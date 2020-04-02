mknpad.sys = (mknpad.sys || {});

mknpad.sys.printOut = (mknpad.sys.printOut || function (str) {
	mknpad.dev.out.textContent += str;
});

mknpad.sys.printErr = (mknpad.sys.printErr || function (str) {
	mknpad.dev.err.textContent += str;
});
