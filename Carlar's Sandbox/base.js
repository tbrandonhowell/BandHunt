console.log("base.js is loaded");

// TODO: Need to update my ajax calls to get rid of "then" and use "complete" or whatever Tim told me about (see notes)

//============================
// INITIALIZE VARIABLES
var zipCity; // may be deprecated due to use of local storage
var zipState; // may be deprecated due to use of local storage
var metroArea;
var metroAreaName;
var eventArray = [];
var artistNameArray = [];
var accessToken;
var spotifyUserID;
var spotifyRealName;
var artistIdArray = [];
var songsIdArray = [];
var playlistName;
var playlistID;
var playlistSongsIdArray = [];
var spotifyRedirDest = "http://boot.camp:8888/test.html";
var spotifyLink = 'https://accounts.spotify.com/authorize?client_id=8ecf5355cbd5468ca774341c25284642&response_type=token&redirect_uri=' + spotifyRedirDest + '&scope=playlist-modify-public';
// TODO: ^^^ this needs to be updated for production
//============================


// TODO: Need to build in the functionality for capturing the city/state from an input field
//============================
// IMMEDIATELY CAPTURE CITY/STATE FROM IP ADDRESS IN CASE WE NEED IT
function getIP(json) {
    console.log("getIP function triggered");
    console.log("json.city: " + json.city);
    console.log("json.region: " + json.region);
    zipCity = json.city; // set variables to use later
    zipState = json.region; // set variables to use later
    console.log("zipCity: " + zipCity);
    console.log("zipState: " + zipState);
} 
//============================

//============================
// IMMEDIATELY CAPTURE SPOTIFY ACCESS TOKEN FROM (1) HASH OR (2) LOCAL (IF IT EXISTS)
var hash = window.location.hash;
console.log("Full hash: " + hash);
hash = hash.slice(1); // remove first character (#)
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
if (result.access_token !== undefined) { // if there is an access_token value present in the hash
    console.log("grabbing access token from hash");
    accessToken = result.access_token; // set variable accessToken to the value from hash
    window.localStorage.setItem("spotifyToken",accessToken); // put the token in local storage
} else if (localStorage.getItem("spotifyToken") !== null) { // grab the token out of local storage if it's there
    console.log("grabbing access token from local storage");
    accessToken = localStorage.getItem("spotifyToken"); // and set accessToken to the stored token
} else {
    // leave everything well enough alone
    console.log("don't do anything with access tokens");
}
console.log("accessToken: " + accessToken);
//============================






//===////////////////////////////
window.onload = function () { // open onload
//===////////////////////////////

// //============================
// // ADD SPOTIFY LINK HREF TO DOM
// var spotifyLink = "https://accounts.spotify.com/authorize?client_id=8ecf5355cbd5468ca774341c25284642&response_type=token&redirect_uri=" + spotifyRedirDest + "&scope=playlist-modify-public";
// $("#spotifyLink").attr("href",spotifyLink);
// //============================

//============================
// UPDATE LOCALSTORAGE WITH IP CITY/STATE IF CURRENTLY BLANK
if (localStorage.getItem("city") === null) { // if the localstorage city value hasn't been set, then get that info from the IP address
    console.log("localStorage.city has not been set, setting with data from IP address");
    window.localStorage.setItem("city",zipCity); // set values to local storage
    window.localStorage.setItem("state",zipState); // set values to local storage
    // window.localStorage.setItem("city","Las Vegas"); // DELETE: manual override for testing
    // window.localStorage.setItem("state","NV"); // DELETE: manual override for testing
    console.log("city/state localStorage values set");
}
// TODO: should we override the city/state info with updated metro area that comes back from the songkick api?
//============================

//============================
// WRITE LOCALSTORAGE CITY/STATE TO THE SCREEN
console.log("city from local storage: " + localStorage.getItem("city"));
$("#city").text(localStorage.getItem("city"));
console.log("state from local storage: " + localStorage.getItem("state"));
$("#state").text(localStorage.getItem("state"));
//============================



// TODO: does the songkick trigger need to be within the window.onload?
//============================
// TRIGGER THE SONGKICK API CALLS FUNCTION
songkickAPI();
//============================



//============================
// TRIGGER THE SPOTIFY USERID API CALLS FUNCTION
// running this every time the page loads
spotifyUserAPI();
//============================


//===////////////////////////////
}; // close onload
//===////////////////////////////



// TODO: need functionality for user to input city name and then it gets pushed to local storage to use in api calls











