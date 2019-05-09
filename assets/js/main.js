
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

$(window).on('resize', () => {
    const win = $(this);
    if (win.width() >= 576) {
        $('.nav').removeClass('justify-content-center');
        $('.pagination').removeClass('pagination-sm');
        $('.all-episode').removeClass('d-none');
        $('.all-episode').addClass('d-block');
    }
    if (win.width() <= 576) {
        $('.nav').addClass('justify-content-center');
        $('.pagination').addClass('pagination-sm');
        $('.all-episode').addClass('d-none');
        $('.all-episode').removeClass('d-block');
    }
});

$(document).ready(() => {
    if ($(window).width() >= 576) {
        $('.nav').removeClass('justify-content-center');
        $('.pagination').removeClass('pagination-sm');
        $('.all-episode').removeClass('d-none');
        $('.all-episode').addClass('d-block');
    } 
    if ($(window).width() <= 576) {
        $('.nav').addClass('justify-content-center');
        $('.pagination').addClass('pagination-sm');
        $('.all-episode').addClass('d-none');
        $('.all-episode').removeClass('d-block');
    }
});