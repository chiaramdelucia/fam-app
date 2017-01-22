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
    //getGoogleCoordinates();

  });  

  // //if value is changed
  // $('#google-add-zip').on('click', function(){

  //   //change global variable
  //   userZip = $("#google-input-zip").val();
  //   console.log("Google map Zip =" , userZip);
  //   localStorage.setItem("userZip", userZip);

  //   //display map
  //   getGoogleCoordinates();
  //   // getWeather();
  // }); 

  // function getGoogleCoordinates(){

  //   var addressZip = $("#google-input-zip").val();
  //   console.log("getGoogleCoordinates()-Input address/zip = " + addressZip);
  //   $.ajax({    
  //     url: 'https://maps.googleapis.com/maps/api/geocode/json?address='+ 
  //     addressZip +'&key=AIzaSyBtUUj6f_bVbHbWpCow6r5pktW8QVcwXp8',
  //     method: "POST"
  //   }).done(function(response){
    
  //   console.log("getGoogleCoordinates()- response", response);
  //   console.log("getGoogleCoordinates()- address",  response.results[0].formatted_address);

  //   var latitude = response.results[0].geometry.location.lat;
  //   var longitude = response.results[0].geometry.location.lng;

  //   };

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