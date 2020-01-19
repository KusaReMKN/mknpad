// 【筑前煮】入出力ポート
let PadOutput, ErrorOutput;

// 【筑前煮】入出力の初期化関数
function IOInit() {
	PadOutput = document.getElementById('PadOutput');
	ErrorOutput = document.getElementById('cmdlin');
	ErrorOutput.textContent = '';
	PadOutput.textContent = '';
}

// 【筑前煮】標準出力に文字列出力
function PrintOut(str) {
	PadOutput.textContent += (str + '');
}

// 【筑前煮】標準エラーに文字列出力
function PrintErr(str) {
	ErrorOutput.textContent += (str + '');
}

// 【筑前煮】ページ読み込み時に入出力初期化をするよ
window.addEventListener('load', IOInit);
