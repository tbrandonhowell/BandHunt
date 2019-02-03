console.log("spotifyUser.js is loaded");

var spotifyUserAPI = function(){


//============================
// IF WE HAVE THE SPOTIFY ACCESS TOKEN, THEN QUERY THE API FOR SPOTIFY USERNAME
// also write the 'click to create playlist' or 'click to connect spotify' verbiage based on whether or not we have an accessToken stored
if (accessToken) {
    console.log("accessToken exists");
    return $.ajax({ // the request to the API
        url: 'https://api.spotify.com/v1/me', // where the data is
        method: 'GET',
        headers: {'Authorization': 'Bearer ' + accessToken},
        success: function(response) {
            console.log('user object response came back!!!');
            console.log(response);
            spotifyUserID = response.id; // set spotifyUserID variable
            console.log("spotifyUserID: " + spotifyUserID);
            window.localStorage.setItem("spotifyUserID",spotifyUserID); // put the token in local storage
            console.log("local storage value for spotifyUserID should be set")
            spotifyRealName = response.display_name; // set spotifyRealName variable
            console.log("spotifyRealName: " + spotifyRealName);
            window.localStorage.setItem("spotifyRealName",spotifyRealName);
            console.log("local storage value for spotifyRealName should be set");
            $("#spotifyUserID").text(spotifyUserID); // write the spotify user info to the screen
            $("#spotifyRealName").text(spotifyRealName); // write the spotify user info to the screen
            console.log("songkick api call metroAreaName value: " + metroAreaName);
            var updateRightSide = '<h3>Spotify is connected!</h3><h4>Enter a name for your playlist and hit "Create" to add a playlist of upcoming bands to your Spotify account!</h4><form id="playlistForm"><input class="form-control" type="text" placeholder="Input Playlist Name" id="inputPlaylistName"><button class="btn btn-primary btn-success" id="createPlaylistBTN">Create</button></form>';
            $("#rightSide").empty(); // clear the 'rightSide' div and 
            $("#rightSide").html(updateRightSide); // paint new message requesting playlist creation
        },
        error: function(xhr) { // we're going to assume we're getting an error b/c the access token has expired
            console.log("error triggered on spotify API userID call");
            console.log(xhr.status);
            // console.log(thrownError);
            window.location.replace(spotifyLink); 
            // ^^^ grab the spotifyLink that has already been set and push the user to that page to renew their access token
        }
    });
} else { // print the "click to connect your account" link
    var updateRightSide = '<h3>Are you a Spotify user? <a href="' + spotifyLink + '" id="spotifyLink">Click here</a> connect your Spotify account and build out playlists of bands coming to your town!</h3>';
    $("#rightSide").empty(); // clear the 'rightSide' div and 
    $("#rightSide").html(updateRightSide); // paint new message requesting playlist creation
};
//============================



}; // close spotifyUserAPI()