mknpad.sys = mknpad.sys || {};
mknpad.sys.math = mknpad.sys.math || {};
mknpad.sys.math.modf = mknpad.sys.math.modf || function (x) {
	return [x % 1, x / 1 | 0];
}
