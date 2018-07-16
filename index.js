// Declare the necessary variables
var math = require("mathjs"),
	fs = require("fs");

// Performs a single iteration of Halley's Method and returns the next candidate.
var halley = (f, g, h, current) => current - ((2 * f(current) * g(current)) / ((2 * Math.pow(g(current), 2)) - (f(current) * h(current))));

// Performs a single iteration of the Secant Method and returns the next candidate.
var secant = (f, current, previous) => current - (f(current) * ((current - previous) / (f(current) - f(previous))));

// Performs a single iteration of Newton's Method and returns the next candidate.
var newton = (f, g, current) => current - (f(current) / g(current));

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

// Iterates through the desired method until an acceptable value is found or breaks after one million steps.
var main = (f, g, h, error, timer, method, obj) => {
	if(method == "BM") {
		if(f(obj[0]) == 0) { return obj[0]; }
		if(f(obj[1]) == 0) { return obj[1]; }
		var count = 0;
		while(!(f(obj[0]) == 0 || f(obj[1]) == 0 || Math.abs(f(obj[2])) <= error)) {
			if(f(obj[2]) == Infinity) { 
				console.log("It seems after " + count + " steps there was a blowup!");
				obj = "UNDEFINED";
				break;
			}
			if(count == 10000) { console.log("After ten thousand steps " +
				"there is still no value of x that satisfies the condition with the given error.") }
			else if(count == 1000000) { 
				timer = process.hrtime(timer).toString().split(",");
				console.log("Bisection Method: " + timer[0] + " seconds and " + timer[1] + " nanoseconds");
				console.log("After one million steps there is still no value of x that satisfies " + 
					"the condition and this is enough to convince us that there might not be such a value " + 
					"or the interval was just not tight enough!");
				obj[2] = "UNDEFINED";
				break;
			}
			obj = bisect(f, obj);
			count++;
		}
		return obj[2];
	}
	else if(method == "NM") {
		if(f(obj) == 0) { return obj; }
		var count = 0;
		while(Math.abs(f(obj)) > error) {
			if(f(obj) == Infinity) { 
				console.log("It seems after " + count + " steps there was a blowup!");
				obj = "UNDEFINED";
				break;
			}
			if(count == 10000) { console.log("After ten thousand steps " +
				"there is still no value of x that satisfies the condition with the given error.") }
			else if(count == 1000000) { 
				timer = process.hrtime(timer).toString().split(",");
				console.log("Newton's Method: " + timer[0] + " seconds and " + timer[1] + " nanoseconds");
				console.log("After one million steps there is still no value of x that satisfies " + 
					"the condition and this is enough to convince us that there might not be such a value " + 
					"or the starting point was a bad choice!");
				obj = "UNDEFINED";
				break;
			}
			obj = newton(f, g, obj);
			count++;
		}
		return obj;
	}
	else if(method == "SM") {
		if(f(obj[0]) == 0) { return obj[0]; }
		if(f(obj[1]) == 0) { return obj[1]; }
		var count = 0,
			holder = 0;
		while(Math.abs(f(obj[1])) > error) {
			if(f(obj[1]) == Infinity) { 
				console.log("It seems after " + count + " steps there was a blowup!");
				obj = "UNDEFINED";
				break;
			}
			if(count == 10000) { console.log("After ten thousand steps " +
				"there is still no value of x that satisfies the condition with the given error.") }
			else if(count == 1000000) { 
				timer = process.hrtime(timer).toString().split(",");
				console.log("Secant Method: " + timer[0] + " seconds and " + timer[1] + " nanoseconds");
				console.log("After one million steps there is still no value of x that satisfies " + 
					"the condition and this is enough to convince us that there might not be such a value " + 
					"or the starting points were a bad choice!");
				obj[2] = "UNDEFINED";
				break;
			}
			holder = obj[1];
			obj[1] = secant(f, obj[1], obj[0]);
			obj[0] = holder;
			count++;
		}
		return obj[1];
	}
	else if(method == "HM") {
		if(f(obj) == 0) { return obj; }
		var count = 0;
		while(Math.abs(f(obj)) > error) {
			if(f(obj) == Infinity) { 
				console.log("It seems after " + count + " steps there was a blowup!");
				obj = "UNDEFINED";
				break;
			}
			if(count == 10000) { console.log("After ten thousand steps " +
				"there is still no value of x that satisfies the condition with the given error.") }
			else if(count == 1000000) { 
				timer = process.hrtime(timer).toString().split(",");
				console.log("Halley's Method: " + timer[0] + " seconds and " + timer[1] + " nanoseconds");
				console.log("After one million steps there is still no value of x that satisfies " + 
					"the condition and this is enough to convince us that there might not be such a value " + 
					"or the starting point was a bad choice!");
				obj = "UNDEFINED";
				break;
			}
			obj = halley(f, g, h, obj);
			count++;
		}
		return obj;
	}
};

// Read and parse the input. Call the main function and output the result if there is one. 
fs.readFile("input.txt", "utf8", (err, data) => {
	if(err) { throw err; }
	var rows = data.split("\n").map(elem => elem.split("\r")[0]),
		left = undefined,
		right = undefined,
		secant0 = undefined,
		secant1 = undefined,
		start = undefined,
		control = parseFloat(rows[9]),
		parser = new math.parser();
	try {
		parser.eval(rows[1]);
		var attempt1 = math.derivative(rows[1].split("=")[1], rows[1].split("f(")[1][0]).toString();
		parser.eval("g(x) = " + attempt1);
		var attempt2 = math.derivative(attempt1, rows[1].split("f(")[1][0]).toString();
		parser.eval("h(x) = " + attempt2);
		var func = parser.get("f"),
			der = parser.get("g"),
			secder = parser.get("h");
		if(rows[3].length != 0) {
			try {
				left = parseFloat(rows[3].split(",")[0].split("[")[1]);
				right = parseFloat(rows[3].split(",")[1].split("]")[0]);
			}
			catch(problem) {
				console.log("There was a problem parsing the interval you provided on line 4!");
			}
			if(!isNaN(left) && !isNaN(right)) {
				console.log("");
				console.log("------------------------------------------------------------------------------------------------------");
				var	timerBM = process.hrtime(),
					resultBM = main(func, der, secder, control, timerBM, "BM", [left, right, 0]);
				if(resultBM != "UNDEFINED") {
					timerBM = process.hrtime(timerBM).toString().split(",");
					console.log("Bisection Method: " + timerBM[0] + " seconds and " + timerBM[1] + " nanoseconds");
					console.log("The first value of x inside " + rows[3].replace(/ /g,'') + 
						" that makes |f(x)| < " + control + " is " + resultBM.toPrecision(15));
				}
			}
			else {
				console.log("");
				console.log("------------------------------------------------------------------------------------------------------");
				console.log("Bisection Method:");
				console.log("There was a problem parsing the interval you provided on line 4!");
			}
		}
		if(rows[5].length != 0) {
			try {
				start = parseFloat(rows[5]);
			}
			catch(problem) {
				console.log("There was a problem parsing the starting point you provided on line 6!");
			}
			if(!isNaN(start)) {
				if(isNaN(left) || isNaN(right)) { console.log(""); }
				console.log("------------------------------------------------------------------------------------------------------");
				var timerNM = process.hrtime(),
					resultNM = main(func, der, secder, control, timerNM, "NM", start);
				if(resultNM != "UNDEFINED") {
					timerNM = process.hrtime(timerNM).toString().split(",");
					console.log("Newton's Method: " + timerNM[0] + " seconds and " + timerNM[1] + " nanoseconds");
					console.log("The first value of x inside that makes |f(x)| < " + control + 
						" with starting point " + start + " is " + resultNM.toPrecision(15));
				}
			}
			else {
				if(isNaN(left) || isNaN(right)) { console.log(""); }
				console.log("------------------------------------------------------------------------------------------------------");
				console.log("Newton's Method:");
				console.log("There was a problem parsing the starting point you provided on line 6!");
			}
		}
		if(rows[5].length != 0) {
			try {
				start = parseFloat(rows[5]);
			}
			catch(problem) {
				console.log("There was a problem parsing the starting point you provided on line 6!");
			}
			if(!isNaN(start)) {
				if((isNaN(left) || isNaN(right)) && isNaN(start)) { console.log(""); }
				console.log("------------------------------------------------------------------------------------------------------");
				var timerHM = process.hrtime(),
					resultHM = main(func, der, secder, control, timerHM, "HM", start);
				if(resultNM != "UNDEFINED") {
					timerHM = process.hrtime(timerHM).toString().split(",");
					console.log("Halley's Method: " + timerHM[0] + " seconds and " + timerHM[1] + " nanoseconds");
					console.log("The first value of x inside that makes |f(x)| < " + control + 
						" with starting point " + start + " is " + resultHM.toPrecision(15));
				}
			}
			else {
				if((isNaN(left) || isNaN(right)) && isNaN(start)) { console.log(""); }
				console.log("------------------------------------------------------------------------------------------------------");
				console.log("Halley's Method:");
				console.log("There was a problem parsing the starting point you provided on line 6!");
			}
		}
		if(rows[7].length != 0) {
			try {
				secant0 = parseFloat(rows[7].split(",")[0].split("[")[1]);
				secant1 = parseFloat(rows[7].split(",")[1].split("]")[0]);
			}
			catch(problem) {
				console.log("There was a problem parsing the starting points you provided on line 8!");
			}
			if(!isNaN(secant0) && !isNaN(secant1)) {
				if((isNaN(left) || isNaN(right)) && isNaN(start)) { console.log(""); }
				console.log("------------------------------------------------------------------------------------------------------");
				var	timerSM = process.hrtime(),
					resultSM = main(func, der, secder, control, timerSM, "SM", [secant0, secant1]);
				if(resultSM != "UNDEFINED") {
					timerSM = process.hrtime(timerSM).toString().split(",");
					console.log("Secant Method: " + timerSM[0] + " seconds and " + timerSM[1] + " nanoseconds");
					console.log("The first value of x inside that makes |f(x)| < " + control + 
					" with starting points " + secant0 + " and " + secant1 + " is " + resultSM.toPrecision(15));
				}
			}
			else {
				if((isNaN(left) || isNaN(right)) && isNaN(start)) { console.log(""); }
				console.log("------------------------------------------------------------------------------------------------------");
				console.log("Secant Method:");
				console.log("There was a problem parsing the starting points you provided on line 8!");
			}
		}
		if((!isNaN(left) && !isNaN(right)) || !isNaN(start) || (!isNaN(secant0) && !isNaN(secant1)) || 
			rows[3].length > 0 || rows[5].length > 0 || rows[7].length > 0) {
			console.log("------------------------------------------------------------------------------------------------------");
			console.log("");
		}
	}
	catch(prob) {
		console.log("There was a problem parsing either the function, starting point, or error you provided!");	
	}
});