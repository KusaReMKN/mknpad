// 既存のコマンドブロックの編集
function EditBlock(ClickedCommandBlock) {
	let NewCommand = window.prompt('コマンドブロックを編集...', ClickedCommandBlock.textContent);
	if (NewCommand === null) {	// キャンセルは何もしない
		UpdateBlocks();
		return false;
	}
	else {
		NewCommand = NewCommand.replace(/\s+/g, ' ');
		NewCommand = NewCommand.replace(/(^\s*|\s*$)/g, '');
	}
	if (NewCommand === '' && !ClickedCommandBlock.classList.contains('PADTitle')) {	// 空になったら削除
		if (ClickedCommandBlock.classList.contains('WhlBlk') || ClickedCommandBlock.classList.contains('DowBlk') || ClickedCommandBlock.classList.contains('IfBlk')) {
			ClickedCommandBlock.parentNode.removeChild(ClickedCommandBlock.nextSibling);
			ClickedCommandBlock.parentNode.removeChild(ClickedCommandBlock.nextSibling);
			ClickedCommandBlock.parentNode.removeChild(ClickedCommandBlock.nextSibling);
			ClickedCommandBlock.parentNode.removeChild(ClickedCommandBlock.nextSibling);
		}
		ClickedCommandBlock.parentNode.removeChild(ClickedCommandBlock);
		UpdateBlocks();
		return false;
	}
	ClickedCommandBlock.textContent = NewCommand;
	UpdateBlocks();
	return true;
}
