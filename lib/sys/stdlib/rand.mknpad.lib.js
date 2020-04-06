mknpad.sys = mknpad.sys || {};
mknpad.sys.stdlib = mknpad.sys.stdlib || {};
mknpad.sys.stdlib.RAND_MAX = mknpad.sys.stdlib.RAND_MAX || 0x7fff;
mknpad.sys.stdlib.rand = mknpad.sys.stdlib.rand || function () {
	return Math.floor(Math.random() * mknpad.sys.stdlib.RAND_MAX);
}
