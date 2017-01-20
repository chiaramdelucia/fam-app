
$(document).on('ready', function(){

var latitude ;
var longitude;
var radius = 5000;



//on adding zipcode


// ----------------Get meetups-----------------------------




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

