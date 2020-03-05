// 【−α】クソ雑魚実行関数 (被依存: PADStart)
let PADGLOBVARS = {}, PADVARS = {};	// 変数バッファ
let FullCommand = '';	// コマンドの全文が入る

// 【筑前煮】実行前ルーチン (EventHandler)
function PADStart() {
	try {
		let start = new Date();
		RunPAD(document.getElementById('MAIN'));
		PrintErr('(実行時間: ' + (new Date() - start) + '[ms])\n');
		PrintErr('================\n\n');
	}
	catch (e) {
		PrintErr(e + ' (' + FullCommand + ')\n');
		PrintErr('プログラムは中断されました.\n\n');
		PrintErr('PADVARS:\n');
		Object.keys(PADVARS).forEach(function (key) {
			let val = PADVARS[key];
			PrintErr('\t' + key.slice(0, -3) + ' : (' + val + ')\n');
		});
		PrintErr('\nPADGLOBVARS:\n');
		Object.keys(PADGLOBVARS).forEach(function (key) {
			let val = PADGLOBVARS[key];
			PrintErr('\t' + key.slice(0, -3) + ' : (' + val + ')\n');
		});
		return 'error';
	}

}

function RunPAD(PAD, n = 0) {
	if (n === 0) {
		IOInit();
	}

	for (let i = 0; i < PAD.children.length; i++) {
		// 前判定ループ
		if (PAD.children.item(i).classList.contains('WhlBlk')) {
			FullCommand = PAD.children.item(i).textContent;

			while (eval(FullCommand)) {
				let WHL = PAD.children.item(i + 1);
				let res = RunPAD(WHL, n + 1);
				if (res === 'break') break;
				if (res === 'continue') continue;
				if (res === 'error') return 'error';
				if (res === 'return') return 'return';
			}
		}
		// 後判定ループ
		if (PAD.children.item(i).classList.contains('DowBlk')) {
			FullCommand = PAD.children.item(i).textContent;

			do {
				let WHL = PAD.children.item(i + 1);
				let res = RunPAD(WHL, n + 1);
				if (res === 'break') break;
				if (res === 'continue') continue;
				if (res === 'error') return 'error';
				if (res === 'return') return 'return';
			} while (eval(FullCommand));
		}
		// 条件分岐
		if (PAD.children.item(i).classList.contains('IfBlk')) {
			FullCommand = PAD.children.item(i).textContent;

			let NestBlock = PAD.children.item(i + 1);
			let ThenBlk = NestBlock.getElementsByClassName('BlkBlk')[0];
			let ElseBlk = NestBlock.getElementsByClassName('BlkBlk')[1];

			if (eval(FullCommand)) {
				let res = RunPAD(ThenBlk, n + 1);
				if (res === 'break' || res === 'continue' || res === 'error' || res === 'return') {
					return res;
				}
			} else {
				let res = RunPAD(ElseBlk, n + 1);
				if (res === 'break' || res === 'continue' || res === 'error' || res === 'return') {
					return res;
				}
			}
		}
		// 定期済み処理呼び出し
		if (PAD.children.item(i).classList.contains('FncBlk')) {
			let Command = PAD.children.item(i).textContent.split(' ');
			FullCommand = PAD.children.item(i).textContent;
			let PREVVARS = JSON.stringify(PADVARS);
			let res = RunPAD(document.getElementById(Command[0]), -(n + 1));
			PADVARS = JSON.parse(PREVVARS);
			if (res === 'error') return res;
		}
		// コマンドの処理
		if (PAD.children.item(i).classList.contains('CmdBlk')) {
			FullCommand = PAD.children.item(i).textContent;
			let res = eval(FullCommand);
			if (res === 'break' || res === 'continue' || res === 'error' || res === 'return') {
				return res;
			}
		}
	}
	return 'next';
}
