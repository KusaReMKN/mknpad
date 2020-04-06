mknpad.sys = mknpad.sys || {};
mknpad.sys.ctype = mknpad.sys.ctype || {};
mknpad.sys.ctype.isalnum = mknpad.sys.ctype.isalnum || function (c) {
	return mknpad.sys.ctype.isalpha(c) || mknpad.sys.ctype.isdigit(c);
};
