$(document).ready(function(){
    $("#relInitialAge").change(function(){
        var selectedInitialAge = $(this).children("option:selected").val()
        var selectedInitialAgeNumber = Number(selectedInitialAge);
        var ageGrArr = [];
    for (var i=selectedInitialAgeNumber+1; i<=75; i++) {
        ageGrArr.push(i);
    }
    var mySelect = $('#relFinalAge');
    $.each(ageGrArr, function(val, text) {
    mySelect.append(
        $('<option></option>').val(val+selectedInitialAgeNumber+1).html(text)
    );
    });
    });
});