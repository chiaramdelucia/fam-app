$(document).ready(function(){
  
  var choices;
  var categories;
  var cityState;


  var bookmarkIcon = '<span class="bookmark" style="float: right"><a class="bkTooltip" rel="tooltip" data-toggle="tooltip" data-placement="top" title="Bookmark Item" href="#"><i class="fa fa-bookmark-o fa-lg" aria-hidden="true" style="color:blue"></i></a></span>';

	$('.outdoorsLi').on ('click', function(){
    event.preventDefault();
		choices = $(this).data('term');
    categories = $(this).data('search');
    console.log(categories);
    console.log(choices);
		$("#resultsAPI").empty();
		whatTheYelp();
	});

	$('.indoorsLi').on ('click', function(){
    event.preventDefault();
		choices = $(this).data('term');
    categories = $(this).data('search');
    console.log(categories);
    console.log(choices);
		$("#resultsAPI").empty();
		whatTheYelp();
	});

	$('.foodLi').on ('click', function(){
    event.preventDefault();
		choices = $(this).data('term');
    categories = $(this).data('search');
    console.log(categories);
    console.log(choices);
		$("#resultsAPI").empty();
		whatTheYelp();
	});

	$('#meetups').on('click', function(){
    event.preventDefault();
		$("#resultsAPI").empty();
    $('#searched-Item').html("You searched for Meetups");
		geocoder();
	});

  $('.navbar-select-items li').on('click', function(){
     console.log("Nav item selected = ", $(this).text()); // gets text contents of clicked li
     $('#searched-Item').html("You searched for " + $(this).text());
  });


  function whatTheYelp(){
    var address = $("#google-input-zip").val();

    var numResults = $("#numResults").val();
    console.log("number of results to fetch", numResults);
      
      console.log("whatTheYelp() address ", address);
      
      var auth = {
        consumerKey: "N79ok2kTPQxglbRUEq6nKg",
        consumerSecret: "bj6U9j64nKyEqBbCRvfm5eAcOYQ",
        accessToken: "U0Ya5mK-gWYd0w1f-qnv3hC_NJwB60KB",
        accessTokenSecret: "6AUtdcwquIItxXKO4DErbyZbb6I",
        serviceProvider: {
          signatureMethod: "HMAC-SHA1"
        }
      };

      var terms = categories;
      console.log(choices);

      var near = address;
      console.log(address);

      var accessor = {
        consumerSecret: auth.consumerSecret,
        tokenSecret: auth.accessTokenSecret
      };

      parameters = [];
      parameters.push(['term', choices])
      parameters.push(['location', near]);
      parameters.push(['limit', 10]);
      parameters.push(['sort', 1]);
      parameters.push(['category_filter', categories]);
      parameters.push(['radius_filter', 8000]);
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
      // console.log(parameterMap);

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
                 url: '../assets/css/images/logo2.png',
              //'https://developers.google.com/maps/documentation/javascript/images/circle.png',
                 anchor: new google.maps.Point(10, 10),
                 scaledSize: new google.maps.Size(20, 25)
              }
            });

            var bussinessName = '<div id="window">' + data.businesses[i].name + '</div>'
              google.maps.event.addListener(marker, 'mouseover', function() {
              infoWindow.setContent(bussinessName);
              infoWindow.open(map, marker);
            });
          };

          function initMap(busLat, busLong) {
            var styledMapType = new google.maps.StyledMapType(
          [{
              featureType: 'poi',
              elementType: 'labels.icon',
              stylers: [{visibility: 'off'}],
            }],
            {name: 'Styled Map'});
            map = new google.maps.Map(document.getElementById('map'), {
              center: {lat: busLat, lng: busLong},
              zoom: 12,
              mapTypeId: 'roadmap',
              
            });
            infoWindow = new google.maps.InfoWindow(); 
            map.mapTypes.set('styled_map', styledMapType);
            map.setMapTypeId('styled_map');

          };

          var initlat = data.region.center.latitude;
          var initlong = data.region.center.longitude;
          // console.log("initlat "+initlat + "  initlong "+initlong);
          //start "here"
          initMap(initlat, initlong);

    console.log("whatTheYelp()- num of search results=",data.businesses.length);      

    if(data.businesses.length <= numResults){
      numResults = data.businesses.length;
    }     

		for(i=0; i< numResults; i= i+1) {
			//commenting this out because of bookmarking error

			// $("#resultsAPI").append("<p class='link'>");  
			// $("#resultsAPI").append('<a href ="' + data.businesses[i] + '">' + data.businesses[i].name +'</a>');
			// $("#resultsAPI").append("      ");
			// $("#resultsAPI").append('<img src="' + data.businesses[i].rating_img_url +'" />');
			// $("#resultsAPI").append(" Phone: ");
			// $("#resultsAPI").append(data.businesses[i].phone);
			// $("#resultsAPI").append("<p>");  
			// $("#resultsAPI").append(" Yelp Reviews: ");
			// $("#resultsAPI").append(data.businesses[i].review_count);
			// $("#resultsAPI").append("      ");
			// $("#resultsAPI").append(bookmarkIcon)
			// $("#resultsAPI").append("</p>"); 

			var outPutDivSection = $('<div>');
    	outPutDivSection.attr("class", "search-result");
    	outPutDivSection.attr("id", "search-item" + i);
    	outPutDivSection.css("background-color", "#e9e9e9");
    	outPutDivSection.css("padding", "10px");
    	outPutDivSection.css("margin-top", "10px");
      outPutDivSection.css("border", "1px solid #000000");


      var outPutInformation =

      '<h2>' + data.businesses[i].name  + '    ' + bookmarkIcon + '</h2>'+ 
      '<p>' + 'Rating : ' + '<img src="' + data.businesses[i].rating_img_url +'" />' + '</p>'+ 
      '<p>' + 'Phone : ' + data.businesses[i].display_phone + '</p>'+ 
      '<p>' + 'Reviews : ' + data.businesses[i].review_count + '</p>'+   
      '<p class="link"><a target="_blank" style="text-decoration: underline; color: blue;" href="' + data.businesses[i].url + '" >' + data.businesses[i].name + '</a></p>';

      outPutDivSection.html(outPutInformation);

      $("#resultsAPI").append(outPutDivSection);


			var busLat = data.businesses[i].location.coordinate.latitude;
			var busLong = data.businesses[i].location.coordinate.longitude;
			var business = data.businesses[i];

			addMarker(busLat, busLong);

			console.log(busLat + "   "+busLong)

		}; //for
  }//success
});//ajax

};// what the yelp

function geocoder (){
      var mulat = localStorage.getItem('mulat');
      var mulong = localStorage.getItem('mulong');
      console.log(mulat);
      console.log(mulong);

      $.ajax({
          
            url: 'cors-anywhere.herokuapp.com' + 'https://api.geonames.org/findNearbyPostalCodesJSON?lat='+mulat+'&lng='+ mulong + '&country=US&radius=10&username=cpsavva', 
            // url: 'http://api.geonames.org/postalCodeSearchJSON?placename='+ cityState+'&country=US&maxRows=10&username=cpsavva',
            method: "GET"
            }).done(function(response){
              console.log(response)
              
              //list needed for api
              //category = 25
              var city = response.postalCodes[0].placeName
              var country = response.postalCodes[0].countryCode
              var lat = response.postalCodes[0].lat
              var lng = response.postalCodes[0].lng
              var state = response.postalCodes[0].adminCode1
              //&text=family kids mom dad toddlers babies
              //&topic = parents
              var zipcode = response.postalCodes[0].postalCode
              console.log(zipcode);
              console.log(city);
              console.log(state);
              console.log(country);
              console.log(lat);
              console.log(lng);



    var URL = 'https://api.meetup.com/2/open_events?zip='+ zipcode + 
              '&and_text=False&country='+ country + '&offset=0&city='+ city +
              '&format=json&lon='+ lng + 
              '&limited_events=False&topic=parents&text=family+kids+mom+dad+toddlers+babies' +
              '&state='+ state + '&photo-host=public&page=20&radius=10&category=25&lat='
              + lat + '&desc=False&status=upcoming&sig_id=216265865&sig=f750f3c25081c44e545cae4b1e3ffb99f886cb20' + 
              '&sign=true&key=6a454ba562f402be763a6332275c2e&callback=gotIt'
     $.ajax({    
          url: URL,
          method: "GET",
          dataType: 'jsonp'

      }).done(function(response) {
        console.log("getMeetups() ", response);
        var numberOfEvents = response.meta.count;
            console.log(numberOfEvents)
            
          for(var i=0; i< numberOfEvents; i++){
            

            var groupName = response.results[i].group.name;
            var eventName = response.results[i].name;
            var eventURL = response.results[i].event_url;
            console.log(groupName);
            console.log(eventName);
            console.log(eventURL);

            
          var outPutDivSection = $('<div>');
          outPutDivSection.attr("class", "search-result");
          outPutDivSection.attr("id", "search-item" + i);
          outPutDivSection.css("background-color", "#e9e9e9");
          outPutDivSection.css("padding", "15px");
          outPutDivSection.css("margin-top", "10px");
          outPutDivSection.css("border", "1px solid #000000");

            
            var outPutInformation =

            '<h2>' + 'Group : ' + groupName  + '    '+ bookmarkIcon + '</h2>'+ 
            '<p>' + 'Event : ' + eventName + '</p>'+ 
            '<p class="link"><a target="_blank" style="text-decoration: underline; color: blue;" href="' + eventURL + '" >Details</a></p>';

            outPutDivSection.html(outPutInformation);
            $("#resultsAPI").append(outPutDivSection);

           } //for
              
            });//meetup ajax

  });//geoname ajax
            
      }; //geocoder


//bookmark items
$('#resultsAPI').on('click', '.bookmark',function(){
      event.preventDefault();
      var currentUser = firebase.auth().currentUser;       
     
    if(currentUser != null){

      console.log("Bookmark an Item for currentUser=", currentUser);
      var displayName = currentUser.displayName;

      var bookmarkLink = $(this).parent().siblings(".link").html();

      if(!jQuery.isEmptyObject(currentUser)){ //check for null condition
        $(this).html("<i class='fa fa-bookmark fa-lg' aria-hidden='true' style='color:red'></i>");

        if(displayName != null && bookmarksRef != null){          
          bookmarksRef.child(displayName).push(bookmarkLink);
        }else{
          console.log("User displayname is Null");
        }       

      }else{
          // console.log("The user is not logged in to favorite!");
      }

    }else{
      console.log("The user is not logged in to favorite!");
      $('#signinModal').modal('show');
    }

    });

});

//tooltip for bookmark
  $('#resultsAPI').tooltip({
    selector: '[data-toggle="tooltip"]'
  });

// $(document.body).tooltip({ selector: "[title]" });//good to know

