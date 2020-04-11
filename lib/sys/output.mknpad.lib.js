mknpad.sys = (mknpad.sys || {});

mknpad.sys.printOut = mknpad.sys.printOut || function (...str) {
	for (let i = 0; i < str.length; i++) {
		mknpad.dev.out.textContent += str;
	}
};

mknpad.sys.printErr = mknpad.sys.printErr || function (...str) {
	for (let i = 0; i < str.length; i++) {
		mknpad.dev.err.textContent += str;
	}
};
