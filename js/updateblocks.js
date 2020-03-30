// ブロックに触った時のイベントを付ける
// ついでに連続した空ブロックを殺す
function UpdateBlocks(t = 0) {
	mknpad.system.block.internal.trimEmptyBlock();
	// エンプティブロックに追加のルーチンを追加
	let EmptyBlocks = document.getElementsByClassName('EmpBlk');
	for (let i = 0; i < EmptyBlocks.length; i++) {
		EmptyBlocks[i].onclick = function (e) {
			mknpad.system.block.create(this);
		};
	}

	// コマンドブロックに編集のルーチンを追加
	let CommandBlocks = document.getElementsByClassName('CmdBlk');
	for (let i = 0; i < CommandBlocks.length; i++) {
		CommandBlocks[i].ondblclick = function (e) {
			mknpad.system.block.edit(this);
		};
		CommandBlocks[i].oncontextmenu = mknpad.system.handler.context;
	}
	CommandBlocks = document.getElementsByClassName('WhlBlk');
	for (let i = 0; i < CommandBlocks.length; i++) {
		CommandBlocks[i].ondblclick = function (e) {
			mknpad.system.block.edit(this);
		};
		CommandBlocks[i].oncontextmenu = mknpad.system.handler.context;
	}
	CommandBlocks = document.getElementsByClassName('DowBlk');
	for (let i = 0; i < CommandBlocks.length; i++) {
		CommandBlocks[i].ondblclick = function (e) {
			mknpad.system.block.edit(this);
		};
		CommandBlocks[i].oncontextmenu = mknpad.system.handler.context;
	}
	CommandBlocks = document.getElementsByClassName('IfBlk');
	for (let i = 0; i < CommandBlocks.length; i++) {
		CommandBlocks[i].ondblclick = function (e) {
			mknpad.system.block.edit(this);
		};
		CommandBlocks[i].oncontextmenu = mknpad.system.handler.context;
	}
	CommandBlocks = document.getElementsByClassName('PADTitle');
	for (let i = 0; i < CommandBlocks.length; i++) {
		CommandBlocks[i].ondblclick = function (e) {
			mknpad.system.block.edit(this);
		};
	}
	CommandBlocks = document.getElementsByClassName('CmtBlk');
	for (let i = 0; i < CommandBlocks.length; i++) {
		CommandBlocks[i].ondblclick = function (e) {
			mknpad.system.block.edit(this);
		};
		CommandBlocks[i].oncontextmenu = mknpad.system.handler.context;
	}
	CommandBlocks = document.getElementsByClassName('FncBlk');
	for (let i = 0; i < CommandBlocks.length; i++) {
		CommandBlocks[i].ondblclick = function (e) {
			mknpad.system.block.edit(this);
		};
		CommandBlocks[i].oncontextmenu = mknpad.system.handler.context;
	}
	if (t == 0) {
		UpdateBlocks(1);
	}
}

window.addEventListener('load', UpdateBlocks);
