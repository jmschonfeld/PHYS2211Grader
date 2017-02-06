/** PHYS 2211 Grade Calculator Script **/

$("#data-results").hide();

$(".reset").click(resetForm;
$("#gradeform").submit(submitForm) {

}


var submitForm = function() {
	var values = {};
	$("input").each(function() {
		values[$(this).attr("name")] = $(this).val();
		$(this).attr("disabled", "true");
	});


	$("#data-results").show();
	$("#data-entry").hide();
	$(".submit").hide();
	return false;
}

var resetForm = function() {
	$("input").each(function() {
		$(this).val('');
		$(this).attr("disabled", "false");
	});
	$("#data-results").hide();
	$("#data-entry").show();
	$(".submit").show();
}