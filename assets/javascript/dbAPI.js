$(document).on('ready', function(){

  var userZip;
  var bookmarkIcon = '<span class="bookmark" style="float: right"><a href="#"><i class="fa fa-bookmark-o fa-lg" aria-hidden="true" style="color:blue"></i></a></span>';

  $('#user-add-zip').on('click', function(){
    userZip = $('#user-input-zip').val();   //set as global variable  
    console.log("dbAPI.js, User input Zip =" , userZip);
    localStorage.setItem("userZip", userZip);

    // populate googlemaps API with zipcode
    $('#google-input-zip').val(userZip);

    //display map
    getGoogleCoordinates();
    getWeather();

  });  

  //if value is changed
  $('#google-add-zip').on('click', function(){

    //change global variable
    userZip = $("#google-input-zip").val();
    console.log("Google map Zip =" , userZip);
    localStorage.setItem("userZip", userZip);

    //display map
    getGoogleCoordinates();
    // getWeather();
  }); 

  function initMap() {
    var uluru = {lat: 37.09024, lng: -95.712891};
    var map = new google.maps.Map(document.getElementById('map'), {
      zoom: 4,
      center: uluru
    });
    var marker = new google.maps.Marker({
      position: uluru,
      map: map
    });
  }

  function getGoogleCoordinates(){

    var addressZip = $("#google-input-zip").val();
    console.log("getGoogleCoordinates()-Input address/zip = " + addressZip);

    $.ajax({    
      url: 'https://maps.googleapis.com/maps/api/geocode/json?address='+ 
      addressZip +'&key=AIzaSyBtUUj6f_bVbHbWpCow6r5pktW8QVcwXp8',
      method: "POST"
    }).done(function(response){
    
    console.log("getGoogleCoordinates()- response", response);
    console.log("getGoogleCoordinates()- address",  response.results[0].formatted_address);

    var latitude = response.results[0].geometry.location.lat;
    var longitude = response.results[0].geometry.location.lng;

    var tableRowMaps = $("<tr>")
    tableRowMaps.append('<td>'+ response.results[0].address_components[1].short_name + 
    '</td>' + '<td>'+ latitude + '</td>' + '<td>' + longitude + '</td>');
    
    $("#address-table").html(tableRowMaps);

    var map;
    var infoWindow;
    var service;

    function initMap() {
      map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: latitude, lng: longitude},
        zoom: 15,
        styles: [
          {stylers: [{ visibility: 'simplified' }]}, 
          { elementType: 'labels', stylers: [{ visibility: 'off' }]}
        ]  
      });

      infoWindow = new google.maps.InfoWindow();
      service = new google.maps.places.PlacesService(map);

    // The idle event is a debounced event, so we can query & listen without
    // throwing too many requests at the server.
      map.addListener('idle', performSearch);
    }
    });
   } 
 
      
  function performSearch() {
    var choices = $(".choices").val();
    console.log("performSearch()- choices", choices);

    var request = {
      bounds: map.getBounds(),
      type: choices,
      openNoW: true,
    };
    service.radarSearch(request, callback);
  }


  function callback(results, status) {
    if (status !== google.maps.places.PlacesServiceStatus.OK) {
      console.error("callback()", status);
    return;
    }
    for (var i = 0, result; result = results[i]; i++) {
      addMarker(result);
    }
  }


  function addMarker(place) {
    console.log("In addMarker()", place);
    var marker = new google.maps.Marker({
      map: map,
      position: place.geometry.location,
      icon: {
        url: 'https://developers.google.com/maps/documentation/javascript/images/circle.png',
        anchor: new google.maps.Point(10, 10),
        scaledSize: new google.maps.Size(10, 17)
      }
    });


    google.maps.event.addListener(marker, 'click', function() {
      service.getDetails(place, function(result, status) {
        if (status !== google.maps.places.PlacesServiceStatus.OK) {
          console.error(status);
          return;
        }
          infoWindow.setContent(result.name);
          infoWindow.open(map, marker);
        });
      });
    
    initMap();
  }

//weather
   function getWeather() {
        var address = $("#user-input-zip").val();
        console.log("weather " + address)
        $.ajax({
            url: 'https://api.wunderground.com/api/7d4c2ccc48b6acd9/conditions/q/' + address + '.json',
            method: 'GET',
            datatype: "json"
        }).done(function(wonder) {
            console.log(wonder)
            console.log(wonder.current_observation.icon);
            var icon_url = wonder.current_observation.icon_url;
            var icon = wonder.current_observation.icon;
            var degrees = Math.floor(wonder.current_observation.temp_f)
            var city = wonder.current_observation.display_location.city
            $(".weather-widget").html('<span><img src="' + icon_url + '"></span><span>' + degrees + '°F</span><br><span>' + city + '<span>')
        });

    };

  //MEETUPS

  $('#meetups').on('click', function(){
      getMeetups();
  });

  //TODO
  function getMeetups(){

    console.log('getMeetups() - zipcode', localStorage.getItem("userZip"));
    userZip = localStorage.getItem("userZip");

    // var meetupsAPIKey = "32246d5033476b30277fe2c671b1b";
   
    var URL = "https://api.meetup.com/find/groups?photo-host=public&zip=" +
    userZip + "&page=25&sig_id=215984186&radius=10&topic_id=10333&category=25&sig=1136ea8f75e616421d23203df6988a0e83546ef7";

     $.ajax({    
          url: URL,
          method: "GET",
          dataType: 'jsonp'

      }).done(function(response) {
        console.log("getMeetups() ", response);

        for(var i=0; i< 15; i++){

          var outPutDivSection = $('<div>');

          outPutDivSection.attr("class", "search-result");
          outPutDivSection.attr("id", "search-item" + i);
          outPutDivSection.css("background-color", "#e9e9e9");
          outPutDivSection.css("padding", "15px");
          outPutDivSection.css("margin-top", "10px");

          var outPutInformation =

          '<h3>' + response.data[i].name  + '    '+ bookmarkIcon + '</h3>'+ 
          '<p>' + 'City : ' + response.data[i].city + '</p>'+ 
          '<p>' + 'Meant for : ' + response.data[i].who + '</p>'+  
          '<p class="link"><a href="' + response.data[i].link + '" >' + response.data[i].link + '</a></p>';

          outPutDivSection.html(outPutInformation);

          $("#results-div").append(outPutDivSection);

      }
  
      });
  }

  //bookmark items 
  $('#results-div').on('click', '.bookmark',function(){

      var currentUser = firebase.auth().currentUser;        
      var displayName = currentUser.displayName;

      console.log("Bookmark an Item for currentUser=", currentUser);

      var bookmarkLink = $(this).parent().siblings(".link").html();
      
      if(!jQuery.isEmptyObject(currentUser)){ //check for null condition
        $(this).html("<i class='fa fa-bookmark fa-lg' aria-hidden='true' style='color:red'></i>");

        if(displayName != null && bookmarksRef != null){          
            bookmarksRef.child(displayName).push(bookmarkLink);
        }else{
            console.log("User displayname is Null");
        }       

      }else{
        console.log("The user is not logged in to favorite!");
      }


    });

    

});