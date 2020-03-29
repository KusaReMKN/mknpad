/* stdio for mknpad start */
const EOF = -1;
const NULL = null;

function puts(s) {
	mknpad.api.printOut(s + '\n');
}

function gets() {
	return window.prompt()
}
/* stdio for mknpad end */
