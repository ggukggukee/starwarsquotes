
$('#formInput').change(function() {
    $('#formDiv').toggle();
    $('#textBottom').toggle();
});
$('.quizresult').click(function(){
    $(this).addClass('btn-primary');
    $(this).removeClass('btn-outline-secondary');
    window.location.reload();
});

$('.notquizresult').click(function(){
    $(this).addClass('btn-danger');
    $(this).removeClass('btn-outline-secondary');
});

$(function () {
    $('.quizresult').popover({container: 'body'});
});
