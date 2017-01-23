$(document).ready(function() {

	function whatTheYelp(){
    var address = $("#google-input-zip").val();
      var choices = $(".choices").val();
      console.log(choices)
      console.log(address)
      

      var auth = {
        consumerKey: "N79ok2kTPQxglbRUEq6nKg",
        consumerSecret: "bj6U9j64nKyEqBbCRvfm5eAcOYQ",
        accessToken: "U0Ya5mK-gWYd0w1f-qnv3hC_NJwB60KB",
        accessTokenSecret: "6AUtdcwquIItxXKO4DErbyZbb6I",
        serviceProvider: {
          signatureMethod: "HMAC-SHA1"
        }
      };
      var terms = choices;
      console.log(choices)

      var near = address;
      console.log(address)
      var accessor = {
        consumerSecret: auth.consumerSecret,
        tokenSecret: auth.accessTokenSecret
      };

      parameters = [];
      parameters.push(['term', terms]);
      parameters.push(['location', near]);
      parameters.push(['radius', 5]);
      parameters.push(['limit_filter', 15]);
      parameters.push(['sort', 1])
      parameters.push(['callback', 'cb']);
      parameters.push(['oauth_consumer_key', auth.consumerKey]);
      parameters.push(['oauth_consumer_secret', auth.consumerSecret]);
      parameters.push(['oauth_token', auth.accessToken]);
      parameters.push(['oauth_signature_method', 'HMAC-SHA1']);

      var message = {
        'action': 'https://api.yelp.com/v2/search',
        'method': 'GET',
        'parameters': parameters
      };

      OAuth.setTimestampAndNonce(message);
      OAuth.SignatureMethod.sign(message, accessor);

      var parameterMap = OAuth.getParameterMap(message.parameters);
      parameterMap.oauth_signature = OAuth.percentEncode(parameterMap.oauth_signature)
      console.log(parameterMap);

      $.ajax({
        'url': message.action,
        'data': parameterMap,
        'cache': true,
        'dataType': 'jsonp',
        'jsonpCallback': 'cb',
        'success': function(data, textStats, XMLHttpRequest) {
          var i;
          console.log(data);

          function addMarker(business_latitude, busLong) {
            var marker = new google.maps.Marker({
              map: map,
              position: {lat: business_latitude, lng: busLong},
              icon: {
                url: 'https://developers.google.com/maps/documentation/javascript/images/circle.png',
                anchor: new google.maps.Point(10, 10),
                scaledSize: new google.maps.Size(10, 17)
              }
            });
          };

          function initMap(busLat, busLong) {
            map = new google.maps.Map(document.getElementById('map'), {
              center: {lat: busLat, lng: busLong},
              zoom: 14,
              mapTypeId: 'roadmap',
              
            }); 

          };
          var initlat = data.region.center.latitude
          var initlong = data.region.center.longitude
          console.log("initlat "+initlat + "  initlong "+initlong)
          //start "here"
          initMap(initlat, initlong);

        for(i=0; i<=9; i= i+1) {
                    $("#resultsAPI").append("<p>");  
                    $("#resultsAPI").append('<a href ="' + data.businesses[i] + '">' + data.businesses[i].name +'</a>');
                    $("#resultsAPI").append("      ");
                    $("#resultsAPI").append('<img src="' + data.businesses[i].rating_img_url +'" />');
                    $("#resultsAPI").append(" Phone: ");
                    $("#resultsAPI").append(data.businesses[i].phone);
                    $("#resultsAPI").append("<p>");  
                    $("#resultsAPI").append(" Yelp Reviews: ");
                    $("#resultsAPI").append(data.businesses[i].review_count);
                    $("#resultsAPI").append("      ");
                    $("#resultsAPI").append("</p>");  

                    var busLat = data.businesses[i].location.coordinate.latitude;
                    var busLong = data.businesses[i].location.coordinate.longitude;
                    var business = data.businesses[i];

                    addMarker(busLat, busLong);

                    console.log(busLat + "   "+busLong)
          
          }; //for
        }//success
      });//ajax

};// what the yelp

//main process
$("#google-add-zip").on("click", function(){
  event.preventDefault();
  $("#resultsAPI").empty();
  whatTheYelp();
  
});

});