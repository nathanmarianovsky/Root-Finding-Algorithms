// Declare the necessary variables
var math = require("mathjs"),
	fs = require("fs");

// Performs a single iteration of Newton's Method and returns the next candidate.
var newton = (f, g, current) => current - (f(current) / g(current));

// Iterates through Newton's Method until a desired value is found or breaks after one million steps.
var NM = (f, g, value, error, timer) => {
	if(f(value) == 0) { return value; }
	var count = 0;
	while(Math.abs(f(value)) > error) {
		if(f(value) == Infinity) { console.log("It seems after " + count + " steps there was a blowup!"); }
		if(count == 10000) { console.log("After ten thousand steps " +
			"there is still no value of x that satisfies the condition with the given error.") }
		else if(count == 1000000) { 
			timer = process.hrtime(timer).toString().split(",");
			console.log("Newton's Method: " + timer[0] + " seconds and " + timer[1] + " nanoseconds");
			console.log("After one million steps there is still no value of x that satisfies " + 
				"the condition and this is enough to convince us that there might not be such a value " + 
				"or the interval was just not tight enough!");
			value = "UNDEFINED";
			break;
		}
		value = newton(f, g, value);
		count++;
	}
	return value;
};

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
var BM = (f, interval, error, timer) => {
	if(f(interval[0]) == 0) { return interval[0]; }
	if(f(interval[1]) == 0) { return interval[1]; }
	var count = 0;
	while(!(f(interval[0]) == 0 || f(interval[1]) == 0 || Math.abs(f(interval[2])) <= error)) {
		if(count == 10000) { console.log("After ten thousand steps " +
			"there is still no value of x that satisfies the condition with the given error.") }
		else if(count == 1000000) { 
			timer = process.hrtime(timer).toString().split(",");
			console.log("Bisection Method: " + timer[0] + " seconds and " + timer[1] + " nanoseconds");
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
		left = undefined,
		right = undefined,
		start = parseFloat(rows[5]),
		control = parseFloat(rows[7]),
		parser = new math.parser();
	if(rows[3].length != 0) {
		try {
			left = parseFloat(rows[3].split(",")[0].split("[")[1]);
			right = parseFloat(rows[3].split(",")[1].split("]")[0]);
		}
		catch(prob) {
			console.log("There was a problem parsing the interval you provided!");
		}
	}
	try {
		parser.eval(rows[1]);
		parser.eval("g(x) = " + math.derivative(rows[1].split("=")[1], rows[1].split("f(")[1][0]).toString());
		var func = parser.get("f"),
			der = parser.get("g");
		if((!isNaN(left) && !isNaN(right)) || !isNaN(start)) { console.log(""); }
		if(!isNaN(left) && !isNaN(right)) {
			console.log("-----------------------------------------------------------------------------------------------");
			var	timerBM = process.hrtime(),
				resultBM = BM(func, [left, right, 0], control, timerBM);
			if(resultBM != "UNDEFINED") {
				timerBM = process.hrtime(timerBM).toString().split(",");
				console.log("Bisection Method: " + timerBM[0] + " seconds and " + timerBM[1] + " nanoseconds");
				console.log("The first value of x inside " + rows[3].replace(/ /g,'') + 
					" that makes |f(x)| < " + control + " is " + resultBM.toPrecision(15));
			}
		}
		if(!isNaN(start)) {
			console.log("-----------------------------------------------------------------------------------------------");
			var timerNM = process.hrtime(),
				resultNM = NM(func, der, start, control, timerNM);
			if(resultNM != "UNDEFINED") {
				timerNM = process.hrtime(timerNM).toString().split(",");
				console.log("Newton's Method: " + timerNM[0] + " seconds and " + timerNM[1] + " nanoseconds");
				console.log("The first value of x inside that makes |f(x)| < " + control + 
					" with starting point " + start + " is " + resultNM.toPrecision(15));
			}
		}
		if((!isNaN(left) && !isNaN(right)) || !isNaN(start)) {
			console.log("-----------------------------------------------------------------------------------------------");
			console.log("");
		}
	}
	catch(prob) {
		console.log("There was a problem parsing either the function, starting point, or error you provided!");	
	}
});