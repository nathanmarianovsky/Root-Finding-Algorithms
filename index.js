var math = require("mathjs"),
	fs = require("fs");






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
	console.log(error);
	if(f(interval[0]) == 0) { return interval[0]; }
	if(f(interval[1]) == 0) { return interval[1]; }
	while(!(f(interval[0]) == 0 || f(interval[1]) == 0 || Math.abs(f(interval[2])) <= error)) {
		console.log(interval);
		interval = bisect(f, interval);
	}
	return interval[2];
};

// main(f, [1, 2, 0], 1 / 10);

fs.readFile("input.txt", "utf8", (err, data) => {
	if(err) { throw err; }
	var rows = data.split("\n").map(elem => elem.split("\r")[0]),
		left = parseFloat(rows[3].split(",")[0].split("[")[1]),
		right = parseFloat(rows[3].split(",")[1].split("]")[0]),
		control = parseFloat(rows[5]),
		parser = new math.parser();
	parser.eval(rows[1]);
	var func = parser.get("f");
	console.log("The first value of x that makes |f(x)| < " + control + " is " + main(func, [left, right, 0], control) + ".");
});