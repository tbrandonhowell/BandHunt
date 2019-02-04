console.log("base.js is loaded");

// TODO: Need to update my ajax calls to get rid of "then" and use "complete" or whatever Tim told me about (see notes)

//============================
// INITIALIZE VARIABLES
var zipCity; // may be deprecated due to use of local storage
var zipState; // may be deprecated due to use of local storage
var metroArea;
var metroAreaName;
var eventArray = [];
var songkickArtistArray = [];
var artistNameArray = [];
var accessToken;
var spotifyUserID;
var spotifyRealName;
var artistIdArray = [];
var songsIdArray = [];
var playlistName;
var playlistID;
var playlistSongsIdArray = [];
var maxTracks; // max # tracks allowed in a playlist
var spotifyRedirDest = window.location.href;
console.log("spotifyRedirDest: " + spotifyRedirDest);
var spotifyLink = 'https://accounts.spotify.com/authorize?client_id=8ecf5355cbd5468ca774341c25284642&response_type=token&redirect_uri=' + spotifyRedirDest + '&scope=playlist-modify-public';
//============================


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



var rightSideHeightObject = $('#contentDiv').height( ($(window).height() - $('#headerDiv').height()) + "px" );
console.log(rightSideHeightObject);
var spotifyHeight = rightSideHeightObject[0].clientHeight - 20;
console.log("spotifyHeight: " + spotifyHeight);
var rightSideWidthObject = $('#rightSide').width();
console.log(rightSideWidthObject);
var spotifyWidth = rightSideWidthObject - 2;
console.log("spotifyWidth: " + spotifyWidth);



//============================
// CAPTURE THE SIZE OF THE 'rightSide' DIV
console.log("rightSide div width: " + $("#rightSide").width());
console.log("rightSide div height: " + $("#rightSide").height());
// CAPTURE THE SIZE OF THE 'leftSide' DIV
console.log("leftSide div width: " + $("#leftSide").width());
console.log("leftSide div height: " + $("#leftSide").height());
// https://stackoverflow.com/questions/2435377/how-to-make-last-div-stretch-to-fill-screen
// ^^ picked up up this div size hack from here
$(window).resize(function(){
    console.log("contentDiv height should be: " + ($(window).height() - $('#headerDiv').height()));
    var tableHeightObject = $('#contentDiv').height( ($(window).height() - $('#headerDiv').height()) + "px" );
    var tableHeight = tableHeightObject[0].clientHeight - 20;
    console.log("resized tableHeight: " + tableHeight);
    document.getElementById('eventTbody').setAttribute("style","height:" + tableHeight + "px; overflow-y: scroll;");
// ^^^ add the styling for height here since we're overwriting the tbody styles in this function
});
//============================


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
//============================


//============================
// WRITE LOCALSTORAGE CITY/STATE TO THE SCREEN
console.log("city from local storage: " + localStorage.getItem("city"));
if (localStorage.getItem("city") !== "undefined") {
    $("#city").attr("value",localStorage.getItem("city"));
}
console.log("state from local storage: " + localStorage.getItem("state"));
// $("#state").attr("value",localStorage.getItem("state"));
$("#state").val(localStorage.getItem("state"));
// $("#element-id").val('the value of the option');
//============================


//=============================
// CAPTURE THE CLICK ON CITY/STATE SUBMIT
$("#submit").on("click", function(event) {
    console.log("click captured"); 
    event.preventDefault(); // prevent form from trying to submit/refresh the page  
    // make sure the city name wasn't empty
    if ($("#city").val().trim() == "") { // if the city field is empty
        console.log("empty city name")
        $("#city").attr("style","border: 3px solid red;"); // make the outline red
    } else { // otherwise if the city field has an input
        $("#city").attr("style",""); // reset the form field outline in case they previously submitted an empty city
        var newCity = $("#city").val().trim(); // get the city input
        console.log("newCity: " + newCity);
        var newState = $("#state").val().trim(); // get the state input
        console.log("newState: " + newState);
        window.localStorage.setItem("city",newCity); // set values to local storage
        window.localStorage.setItem("state",newState); // set values to local storage
        console.log("city/state localStorage values set");
        if (accessToken) { // if the accessToken exists
            // ^^ update the right div to have the "create a playlist" message
            var updateRightSide = '<h3>Spotify is connected!</h3><h4>Enter a name for your playlist and hit "Create" to add a playlist of upcoming bands to your Spotify account!</h4><form id="playlistForm"><input class="form-control" type="text" placeholder="Input Playlist Name" id="inputPlaylistName"><button class="btn btn-primary btn-success" id="createPlaylistBTN">Create</button></form>';
            $("#rightSide").empty(); // clear the 'rightSide' div and 
            $("#rightSide").html(updateRightSide); // paint new message requesting playlist creation
        };
        songkickAPI();
    }
});
//=============================


// TODO: does the songkick trigger need to be within the window.onload?
//============================
// TRIGGER THE SONGKICK API CALLS FUNCTION ON LOAD
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








