/* mknio start */
const mknio = {
	put: x => {
		mknpad.api.printOut(x);
	},
	get: () => {
		return window.prompt();
	}
}
/* mknio end */
