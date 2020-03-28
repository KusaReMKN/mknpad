let mknpad = {
	const: {
		version: '0.5.0.0',
		versionString: 'PAD Editor β Eryngii 0.0',
		internalName: 'MKNPAD.Eryngii.0.5',
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
			option: 'dialog=yes,width=800,height=600,alwaysRaised=yes',
		}
	},
	var: {
		padjs: '',
		importErrorCount: 0,
	},
	dev: {
		err: undefined,
		out: undefined,
		pad: undefined,
		run: undefined,
	},
	io: {
		// テキストアクセス
		print(dev, str) {
			dev.textContent += str;
		},
		scan(dev) {
			return dev.textContent;
		},
		clear(dev) {
			dev.textContent = '';
		},
		// Base64 アクセス
		write(dev, base64) {
			dev.innerHTML = decodeURIComponent(window.atob(base64));
		},
		read(dev) {
			return window.btoa(encodeURIComponent(dev.innerHTML));
		},
	},
	api: {
		abort(str) {
			throw ('mknpad.api.abort: ' + str);
		},
		printErr(str) {
			mknpad.io.print(mknpad.dev.err, str);
		},
		printOut(str) {
			mknpad.io.print(mknpad.dev.out, str);
		},
		padData() {
			return mknpad.io.read(mknpad.dev.pad);
		},
		writePad(base64) {
			mknpad.io.write(mknpad.dev.pad, base64);
		},
		getQuery() {
			let vars = [], max = 0, hash = [], array = [];
			let url = window.location.search;
			hash = url.slice(1).split('&');
			max = hash.length;
			for (var i = 0; i < max; i++) {
				array = hash[i].split('='); //keyと値に分割。
				vars.push(array[0]); //末尾にクエリ文字列のkeyを挿入。
				vars[array[0]] = array[1]; //先ほど確保したkeyに、値を代入。
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
			mknpad.dev.run = document.getElementById('padrun');
			mknpad.dev.pad = document.getElementById('pad');
		},
	},
	system: {
		file: {
			savePad() {
				let fileData = {
					version: mknpad.const.version,
					data: mknpad.api.padData(),
					dataLength: undefined,
				};
				fileData.dataLength = fileData.data.length;
				if (!window.Blob) {
					mknpad.api.printErr('Error: Your browser does not support Blob.\n');
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
							}
							catch (e) {
								mknpad.api.printErr(`Error: File (${res.name}) not supported.\n`);
								return false;
							}
							if (fileData.version && fileData.version.split && fileData.version.split('.')[1] === mknpad.const.version.split('.')[1]) {
								if (fileData.data.length === fileData.dataLength) {
									mknpad.api.writePad(fileData.data);
									mknpad.api.printErr(`Info: File (${res.name}) has loaded.\n`);
									return true;
								}
								else {
									mknpad.api.printErr(`Error: File (${res.name}) is broken.\n`);
									return false;
								}
							}
							else {
								mknpad.api.printErr(`Error: File (${res.name}) is unsupported version.\n`);
								return false;
							}
						}
						else {
							mknpad.api.printErr(`Error: File (${res.name}) not supported.\n`);
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
				mknpad.api.printErr(`Info: @import: ${this.responseURL} [ ${this.status}: ${this.statusText} ]\n`);
			}
		},
		pad: {
			internal: {
				subCompile(subPad, n = 0) {
					for (let i = 0; i < subPad.children.length; i++) {
						let block = subPad.children.item(i);
						for (let j = 0; j < n; j++) {
							mknpad.var.padjs += '\t';
						}
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
							}
							else {
								mknpad.var.padjs += block.textContent + ';\n';
							}
						}
					}
				},
				atImport(argv) {
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
				atCommand(cmd) {
					let argv = cmd.split(' ');
					switch (argv[0]) {
						case '@import':
							mknpad.system.pad.internal.atImport(argv);
							break;
						default:
							mknpad.api.printErr(`Error: Unknown @ Command: ${argv[0]}\n`);
					}
				},
			},
			compile() {
				mknpad.api.printErr('Info: mknpad.system.pad.compile: Start ...\n');
				mknpad.var.padjs = '';
				mknpad.var.padjs += 'function Main() {\n';
				mknpad.system.pad.internal.subCompile(mknpad.dev.pad);
				mknpad.var.padjs += '}\n';
				mknpad.api.printErr(mknpad.var.importErrorCount === 0 ?
					'Info: mknpad.system.pad.compile: Done.\n' :
					'Error: mknpad.system.pad.compile: @import Error\n');
			},
			run() {
				mknpad.api.printErr('\nInfo: mknpad.system.pad.run: Start ...\n\n');
				mknpad.system.pad.compile();
				let mainURI = 'data:text/javascript;charset=utf-8,' + encodeURIComponent(mknpad.var.padjs);
				mknpad.dev.run.src = './runtime/?q=' + mainURI;
				mknpad.api.printErr('\nInfo: mknpad.system.pad.run: Done.\n');
			}
		},
	},
	boot() {
		mknpad.init.dev();

		let mainjs = document.createElement('script');
		mainjs.src = 'data:text/javascript;charset=utf-8,' + (mknpad.api.getQuery()['q']);
		document.body.appendChild(mainjs);
	}
};
window.addEventListener('load', mknpad.boot);
