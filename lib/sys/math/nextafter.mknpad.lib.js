mknpad.sys = mknpad.sys || {};
mknpad.sys.math = mknpad.sys.math || {};
mknpad.sys.math.nextafter = mknpad.sys.math.nextafter || function (x, y) {
	return y - x < 0 ? x - Number.EPSILON : x + Number.EPSILON;
}
mknpad.sys.math.nexttoward = mknpad.sys.math.nexttoward || function (x, y) {
	return y - x < 0 ? x - Number.EPSILON : x + Number.EPSILON;
}
