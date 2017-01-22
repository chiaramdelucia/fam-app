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
  
    // <script async defer src="https://maps.googleapis.com/maps/api/js?key=AIzaSyBtUUj6f_bVbHbWpCow6r5pktW8QVcwXp8&callback=initMap&libraries=places">
   
   
  function getAddress(){
    var address = $("#address").val();
    console.log("maps "+ address)
      $.ajax({
    
        url: 'https://maps.googleapis.com/maps/api/geocode/json?address='+ address +'&key=AIzaSyBtUUj6f_bVbHbWpCow6r5pktW8QVcwXp8',
        method: "POST"
      }).done(function(response) {
        console.log(response);
        console.log(response.results[0].formatted_address)

    var latitude = response.results[0].geometry.location.lat
    var longitude = response.results[0].geometry.location.lng
    var tableRowMaps = $("<tr>")
    tableRowMaps.append('<td>'+ response.results[0].formatted_address+ '</td>' + '<td>'+ latitude + '</td>' + '<td>' + longitude + '</td>');
    
    $("#address-table").append(tableRowMaps);
    // function initMap() {
    //     var uluru = {lat: latitude, lng: longitude};
    //     var map = new google.maps.Map(document.getElementById('map'), {
    //       zoom: 15,
    //       center: uluru
    //     });
    //     var marker = new google.maps.Marker({
    //       position: uluru,
    //       map: map
    //     });
    //   }
    var map;
    var infoWindow;
    var service;
  
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: latitude, lng: longitude},
    zoom: 15,
    styles: [{
      stylers: [{ visibility: 'simplified' }]
    }, {
      elementType: 'labels',
      stylers: [{ visibility: 'off' }]
    }]
  });

  infoWindow = new google.maps.InfoWindow();
  service = new google.maps.places.PlacesService(map);

  // The idle event is a debounced event, so we can query & listen without
  // throwing too many requests at the server.
  map.addListener('idle', performSearch);
}

function performSearch() {
  var choices = $(".choices").val();
  console.log(choices)
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
}
      initMap();
});
           
};
