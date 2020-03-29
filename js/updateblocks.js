// 【筑前煮】選択中のブロックを保持
let SelectedBlock = null;
let BlockSelected = false;

document.getElementById('pad').onclick = function () {
	if (BlockSelected !== true && SelectedBlock !== null) {
		SelectedBlock.style.borderStyle = 'solid';
		SelectedBlock.style.borderWidth = '2px';
		SelectedBlock = null;
	}
	BlockSelected = false;
	let migiMenu = document.getElementById('migiMenu');
	migiMenu.style.display = 'none';
}

// 【筑前煮】クリックによってブロックを選択する
function Select(e) {
	BlockSelected = true;
	if (SelectedBlock !== null) {
		SelectedBlock.style.borderStyle = 'solid';
		SelectedBlock.style.borderWidth = '2px';
	}
	SelectedBlock = this;
	this.style.borderStyle = 'double';
	this.style.borderWidth = '3px';
}

// 【筑前煮】右クリックによって独自メニューを出す
function ClickRight(e) {
	if (SelectedBlock !== null) {
		SelectedBlock.style.borderStyle = 'solid';
		SelectedBlock.style.borderWidth = '2px';
	}
	SelectedBlock = this;
	this.style.borderStyle = 'double';
	this.style.borderWidth = '3px';

	let migiMenu = document.getElementById('migiMenu');
	migiMenu.style.display = 'block';
	migiMenu.style.top = (this.getBoundingClientRect().top + window.pageYOffset + this.clientHeight) + 'px';
	migiMenu.style.left = (this.getBoundingClientRect().left + window.pageXOffset + this.clientWidth) + 'px';

	let foo = this;

	document.getElementById('copyit').onclick = function () {
		BlockSelected = false;
		let migiMenu = document.getElementById('migiMenu');
		migiMenu.style.display = 'none';
	};
	document.getElementById('cutit').onclick = function () {
		BlockSelected = false;
		let migiMenu = document.getElementById('migiMenu');
		migiMenu.style.display = 'none';
	};
	document.getElementById('deleteit').onclick = function () {
		console.log(foo);
		if (foo.classList.contains('WhlBlk') || foo.classList.contains('DowBlk') || foo.classList.contains('IfBlk')) {
			foo.parentNode.removeChild(foo.nextSibling);
			foo.parentNode.removeChild(foo.nextSibling);
			foo.parentNode.removeChild(foo.nextSibling);
			foo.parentNode.removeChild(foo.nextSibling);
		}
		foo.parentNode.removeChild(foo);
		UpdateBlocks();

		BlockSelected = false;
		let migiMenu = document.getElementById('migiMenu');
		migiMenu.style.display = 'none';
	};
	document.getElementById('editit').onclick = function () {
		BlockSelected = false;
		let migiMenu = document.getElementById('migiMenu');
		migiMenu.style.display = 'none';

		let evt = new MouseEvent("dblclick", { bubbles: true, cancelable: true, view: window });
		foo.dispatchEvent(evt);
	};
	return false;
}

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
			EditBlock(this);
		};
		CommandBlocks[i].oncontextmenu = ClickRight;
		CommandBlocks[i].onclick = Select;
	}
	CommandBlocks = document.getElementsByClassName('WhlBlk');
	for (let i = 0; i < CommandBlocks.length; i++) {
		CommandBlocks[i].ondblclick = function (e) {
			EditBlock(this);
		};
		CommandBlocks[i].oncontextmenu = ClickRight;
		CommandBlocks[i].onclick = Select;
	}
	CommandBlocks = document.getElementsByClassName('DowBlk');
	for (let i = 0; i < CommandBlocks.length; i++) {
		CommandBlocks[i].ondblclick = function (e) {
			EditBlock(this);
		};
		CommandBlocks[i].oncontextmenu = ClickRight;
		CommandBlocks[i].onclick = Select;
	}
	CommandBlocks = document.getElementsByClassName('IfBlk');
	for (let i = 0; i < CommandBlocks.length; i++) {
		CommandBlocks[i].ondblclick = function (e) {
			EditBlock(this);
		};
		CommandBlocks[i].oncontextmenu = ClickRight;
		CommandBlocks[i].onclick = Select;
	}
	CommandBlocks = document.getElementsByClassName('PADTitle');
	for (let i = 0; i < CommandBlocks.length; i++) {
		CommandBlocks[i].ondblclick = function (e) {
			EditBlock(this);
		};
	}
	CommandBlocks = document.getElementsByClassName('CmtBlk');
	for (let i = 0; i < CommandBlocks.length; i++) {
		CommandBlocks[i].ondblclick = function (e) {
			EditBlock(this);
		};
	}
	CommandBlocks = document.getElementsByClassName('FncBlk');
	for (let i = 0; i < CommandBlocks.length; i++) {
		CommandBlocks[i].ondblclick = function (e) {
			EditBlock(this);
		};
		CommandBlocks[i].oncontextmenu = ClickRight;
		CommandBlocks[i].onclick = Select;
	}
	if (t == 0) {
		UpdateBlocks(1);
	}
}

window.addEventListener('load', UpdateBlocks);
