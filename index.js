// Declare the necessary variables
var math = require("mathjs"),
	fs = require("fs");

// Performs a single iteration of the Bisection Method and returns the new array containing the endpoints and the new candidate.
var bisect = (f, interval) => {
	var middle = (interval[0] + interval[1]) / 2,
		eval1 = f(interval[0]),
		eval2 = f(interval[1]),
		value = f(middle),
		holder = 0,
		arr = [];
	if(eval1 > 0 && eval2 < 0) {
		if(value <= 0) {
			holder = interval[1];
			interval[1] = middle;
		}
		else {
			holder = interval[0];
			interval[0] = middle;
		}
	}
	else if(eval1 < 0 && eval2 > 0) {
		if(value >= 0) {
			holder = interval[1];
			interval[1] = middle;
		}
		else {
			holder = interval[0];
			interval[0] = middle;
		}
	}
	interval[2] = holder;
	return interval;
};

// Iterates through the Bisection Method until a desired value is found or breaks after one million steps.
var main = (f, interval, error) => {
	if(f(interval[0]) == 0) { return interval[0]; }
	if(f(interval[1]) == 0) { return interval[1]; }
	var count = 0;
	while(!(f(interval[0]) == 0 || f(interval[1]) == 0 || Math.abs(f(interval[2])) <= error)) {
		if(count == 10000) { console.log("After ten thousand steps " +
			"there is still no value of x that satisfies the condition with the given error.") }
		else if(count == 1000000) { 
			console.log("After one million steps there is still no value of x that satisfies " + 
				"the condition and this is enough to convince us that there might not be such a value " + 
				"or the interval was just not tight enough!");
			interval[2] = "UNDEFINED";
			break;
		}
		interval = bisect(f, interval);
		count++;
	}
	return interval[2];
};

// Read and parse the input. Call the main function and output the result if there is one. 
fs.readFile("input.txt", "utf8", (err, data) => {
	if(err) { throw err; }
	var rows = data.split("\n").map(elem => elem.split("\r")[0]),
		left = parseFloat(rows[3].split(",")[0].split("[")[1]),
		right = parseFloat(rows[3].split(",")[1].split("]")[0]),
		control = parseFloat(rows[5]),
		parser = new math.parser();
	try {
		parser.eval(rows[1]);
		var func = parser.get("f");
		var result = main(func, [left, right, 0], control);
		if(result != "UNDEFINED") {
			console.log("The first value of x inside " + rows[3].replace(/ /g,'') + " that makes |f(x)| < " + control + " is " + result.toPrecision(15));
		}
	}
	catch(prob) {
		console.log("There was a problem parsing either the function, interval, or error you provided!");	
	}
});