let mknpad = {

	const: {
		version: '0.5.2.200330',
		versionString: 'PAD Editor Eryngii 2.200330',
		internalName: 'MKNPAD.5.2.200330',
		mknpadFileExtension: '.mknpad',
		mknpadFileType: 'application/x.mknpad+json',
		blocks: {
			whlblk: 'WhlBlk',
			dowblk: 'DowBlk',
			ifblk: 'IfBlk',
			fncblk: 'FncBlk',
			cmdblk: 'CmdBlk',
			blkblk: 'BlkBlk',
		},
		lib: {
			path: './lib/',
			extension: '.mknpadlib.js',
			type: 'text/javascript',
		},
		win: {
			name: 'MKNPADWIN',
			option: 'width=1024,height=720,chrome=yes',
		}
	},

	var: {
		padjs: '',
		importErrorCount: 0,
		selectedBlock: undefined,
	},

	dev: {	// 入出力 HTMLElement
		err: undefined,	// エラー出力先
		out: undefined,	// 標準出力先
		pad: undefined, // PAD の配置場所
		run: undefined,	// PAD の実行結果表示ウィンドウ (window 型)
		blockType: undefined,	// blockType 記憶の Input
		context: undefined,	// 右クリックで表示されるメニュー
	},

	io: {	// 汎用入出力関数
		// テキストアクセス
		print(dev: HTMLElement, str: string): void {
			dev.textContent += str;
		},
		scan(dev: HTMLElement): string {
			return dev.textContent;
		},
		clear(dev: HTMLElement): void {
			dev.textContent = '';
		},
		// Base64 アクセス
		write(dev: HTMLElement, base64: string): void {
			dev.innerHTML = decodeURIComponent(window.atob(base64));
		},
		read(dev: HTMLElement): string {
			return window.btoa(encodeURIComponent(dev.innerHTML))
		},
	},

	api: {	// 低次元システムコール
		abort(str: string) {
			throw ('mknpad.api.abort: ' + str);
		},
		printErr(str: string) {
			mknpad.io.print(mknpad.dev.err, str);
		},
		printOut(str: string) {
			mknpad.io.print(mknpad.dev.out, str);
		},
		padData() {
			return mknpad.io.read(mknpad.dev.pad);
		},
		writePad(base64: string) {
			mknpad.io.write(mknpad.dev.pad, base64);
		},
		getQuery() {
			let vars = [], max = 0, hash = [], array = [];
			let url = window.location.search;

			hash = url.slice(1).split('&');
			max = hash.length;
			for (var i = 0; i < max; i++) {
				array = hash[i].split('=');    //keyと値に分割。
				vars.push(array[0]);    //末尾にクエリ文字列のkeyを挿入。
				vars[array[0]] = array[1];    //先ほど確保したkeyに、値を代入。
			}
			return vars;
		}
	},

	init: {
		dev() {
			mknpad.dev.err = document.getElementById('paderr');
			mknpad.io.clear(mknpad.dev.err);
			mknpad.dev.out = document.getElementById('padout');
			mknpad.io.clear(mknpad.dev.out);

			mknpad.dev.pad = document.getElementById('pad');

			mknpad.dev.blockType = document.getElementById('blktype');

			mknpad.dev.context = document.getElementById('context');

			mknpad.system.console.log('Info: mknpad.init.dev: Done.');
		},
		handler() {
			mknpad.dev.pad.onclick = mknpad.system.handler.block.clickPad;
			mknpad.system.console.log('Info: mknpad.init.handler: Done.');
		}
	},

	system: {
		file: {
			savePad(): boolean {
				let fileData = {
					version: mknpad.const.version,
					data: mknpad.api.padData(),
					dataLength: undefined,
				};
				fileData.dataLength = fileData.data.length;

				if (!window.Blob) {
					mknpad.system.console.log('Error: Your browser does not support Blob.');
					return false;
				}

				let blob = new Blob([JSON.stringify(fileData)], { type: mknpad.const.mknpadFileType });

				let Time = new Date();

				let a = document.createElement('a');
				a.href = URL.createObjectURL(blob);
				a.target = '_blank';
				a.download = 'mknpad_' + Time.getTime() + mknpad.const.mknpadFileExtension;
				a.click();
				URL.revokeObjectURL(a.href);
				mknpad.system.console.log(`Info: Save: File (${a.download})`);
				return true;
			},
			loadPad() {
				let input = document.createElement('input');
				input.type = 'file';
				input.accept = [mknpad.const.mknpadFileExtension, mknpad.const.mknpadFileType].join();
				input.addEventListener('change', function () {
					let res = this.files[0];
					let reader = new FileReader();
					reader.addEventListener('load', () => {
						if (typeof reader.result === 'string' && reader.result.match(/^[\x00-\x7e]*$/)) {
							let fileData;
							try {
								fileData = JSON.parse(reader.result);
							} catch (e) {
								mknpad.system.console.log(`Error: Open: File (${res.name}) not supported.`);
								return false;
							}
							if (fileData.version && fileData.version.split && fileData.version.split('.')[1] === mknpad.const.version.split('.')[1]) {
								if (fileData.data.length === fileData.dataLength) {
									mknpad.api.writePad(fileData.data);
									mknpad.system.console.log(`Info: Open: File (${res.name}) (${res.size} Bytes) version (${fileData.version})`);
									mknpad.system.block.update();
									return true;
								}
								else {
									mknpad.system.console.log(`Error: Open: File (${res.name}) is broken.`);
									return false;
								}
							} else {
								mknpad.system.console.log(`Error: Open: File (${res.name}) is incompatible. File version (${fileData.version}), requires (${mknpad.const.version})`);
								return false;
							}
						}
						else {
							mknpad.system.console.log(`Error: Open: File (${res.name}) not supported.`);
							return false;
						}
					});
					reader.readAsText(res);
				});
				input.click();
			},
		},
		handler: {
			atImportLoad() {
				if (this.status === 200) {
					mknpad.var.padjs += this.responseText;
				}
				else {
					mknpad.var.importErrorCount++;
				}
				mknpad.system.console.log(`Info: @import: ${this.responseURL} [ ${this.status}: ${this.statusText} ]`);
			},
			block: {
				internal: {
					showContext(html: HTMLElement) {
						mknpad.dev.context.style.display = 'block';
						mknpad.dev.context.style.top = (html.getBoundingClientRect().top + window.pageYOffset + html.clientHeight) + 'px';
						mknpad.dev.context.style.left = (html.getBoundingClientRect().left + window.pageXOffset + html.clientWidth) + 'px';
					},
					hideContext() {
						mknpad.dev.context.style.display = 'none';
					},
					editit() {
						mknpad.system.block.edit(this);
					},

				},
				clickPad() {
					mknpad.system.handler.block.internal.hideContext();
				},
				context() {
					mknpad.system.handler.block.internal.showContext(this);

					let foo = this;

					document.getElementById('copyit').onclick = function () {
						mknpad.system.handler.block.internal.hideContext();
					};
					document.getElementById('cutit').onclick = function () {
						mknpad.system.handler.block.internal.hideContext();
					};
					document.getElementById('deleteit').onclick = function () {
						mknpad.system.handler.block.internal.hideContext();
						mknpad.system.block.remove(foo);

					};
					document.getElementById('editit').onclick = function () {
						mknpad.system.handler.block.internal.hideContext();
						mknpad.system.block.edit(foo);
					};
					return false;
				}
			}
		},
		pad: {
			internal: {
				subCompile(subPad: Element, n: number = 0): void {
					for (let i = 0; i < subPad.children.length; i++) {
						let block = subPad.children.item(i);

						// 前判定ループ
						if (block.classList.contains(mknpad.const.blocks.whlblk)) {
							mknpad.var.padjs += `while (${block.textContent}) {\n`;
							mknpad.system.pad.internal.subCompile(block.nextElementSibling, n + 1);
							mknpad.var.padjs += '}\n';
						}

						// 後判定ループ
						if (block.classList.contains(mknpad.const.blocks.dowblk)) {
							mknpad.var.padjs += 'do {\n';
							mknpad.system.pad.internal.subCompile(block.nextElementSibling, n + 1);
							mknpad.var.padjs += `} while (${block.textContent});\n`;
						}

						// 条件分岐
						if (block.classList.contains(mknpad.const.blocks.ifblk)) {
							let nestPads = block.nextElementSibling.getElementsByClassName(mknpad.const.blocks.blkblk);
							let thenPad = nestPads.item(0);
							let elsePad = nestPads.item(1);

							mknpad.var.padjs += `if (${block.textContent}) {\n`;
							mknpad.system.pad.internal.subCompile(thenPad, n + 1);
							mknpad.var.padjs += '} else {\n';
							mknpad.system.pad.internal.subCompile(elsePad, n + 1);
							mknpad.var.padjs += '}\n';
						}

						if (block.classList.contains(mknpad.const.blocks.cmdblk)) {
							if (RegExp(/^@/).test(block.textContent)) {
								mknpad.system.pad.internal.atCommand(block.textContent);
							} else {
								mknpad.var.padjs += block.textContent + ';\n';
							}
						}
					}
				},
				atImport(argv: string[]) {
					for (let i = 1; i < argv.length; i++) {
						let req = new XMLHttpRequest();
						req.overrideMimeType(mknpad.const.lib.type);
						req.open('GET', mknpad.const.lib.path + argv[i] + mknpad.const.lib.extension, false);
						req.addEventListener('load', mknpad.system.handler.atImportLoad);
						req.addEventListener('error', mknpad.system.handler.atImportLoad);
						req.addEventListener('abort', mknpad.system.handler.atImportLoad);
						req.send(null);
					}
				},
				atCommand(cmd: string) {
					let argv = cmd.split(' ');
					switch (argv[0]) {
						case '@import':
							mknpad.system.pad.internal.atImport(argv);
							break;
						default:
							mknpad.system.console.log(`Error: Unknown @ Command: ${argv[0]}`);
					}
				},
			},
			compile() {
				mknpad.system.console.log('Info: mknpad.system.pad.compile: Start ...');
				mknpad.var.padjs = '';
				mknpad.var.importErrorCount = 0;
				mknpad.system.pad.internal.subCompile(mknpad.dev.pad.getElementsByClassName('Main')[0]);
				if (mknpad.var.importErrorCount === 0) {
					mknpad.system.console.log('Info: mknpad.system.pad.compile: Done.');
					return true;
				}
				mknpad.system.console.log('Error: mknpad.system.pad.compile: @import Error');
				return false;
			},
			run() {
				mknpad.system.console.log('Info: mknpad.system.pad.run: Start ...');
				if (mknpad.system.pad.compile()) {
					mknpad.var.padjs = `try {\n ${mknpad.var.padjs}}\ncatch (e) {\nmknpad.api.printErr("RUNTIME RERROR: " + e);\n}\n`;
					let mainURI = encodeURIComponent(mknpad.var.padjs);
					mknpad.dev.run = window.open('./runtime/?q=' + mainURI, mknpad.const.win.name, mknpad.const.win.option);
					mknpad.dev.run.focus();
					mknpad.dev.run.onclose = mknpad.dev.run.stop;
					mknpad.system.console.log('Info: mknpad.system.pad.run: Done.');
					return true;
				}
				mknpad.system.console.log('Error: mknpad.system.pad.run: Process aborted.');
				return false;
			},
			stop() {
				mknpad.dev.run && mknpad.dev.run.close();
			}
		},
		block: {
			internal: {
				normalize(str: string): string {
					return str.replace(/\s+/g, ' ').replace(/(^\s*|\s*$)/g, '');
				},
				// 	連続したエンプティブロックの削除
				trimEmptyBlock() {
					let BlockBlocks = document.getElementsByClassName(mknpad.const.blocks.blkblk);
					for (let i = 0; i < BlockBlocks.length; i++) {
						let BlockDivs = BlockBlocks[i].getElementsByTagName('div');
						let DoubleEnptyBlock = false;
						for (let j = 0; j < BlockDivs.length; j++) {
							if (BlockDivs[j].classList.contains('EmpBlk') === true) {
								if (DoubleEnptyBlock === true) {
									BlockDivs[j].parentNode.removeChild(BlockDivs[j]);
									DoubleEnptyBlock = false;
								} else {
									DoubleEnptyBlock = true;
								}
							}
							else {
								DoubleEnptyBlock = false;
							}
						}
						// 連続した <br> を消す
						let AllTags = BlockBlocks[i].children;
						let DoubleBrTag = false;
						let PrevBr;
						for (let j = 0; j < AllTags.length; j++) {
							if (AllTags[j].tagName) {
								if (AllTags[j].tagName.toLowerCase() === 'br') {
									if (DoubleBrTag === true) {
										AllTags[j].parentNode.removeChild(AllTags[j]);
										PrevBr.parentNode.removeChild(PrevBr);
										DoubleBrTag = false;
									} else {
										PrevBr = AllTags[j]
										DoubleBrTag = true;
									}
								}
								else {
									DoubleBrTag = false;
								}
							}
						}
					}
				},
				createWhile(ClickedEmptyBlock: HTMLElement, CBCommand: string) {
					let WB = document.createElement('div');
					WB.classList.add('WhlBlk');
					WB.textContent = CBCommand;
					let BB = document.createElement('div');
					BB.classList.add('BlkBlk');
					BB.classList.add('NstBlk');
					let EB = document.createElement('div');
					EB.classList.add('EmpBlk');
					let DB = document.createElement('div');
					DB.classList.add('DmyBlk');
					ClickedEmptyBlock.parentNode.insertBefore(EB, ClickedEmptyBlock.nextSibling);
					ClickedEmptyBlock.parentNode.insertBefore(document.createElement('br'), ClickedEmptyBlock.nextSibling);
					ClickedEmptyBlock.parentNode.insertBefore(document.createTextNode('\n'), ClickedEmptyBlock.nextSibling);
					ClickedEmptyBlock.parentNode.insertBefore(DB, ClickedEmptyBlock.nextSibling);
					ClickedEmptyBlock.parentNode.insertBefore(document.createTextNode('\n'), ClickedEmptyBlock.nextSibling);
					BB = ClickedEmptyBlock.parentNode.insertBefore(BB, ClickedEmptyBlock.nextSibling);
					ClickedEmptyBlock.parentNode.insertBefore(document.createTextNode('\n'), ClickedEmptyBlock.nextSibling);
					ClickedEmptyBlock.parentNode.insertBefore(WB, ClickedEmptyBlock.nextSibling);
					ClickedEmptyBlock.parentNode.insertBefore(document.createTextNode('\n'), ClickedEmptyBlock.nextSibling);
					ClickedEmptyBlock.parentNode.insertBefore(document.createElement('br'), ClickedEmptyBlock.nextSibling);
					ClickedEmptyBlock.parentNode.insertBefore(document.createTextNode('\n'), ClickedEmptyBlock.nextSibling);
					BB.appendChild(document.createTextNode('\n'));
					let BEB = document.createElement('div');
					BEB.classList.add('EmpBlk');
					BB.appendChild(BEB);
					BB.appendChild(document.createElement('br'));
				},
				createUntil(ClickedEmptyBlock: HTMLElement, CBCommand: string) {
					let WB = document.createElement('div');
					WB.classList.add('DowBlk');
					WB.textContent = CBCommand;
					let BB = document.createElement('div');
					BB.classList.add('BlkBlk');
					BB.classList.add('NstBlk');
					let EB = document.createElement('div');
					EB.classList.add('EmpBlk');
					let DB = document.createElement('div');
					DB.classList.add('DmyBlk');
					ClickedEmptyBlock.parentNode.insertBefore(EB, ClickedEmptyBlock.nextSibling);
					ClickedEmptyBlock.parentNode.insertBefore(document.createElement('br'), ClickedEmptyBlock.nextSibling);
					ClickedEmptyBlock.parentNode.insertBefore(document.createTextNode('\n'), ClickedEmptyBlock.nextSibling);
					ClickedEmptyBlock.parentNode.insertBefore(DB, ClickedEmptyBlock.nextSibling);
					ClickedEmptyBlock.parentNode.insertBefore(document.createTextNode('\n'), ClickedEmptyBlock.nextSibling);
					BB = ClickedEmptyBlock.parentNode.insertBefore(BB, ClickedEmptyBlock.nextSibling);
					ClickedEmptyBlock.parentNode.insertBefore(document.createTextNode('\n'), ClickedEmptyBlock.nextSibling);
					ClickedEmptyBlock.parentNode.insertBefore(WB, ClickedEmptyBlock.nextSibling);
					ClickedEmptyBlock.parentNode.insertBefore(document.createTextNode('\n'), ClickedEmptyBlock.nextSibling);
					ClickedEmptyBlock.parentNode.insertBefore(document.createElement('br'), ClickedEmptyBlock.nextSibling);
					ClickedEmptyBlock.parentNode.insertBefore(document.createTextNode('\n'), ClickedEmptyBlock.nextSibling);
					BB.appendChild(document.createTextNode('\n'));
					let BEB = document.createElement('div');
					BEB.classList.add('EmpBlk');
					BB.appendChild(BEB);
					BB.appendChild(document.createElement('br'));
				},
				createIf(ClickedEmptyBlock: HTMLElement, CBCommand: string) {
					let WB = document.createElement('div');
					WB.classList.add('IfBlk');
					WB.textContent = CBCommand;
					let NB = document.createElement('div');
					NB.classList.add('NstBlk');
					let EB = document.createElement('div');
					EB.classList.add('EmpBlk');
					let DB = document.createElement('div');
					DB.classList.add('DmyBlk');
					ClickedEmptyBlock.parentNode.insertBefore(EB, ClickedEmptyBlock.nextSibling);
					ClickedEmptyBlock.parentNode.insertBefore(document.createElement('br'), ClickedEmptyBlock.nextSibling);
					ClickedEmptyBlock.parentNode.insertBefore(document.createTextNode('\n'), ClickedEmptyBlock.nextSibling);
					ClickedEmptyBlock.parentNode.insertBefore(DB, ClickedEmptyBlock.nextSibling);
					ClickedEmptyBlock.parentNode.insertBefore(document.createTextNode('\n'), ClickedEmptyBlock.nextSibling);
					NB = ClickedEmptyBlock.parentNode.insertBefore(NB, ClickedEmptyBlock.nextSibling);
					ClickedEmptyBlock.parentNode.insertBefore(document.createTextNode('\n'), ClickedEmptyBlock.nextSibling);
					ClickedEmptyBlock.parentNode.insertBefore(WB, ClickedEmptyBlock.nextSibling);
					ClickedEmptyBlock.parentNode.insertBefore(document.createTextNode('\n'), ClickedEmptyBlock.nextSibling);
					ClickedEmptyBlock.parentNode.insertBefore(document.createElement('br'), ClickedEmptyBlock.nextSibling);
					ClickedEmptyBlock.parentNode.insertBefore(document.createTextNode('\n'), ClickedEmptyBlock.nextSibling);

					let ThenBlkBlk = document.createElement('div');
					ThenBlkBlk.classList.add('BlkBlk');
					ThenBlkBlk = NB.appendChild(ThenBlkBlk);

					let ThenFlgBlk = document.createElement('div');
					ThenFlgBlk.classList.add('FlgBlk');
					ThenFlgBlk.textContent = 'then';
					ThenBlkBlk.appendChild(ThenFlgBlk);
					ThenBlkBlk.appendChild(document.createElement('br'));
					let ThenEmpBlk = document.createElement('div');
					ThenEmpBlk.classList.add('EmpBlk');
					ThenBlkBlk.appendChild(ThenEmpBlk);

					let ThenDmyBlk = document.createElement('div');
					ThenDmyBlk.classList.add('DmyBlk');
					NB.appendChild(ThenDmyBlk);
					NB.appendChild(document.createElement('br'));

					NB.appendChild(document.createElement('br'));

					let ElseBlkBlk = document.createElement('div');
					ElseBlkBlk.classList.add('BlkBlk');
					ElseBlkBlk = NB.appendChild(ElseBlkBlk);

					let ElseFlgBlk = document.createElement('div');
					ElseFlgBlk.classList.add('FlgBlk');
					ElseFlgBlk.textContent = 'else';
					ElseBlkBlk.appendChild(ElseFlgBlk);
					ElseBlkBlk.appendChild(document.createElement('br'));
					let ElseEmpBlk = document.createElement('div');
					ElseEmpBlk.classList.add('EmpBlk');
					ElseBlkBlk.appendChild(ElseEmpBlk);

					let ElseDmyBlk = document.createElement('div');
					ElseDmyBlk.classList.add('DmyBlk');
					NB.appendChild(ElseDmyBlk);
					NB.appendChild(document.createElement('br'));
				},
				createComment(ClickedEmptyBlock: HTMLElement, CBCommand: string) {
					let CB = document.createElement('div');
					CB.classList.add('CmtBlk');
					CB.textContent = CBCommand;
					let EB = document.createElement('div');
					EB.classList.add('EmpBlk');
					ClickedEmptyBlock.parentNode.insertBefore(EB, ClickedEmptyBlock.nextSibling);
					ClickedEmptyBlock.parentNode.insertBefore(document.createElement('br'), ClickedEmptyBlock.nextSibling);
					ClickedEmptyBlock.parentNode.insertBefore(document.createTextNode('\n'), ClickedEmptyBlock.nextSibling);
					ClickedEmptyBlock.parentNode.insertBefore(CB, ClickedEmptyBlock.nextSibling);
					ClickedEmptyBlock.parentNode.insertBefore(document.createElement('br'), ClickedEmptyBlock.nextSibling);
				},
				createFunction(ClickedEmptyBlock: HTMLElement, CBCommand: string) {
					let CB = document.createElement('div');
					let tmp;
					CB.classList.add('FncBlk');
					CB.textContent = tmp = CBCommand.split(' ')[0];
					let EB = document.createElement('div');
					EB.classList.add('EmpBlk');
					ClickedEmptyBlock.parentNode.insertBefore(EB, ClickedEmptyBlock.nextSibling);
					ClickedEmptyBlock.parentNode.insertBefore(document.createElement('br'), ClickedEmptyBlock.nextSibling);
					ClickedEmptyBlock.parentNode.insertBefore(document.createTextNode('\n'), ClickedEmptyBlock.nextSibling);
					ClickedEmptyBlock.parentNode.insertBefore(CB, ClickedEmptyBlock.nextSibling);
					ClickedEmptyBlock.parentNode.insertBefore(document.createElement('br'), ClickedEmptyBlock.nextSibling);

					// 関数本体がなければ作る
					if (document.getElementById(tmp) === null) {
						document.getElementById('PAD').appendChild(document.createElement('br'));
						document.getElementById('PAD').appendChild(document.createElement('br'));
						let BB = document.createElement('div');
						BB.classList.add('BlkBlk', 'Func');
						BB.id = tmp;
						BB = document.getElementById('PAD').appendChild(BB);

						let FuncFlgBlk = document.createElement('div');
						FuncFlgBlk.classList.add('FlgBlk');
						FuncFlgBlk.textContent = tmp + ' Start';
						FuncFlgBlk.ondblclick = function () {
							if (confirm('定義処理 ' + tmp + ' を削除しますか？') === true) {
								BB.parentNode.removeChild(BB.previousSibling);
								BB.parentNode.removeChild(BB.previousSibling);
								BB.parentNode.removeChild(BB);
							}
						};
						BB.appendChild(FuncFlgBlk);
						BB.appendChild(document.createElement('br'));
						let FuncEmpBlk = document.createElement('div');
						FuncEmpBlk.classList.add('EmpBlk');
						BB.appendChild(FuncEmpBlk);
						BB.appendChild(document.createElement('br'));
						let FuncEndBlk = document.createElement('div');
						FuncEndBlk.classList.add('FlgBlk');
						FuncEndBlk.textContent = tmp + ' End';
						BB.appendChild(FuncEndBlk);
					}
				},
				createNormal(ClickedEmptyBlock: HTMLElement, CBCommand: string) {
					let CB = document.createElement('div');
					CB.classList.add('CmdBlk');
					CB.textContent = CBCommand;
					let EB = document.createElement('div');
					EB.classList.add('EmpBlk');
					ClickedEmptyBlock.parentNode.insertBefore(EB, ClickedEmptyBlock.nextSibling);
					ClickedEmptyBlock.parentNode.insertBefore(document.createElement('br'), ClickedEmptyBlock.nextSibling);
					ClickedEmptyBlock.parentNode.insertBefore(document.createTextNode('\n'), ClickedEmptyBlock.nextSibling);
					ClickedEmptyBlock.parentNode.insertBefore(CB, ClickedEmptyBlock.nextSibling);
					ClickedEmptyBlock.parentNode.insertBefore(document.createElement('br'), ClickedEmptyBlock.nextSibling);
				}
			},
			edit(cmdblk: HTMLElement) {
				let cmd = window.prompt('Edit the Command Block', cmdblk.textContent);
				if (cmd === null) {
					mknpad.system.block.update();
					return false;
				}
				cmd = mknpad.system.block.internal.normalize(cmd);

				if (cmd === '' && !cmdblk.classList.contains('padTitle')) {
					mknpad.system.block.remove(cmdblk);
					return false;
				}
				cmdblk.textContent = cmd;
				mknpad.system.block.update();
				return true;
			},
			remove(cmdblk: HTMLElement) {
				if (cmdblk.classList.contains('WhlBlk') || cmdblk.classList.contains('DowBlk') || cmdblk.classList.contains('IfBlk')) {
					cmdblk.parentNode.removeChild(cmdblk.nextSibling);
					cmdblk.parentNode.removeChild(cmdblk.nextSibling);
					cmdblk.parentNode.removeChild(cmdblk.nextSibling);
					cmdblk.parentNode.removeChild(cmdblk.nextSibling);
				}
				cmdblk.parentNode.removeChild(cmdblk);
				mknpad.system.block.update();
			},
			update(t = 0) {
				mknpad.system.block.internal.trimEmptyBlock();
				// エンプティブロックに追加のルーチンを追加
				let EmptyBlocks = document.getElementsByClassName('EmpBlk') as HTMLCollectionOf<HTMLElement>;
				for (let i = 0; i < EmptyBlocks.length; i++) {
					EmptyBlocks[i].onclick = function (e) {
						mknpad.system.block.create(EmptyBlocks[i]);
					};
				}

				// コマンドブロックに編集のルーチンを追加
				let CommandBlocks = document.getElementsByClassName('CmdBlk') as HTMLCollectionOf<HTMLElement>;
				for (let i = 0; i < CommandBlocks.length; i++) {
					CommandBlocks[i].ondblclick = mknpad.system.handler.block.internal.editit;
					CommandBlocks[i].oncontextmenu = mknpad.system.handler.block.context;
				}
				CommandBlocks = document.getElementsByClassName('WhlBlk') as HTMLCollectionOf<HTMLElement>;
				for (let i = 0; i < CommandBlocks.length; i++) {
					CommandBlocks[i].ondblclick = mknpad.system.handler.block.internal.editit;
					CommandBlocks[i].oncontextmenu = mknpad.system.handler.block.context;
				}
				CommandBlocks = document.getElementsByClassName('DowBlk') as HTMLCollectionOf<HTMLElement>;
				for (let i = 0; i < CommandBlocks.length; i++) {
					CommandBlocks[i].ondblclick = mknpad.system.handler.block.internal.editit;
					CommandBlocks[i].oncontextmenu = mknpad.system.handler.block.context;
				}
				CommandBlocks = document.getElementsByClassName('IfBlk') as HTMLCollectionOf<HTMLElement>;
				for (let i = 0; i < CommandBlocks.length; i++) {
					CommandBlocks[i].ondblclick = mknpad.system.handler.block.internal.editit;
					CommandBlocks[i].oncontextmenu = mknpad.system.handler.block.context;
				}
				CommandBlocks = document.getElementsByClassName('PADTitle') as HTMLCollectionOf<HTMLElement>;
				for (let i = 0; i < CommandBlocks.length; i++) {
					CommandBlocks[i].ondblclick = mknpad.system.handler.block.internal.editit;
				}
				CommandBlocks = document.getElementsByClassName('CmtBlk') as HTMLCollectionOf<HTMLElement>;
				for (let i = 0; i < CommandBlocks.length; i++) {
					CommandBlocks[i].ondblclick = mknpad.system.handler.block.internal.editit;
					CommandBlocks[i].oncontextmenu = mknpad.system.handler.block.context;
				}
				CommandBlocks = document.getElementsByClassName('FncBlk') as HTMLCollectionOf<HTMLElement>;
				for (let i = 0; i < CommandBlocks.length; i++) {
					CommandBlocks[i].ondblclick = mknpad.system.handler.block.internal.editit;
					CommandBlocks[i].oncontextmenu = mknpad.system.handler.block.context;
				}
				if (t === 0) {
					mknpad.system.block.update(1);
				}
			},
			create(ClickedEmptyBlock: HTMLElement) {
				let cmd = window.prompt('Insert a Command Block', '');
				if (cmd !== null) {
					cmd = mknpad.system.block.internal.normalize(cmd);
				}
				if (cmd === null || cmd === '') {
					mknpad.system.block.update();
					return false;
				}
				switch (mknpad.dev.blockType.value) {
					case 'while':
						mknpad.system.block.internal.createWhile(ClickedEmptyBlock, cmd);
						break;
					case 'until':
						mknpad.system.block.internal.createUntil(ClickedEmptyBlock, cmd);
						break;
					case 'if':
						mknpad.system.block.internal.createIf(ClickedEmptyBlock, cmd);
						break;
					case 'comment':
						mknpad.system.block.internal.createComment(ClickedEmptyBlock, cmd);
						break;
					case 'function':
						mknpad.system.block.internal.createFunction(ClickedEmptyBlock, cmd);
						break;
					default:
						mknpad.system.block.internal.createNormal(ClickedEmptyBlock, cmd);
						break;
				}
				mknpad.system.block.update();
				return true;
			}
		},
		console: {
			scroll(dev: HTMLElement) {
				dev.scrollBy({ top: dev.scrollHeight, behavior: "smooth" });
			},
			log(str: string) {
				const time = new Date();
				mknpad.api.printErr(`[${time.toLocaleTimeString()}.${time.getMilliseconds()}] ${str}\n`);
				mknpad.system.console.scroll(mknpad.dev.err);
			},
			showCode() {
				mknpad.io.clear(mknpad.dev.out);
				mknpad.system.pad.compile();
				mknpad.api.printOut(mknpad.var.padjs);
			}
		}
	},

	boot() {
		mknpad.init.dev();
		mknpad.init.handler();
		mknpad.system.block.update();
		mknpad.system.console.log('Info: mknpad.boot: Done.');
		mknpad.system.console.log('');
		mknpad.system.console.log('*** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** ');
		mknpad.system.console.log('');
		mknpad.system.console.log(`Welcome to ${mknpad.const.versionString} (${mknpad.const.internalName})`);
		mknpad.system.console.log('');
		mknpad.system.console.log(` - Documentation:\thttps://memo.kusaremkn.com/mknpad/`);
		mknpad.system.console.log('');
		mknpad.system.console.log('*** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** ');
	}
};

mknpad.boot();
