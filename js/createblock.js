// 新しいコマンドブロックの挿入
// 引数は挿入位置直前のエンプティブロック
function CreateBlock(ClickedEmptyBlock) {
	let CBCommand = window.prompt('コマンドブロックを挿入...', '');
	if (CBCommand !== null) {
		CBCommand = CBCommand.replace(/\s+/g, ' ');
		CBCommand = CBCommand.replace(/(^\s*|\s*$)/g, '');
	}
	if (CBCommand === null || CBCommand === '') {
		UpdateBlocks();
		return false;
	}
	// あからさまに比較じゃない奴は
	if (CBCommand.match(/^(NEQ|EQ|LT|GT|LTE|GTE|\$|C:)/g) === null && document.getElementById('blktype').value.match(/^(while|until|if)/g) !== null) {
		document.getElementById('blktype').value = 'normal';
	}
	switch (document.getElementById('blktype').value) {
		case 'while':
			{
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
			}
			break;
		case 'until':
			{
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
			}
			break;
		case 'if':
			{
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

			}
			break;
		case 'comment':
			{
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
			}
			break;
		case 'function':
			{
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
			}
			break;
		default:
			{
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
			break;
	}
	UpdateBlocks();
	return true;
}
