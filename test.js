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
    url: 'https://api.songkick.com/api/3.0/search/locations.json?query=' + zipCity + '&apikey=A1gWVGMiT6nFuDTr', // where the data is
    method: 'GET'
}).then(function(response) { // what to do when the API returns data. in this case we're putting the api response into this function
    console.log('location search response came back!!!');
    console.log(response);
    metroArea = response.resultsPage.results.location[0].metroArea.id;
    console.log("metroArea: " + metroArea);
//============================
// GET PERFORMANCES FROM THE METRO AREA
}).then(function() {
    return $.ajax({ // the request to the API
        url: 'https://api.songkick.com/api/3.0/metro_areas/17913/calendar.json?apikey=A1gWVGMiT6nFuDTr', // where the data is
        method: 'GET'
    }).then(function(response) { // what to do when the API returns data. in this case we're putting the api response into this function
        console.log('metro performances response came back!!!');
        console.log(response);
        eventArray = response.resultsPage.results.event;
        console.log(eventArray);
        for (i=0;i<eventArray.length;i++) { // loop through the events array
            for (x=0;x<eventArray[i].performance.length;x++) {// within each event, loop through the artists array and print out a row for each artist
                var insertRow = '<tr>';
                var insertRow = insertRow + '<td><a href="' + eventArray[i].uri + '">' + eventArray[i].performance[x].artist.displayName + '</a></td>';
                var insertRow = insertRow + '<td><a href="' + eventArray[i].venue.uri + '">' + eventArray[i].venue.displayName + '</a></td>';
                var insertRow = insertRow + '<td>' + eventArray[i].start.date + '</td>';
                var insertRow = insertRow + '<td><i onclick="myFunction(this)" class="fa fa-thumbs-up"></i></td>;'
                var insertRow = insertRow + '</tr>';
                $("#eventTable").append(insertRow);
                artistNameArray.push(eventArray[i].performance[x].artist.displayName); // add the artist name to artistNameArray[] that we'll use to query spotify
            } // close FOR loop
        } // close FOR loop
        console.log(artistNameArray);
    });
function myFunction(x) {
    x.classList.toggle("fa-thumbs-down");
    }
//============================
// IF accessToken IS NOT UNDEFINED, THEN WE NEED TO POLL SPOTIFY FOR THE USER NAME
}).then(function() {
    console.log("accessToken: " + accessToken);
    if (accessToken) {
        console.log("accessToken exists");
        return $.ajax({ // the request to the API
            url: 'https://api.spotify.com/v1/me', // where the data is
            method: 'GET',
            headers: {'Authorization': 'Bearer ' + accessToken}
        }).then(function(response) { // what to do when the API returns data. in this case we're putting the api response into this function
            console.log('user object response came back!!!');
            console.log(response);
            spotifyUserID = response.id; // set spotifyUserID variable
            console.log("spotifyUserID: " + spotifyUserID);
        });
    };
//============================
// IF accessToken IS NOT UNDEFINED, THEN WE NEED TO POLL SPOTIFY TO GET THE USER ID FOR EACH ARTIST
}).then(function() {
    console.log("placeholder: get artist IDs");
    console.log("artistNameArray.length: " + artistNameArray.length);
    for (n=0;n<artistNameArray.length;n++) {
        $.ajax({ // the request to the API
            url: 'https://api.spotify.com/v1/search?q="' + artistNameArray[n] + '"&type=artist', // where the data is
            method: 'GET',
            headers: {'Authorization': 'Bearer ' + accessToken},
            // async: false
        }).then(function(response) { // what to do when the API returns data. in this case we're putting the api response into this function
            console.log('artist ID response came back!!!');
            if(response.artists.items[0].id) {
                console.log(response.artists.items[0].id);
                artistIdArray.push(response.artists.items[0].id);
            };
        });
    }
//============================
// IF accessToken IS NOT UNDEFINED, THEN WE NEED TO POLL SPOTIFY FOR TOP TRACK FROM EACH ARTIST
}).then(function() {
    console.log(artistIdArray);
    console.log("placeholder: get top tracks array");
    console.log("artistIdArray.length: " + artistIdArray.length);
    for (z=0;z<artistIdArray.length;z++) {
        $.ajax({ // the request to the API
            url: 'https://api.spotify.com/v1/artists/' + artistIdArray[z] + '/top-tracks?country=US', // where the data is
            method: 'GET',
            headers: {'Authorization': 'Bearer ' + accessToken},
            // async: false
        }).then(function(response) { // what to do when the API returns data. in this case we're putting the api response into this function
            console.log('song ID response came back!!!');
            console.log(response.tracks[0].id);
            songsIdArray.push(response.tracks[0].id);
        });
    }
//============================
// IF accessToken IS NOT UNDEFINED, THEN WE CREATE THE PLAYLIST IN THE USER'S ACCOUNT
}).then(function() {
    console.log(songsIdArray);
    console.log("placeholder: create playlist");
    $.ajax({
        headers: {'Authorization': 'Bearer ' + accessToken}, // standard access token
        method: "POST",
        contentType: 'application/json',
        url: 'https://api.spotify.com/v1/users/' + spotifyUserID + '/playlists', // using the user ID
        data: JSON.stringify({name:'api playlist 3', public:'true'}), // JSON string for the input here
        // TODO: figure out naming convention for the playlists we create
        // async: false
    }).then(function(response) { // what to do when the API returns data. in this case we're putting the api response into this function
        console.log('playlist creation response came back!!!');
        console.log(response);
        playlistID = response.id;
        console.log(playlistID);
    });
    // TODO: should we check to see if the playlist exists first? like if the playlist name were were going to select already exists, then you skip the step of creating the playlist and go straight to adding tracks to it?
//============================
// IF accessToken IS NOT UNDEFINED, THEN WE ADD THE TRACKS TO THE PLAYLIST
}).then(function() {
    console.log("placeholder: add tracks to playlist");

    // the first thing we should do is add the "spotify:track:" to the beginning of each entry in the songsIdArray
    // then we can drop it in the stringify below
    for (y=0;y<songsIdArray.length;y++) {
        var pushVal = "spotify:track:" + songsIdArray[y];
        playlistSongsIdArray.push(pushVal);
    }
    console.log(playlistSongsIdArray);

    // then post the songs to the playlist
    $.ajax({
        // async: false,
        headers: {'Authorization': 'Bearer ' + accessToken}, // standard access token
        method: "POST",
        contentType: 'application/json',
        url: 'https://api.spotify.com/v1/playlists/' + playlistID + '/tracks', // using the "circuitspore" user
        data: JSON.stringify(
            {
                uris: playlistSongsIdArray
            }
            ), // JSON string for the input here
    }).then(function(response) { // what to do when the API returns data. in this case we're putting the api response into this function
    console.log('song insertion response came back!!!');
    console.log(response);
    });
//============================
// IF accessToken IS NOT UNDEFINED, THEN WE EMBED THE PLAYLIST ON THE PAGE
}).then(function() {
    console.log("placeholder: embed playlist on the page");

    var playerFrame = '<iframe src="https://open.spotify.com/embed/user/' + spotifyUserID + '/playlist/' + playlistID + '" width="300" height="380" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe>'

    $("#rightSide").empty();
    $("#rightSide").append(playerFrame);


    
//============================
// IF accessToken IS NOT UNDEFINED, 
}).then(function() {
    console.log("placeholder");
//============================
// IF accessToken IS NOT UNDEFINED, 
}).then(function() {
    console.log("placeholder");
})
;
//============================



//===////////////////////////////
// }); // close document ready
//===////////////////////////////

//===////////////////////////////
}; // close onload
//===////////////////////////////