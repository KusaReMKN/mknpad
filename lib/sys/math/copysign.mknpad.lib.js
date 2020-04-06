mknpad.sys = mknpad.sys || {};
mknpad.sys.math = mknpad.sys.math || {};
mknpad.sys.math.copysign = mknpad.sys.math.copysign || function (x, y) {
	return (y < 0 ? -Math.abs(x) : Math.abs(x));
};
