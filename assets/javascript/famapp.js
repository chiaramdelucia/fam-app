$(document).ready(function() {

    var userZip;

    //scroll effect and functions for user's inital zip code input
	$("#user-add-zip").click(function() {
        console.log("hello");
	    $('html,body').animate({
	        scrollTop: $("#content").offset().top},
	        'slow');    
            getWeather();
            getAddress();
	});

    //review this
    $(window).on('load', function(){
        userZip = localStorage.getItem('userZip');
        $('#user-input-zip').val(userZip);
        $('#google-input-zip').val(userZip);
    });

    //store the zip
    $('#user-add-zip').on('click', function(){
        userZip = $('#user-input-zip').val();   //set as global variable  
        console.log("famapp.js, User input Zip =" , userZip);
        localStorage.setItem("userZip", userZip);

        // populate googlemaps API with zipcode
        $('#google-input-zip').val(userZip);

    });  

    function getWeather() {
        var address = $("#user-input-zip").val();
        console.log("weather " + address);
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

    function getAddress(){

        var address = $("#user-input-zip").val();
        console.log("maps "+ address);
        
        $.ajax({
            url: 'https://maps.googleapis.com/maps/api/geocode/json?address='+ address +'&key=AIzaSyBtUUj6f_bVbHbWpCow6r5pktW8QVcwXp8',
            method: "GET"
        }).done(function(response){
            console.log(response);
            console.log(response.results[0].formatted_address)

            var latitude = response.results[0].geometry.location.lat
            var longitude = response.results[0].geometry.location.lng
            var formatted_address = response.results[0].formatted_address
            
            $('#google-input-zip').val(formatted_address);

            function initMap() {
                var map = new google.maps.Map(document.getElementById('map'), {
                    center: {lat: latitude, lng: longitude},
                    zoom: 15,
                    mapTypeId: 'roadmap',
                });//var map
                
                var marker = new google.maps.Marker({
                    position: {lat: latitude, lng: longitude},
                    map: map
                });//var marker
            };//initMap

            initMap();
        });//ajax

    }//get Address

    //Sticky Nav Bar
    var win = $(window),
        nav = $('nav'),

        pos = nav.offset().top,
        sticky = function() {
            win.scrollTop() > pos ?
            nav.addClass('sticky')
            : nav.removeClass('sticky')
        }

        win.scroll(sticky)

    //Scroll in results-div, but not on window when mouse is in results-div
    $('#resultsAPI').on( 'mousewheel DOMMouseScroll', function (e) { 

            var e0 = e.originalEvent;
            var delta = e0.wheelDelta || -e0.detail;

            this.scrollTop += ( delta < 0 ? 1 : -1 ) * 30;
            e.preventDefault();  
        });
   
});