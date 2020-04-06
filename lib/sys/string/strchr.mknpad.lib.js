mknpad.sys = mknpad.sys || {};
mknpad.sys.string = mknpad.sys.string || {};
mknpad.sys.string.strchr = mknpad.sys.string.strchr || function (s, c) {
	return s.indexOf(typeof c === 'number' ? String.fromCharCode(c) : c);
};
