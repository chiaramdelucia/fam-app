$(document).ready(function() {    

    var cityState;
    
     // $("#content").hide();
    
    //store the zip
    $('#user-add-zip').on('click', function(){
        event.preventDefault();

        $('html,body').animate({
        scrollTop: $("#content").offset().top
        },'slow'); 

        $("#land").fadeOut('slow');
        $("#content").show('slow');

        cityState = $('#user-input-zip').val();   //set as global variable  
        console.log("famapp.js, #user-add-zip.onclick=" , cityState);
        
        localStorage.setItem("cityState", cityState);

        // populate googlemaps API with zipcode
        $('#google-input-zip').val(cityState);

        if(!jQuery.isEmptyObject(cityState)){
            getWeather();
            getAddress();
        }else{
            console.log("famapp.js, #user-add-zip.onclick=-cityStateZip is missing");
        }

    });  
    

    $("#google-add-zip").on("click", function(){
        event.preventDefault();
        
        cityState = $("#google-input-zip").val();
        console.log("famapp.js, #google-add-zip.onclick=" , cityState);

        localStorage.setItem("cityState", cityState);

        $("#resultsAPI").empty();

        getWeather();
        getAddress();   
    });


    function getWeather() {
        // var address = $("#user-input-zip").val();
        var address = localStorage.getItem("cityState");
        console.log("getWeather() " + address);
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

        // var address = $("#user-input-zip").val();
        var address = localStorage.getItem("cityState");
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
                    map: map,
                    icon: {
                    url: '../assets/css/images/logo2.png',
                    anchor: new google.maps.Point(10, 10),
                    scaledSize: new google.maps.Size(40, 50)
                },
                });//var marker
            };//initMap

            initMap();
        });//ajax

    }//get Address

    //Sticky Nav Bar
    // var win = $(window),
    //     nav = $('nav'),

    //     pos = nav.offset().top,
    //     sticky = function() {
    //         win.scrollTop() > pos ?
    //         nav.addClass('sticky')
    //         : nav.removeClass('sticky')
    //     }

    //     win.scroll(sticky)

    //Scroll in results-div, but not on window when mouse is in results-div
    $('#resultsAPI').on( 'mousewheel DOMMouseScroll', function (e) { 

            var e0 = e.originalEvent;
            var delta = e0.wheelDelta || -e0.detail;

            this.scrollTop += ( delta < 0 ? 1 : -1 ) * 30;
            e.preventDefault();  
        });

    window.onbeforeunload = function () {
        window.scrollTo(0, 0);
    }

      //original code to revert back to
    // $( "#user-add-zip" ).click(function() {
    //     localStorage.setItem('loaded', true);

    //     $("#land").fadeOut('slow');
    //     $("#content").show('slow');
    // });
   
    //commented out code
 //    scroll effect and functions for user's inital zip code input
    // $("#user-add-zip").click(function() {
 //        event.preventDefault();
 //        console.log("hello");
    //     $('html,body').animate({
    //         scrollTop: $("#content").offset().top},
    //         'slow');   
 //            getWeather();
 //            getAddress();
    // });

    // var cityState;

    //review this - original code to revert back to 
    // $(window).on('load', function(){
    //     event.preventDefault();
    //     console.log('loaded?' , localStorage.getItem('loaded'));
    //     cityState = localStorage.getItem('cityState');

    //     if(localStorage.getItem('loaded')){
    //         $("#land").hide('slow');
    //         $("#content").show('slow');
    //     }
        
    //     $('#user-input-zip').val(cityState);
    //     $('#google-input-zip').val(cityState);

    //     if(!jQuery.isEmptyObject(cityState)){
    //         getWeather();
    //         getAddress();
    //     }else{
    //         console.log("Window onload()-cityStateZip is missing");
    //     }
    // });

   
});