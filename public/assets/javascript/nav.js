$(document).ready(function(){
  
  var choices;

  var cityState = $("google-input-zip").val();

  var bookmarkIcon = '<span class="bookmark" style="float: right"><a class="bkTooltip" rel="tooltip" data-toggle="tooltip" data-placement="top" title="Bookmark Item" href="#"><i class="fa fa-bookmark-o fa-lg" aria-hidden="true" style="color:blue"></i></a></span>';

	$('.outdoorsLi').on ('click', function(){
    event.preventDefault();
		choices = $(this).data('search');
    console.log(choices)
		$("#resultsAPI").empty();
		whatTheYelp();
	});

	$('.indoorsLi').on ('click', function(){
    event.preventDefault();
		choices = $(this).data('search');
    console.log(choices)
		$("#resultsAPI").empty();
		whatTheYelp();
	});

	$('.foodLi').on ('click', function(){
    event.preventDefault();
		choices = $(this).data('search');
    console.log(choices)
		$("#resultsAPI").empty();
		whatTheYelp();
	});

	$('#meetups').on('click', function(){
    event.preventDefault();
		$("#resultsAPI").empty();
		getMeetups();
	});

	$("#google-add-zip").on("click", function(){
		event.preventDefault();
		localStorage.setItem("cityState", cityState);
		$("#resultsAPI").empty();
    getWeather();
		whatTheYelp();	  
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

      var terms = choices;
      console.log(choices);

      var near = address;
      console.log(address);
      var accessor = {
        consumerSecret: auth.consumerSecret,
        tokenSecret: auth.accessTokenSecret
      };

      parameters = [];
      parameters.push(['term', terms]);
      parameters.push(['location', near]);
      parameters.push(['radius_filter', 8000]);
      parameters.push(['limit', 10]);
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
                url: 'https://developers.google.com/maps/documentation/javascript/images/circle.png',
                anchor: new google.maps.Point(10, 10),
                scaledSize: new google.maps.Size(10, 17)
              }
            });
          };

          function initMap(busLat, busLong) {
            map = new google.maps.Map(document.getElementById('map'), {
              center: {lat: busLat, lng: busLong},
              zoom: 12,
              mapTypeId: 'roadmap',
              
            }); 

          };

          var initlat = data.region.center.latitude;
          var initlong = data.region.center.longitude;
          // console.log("initlat "+initlat + "  initlong "+initlong);
          //start "here"
          initMap(initlat, initlong);

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
    	outPutDivSection.css("padding", "15px");
    	outPutDivSection.css("margin-top", "10px");

      var outPutInformation =

      '<h3>' + data.businesses[i].name  + '    ' + bookmarkIcon + '</h2>'+ 
      '<p>' + 'Rating : ' + '<img src="' + data.businesses[i].rating_img_url +'" />' + '</p>'+ 
      '<p>' + 'Phone : ' + data.businesses[i].phone + '</p>'+ 
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

function getMeetups(){
    
    console.log('getMeetups() - zipcode', localStorage.getItem("userZip"));
    userZip = localStorage.getItem("userZip");
    var numResults = $("#numResults").val();

    console.log("number of results to fetch", numResults);

    // var meetupsAPIKey = "32246d5033476b30277fe2c671b1b";
   
    var URL = "https://api.meetup.com/find/groups?photo-host=public&zip=" +
    userZip + "&page=25&sig_id=215984186&radius=10&topic_id=10333&category=25&sig=1136ea8f75e616421d23203df6988a0e83546ef7";

     $.ajax({    
          url: URL,
          method: "GET",
          dataType: 'jsonp'

      }).done(function(response) {
        console.log("getMeetups() ", response);

        for(var i=0; i< numResults; i++){

          var outPutDivSection = $('<div>');
          outPutDivSection.attr("class", "search-result");
          outPutDivSection.attr("id", "search-item" + i);
          outPutDivSection.css("background-color", "#e9e9e9");
          outPutDivSection.css("padding", "15px");
          outPutDivSection.css("margin-top", "10px");

          if(response.data.errors){
            console.log("there are errors in meetups data")
          }else{
            var outPutInformation =

            '<h3>' + response.data[i].name  + '    '+ bookmarkIcon + '</h3>'+ 
            '<p>' + 'City : ' + response.data[i].city + '</p>'+ 
            '<p>' + 'Meant for : ' + response.data[i].who + '</p>'+  
            '<p class="link"><a target="_blank" style="text-decoration: underline; color: blue;" href="' + response.data[i].link + '" >' + response.data[i].name + '</a></p>';

            outPutDivSection.html(outPutInformation);
            $("#resultsAPI").append(outPutDivSection);

          }
        }
  
      });
  }


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
