
$(document).on('ready', function(){

var userZip;
var latitude ;
var longitude;
var radius = 5000;

var bookmarkIcon= '<span class="bookmark"><a href="#"><i class="fa fa-bookmark-o" aria-hidden="true"></i></a></span>';

//on adding zipcode






// ----------------Get meetups-----------------------------

$('#meetups').on('click', function(){
    getMeetups();
});

//TODO
function getMeetups(){
  console.log('zipcode', userZip);

  // var meetupsAPIKey = "32246d5033476b30277fe2c671b1b";
 
  var URL = "https://api.meetup.com/find/groups?photo-host=public&zip=" +
  userZip + "&page=25&sig_id=215984186&radius=10&topic_id=10333&category=25&sig=1136ea8f75e616421d23203df6988a0e83546ef7";

   $.ajax({    
        url: URL,
        method: "GET",
        dataType: 'jsonp'

    }).done(function(response) {
      console.log(response);

      //TODO- proper display/CSS and pull other required data

      for( var i = 0; i < 15; i++){
        if(response.data[i] != undefined && response.data[i] != null){
         var tableRowResults = $("<div>");
          tableRowResults.append(
          '<tr><td>'+ "Name :" + response.data[i].name + 
          bookmarkIcon + '<br>' +
          "City : " + response.data[i].city + '<br>' +
          "URL : <a href= '" + response.data[i].link + "'>Click here for details </a><br>" +
          "</td></tr><br><br><br><hr>");
          console.log(tableRowResults);
          // tableRowResults.setAttribute('data-bkmark', response.data[i].link);
          $("#results-table").append(tableRowResults);
          // console.log(response.data[i].city, response.data[i].name, response.data[i].link);
        }
      }    

    });
}

//bookmark items clicked //todo
$('#results-table').on('click', '.bookmark',function(){
 
    console.log(bookmarksRef);
    
    console.log("current user=", currentUser);
    
    if(currentUser){ //check for null condition
      $(this).html("<i class='fa fa-bookmark' aria-hidden='true'></i>");
    }

    var bookmarks = {};
  });

    
});

