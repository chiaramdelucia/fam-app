$(document).ready(function() {


	$("#user-add-zip").click(function() {
        console.log("hello")
	    $('html,body').animate({
	        scrollTop: $("#content").offset().top},
	        'slow');    

            getWeather();


	});



    function getWeather() {
        var address = $("#address").val();
        console.log("weather " + address)
        $.ajax({

            url: 'https://api.wunderground.com/api/7d4c2ccc48b6acd9/conditions/q/' + address + '.json',
            method: 'GET',
            datatype: "json"
        }).done(function(wonder) {
            console.log(wonder);
            console.log(wonder.current_observation.icon);
            var icon_url = wonder.current_observation.icon_url;
            var icon = wonder.current_observation.icon;
            var degrees = Math.floor(wonder.current_observation.temp_f);
            var city = wonder.current_observation.display_location.city;
            $(".weather-widget").html('<span><img src="' + icon_url + '"></span><span>' + degrees + '°F</span><br><span>' + city + '<span>');

        });

    };

    var win = $(window),
            nav = $('nav'),

            pos = nav.offset().top,
            sticky = function() {
                win.scrollTop() > pos ?
                    nav.addClass('sticky')
                    : nav.removeClass('sticky')
            }

    win.scroll(sticky)

   
});