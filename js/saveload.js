// 【筑前煮】被依存: GetLibrary
function Text2Pad(str) {
	if (str === null || str === '' || str === undefined) {
		return false;
	}
	document.getElementById('PAD').innerHTML = decodeURIComponent(escape(window.atob(str)));
	UpdateBlocks();
	return true;
}

// 【筑前煮】被依存: SavePAD2File
function Pad2Text() {
	return window.btoa(unescape(encodeURIComponent(document.getElementById('PAD').innerHTML)));
}

// 【筑前煮】PAD をファイルに保存する
function SavePAD2File() {
	let FileData = {};
	let PADData = Pad2Text();
	let PADLength = PADData.length;

	FileData.Length = PADLength;
	FileData.Data = PADData;

	if (!window.Blob) {	// Blob 未対応をはじく
		window.alert('Blob に対応していません。\n‘Convert to Text’ 機能を利用してテキストとして保存してください。')
		return false;
	}

	let blob = new Blob([JSON.stringify(FileData)], { type: 'application/x-mknpad' });

	let Time = new Date();

	let a = document.createElement('a');
	a.href = URL.createObjectURL(blob);
	a.target = '_blank';
	a.download = Time.getTime() + '.Chikuzen-ni.mknpad';
	a.click();
	URL.revokeObjectURL(a.href);
	return true;
}

// 【−α】サーバからファイルを落とす
function GetLibrary(name = window.prompt('ライブラリ名を指定してください')) {
	if (name === null || name === '' || name === undefined) {	// 無効データをはじく
		return false;
	}
	if (name === 'KusaReMKN') {	// イースターエッグ
		alert('🍊👍✨');
		return false;
	}
	let mid = new XMLHttpRequest();
	mid.overrideMimeType('application/x-mknpad-data');	// MIME を上書きして XML パースエラーを防ぐ
	mid.open('get', './lib/' + name + '.Chikuzen-ni.mknpad.data');
	mid.addEventListener('load', () => {
		Text2Pad(mid.responseText);
	});
	mid.addEventListener('error', () => {
		alert('エラーが返されました');
	});
	mid.addEventListener('abort', () => {
		alert('中断しました');
	});
	mid.send(null);
	return true;
}

// 【筑前煮】エラーファイルを読み込んだ回数 (イースターエッグ)
let ErrorFileCount = 0;

// 【筑前煮】ファイルから読み込み
function LoadPADfromFile() {
	let input = document.createElement('input');
	input.type = 'file';
	input.accept = '.Chikuzen-ni.mknpad,.mknpad,application/x-mknpad';
	input.addEventListener('change', e => {
		let res = e.target.files[0];
		let reader = new FileReader();
		reader.addEventListener('load', () => {
			if (reader.result.match(/^[\x00-\x7e]*$/)) {
				let FileData;
				FileData = JSON.parse(reader.result);
				if (FileData.Data.length === FileData.Length) {
					Text2Pad(FileData.Data);
					ErrorFileCount = 0;
					return true;
				}
				else {
					// 5 回連続でエラーするとイースターエッグ起動
					alert(++ErrorFileCount === 5 ? 'いたずらしないでちょ' : 'ファイルのデータが正しくありません');
					return false;
				}
			}
			else {
				// 5 回連続でエラーするとイースターエッグ起動
				alert(++ErrorFileCount === 5 ? 'いたずらしないでちょ' : 'ファイルのデータが正しくありません');
				return false;
			}
		});
		reader.readAsText(res);
	});
	input.click();
}
