/**
  * PHYS 2211 Grade Calculator Script
  *
  * Author: Jeremy Schonfeld (http://jmschonfeld.me)
  * 
  */



  /* Mobile Device Detection */
  (function(a,b){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)))alert("This is best used on a desktop or tablet, and may not work properly on a mobile device")})(navigator.userAgent||navigator.vendor||window.opera,'http://detectmobilebrowser.com/mobile');

$("#data-results").hide();

var isResetBack = false;
var bucketWeights = {
	'clickers-check': 3.0,
	'homework-check': 5.0,
	'optional-check': 3.0,
	'wiki-check': 2.0,
	'reading-check': 1.0,
	'lectures-check': 1.0
};

$("input[type=text]").on("keypress", function(event) {
	var charCode = (event.which) ? event.which : event.keyCode;
	if (charCode == 46 && $(this).val().indexOf(".") >= 0) {
		return false;
	}
	if (charCode != 46 && charCode > 31 && (charCode < 48 || charCode > 57))
	 	return false;
	return true;
});

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
		if (($(this).attr("name").startsWith("lab") && !$(this).val().trim().length) && go) {
			console.log("invalid lab field (blank)");
			alert("You must fill out all three lab grade fields");
			go = false;
		}
		if ($(this)[0].hasAttribute("aria-label") && go) {
			var checkbox = $("#" + $(this).attr("name") + "-check");
			if (checkbox.is(":checked") && !$(this).val().trim().length) {
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
			if (!$(this).val().length && $(this)[0].hasAttribute("aria-label")) {
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
			alert("Invalid test score; please fill in ALL scores that you have so far and leave future tests blank");
			isResetBack = true;
			resetForm();
			return false;
		}
		var predictions = predict(values);
		displayPredictions(predictions, false);

	} else {
		var predFinal = !values['final'].length;

		var grades = calcResults(values, predFinal);
		displayResults(grades, predFinal);

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
		if (!isResetBack) {
			$(this).val('');
			$(this).prop("checked", false);
		}
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
	return !values['test1'].length || !values['test2'].length || !values['test3'].length || !values['test4'].length;
}

function isValidPrediction(values) {
	var check = ['test1', 'test2', 'test3', 'test4', 'final'];
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
	ret = Math.max(0, ret);
	return ret;
}

function finalNeeded(goal, values, calc) {
	var a =  (goal * 100.0 - calc['extraCredit'] * 2.0 - calc['bucket'] * 10.0) / 90.0 * 0.9 * 100.0  - parseFloat(values['labA']) * 5.0 - parseFloat(values['labB']) * 10.0 - parseFloat(values['labC']) * 5.0;
	var b = (a - calc['testAvg'] * 45.0) / 25.0;
	b = Math.max(0, b);
	return b;
}

function calcResults(values, predFinal) {
	console.log("Calculating results with values " + JSON.stringify(values));
	var bucketPossible = (parseFloat(values['clickers']) * 3.0 * values['clickers-check'] + parseFloat(values['homework']) * 5.0 * values['homework-check'] +
								parseFloat(values['optional']) * 3.0  * values['optional-check'] + parseFloat(values['wiki']) * 2.0 * values['wiki-check'] +
								parseFloat(values['reading']) * values['reading-check'] + parseFloat(values['lectures']) * values['lectures-check']) / values['totCheck'];
	var extraCredit = Math.max(0, Math.min(5, bucketPossible * values['totCheck'] / 100.0 - parseFloat(values['homework']) * 5.0 / 100) + parseFloat(values['homework']) * 5.0 / 100.0 - 10.0) / 2.0 * 100.0;
	var bucket = Math.min(10, (bucketPossible * values['totCheck']) / 100.0) / 0.1;
	var testAvg = calcTestAverage(values['test1'], values['test2'], values['test3'], values['test4']);
	if (!predFinal) {
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
	} else {
		var calc = {
			'bucketPossible': bucketPossible,
			'extraCredit': extraCredit,
			'bucket': bucket,
			'testAvg': testAvg,
		};
		var needed = [
			finalNeeded(90.0, values, calc),
			finalNeeded(80.0, values, calc),
			finalNeeded(70.0, values, calc),
			finalNeeded(60.0, values, calc)
		];
		calc['needed'] = needed;
		console.log("CALCULATION AND FINAL PREDICTION RESULTS: " + JSON.stringify(calc));
		return calc;
	}
}

function rnd(num) {
	return Math.round(num * 100.0) / 100.0;
}

function displayResults(grades, predFinal) {
	if (predFinal) {
		displayPredictions(grades, true);
		return;
	}
	var html = "<strong>Bucket Possible:</strong> " + rnd(grades['bucketPossible']);
	html += "<br><strong>Extra Credit:</strong> " + rnd(grades['extraCredit']);
	html += "<br><strong>Bucket Percentage:</strong> " + rnd(grades['bucket']);
	html += "<br><strong>Test Average:</strong> " + rnd(grades['testAvg']);
	html += "<br><strong>Core:</strong> " + rnd(grades['core']);
	html += "<br><h3>Final Grade:</h3> " + rnd(grades['overall']) + " (" + grades['letterGrade'] + ")";
	$("#res-display").html(html);
}

function displayPredictions(predict, predFinal) {
	var html = "<strong>Current Bucket Possible:</strong> " + rnd(predict['bucketPossible']);
	html += "<br><strong>Current Extra Credit:</strong> " + rnd(predict['extraCredit']);
	html += "<br><strong>Current Bucket Percentage:</strong> " + rnd(predict['bucket']);
	html += "<br><strong>Current Test Average" + (predFinal ? "" : " (without weights)") + ":</strong> " + (predFinal ? rnd(predict['testAvg']) : rnd(predict.curAvg.sum / predict.curAvg.tot));
	html += "<br><br><h3>" + (predFinal ? "Final Exam" : "Test Average") + " Goals:</h3><small>";
	var term = predFinal ? " on final exam" : " average on remaining tests";
	if (!predFinal) {
		html += "These are the total averages of the <i>remaining</i> tests that you need to reach in order to achieve each grade level for the class assuming a 90% on the final";
	} else {
		html += "These are the scores you must reach on your final exam in order to reach each grade level for your semester average";
	}
	html += "</small><br><br><strong>90% (A):</strong> " + rnd(predict['needed'][0]) + "%" + term;
	html += "<br><strong>80% (B):</strong> " + rnd(predict['needed'][1]) + "%" + term;
	html += "<br><strong>70% (C):</strong> " + rnd(predict['needed'][2]) + "%" + term;
	html += "<br><strong>60% (D):</strong> " + rnd(predict['needed'][3]) + "%" + term;
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
		if (tests[i].length) {
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
