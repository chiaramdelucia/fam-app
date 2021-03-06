/*Firebase Initialization code Snippet */

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
var bookmarksRef = database.ref("/bookmarks"); //bookmarking search items

var currentUser = {}; //setting globally

$(document).ready(function() {

   $('input').parsley(); //parsleyJS library

    $('#btnSignupSubmit').on('click', function() {        
        var email = $('#txtSignupEmail').val().trim();
        var password = $('#txtSignupPassword').val().trim();
        firebaseSignup(email, password);
        
    });

    $('#btnSigninSubmit').on('click', function() {        
        var email = $('#txtSigninEmail').val().trim();
        var password = $('#txtSigninPassword').val().trim();
        firebaseSignin(email, password);               
    });

    $("#btnSignout").on('click', function() {        
        firebase.auth().signOut().then(function() {
            console.log("Signedout successfully");
        }, function(error) {
            console.log(error.message);
        });
        location.reload();        
    });

    $("#btnReset").click(function() {
        $(':input', '#signupDiv').val("");
        
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

    $('#profile-close').on('click', function(){
        $("#profileDiv").empty();       
    });

    // Firebase new user Signup using Email/password

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

        newUserPromise.then(function(user) {
            console.log("firebaseSignup(), Signed up successfully", user);
            $('#signupModal').hide('hide');

            // add user info to database
            addToDatabase(user);
        });
    }

    //Firebase Existing user Sign in using Email/Password

    function firebaseSignin(email, password) {
        var userObjPromise = firebase.auth().signInWithEmailAndPassword(email, password);

        userObjPromise.catch(function(error) {
            console.log(error.code);
            console.log(error.message);
            $('#errorStatus').html("Signin failed, try again");
        });

        userObjPromise.then(function(user) {
            console.log("firebaseSignin(), Signed in successfully", user);
            $('#signinModal').hide('hide');
        });
    }

    //Google Authentication of User

    function firebaseGoogleSignin() {
        console.log("in firebaseGoogleSignin()");

        var provider = new firebase.auth.GoogleAuthProvider();
        var result = firebase.auth().signInWithPopup(provider);

        console.log("firebaseGoogleSignin() ", result);

        result.then(function(result) {

            // This gives you a Google Access Token. You can use it to access the Google API.
            var token = result.credential.accessToken;

            // The signed-in user info.
            var user = result.user;
            console.log('firebaseGoogleSignin()-user ', user);

            //add google user too? 
            addToDatabase(user);

            $('#signinModal').hide('hide');
            $('#signupModal').hide('hide');

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


    firebase.auth().onAuthStateChanged(function(firebaseUser) {
        if (firebaseUser) {
            console.log('onAuthStateChanged(), User logged in', firebaseUser);
            $('#status').html("Welcome " + firebaseUser.displayName);
            $('#status').prop('disabled', false);
            $('#btnSignIn').hide();
            $('#btnSignUp').hide();
        } else {
            console.log("onAuthStateChanged(), not logged in");
            $('#status').html(" ");
            $('#status').prop('disabled', true);
        }
    });

    //keeping track of number of users
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

    //Persisiting User in the database
    function addToDatabase(user) {

        console.log("addToDatabase(), adding user to database", user.displayName, user.email);

        var displayName;
        var zipcode;

        if (user.displayName == null) {
            displayName = $("#txtSignupUserName").val().trim();
        } else {
            displayName = user.displayName;
        }

        zipcode = $("#txtSignupZipcode").val().trim();

        var member = {};
        member.displayName = displayName;
        member.zipcode = zipcode;
        member.email = user.email;

        membersRef.child(displayName).set(member);

        updateUserInfo(user);
    }

    //Updating user info because Email/password does not update Userprofile info
    function updateUserInfo(user) {

        console.log("updateUserInfo(), User logged in ", user);

        if (user.displayName == null) {
            console.log("updateUserInfo(user), display name is" + user.displayName);
            user.updateProfile({
                displayName: $("#txtSignupUserName").val().trim()
            }).then(function() {
                $('#status').html("Welcome " + user.displayName); //check again, quickhack
                console.log("updateUserInfo(), User updated successfully with ",  $("#txtSignupUserName").val().trim());
                // location.reload();
            }, function(error) {
                console.log(error.message);
            });
        } else {
            console.log('updateUserInfo(), User info not updated');
        }
    }

    // Displaying Profile information and Bookmark Info for the user.
    function fetchUserProfile() {

        var user = firebase.auth().currentUser;

        console.log("fetchUserProfile() for user=", user);

        membersRef.once("value")
            .then(function(membersSnapshot) {
                var profileObj = membersSnapshot.child(user.displayName).val();

                console.log("fetchUserProfile()", profileObj);

                var profileDivSection = $("<div>");
                profileDivSection.attr("class", "profileClass");
                profileDivSection.css("background-color", "#e9e9e9");
                profileDivSection.css("padding", "15px");
                profileDivSection.css("color", "#000000");
                profileDivSection.css("font-size", "20px");
                profileDivSection.css("border", "2px solid #000000");
                profileDivSection.css("margin-top", "10px");

                var userProfile = "<table class='profileTable'>";

                 Object.keys(profileObj).forEach(function(key) {
                    userProfile += '<tr><td class="capitalize">' + key + "</td><td>" + profileObj[key] + '</td></tr>';
                });

                profileDivSection.html(userProfile);
                $("#profileDiv").append(profileDivSection);

            });

            //reading  bookmarks from database

            bookmarksRef.child(user.displayName).once('value', function(bookmarksSnapshot) {

                var bookmarksObj = bookmarksSnapshot.val();
                console.log("bookmarks snapshot", bookmarksObj);

                if(bookmarksObj != null){

                    var bookmarkDivSection = $("<div>");
                        bookmarkDivSection.attr("class", "profileClass");
                        bookmarkDivSection.css("background-color", "#e9e9e9");
                        bookmarkDivSection.css("padding", "15px");
                        bookmarkDivSection.css("color", "#000000");
                        bookmarkDivSection.css("font-size", "20px");
                        bookmarkDivSection.css("border", "2px solid #000000");
                        bookmarkDivSection.css("margin-top", "10px");

                    var bookmarkP = '<p style="font-size: 24px; font-weight: bold;font-decoration: underline"> Your Bookmarks  </p>';

                    Object.keys(bookmarksObj).forEach(function(key) {
                        bookmarkP += '<p>' + bookmarksObj[key] + '</p>';
                    });
                    bookmarkDivSection.html(bookmarkP);

                    $("#profileDiv").append(bookmarkDivSection);

                }else{
                    console.log("No bookmarks for the user");
                }
            });

    }

});

