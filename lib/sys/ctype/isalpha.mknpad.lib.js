mknpad.sys = mknpad.sys || {};
mknpad.sys.ctype = mknpad.sys.ctype || {};
mknpad.sys.ctype.isalpha = mknpad.sys.ctype.isalpha || function (c) {
	return RegExp(/[A-Za-z]/).test(typeof c === 'number' ? String.fromCharCode(c) : String(c)[0]);
};
