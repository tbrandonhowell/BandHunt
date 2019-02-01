//============================
// INITIALIZE VARIABLES
var zipCity;
var zipState;
var metroArea;
var eventArray = [];
var artistNameArray = [];
var accessToken;
var spotifyUserID;
var artistIdArray = [];
var songsIdArray = [];
var playlistID;
var playlistSongsIdArray = [];
//============================

// TODO: Need to push spotify info into local storage so the page will work without the accessToken in the URL

//============================
// CAPTURE ACCESS TOKEN FROM HASH IF PRESENT
var hash = window.location.hash;
console.log("Full hash: " + hash);
hash = hash.slice(1); // remove first character
console.log("Removed #: " + hash);
// help from https://stackoverflow.com/questions/23699666/javascript-get-and-set-url-hash-parameters
var result = hash.split('&').reduce(function (result, item) {
    var parts = item.split('=');
    result[parts[0]] = parts[1];
    return result;
}, {});
// ^^ not 100% sure how this works; need to study it more
console.log(result);
console.log("access_token: " + result.access_token); // grabbing a specific element in the newly created object
accessToken = result.access_token;
console.log("accessToken: " + accessToken);
//============================



//============================
// CAPTURE CITY/STATE FROM IP ADDRESS
function getIP(json) {
    zipCity = json.city;
    zipState = json.region;
    console.log("city: " + zipCity + ", State: " + zipState);
}
//============================


//===////////////////////////////
window.onload = function () { // open onload
//===////////////////////////////

//============================
// ADD SPOTIFY LINK HREF TO DOM
var spotifyRedirDest = "http://boot.camp:8888/test.html";
var spotifyLink = "https://accounts.spotify.com/authorize?client_id=8ecf5355cbd5468ca774341c25284642&response_type=token&redirect_uri=" + spotifyRedirDest + "&scope=playlist-modify-public";
$("#spotifyLink").attr("href",spotifyLink);
//============================

//============================
// ALL OUR API CALLS:
// GET METRO AREA BASED ON CITY
$.ajax({ // the request to the API

}).then(function(response) { // what to do when the API returns data. in this case we're putting the api response into this function

}).then(function() {
    
    return $.ajax({ // the request to the API

    }).then(function(response) { // what to do when the API returns data. in this case we're putting the api response into this function
        
    });

}).then(function() {
    
    if (accessToken) {

        return $.ajax({ // the request to the API

        }).then(function(response) { // what to do when the API returns data. in this case we're putting the api response into this function

        });
    };

}).then(function() {

    for (n=0;n<artistNameArray.length;n++) {
        $.ajax({ // the request to the API

        }).then(function(response) { // what to do when the API returns data. in this case we're putting the api response into this function

            if(response.artists.items[0].id) {

            };
        });
    }

}).then(function() {

    for (z=0;z<artistIdArray.length;z++) {
        $.ajax({ // the request to the API

        }).then(function(response) { // what to do when the API returns data. in this case we're putting the api response into this function

        });
    }

}).then(function() {

    $.ajax({

    }).then(function(response) { // what to do when the API returns data. in this case we're putting the api response into this function

    });

}).then(function() {

    for (y=0;y<songsIdArray.length;y++) {

    }

    $.ajax({
        
    }).then(function(response) { // what to do when the API returns data. in this case we're putting the api response into this function

    });

}).then(function() {
    console.log("placeholder: embed playlist on the page");

    var playerFrame = '<iframe src="https://open.spotify.com/embed/user/' + spotifyUserID + '/playlist/' + playlistID + '" width="300" height="380" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe>'

    $("#rightSide").empty();
    $("#rightSide").append(playerFrame);

})
;
//============================



//===////////////////////////////
}; // close onload
//===////////////////////////////