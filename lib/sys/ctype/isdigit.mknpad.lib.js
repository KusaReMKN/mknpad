mknpad.sys = mknpad.sys || {};
mknpad.sys.ctype = mknpad.sys.ctype || {};
mknpad.sys.ctype.isdigit = mknpad.sys.ctype.isdigit || function (c) {
	return RegExp(/\d/).test(typeof c === 'number' ? String.fromCharCode(c) : String(c)[0]);
};
