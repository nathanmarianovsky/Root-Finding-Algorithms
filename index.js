var math = require("mathjs");

var parser = new math.parser();

parser.eval("f(x) = (x^2)-2");
var f = parser.get("f");

// console.log(f(Math.PI,1));



var bisect = (f, interval) => {
	var middle = f((interval[0] + interval[1]) / 2),
		holder = 0,
		arr = [];
	if(f(interval[0]) > 0 && f(interval[1]) < 0) {
		if(middle <= 0) {
			holder = interval[1];
			interval[1] = (interval[0] + interval[1]) / 2;
		}
		else {
			holder = interval[0];
			interval[0] = (interval[0] + interval[1]) / 2;
		}
		interval[2] = holder;
		// f(middle) <= 0 ? interval[1] = middle : interval[0] = middle;
	}
	else if(f(interval[0]) < 0 && f(interval[1]) > 0) {
		if(middle >= 0) {
			holder = interval[1];
			interval[1] = (interval[0] + interval[1]) / 2;
		}
		else {
			holder = interval[0];
			interval[0] = (interval[0] + interval[1]) / 2;
		}
		interval[2] = holder;
		// f(middle) >= 0 ? interval[1] = middle : interval[0] = middle;
	}
	return interval;
};

// console.log(bisect(f, [1,2,0]));

var main = (f, interval, error) => {
	console.log(interval);
	if(f(interval[0]) == 0) { return interval[0]; }
	if(f(interval[1]) == 0) { return interval[1]; }
	console.log(f(interval[0]));
	console.log(f(interval[1]));
	console.log(f(interval[2]));
	while(!(f(interval[0]) == 0 || f(interval[1]) == 0 || Math.abs(f(interval[2])) <= error)) {
		console.log(interval);
		interval = bisect(f, interval);
	}
	console.log(interval);
};

main(f, [1, 2, 0], 1 / 10);