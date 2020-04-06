mknpad.sys = mknpad.sys || {};
mknpad.sys.math = mknpad.sys.math || {};
mknpad.sys.math.erf = mknpad.sys.math.erf || function (x) {
	// erf(x) = 2/sqrt(pi) * integrate(from=0, to=x, e^-(t^2) ) dt
	// with using Taylor expansion, 
	//        = 2/sqrt(pi) * sigma(n=0 to +inf, ((-1)^n * x^(2n+1))/(n! * (2n+1)))
	// calculationg n=0 to 50 bellow (note that inside sigma equals x when n = 0, and 50 may be enough)
	var m = 1.00;
	var s = 1.00;
	var sum = x * 1.0;
	for (var i = 1; i < 50; i++) {
		m *= i;
		s *= -1;
		sum += (s * Math.pow(x, 2.0 * i + 1.0)) / (m * (2.0 * i + 1.0));
	}
	return 2 * sum / Math.sqrt(3.14159265358979);
}
mknpad.sys.math.erfc = mknpad.sys.math.erfc || function (x) {
	return 1 - erf(x);
}
