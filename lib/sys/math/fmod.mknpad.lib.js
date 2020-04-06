mknpad.sys = mknpad.sys || {};
mknpad.sys.math = mknpad.sys.math || {};
mknpad.sys.math.fmod = mknpad.sys.math.fmod || function (a, b) {
	return Number((a - (Math.floor(a / b) * b)).toPrecision(8));
};
mknpad.sys.math.remainder = mknpad.sys.math.remainder || function (a, b) {
	return Number((a - (Math.floor(a / b) * b)).toPrecision(8));
};
mknpad.sys.math.remquo = mknpad.sys.math.remquo || function (a, b) {
	return Number((a - (Math.floor(a / b) * b)).toPrecision(8));
};
