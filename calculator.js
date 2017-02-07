/** PHYS 2211 Grade Calculator Script **/

$("#data-results").hide();

var isResetBack = false;
var bucketWeights = {
	'clickers-check': 3.0,
	'homework-check': 5.0,
	'optional-check': 3.0,
	'wiki-check': 2.0,
	'reading-check': 1.0,
	'lectures-check': 1.0
}

$("input[type=text][aria-label]").on('input propertychange paste', function(event) {
	if ($(this).val() != '') {
		$("#" + $(this).attr("name") + "-check").prop("checked", true);
	} else {
		$("#" + $(this).attr("name") + "-check").prop("checked", false);
	}
});

var submitForm = function(e) {
	e.preventDefault();
	var values = {};
	var go = true;
	var totCheck = 0.0;
	$("input").each(function() {
		if (($(this).attr("name").startsWith("lab") && !$(this).val().trim()) && go) {
			console.log("invalid lab field (blank)");
			alert("You must fill out all three lab grade fields");
			go = false;
		}
		if ($(this)[0].hasAttribute("aria-label") && go) {
			var checkbox = $("#" + $(this).attr("name") + "-check");
			if (checkbox.is(":checked") && !$(this).val().trim()) {
				console.log("invalid bucket field (blank)");
				alert("You must input a percentage for all selected bucket categories");
				go = false;
			}
		}
		if ($(this).attr("name").endsWith("-check")) {
			var ckd = $(this).is(":checked") ? 1.0 : 0.0;
			totCheck += bucketWeights[$(this).attr("name")] * ckd;
			values[$(this).attr("name")] = ckd;
		} else {
			if (!$(this).val() && $(this)[0].hasAttribute("aria-label")) {
				values[$(this).attr("name")] = 0.0;
			} else {
				values[$(this).attr("name")] = $(this).val();
			}
		}
		$(this).attr("disabled", "true");
	});
	if (!go) {
		isResetBack = true;
		resetForm();
		return false;
	}
	values['totCheck'] = totCheck;
	$(".reset").addClass("disabled");
	isResetBack = true;

	if (isPrediction(values)) {

		if (!isValidPrediction(values)) {
			console.log("invalid prediction (blank fields)");
			alert("In valid test score, please fill in ALL scores that you have so far and leave future tests blank");
			isResetBack = true;
			resetForm();
			return false;
		}
		var predictions = predict(values);
		displayPredictions(predictions);

	} else {

		var grades = calcResults(values);
		displayResults(grades);

	}

	$("#data-entry").fadeOut(1000, function() {
		$("#data-results").fadeIn(1000, function() {
			$(".reset").html("Calculate New Grades");
			$(".reset").removeClass("disabled");
		});

	});
	e.preventDefault();
	return false;
}

var resetForm = function() {
	console.log("Resetting form...");
	$("input").each(function() {
		if (!isResetBack)
			$(this).val('');
		$(this).removeAttr('disabled');
	});
	$(".reset").addClass("disabled");
	$("#data-results").fadeOut(1000, function() {
		$("#data-entry").fadeIn(1000, function() {
			$(".reset").html("Reset Form");
			$(".reset").removeClass("disabled");
			isResetBack = false;
		});

	});
}

$(".reset").click(resetForm);
$("#gradeform").submit(submitForm);

function isPrediction(values) {
	return !values['testA'] || !values['testB'] || !values['testC'] || !values['testD'] || !values['final'];
}

function isValidPrediction(values) {
	var check = ['testA', 'testB', 'testC', 'testD', 'final'];
	var foundBlank = false;
	for (i = 0; i < check.length; i++) {
		if (foundBlank) {
			if (check[i]) {
				return false;
			}
		} else {
			if (!check[i]) {
				foundBlank = true;
			}
		}
	}
	return true;
}

function predict(values) {
	console.log("Predicting grades with values " + JSON.stringify(values));

	// -- unchanged --
	var bucketPossible = (parseFloat(values['clickers']) * 3.0 * values['clickers-check'] + parseFloat(values['homework']) * 5.0 * values['homework-check'] +
									parseFloat(values['optional']) * 3.0  * values['optional-check'] + parseFloat(values['wiki']) * 2.0 * values['wiki-check'] +
									parseFloat(values['reading']) * values['reading-check'] + parseFloat(values['lectures']) * values['lectures-check']) / values['totCheck'];
	var extraCredit = Math.max(0, Math.min(5, bucketPossible * values['totCheck'] / 100.0 - parseFloat(values['homework']) * 5.0 / 100) + parseFloat(values['homework']) * 5.0 / 100.0 - 10.0) / 2.0 * 100.0;
	var bucket = Math.min(10, (bucketPossible * values['totCheck']) / 100.0) / 0.1;
	// -- unchanged --

	var curTestAvg = predTestAvg(values['test1'], values['test2'], values['test3'], values['test4']);

	var needed = [
		testAvgNeeded(90.0, values, extraCredit, bucket, curTestAvg),
		testAvgNeeded(80.0, values, extraCredit, bucket, curTestAvg),
		testAvgNeeded(70.0, values, extraCredit, bucket, curTestAvg),
		testAvgNeeded(60.0, values, extraCredit, bucket, curTestAvg)
	];

	var obj = {
		"bucketPossible": bucketPossible,
		"extraCredit": extraCredit,
		"bucket": bucket,
		"curAvg": curTestAvg,
		"needed": needed
	};
	console.log("RESULTS: " + JSON.stringify(obj));
	return obj;

}

function testAvgNeeded(goal, values, extraCredit, bucket, curAvg) {
	console.log("Getting average needed for goal " + goal);
	var a =  (goal * 100.0 - extraCredit * 2.0 - bucket * 10.0) / 90.0 * 0.9 * 100.0  - parseFloat(values['labA']) * 5.0 - parseFloat(values['labB']) * 10.0 - parseFloat(values['labC']) * 5.0;
	//assuming a 90 on the final:
	var b = (a - 90.0 * 25.0) / 45.0;
	var ret = (b * 4.0 - curAvg.sum) / (4.0 - curAvg.tot);
	return ret;
}

function calcResults(values) {
	console.log("Calculating results with values " + JSON.stringify(values));
	var bucketPossible = (parseFloat(values['clickers']) * 3.0 * values['clickers-check'] + parseFloat(values['homework']) * 5.0 * values['homework-check'] +
								parseFloat(values['optional']) * 3.0  * values['optional-check'] + parseFloat(values['wiki']) * 2.0 * values['wiki-check'] +
								parseFloat(values['reading']) * values['reading-check'] + parseFloat(values['lectures']) * values['lectures-check']) / values['totCheck'];
	var extraCredit = Math.max(0, Math.min(5, bucketPossible * values['totCheck'] / 100.0 - parseFloat(values['homework']) * 5.0 / 100) + parseFloat(values['homework']) * 5.0 / 100.0 - 10.0) / 2.0 * 100.0;
	var bucket = Math.min(10, (bucketPossible * values['totCheck']) / 100.0) / 0.1;
	var testAvg = calcTestAverage(values['test1'], values['test2'], values['test3'], values['test4']);
	var core = ((testAvg * 45.0 + parseFloat(values['labA']) * 5.0 + parseFloat(values['labB']) * 10.0 + parseFloat(values['labC']) * 5.0 + parseFloat(values['final']) * 25.0) / 100.0) / 0.9;
	var overall = (extraCredit * 2.0 + bucket * 10.0 + core * 90.0) / 100.0;
	var letter = 'F';
	if (overall >= 60) { letter = 'D'; }
	if (overall >= 70) { letter = 'C'; }
	if (overall >= 80) { letter = 'B'; }
	if (overall >= 90) { letter = 'A'; }
	var resObj = {
		'bucketPossible': bucketPossible,
		'extraCredit': extraCredit,
		'bucket': bucket,
		'testAvg': testAvg,
		'core': core,
		'overall': overall,
		'letterGrade': letter
	};
	console.log("CALCULATION RESULTS: " + JSON.stringify(resObj));
	return resObj;
}

function rnd(num) {
	return Math.round(num * 100.0) / 100.0;
}

function displayResults(grades) {
	var html = "<strong>Bucket Possible:</strong> " + rnd(grades['bucketPossible']);
	html += "<br><strong>Extra Credit:</strong> " + rnd(grades['extraCredit']);
	html += "<br><strong>Bucket Points:</strong> " + rnd(grades['bucket']);
	html += "<br><strong>Test Average:</strong> " + rnd(grades['testAvg']);
	html += "<br><strong>Core:</strong> " + rnd(grades['core']);
	html += "<br><h3>Final Grade:</h3> " + rnd(grades['overall']) + " (" + grades['letterGrade'] + ")";
	$("#res-display").html(html);
}

function displayPredictions(predict) {
	var html = "<strong>Current Bucket Possible:</strong> " + rnd(predict['bucketPossible']);
	html += "<br><strong>Current Extra Credit:</strong> " + rnd(predict['extraCredit']);
	html += "<br><strong>Current Bucket Points:</strong> " + rnd(predict['bucket']);
	html += "<br><strong>Current Test Average (without weights):</strong> " + rnd(predict.curAvg.sum / predict.curAvg.tot);
	html += "<br><br><h3>Test Average Goals:</h3><br><small>These are the total averages of the <i>remaining</i> tests that you need to reach in order to achieve each grade level for the class assuming a 90% on the final</small><br>";
	html += "<br><strong>90% (A):</strong> " + rnd(predict['needed'][0]) + "%";
	html += "<br><strong>80% (B):</strong> " + rnd(predict['needed'][1]) + "%";
	html += "<br><strong>70% (C):</strong> " + rnd(predict['needed'][2]) + "%";
	html += "<br><strong>60% (D):</strong> " + rnd(predict['needed'][3]) + "%";
	$("#res-display").html(html);
}


function sortNumber(a, b) {
	return a - b;
}

function predTestAvg(testA, testB, testC, testD) {
	var sum = 0.0;
	var tot = 0.0;
	var tests = [testA, testB, testC, testD];
	console.log("predicting tests " + JSON.stringify(tests));
	for (i = 0; i < 4; i++) {
		if (tests[i]) {
			sum += parseFloat(tests[i]);
			tot++;
		}
	}
	return {"sum": sum, "tot": tot};
}

function calcTestAverage(testA, testB, testC, testD) {
	var tests = [parseFloat(testA), parseFloat(testB), parseFloat(testC), parseFloat(testD)];
	tests.sort(sortNumber);
	return (tests[0]*0.06 + tests[1]*0.09 + tests[2]*0.12 + tests[3]*0.18) / 0.45;
}
