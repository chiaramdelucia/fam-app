$(".btn1").click(function() {
    $('html,body').animate({
        scrollTop: $("#content").offset().top},
        'slow');
});

$(".scrollTop").click(function() {
    $('html,body').animate({
        scrollTop: $("#land").offset().top},
        'slow');
});