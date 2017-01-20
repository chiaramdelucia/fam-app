
  // Initialize Firebase
var config = {
	apiKey: "AIzaSyCRfzoY76tvHoB3RUbvU5pJoHylG4L3hI8",
	authDomain: "fam-app-94e72.firebaseapp.com",
	databaseURL: "https://fam-app-94e72.firebaseio.com",
	storageBucket: "fam-app-94e72.appspot.com",
	messagingSenderId: "665693601471"
};

firebase.initializeApp(config);


//------Database Reference--------
var database = firebase.database();
var dbRef = database.ref();
var auth = firebase.auth();

var connectedRef = database.ref(".info/connected");

var membersRef = database.ref("/members"); //members data
var currentUsersRef = database.ref("/currentUsers"); //to count number of ppl online
var bookmarksRef = database.ref("/bookmarks"); 

var currentUser = {}; //setting globally

$(document).ready(function() {

	$('input').parsley(); //parsleyJS library

	$('#btnSignupSubmit').on('click', function(){
		var email = $('#txtSignupEmail').val().trim();
		var password = $('#txtSignupPassword').val().trim();
		firebaseSignup(email, password);
	});

	$('#btnSigninSubmit').on('click', function(){
		var email = $('#txtSigninEmail').val().trim();
		var password = $('#txtSigninPassword').val().trim();
		firebaseSignin(email, password);
	});

	$("#btnSignout").on('click', function(){
		firebase.auth().signOut().then(function() {
  			console.log("Signedout successfully");
		}, function(error) {
  			console.log(error.message);
		});

		location.reload();
	});

	$("#btnReset").click(function () {
        $(':input','#signupDiv').val("");
    });

    $("#btnGoogleSignin").click(function() {
        firebaseGoogleSignin();
    });

    $("#btnGoogleSignup").click(function() {
        firebaseGoogleSignin();
    });

    $("#btnProfile").click(function() {
        fetchUserProfile();
    });

	
	function firebaseSignup(email, password) {
		var newUserPromise = 
		firebase.auth().createUserWithEmailAndPassword(email, password);

		console.log('firebaseSignup(), newUserPromise', newUserPromise);

		newUserPromise.catch(function(error) {
			var errorCode = error.code;
			var errorMessage = error.message;
			if (errorCode == 'auth/weak-password') {
				alert('The password is too weak.');
			} else {
				alert(errorMessage);
			}
			console.log(error);
		});

		newUserPromise.then(function(user){		
			console.log("firebaseSignup(), Signed up successfully", user);
			$('#signupModal').hide('hide');
			// location.reload();
			// add user info to database
			addToDatabase(user);
		});
	}


	function firebaseSignin(email, password){
		var userObjPromise = firebase.auth().signInWithEmailAndPassword(email, password);

		userObjPromise.catch(function(error) {
		   console.log(error.code);
		   console.log(error.message);
		   $('#errorStatus').html("Signin failed, try again");
		});

		userObjPromise.then(function(user) {
		   console.log("firebaseSignin(), Signed in successfully", user);
		   $('#signinModal').hide('hide');
		   // location.reload();
		});
	}	

	firebase.auth().onAuthStateChanged(function(firebaseUser) {
		if(firebaseUser){
			console.log('onAuthStateChanged(), User logged in', firebaseUser);			
 			$('#status').html("Welcome " + firebaseUser.displayName);
		} else {
			console.log("onAuthStateChanged(), not logged in");
			$('#status').html("Not logged in");
		}

		// setCurrentUser(); 
	});

	//keep track of number of users
	connectedRef.on("value", function(snapshot) {
		if (snapshot.val() === true) {
			console.log("New connection to the database");
			// Add user to the connections list.
			var con = currentUsersRef.push(true);
			// Remove user from the connection list when they disconnect.
			con.onDisconnect().remove();
		} else {
		  	console.log("New disconnection to the database");
		}
	});

	currentUsersRef.on("value", function(snapshot) {
	  console.log("Number of connections", snapshot.numChildren());
	  $("#connected-viewers").html(snapshot.numChildren());
	});


	function addToDatabase(user){

		console.log("addToDatabase(), adding user to database", user.displayName, user.email);

		var displayName = $("#txtSignupUserName").val().trim();
		var zipcode = $("#txtSignupZipcode").val().trim();

		var member={};
		member.displayName = displayName;
		member.zipcode = zipcode;
		member.email = user.email;

		membersRef.child(displayName).set(member);

		// updateUserInfo(user);
		setCurrentUser(); 		   

	}


	//setting global variable of current user

	function setCurrentUser(){
		
		currentUser = firebase.auth().currentUser; //set the global variable;   
	    console.log("setCurrentUser(), current user=", currentUser);    

   		if(currentUser){ 
	    	console.log("setCurrentUser(), User logged in ", currentUser.displayName);
	    	
	    	currentUser.updateProfile({
			  displayName: $("#txtSignupUserName").val().trim()		  
			}).then(function() {
			   console.log("setCurrentUser(), User updated successfully with " + currentUser.displayName);
			}, function(error) {
			   console.log(error.message);	
			});
	    }else{
	    	console.log('setCurrentUser(), No user logged in');
   		}

	}


	function firebaseGoogleSignin(){
		console.log("in firebaseGoogleSignin");
		
		var provider = new firebase.auth.GoogleAuthProvider();
		var result = firebase.auth().signInWithPopup(provider);

		console.log("firebaseGoogleSignin() ", result);

		result.then(function(result) {
		  // This gives you a Google Access Token. You can use it to access the Google API.
		  var token = result.credential.accessToken;
		  // The signed-in user info.
		  var user = result.user;
		  console.log(user); 

		  $('#signinModal').hide('hide');
		  $('#signupModal').hide('hide');
		  // location.reload();
		});

		result.catch(function(error) {
		  var errorCode = error.code;
		  var errorMessage = error.message;
		  var email = error.email;

		  // The firebase.auth.AuthCredential type that was used.
		  var credential = error.credential;
		  // $('#errorStatus').html("Signin failed, try again");
		});
	}


		//TODO 
	function fetchUserProfile(){

		console.log('In fetchUserProfile');
		var user = firebase.auth().currentUser;
		console.log("user=", user);

		  user.providerData.forEach(function (profile) {
		    console.log("  Sign-in provider: "+profile.providerId);
		    console.log("  Provider-specific UID: "+profile.uid);
		    console.log("  Name: "+ profile.displayName);
		    console.log("  Email: "+profile.email);
		    console.log("  Photo URL: "+profile.photoURL);
		  });

		// membersRef.child(name).on('value', function(snapshot) {
		// 	console.log('fetching values', snapshot);

		// });
		console.log('/members/' + user.name);

		// dbRef.ref('/members/' + user).once('value').then(function(snapshot) {
  // 		console.log(snapshot.val().username);

		// });

	}


});
