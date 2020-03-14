// 【−α】クソ雑魚実行関数 (被依存: PADStart)
let __INTERNAL__FullCommandLine___ = '';	// コマンドの全文が入る

// 【筑前煮】実行前ルーチン (EventHandler)
function PADStart() {
	try {
		let start = new Date();
		let __INTERNAL__ValueReturnsPADProgram__ = __INTERNAL__function__RunPAD__(document.getElementById('MAIN'));
		PrintErr('(実行時間: ' + (new Date() - start) + '[ms])\n');
		PrintErr('終了値: ' + __INTERNAL__ValueReturnsPADProgram__ + '\n');
		PrintErr('================\n\n');
	}
	catch (e) {
		PrintErr(e + ' (' + __INTERNAL__FullCommandLine___ + ')\n');
		PrintErr('プログラムは中断されました.\n\n');
		return 'error';
	}

}

function __INTERNAL__function__atCommand__(__INTERNAL__arg__FullCommandLine) {
	PrintOut('@ コマンドは未実装です。');
	return false;
}

function __INTERNAL__function__RunPAD__(__INTERNAL__PADHTMLElement__, __INTERNAL__NestDapth__ = 0) {
	if (__INTERNAL__NestDapth__ === 0) {
		IOInit();
	}

	for (let __INTERNAL__PADElementNumber__ = 0; __INTERNAL__PADElementNumber__ < __INTERNAL__PADHTMLElement__.children.length; __INTERNAL__PADElementNumber__++) {
		// 前判定ループ
		if (__INTERNAL__PADHTMLElement__.children.item(__INTERNAL__PADElementNumber__).classList.contains('WhlBlk')) {
			__INTERNAL__FullCommandLine___ = __INTERNAL__PADHTMLElement__.children.item(__INTERNAL__PADElementNumber__).textContent;

			while (eval(__INTERNAL__FullCommandLine___)) {
				let WHL = __INTERNAL__PADHTMLElement__.children.item(__INTERNAL__PADElementNumber__ + 1);
				let __INTERNAL__ReturnValue__ = __INTERNAL__function__RunPAD__(WHL, __INTERNAL__NestDapth__ + 1);
				if (__INTERNAL__ReturnValue__ === 'break') break;
				if (__INTERNAL__ReturnValue__ === 'continue') continue;
				if (__INTERNAL__ReturnValue__ === 'error') return 'error';
				if (__INTERNAL__ReturnValue__ === 'return') return 'return';
			}
		}
		// 後判定ループ
		if (__INTERNAL__PADHTMLElement__.children.item(__INTERNAL__PADElementNumber__).classList.contains('DowBlk')) {
			__INTERNAL__FullCommandLine___ = __INTERNAL__PADHTMLElement__.children.item(__INTERNAL__PADElementNumber__).textContent;

			do {
				let WHL = __INTERNAL__PADHTMLElement__.children.item(__INTERNAL__PADElementNumber__ + 1);
				let __INTERNAL__ReturnValue__ = __INTERNAL__function__RunPAD__(WHL, __INTERNAL__NestDapth__ + 1);
				if (__INTERNAL__ReturnValue__ === 'break') break;
				if (__INTERNAL__ReturnValue__ === 'continue') continue;
				if (__INTERNAL__ReturnValue__ === 'error') return 'error';
				if (__INTERNAL__ReturnValue__ === 'return') return 'return';
			} while (eval(__INTERNAL__FullCommandLine___));
		}
		// 条件分岐
		if (__INTERNAL__PADHTMLElement__.children.item(__INTERNAL__PADElementNumber__).classList.contains('IfBlk')) {
			__INTERNAL__FullCommandLine___ = __INTERNAL__PADHTMLElement__.children.item(__INTERNAL__PADElementNumber__).textContent;

			let NestBlock = __INTERNAL__PADHTMLElement__.children.item(__INTERNAL__PADElementNumber__ + 1);
			let ThenBlk = NestBlock.getElementsByClassName('BlkBlk')[0];
			let ElseBlk = NestBlock.getElementsByClassName('BlkBlk')[1];

			if (eval(__INTERNAL__FullCommandLine___)) {
				let __INTERNAL__ReturnValue__ = __INTERNAL__function__RunPAD__(ThenBlk, __INTERNAL__NestDapth__ + 1);
				if (__INTERNAL__ReturnValue__ === 'break' || __INTERNAL__ReturnValue__ === 'continue' || __INTERNAL__ReturnValue__ === 'error' || __INTERNAL__ReturnValue__ === 'return') {
					return __INTERNAL__ReturnValue__;
				}
			} else {
				let __INTERNAL__ReturnValue__ = __INTERNAL__function__RunPAD__(ElseBlk, __INTERNAL__NestDapth__ + 1);
				if (__INTERNAL__ReturnValue__ === 'break' || __INTERNAL__ReturnValue__ === 'continue' || __INTERNAL__ReturnValue__ === 'error' || __INTERNAL__ReturnValue__ === 'return') {
					return __INTERNAL__ReturnValue__;
				}
			}
		}
		// 定期済み処理呼び出し
		if (__INTERNAL__PADHTMLElement__.children.item(__INTERNAL__PADElementNumber__).classList.contains('FncBlk')) {
			let Command = __INTERNAL__PADHTMLElement__.children.item(__INTERNAL__PADElementNumber__).textContent.split(' ');
			__INTERNAL__FullCommandLine___ = __INTERNAL__PADHTMLElement__.children.item(__INTERNAL__PADElementNumber__).textContent;
			let __INTERNAL__ReturnValue__ = __INTERNAL__function__RunPAD__(document.getElementById(Command[0]), -(__INTERNAL__NestDapth__ + 1));
			if (__INTERNAL__ReturnValue__ === 'error') return __INTERNAL__ReturnValue__;
		}
		// コマンドの処理
		if (__INTERNAL__PADHTMLElement__.children.item(__INTERNAL__PADElementNumber__).classList.contains('CmdBlk')) {
			__INTERNAL__FullCommandLine___ = __INTERNAL__PADHTMLElement__.children.item(__INTERNAL__PADElementNumber__).textContent;
			if (RegExp('^\@').test(__INTERNAL__FullCommandLine___)) {
				__INTERNAL__function__atCommand__(__INTERNAL__FullCommandLine___);
				return 'at';
			}
			if (RegExp('^return').test(__INTERNAL__FullCommandLine___)) {
				return eval(__INTERNAL__FullCommandLine___.split(' ')[1]);
			}
			if (RegExp('^break|^continue|^error').test(__INTERNAL__FullCommandLine___)) {
				return __INTERNAL__FullCommandLine___;
			}
			eval(__INTERNAL__FullCommandLine___);
		}
	}
	return undefined;
}
