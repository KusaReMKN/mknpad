"use strict";

let mknpad = {
	dev: {
		err: undefined,
		out: undefined,
	},
	init: {
		dev() {
			mknpad.dev.err = document.getElementById('paderr');
			mknpad.dev.err.textContent = '';
			mknpad.dev.out = document.getElementById('padout');
			mknpad.dev.out.textContent = '';
		},
	},
	boot() {
		mknpad.init.dev();
		delete mknpad.init;

		if (window.localStorage.padjs) {
			let mainjs = document.createElement('script');
			mainjs.textContent = window.localStorage.getItem('padjs');
			document.body.appendChild(mainjs);
			window.localStorage.removeItem('padjs');
		} else {
			mknpad.dev.err.textContent = 'Nothing to do!';
		}
	}
};
window.addEventListener('load', () => {
	setTimeout(mknpad.boot, 3000);
});
