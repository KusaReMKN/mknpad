mknpad.sys = mknpad.sys || {};
mknpad.sys.math = mknpad.sys.math || {};
mknpad.sys.math.fdim = mknpad.sys.math.fdim || function (x, y) {
	return x > y ? x - y : y - x;
}
