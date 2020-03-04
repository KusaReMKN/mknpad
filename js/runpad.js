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
		PADVARS = {};
		PADGLOBVARS = {};
		PADVARS[GetVarName('MEMORY')] = '!Array! 1 0';
		PADVARS[GetVarName('RAND_MAX')] = 32767;
		PADGLOBVARS[GetVarName('NULL')] = '!Array! 0 0';
		PADGLOBVARS[GetVarName('null')] = null;
		PADGLOBVARS[GetVarName('undefined')] = undefined;
		PADVARS[GetVarName('PADAOFFSET')] = 1;
		PADGLOBVARS[GetVarName('EOF')] = -1;
		PADGLOBVARS[GetVarName('STACKOFFSET')] = 1;
	}
	else if (n < 0) {
		PADVARS = {};
		PADVARS[GetVarName('MEMORY')] = '!Array! 1 0';
		PADVARS[GetVarName('RAND_MAX')] = 32767;
		PADVARS[GetVarName('PADAOFFSET')] = 1;
		n = -n;
	}

	for (let i = 0; i < PAD.children.length; i++) {
		// 前判定ループ
		if (PAD.children.item(i).classList.contains('WhlBlk')) {
			let Command = PAD.children.item(i).textContent.split(' ');
			FullCommand = PAD.children.item(i).textContent;

			while (CalcCCode(Command, 0)) {
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
			let Command = PAD.children.item(i).textContent.split(' ');
			FullCommand = PAD.children.item(i).textContent;

			do {
				let WHL = PAD.children.item(i + 1);
				let res = RunPAD(WHL, n + 1);
				if (res === 'break') break;
				if (res === 'continue') continue;
				if (res === 'error') return 'error';
				if (res === 'return') return 'return';
			} while (CalcCCode(Command, 0));
		}
		// 条件分岐
		if (PAD.children.item(i).classList.contains('IfBlk')) {
			let Command = PAD.children.item(i).textContent.split(' ');
			FullCommand = PAD.children.item(i).textContent;

			let NestBlock = PAD.children.item(i + 1);
			let ThenBlk = NestBlock.getElementsByClassName('BlkBlk')[0];
			let ElseBlk = NestBlock.getElementsByClassName('BlkBlk')[1];

			if (CalcCCode(Command, 0)) {
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
			let res = RunPAD(document.getElementById(Command), -(n + 1));
			PADVARS = JSON.parse(PREVVARS);
			if (res === 'error') return res;
		}
		// コマンドの処理
		if (PAD.children.item(i).classList.contains('CmdBlk')) {
			let Command = PAD.children.item(i).textContent.split(' ');
			FullCommand = PAD.children.item(i).textContent;
			let res = RUN(Command);
			if (res === 'break' || res === 'continue' || res === 'error' || res === 'return') {
				return res;
			}
		}
	}
	return 'next';

	/// 処理ここまで

	function PreProc(CommandLine) {
		const RepTable = {
			'_Alignof': '$ALIGNOF$',
			'(float\)': '$ASFLOAT$',
			'sizeof': '$SIZEOF$',
			'(void)': '$ASVOID$',
			'(int)': '$ASINT$',
			'<<=': '$LETSHL$',
			'>>=': '$LETSHR$',
			'\\+\\+': '$INC$',
			'--': '$DEC$',
			'->': '$ARROW$',
			'<<': '$SHL$',
			'>>': '$SHR$',
			'<=': '$LTE$',
			'>=': '$GTE$',
			'==': '$EQU$',
			'!=': '$NEQ$',
			'&&': '$LOGAND$',
			'\\|\\|': '$LOGOR$',
			'\\+=': '$LETPLUS$',
			'-=': '$LETMINUS$',
			'\\*=': '$LETMUL$',
			'/=': '$LETDIV$',
			'%=': '$LETMOD$',
			'&=': '$LETAND$',
			'\\^=': '$LETXOR$',
			'\\|=': '$LETOR$',
			'\\+': '$PLUS$',
			'-': '$MINUS$',
			'\\*': '$AST$',
			'&': '$AMP$',
			'/': '$DIV$',
			'%': '$MOD$',
			'<': '$LT$',
			'>': '$GT$',
			'\\^': '$XOR$',
			'\\|': '$OR$',
			'\\?': '$QUE$',
			':': '$CLN$',
			'=': '$LET$',
			',': '$COMMA$',
			'\\(': '$BRAL$',
			'\\)': '$BRAR$',
			'\\[': '$ELEL$',
			'\\]': '$ELER$',
			'\\.': '$DOT$',
		};
		for (let key in RepTable) {
			CommandLine = CommandLine.replace(RegExp(key, 'g'), (' ' + RepTable[key] + ' '));
		}
		return CommandLine.replace(/\s+/g, ' ');
	}

	function CalcCCode(Command, first = 1) {
		function isOpe(str) {
			let Opes = [
				'(', ')', '*', '/', '%', '+', '-', '<<', '>>', '<', '<=', '>', '>=', '==', '!=', '&', '^', '|', '=', '&&', '||', '+=', '-=', '*=', '/=', '%=', '<<=', '>>=', '&=', '^=', '|=', '++', '--', ','
			];
			for (let i = 0; i < Opes.length; i++) if (str === Opes[i]) return true;
			return false;
		}
		let stack = [], polish = [];
		let v = [];
		let varname = [];
		let pri = [];	// 優先順位テーブル
		let sp1, sp2;
		let i;

		// 演算子の優先順位登録
		pri['('] = 16;
		pri['++'] = pri['--'] = 15;
		pri['*'] = pri['/'] = pri['%'] = 13;
		pri['+'] = pri['-'] = 12;
		pri['<<'] = pri['>>'] = 11;
		pri['<'] = pri['<='] = pri['>'] = pri['>='] = 10;
		pri['=='] = pri['!='] = 9;
		pri['&'] = 8;
		pri['^'] = 7;
		pri['|'] = 6;
		pri['&&'] = 5;
		pri['||'] = 4;
		pri['='] = pri['+='] = pri['-='] = pri['*='] = pri['/='] = pri['%='] = pri['<<='] = pri['>>='] = pri['&='] = pri['^='] = pri['|='] = 2;
		pri[','] = 1;
		pri[')'] = 0;

		// 番兵たち
		stack[0] = 0;
		pri[0] = -1;

		sp1 = sp2 = 0;

		// ポーランド記法に書き換え
		for (let n = first; n < Command.length; n++) {
			if (Command[n] === '0') {
				Command[n] = '0e0';
			}
			while ((pri[Command[n]] !== undefined ? pri[Command[n]] : 15) <= (pri[stack[sp1]] !== undefined ? pri[stack[sp1]] : 15) && stack[sp1] !== '(') polish[++sp2] = stack[sp1--];
			if (Command[n] !== ')') stack[++sp1] = Command[n];
			else sp1--;
		}
		// スタックの残りを取り出す
		for (i = sp1; i > 0; i--) polish[++sp2] = stack[i];

		// 式の計算
		sp1 = 0;
		for (i = 1; i <= sp2; i++) {
			if (!isOpe(polish[i])) {
				v[++sp1] = GetValue(polish[i]);
				varname[sp1] = polish[i];
			}
			else {
				switch (polish[i]) {
					case '*': v[sp1 - 1] = (v[sp1 - 1] * v[sp1]); break;
					case '/': v[sp1 - 1] = (v[sp1 - 1] / v[sp1]); break;
					case '%': v[sp1 - 1] = (v[sp1 - 1] % v[sp1]); break;
					case '+': v[sp1 - 1] = (v[sp1 - 1] + v[sp1]); break;
					case '-': v[sp1 - 1] = (v[sp1 - 1] - v[sp1]); break;
					case '<<': v[sp1 - 1] = (v[sp1 - 1] << v[sp1]); break;
					case '>>': v[sp1 - 1] = (v[sp1 - 1] >> v[sp1]); break;
					case '<': v[sp1 - 1] = (v[sp1 - 1] < v[sp1]); break;
					case '<=': v[sp1 - 1] = (v[sp1 - 1] <= v[sp1]); break;
					case '>': v[sp1 - 1] = (v[sp1 - 1] > v[sp1]); break;
					case '>=': v[sp1 - 1] = (v[sp1 - 1] >= v[sp1]); break;
					case '==': v[sp1 - 1] = (v[sp1 - 1] == v[sp1]); break;
					case '!=': v[sp1 - 1] = (v[sp1 - 1] != v[sp1]); break;
					case '&': v[sp1 - 1] = (v[sp1 - 1] & v[sp1]); break;
					case '^': v[sp1 - 1] = (v[sp1 - 1] ^ v[sp1]); break;
					case '|': v[sp1 - 1] = (v[sp1 - 1] | v[sp1]); break;
					case '&&': v[sp1 - 1] = (v[sp1 - 1] && v[sp1]); break;
					case '||': v[sp1 - 1] = (v[sp1 - 1] || v[sp1]); break;
					case ',': v[sp1 - 1] = v[sp1]; break;
					case '=':
						if (IsVar(varname[sp1 - 1])) {
							PADVARS[GetVarName(varname[sp1 - 1])] = v[sp1];
							v[sp1 - 1] = v[sp1];
						}
						else throw 'C:OperandError(' + varname[sp1 - 1] + ')';
						break;
					case '+=':
						if (IsVar(varname[sp1 - 1])) {
							PADVARS[GetVarName(varname[sp1 - 1])] += v[sp1];
							v[sp1 - 1] += v[sp1];
						}
						else throw 'C:OperandError(' + varname[sp1 - 1] + ')';
						break;
					case '-=':
						if (IsVar(varname[sp1 - 1])) {
							PADVARS[GetVarName(varname[sp1 - 1])] -= v[sp1];
							v[sp1 - 1] -= v[sp1];
						}
						else throw 'C:OperandError(' + varname[sp1 - 1] + ')';
						break;
					case '*=':
						if (IsVar(varname[sp1 - 1])) {
							PADVARS[GetVarName(varname[sp1 - 1])] *= v[sp1];
							v[sp1 - 1] *= v[sp1];
						}
						else throw 'C:OperandError(' + varname[sp1 - 1] + ')';
						break;
					case '/=':
						if (IsVar(varname[sp1 - 1])) {
							PADVARS[GetVarName(varname[sp1 - 1])] /= v[sp1];
							v[sp1 - 1] /= v[sp1];
						}
						else throw 'C:OperandError(' + varname[sp1 - 1] + ')';
						break;
					case '%=':
						if (IsVar(varname[sp1 - 1])) {
							PADVARS[GetVarName(varname[sp1 - 1])] %= v[sp1];
							v[sp1 - 1] %= v[sp1];
						}
						else throw 'C:OperandError(' + varname[sp1 - 1] + ')';
						break;
					case '<<=':
						if (IsVar(varname[sp1 - 1])) {
							PADVARS[GetVarName(varname[sp1 - 1])] <<= v[sp1];
							v[sp1 - 1] <<= v[sp1];
						}
						else throw 'C:OperandError(' + varname[sp1 - 1] + ')';
						break;
					case '>>=':
						if (IsVar(varname[sp1 - 1])) {
							PADVARS[GetVarName(varname[sp1 - 1])] >>= v[sp1];
							v[sp1 - 1] >>= v[sp1];
						}
						else throw 'C:OperandError(' + varname[sp1 - 1] + ')';
						break;
					case '&=':
						if (IsVar(varname[sp1 - 1])) {
							PADVARS[GetVarName(varname[sp1 - 1])] &= v[sp1];
							v[sp1 - 1] &= v[sp1];
						}
						else throw 'C:OperandError(' + varname[sp1 - 1] + ')';
						break;
					case '^=':
						if (IsVar(varname[sp1 - 1])) {
							PADVARS[GetVarName(varname[sp1 - 1])] ^= v[sp1];
							v[sp1 - 1] ^= v[sp1];
						}
						else throw 'C:OperandError(' + varname[sp1 - 1] + ')';
						break;
					case '|=':
						if (IsVar(varname[sp1 - 1])) {
							PADVARS[GetVarName(varname[sp1 - 1])] |= v[sp1];
							v[sp1 - 1] |= v[sp1];
						}
						else throw 'C:OperandError(' + varname[sp1 - 1] + ')';
						break;
					default: throw 'C:UnknownOperator(' + polish[i] + ')';
				}
				sp1--;
			}
		}
		return PADGLOBVARS[GetVarName('RETURN')] = v[1];
	}

	function IsVar(ValueStr) {
		return (isNaN(parseFloat(ValueStr)));
	}

	function GetValue(ValueStr) {
		return IsVar(ValueStr) ? (PADVARS[GetVarName(ValueStr)] !== undefined ? PADVARS[GetVarName(ValueStr)] : PADGLOBVARS[GetVarName(ValueStr)]) : parseFloat(ValueStr);
	}

	function GetVarName(str) {	// 変数名の内部名を取得
		return str + '_' + window.btoa(unescape(encodeURIComponent(str))).slice(0, 2);
	}

	function atCommand(Command) {
		if (Command[0] === '@import') {
			PrintErr('@import は未実装です このコマンドは無視されます\n');
			return 0;
		}
		if (Command[0] === '@option') {
			PrintErr('@option は未実装です このコマンドは無視されます\n');
			return 0;
		}
		PrintErr('未知の @ コマンドです: ' + Command[0] + ' このコマンドは無視されます');
		return -1;
	}

	function RUN(Command) {
		if (RegExp('^@').test(Command[0])) {	// @ コマンドの処理
			atCommand(Command);
			return 'next';
		}

		switch (Command[0]) {
			case 'C:':
				CalcCCode(Command);
				break;
			case 'return':
				PADGLOBVARS[GetVarName('RETURN')] = (Command.length > 1) ? GetValue(Command[1]) : undefined;
				return 'return';
			case 'INPUT':
				{
					let einput = '';
					let RetryFlag;
					for (let i = 1; i < Command.length; i++) if (!IsVar(Command[i])) throw 'OperandError';
					Input:
					do {
						RetryFlag = false;
						let str = prompt(FullCommand + (einput !== '' ? (' (' + einput + ')') : ''));
						if (str === null) {
							PADGLOBVARS[GetVarName('RETURN')] = GetValue('EOF');
						} else {
							PrintOut('INPUT> ' + str + '\n');
							str = str.replace(/\s+/g, ' ');
							str = str.replace(/(^\s*|\s*$)/g, '');
							let inputs = str.split(' ');
							if (inputs.length !== Command.length - 1) {
								einput = '引数の数が正しくありません';
								RetryFlag = true;
								continue;
							}
							for (let i = 0; i < Math.min(inputs.length, Command.length - 1); i++) {
								if (!IsVar(inputs[i])) {
									PADVARS[GetVarName(Command[i + 1])] = inputs[i] * 1;
								}
								else {
									einput = '引数の値が正しくありません';
									RetryFlag = true;
									continue Input;
								}
							}
							PADGLOBVARS[GetVarName('RETURN')] = inputs.length;
						}
					} while (RetryFlag);
				}
				break;
			case 'break':
				return 'break';
			case 'continue':
				return 'continue';
			case 'PUSH':	// スタックに積む
				PADGLOBVARS[GetVarName(-(PADGLOBVARS[GetVarName('STACKOFFSET')]++))] = GetValue(Command[1]);
				break;
			case 'POP':	// スタックからおろす
				if (!IsVar(Command[1])) throw 'OperandError';
				else {
					if (PADGLOBVARS[GetVarName('STACKOFFSET')] === 1) throw 'StackError';
					else PADVARS[GetVarName(Command[1])] = PADGLOBVARS[GetVarName(-(--PADGLOBVARS[GetVarName('STACKOFFSET')]))];
				}
				break;
			case 'RAND':	// 乱数！
				if (!IsVar(Command[1])) throw 'OperandError';
				else PADVARS[GetVarName(Command[1])] = Math.round((Math.random() * PADVARS[GetVarName('RAND_MAX')]));
				break;
			case 'INT':	// 小数点以下切り捨て
			case 'FLOOR':
				if (!IsVar(Command[1])) throw 'OperandError';
				else PADVARS[GetVarName(Command[1])] = Math.floor(PADVARS[GetVarName(Command[1])]);
				break;
			case 'CEIL':
				if (!IsVar(Command[1])) throw 'OperandError';
				else PADVARS[GetVarName(Command[1])] = Math.ceil(PADVARS[GetVarName(Command[1])]);
				break;
			case 'DIM':	// 配列宣言
				if (!IsVar(Command[1])) throw 'OperandError';
				else {
					PADVARS[GetVarName(Command[1])] = '!Array! ' + PADVARS[GetVarName('PADAOFFSET')] + ' ' + GetValue(Command[2]);
					PADVARS[GetVarName('PADAOFFSET')] += GetValue(Command[2]);
				}
				break;
			case 'SETA':	// 配列初期化
				if (!IsVar(Command[1])) throw 'OperandError';
				else {
					if (typeof PADVARS[GetVarName(Command[1])] !== 'string' || PADVARS[GetVarName(Command[1])].split(' ')[0] !== '!Array!') throw 'ArrayError';
					else {
						let OFFSET = PADVARS[GetVarName(Command[1])].split(' ')[1] * 1;
						let LENGTH = PADVARS[GetVarName(Command[1])].split(' ')[2] * 1;
						if (Command.length - 2 > LENGTH && LENGTH !== 0) throw 'LengthError';
						else for (let i = 0; i < Command.length - 2; i++) PADVARS[GetVarName(OFFSET * 1 + i)] = GetValue(Command[i + 2]);
					}
				}
				break;
			case 'GETA':	// メモリオフセット取得
				if (!IsVar(Command[1])) throw 'OperandError';
				else {
					if (typeof PADVARS[GetVarName(Command[2])] !== 'string' || PADVARS[GetVarName(Command[2])].split(' ')[0] !== '!Array!') throw 'ArrayError';
					else PADVARS[GetVarName(Command[1])] = PADVARS[GetVarName(Command[2])].split(' ')[1] * 1 + GetValue(Command[3]) * 1 - 1;

				}
				break;
			case 'GETP':	// ポインタ取得
				if (!IsVar(Command[1])) throw 'OperandError';
				else {
					if (typeof PADVARS[GetVarName(Command[2])] !== 'string' || PADVARS[GetVarName(Command[2])].split(' ')[0] !== '!Array!') throw 'ArrayError';
					else PADVARS[GetVarName(Command[1])] = '!Array! ' + (PADVARS[GetVarName(Command[2])].split(' ')[1] * 1 + GetValue(Command[3]) * 1) + ' 0';
				}
				break;
			case 'GETE':	// 配列要素取得
				if (!IsVar(Command[1])) throw 'OperandError';
				else {
					if (typeof PADVARS[GetVarName(Command[2])] !== 'string' || PADVARS[GetVarName(Command[2])].split(' ')[0] !== '!Array!') throw 'ArrayError';
					else PADVARS[GetVarName(Command[1])] = PADVARS[GetVarName(PADVARS[GetVarName(Command[2])].split(' ')[1] * 1 + GetValue(Command[3]) * 1)];
				}
				break;
			case 'SETE':	// 配列要素初期化
				if (!IsVar(Command[1])) throw 'OperandError';
				else {
					if (typeof PADVARS[GetVarName(Command[1])] !== 'string' || PADVARS[GetVarName(Command[1])].split(' ')[0] !== '!Array!') throw 'ArrayError';
					else PADVARS[GetVarName(PADVARS[GetVarName(Command[1])].split(' ')[1] * 1 + GetValue(Command[2]) * 1)] = GetValue(Command[3]);
				}
				break;

			case 'GROB':
			case 'GLOB':
				if (!IsVar(Command[1])) throw 'OperandError';
				else PADGLOBVARS[GetVarName(Command[1])] = GetValue(Command[2]);
				break;
			case 'SWAP':
				if (!IsVar(Command[1]) || !IsVar(Command[2])) throw 'OperandError';
				else {
					let tmp = PADVARS[GetVarName(Command[1])];
					PADVARS[GetVarName(Command[1])] = PADVARS[GetVarName(Command[2])];
					PADVARS[GetVarName(Command[2])] = tmp;
				}
				break;
			case 'SWAPA':
				if (!IsVar(Command[1])) throw 'OperandError';
				else {
					if (typeof PADVARS[GetVarName(Command[1])] !== 'string' || PADVARS[GetVarName(Command[1])].split(' ')[0] !== '!Array!') throw 'ArrayError';
					else {
						let tmp = PADVARS[GetVarName(PADVARS[GetVarName(Command[1])].split(' ')[1] * 1 + GetValue(Command[2]))];
						PADVARS[GetVarName(PADVARS[GetVarName(Command[1])].split(' ')[1] * 1 + GetValue(Command[2]))] = PADVARS[GetVarName(PADVARS[GetVarName(Command[1])].split(' ')[1] * 1 + GetValue(Command[3]))];
						PADVARS[GetVarName(PADVARS[GetVarName(Command[1])].split(' ')[1] * 1 + GetValue(Command[3]))] = tmp;
					}
				}
				break;

			case 'PRINT':
				for (let i = 0; i < Command.length - 1; i++) PrintOut(GetValue(Command[i + 1]) + ' ');
				PrintOut('\n');
				break;
			case 'PRINTA':
				if (typeof PADVARS[GetVarName(Command[1])] !== 'string' || PADVARS[GetVarName(Command[1])].split(' ')[0] !== '!Array!') throw 'ArrayError';
				else {
					if (Command.length < 3 && PADVARS[GetVarName(Command[1])].split(' ')[2] * 1 === 0) throw 'LengthRequired';
					else {
						let l = PADVARS[GetVarName(Command[1])].split(' ')[2] * 1;
						if (Command.length === 3 || PADVARS[GetVarName(Command[1])].split(' ')[2] * 1 === 0) l = GetValue(Command[2]);
						for (let i = PADVARS[GetVarName(Command[1])].split(' ')[1] * 1; i < PADVARS[GetVarName(Command[1])].split(' ')[1] * 1 + l; i++) PrintOut(PADVARS[GetVarName(i)] + ' ');
						PrintOut('\n');
					}
				}
				break;

			case 'POW':
				if (!IsVar(Command[1])) throw 'OperandError';
				else PADVARS[GetVarName(Command[1])] = Math.pow(PADVARS[GetVarName(Command[1])], GetValue(Command[2]));
				break;
			case 'SQRT':
				if (!IsVar(Command[1])) throw 'OperandError';
				else PADVARS[GetVarName(Command[1])] = Math.sqrt(PADVARS[GetVarName(Command[1])]);
				break;

			case 'PI':
				if (!IsVar(Command[1])) throw 'OperandError';
				else PADVARS[GetVarName(Command[1])] = Math.PI;
				break;
			case 'INT3':
				throw 'Breakpoint';

			default:
				CalcCCode(Command, 0);
		}
		return 'next';
	}

}
