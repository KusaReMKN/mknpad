mknpad.sys = mknpad.sys || {};
mknpad.sys.math = mknpad.sys.math || {};
mknpad.sys.math.FLT_RADIX = mknpad.sys.math.FLT_RADIX || 2;
mknpad.sys.math.scalbn = mknpad.sys.math.scalbn || function (x, y) {
	return x * mknpad.sys.math.FLT_RADIX ** y;
}
