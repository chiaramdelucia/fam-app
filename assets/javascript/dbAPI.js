$(document).on('ready', function(){

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
    console.log("Input address/zip = " + addressZip);

    $.ajax({    
      url: 'https://maps.googleapis.com/maps/api/geocode/json?address='+ 
      addressZip +'&key=AIzaSyBtUUj6f_bVbHbWpCow6r5pktW8QVcwXp8',
      method: "POST"
    }).done(function(response){
    
    console.log(response);
    console.log(response.results[0].formatted_address);

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
    console.log(choices);

    var request = {
      bounds: map.getBounds(),
      type: choices,
      openNoW: true,
    };
    service.radarSearch(request, callback);
  }


  function callback(results, status) {
    if (status !== google.maps.places.PlacesServiceStatus.OK) {
      console.error(status);
    return;
    }
    for (var i = 0, result; result = results[i]; i++) {
      addMarker(result);
    }
  }


  function addMarker(place) {
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


  // //weather api
  function getWeather(){
    var address= $("#google-input-zip").val();
    console.log("weather "+ address)
    $.ajax({
        url:'https://api.wunderground.com/api/7d4c2ccc48b6acd9/conditions/q/'+ address + '.json',
        method:'GET',
        datatype: "json"
        }).done(function(wonder){
          console.log(wonder);
          console.log(wonder.current_observation.icon);
          var icon_url = wonder.current_observation.icon_url;
          var icon = wonder.current_observation.icon;
          var degrees = wonder.current_observation.temp_f;
          var tableRowWeather = $("<tr>");
          tableRowWeather.append('<td>'+icon+'</td><td>'+degrees +'</td><td><img src="'+icon_url+'"/></td>');
          $("#weather-table").append(tableRowWeather);
    });
  }

var userZip;

$('#user-add-zip').on('click', function(){
  userZip = $('#user-input-zip').val();   //set as global variable  
  console.log("userZip =" , userZip);

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
  console.log("userZip =" , userZip);

  //display map
  getGoogleCoordinates();
  getWeather();
}); 


});
