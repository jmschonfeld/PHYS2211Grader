/** PHYS 2211 Grade Calculator Script **/

$("#data-results").hide();

$(".submit").click(submitForm());
$(".reset").click(resetForm());


function submitForm() {
	var values = {};
	$("input").each(function() {
		values[$(this).attr("name")] = $(this).val();
		$(this).attr("disabled", "true");
	});


	$("#data-results").show();
	$("#data-entry").hide();
	$(".submit").hide();

}

function resetForm() {
	$("input").each(function() {
		$(this).val('');
		$(this).attr("disabled", "false");
	});
	$("#data-results").hide();
	$("#data-entry").show();
	$(".submit").show();
}