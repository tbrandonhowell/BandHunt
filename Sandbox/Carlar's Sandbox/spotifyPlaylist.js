console.log("spotifyPlaylist.js is loaded");

$(document).on("click", "#createPlaylistBTN", function() { 
    console.log("Create playlist button was clicked");
    playlistName = $("#inputPlaylistName").val().trim();
    console.log("playlistName: " + playlistName);

    // TODO: need some validation so empty playlist names don't get passed

    // TODO: should we ever try to reload the user's last spotify playlist if they come back to the page?

    // need to jump into the API to create playlist

    //============================
    // CREATE THE PLAYLIST FIRST
    $.ajax({
        headers: {'Authorization': 'Bearer ' + accessToken}, // standard access token
        method: "POST",
        contentType: 'application/json',
        url: 'https://api.spotify.com/v1/users/' + spotifyUserID + '/playlists', // using the user ID
        data: JSON.stringify({name:playlistName, public:'true'}), // JSON string for the input here
        async: false
    }).then(function(response) { // what to do when the API returns data. in this case we're putting the api response into this function
        console.log('playlist creation response came back!!!');
        console.log(response);
        playlistID = response.id;
        console.log("playlistID: " + playlistID);
    //============================
    // GET ARTIST ID BASED ON NAME SEARCH
    }).then(function() {
        console.log("artistNameArray.length: " + artistNameArray.length);
        for (n=0;n<artistNameArray.length;n++) {
            var tempArtistID;
            $.ajax({ // the request to the API
                url: 'https://api.spotify.com/v1/search?q="' + artistNameArray[n] + '"&type=artist', // where the data is
                method: 'GET',
                headers: {'Authorization': 'Bearer ' + accessToken},
                async: false
            }).then(function(response) { // what to do when the API returns data. in this case we're putting the api response into this function
                console.log('artist ID response came back!!!');
                if(response.artists.items[0].id) {
                    console.log(response.artists.items[0].id);
                    artistIdArray.push(response.artists.items[0].id);
                };
            });
        }
    //============================
    // GET ARTIST 'TOP TRACK' ID BASED ON ARTIST ID  
    }).then(function() {
        console.log("something");
        console.log(artistIdArray);
        console.log("placeholder: get top tracks array");
        console.log("artistIdArray.length: " + artistIdArray.length);
        for (z=0;z<artistIdArray.length;z++) {
            $.ajax({ // the request to the API
                url: 'https://api.spotify.com/v1/artists/' + artistIdArray[z] + '/top-tracks?country=US', // where the data is
                method: 'GET',
                headers: {'Authorization': 'Bearer ' + accessToken},
                async: false
            }).then(function(response) { // what to do when the API returns data. in this case we're putting the api response into this function
                console.log('song ID response came back!!!');
                console.log(response.tracks[0].id);
                songsIdArray.push(response.tracks[0].id);
                playlistSongsIdArray.push("spotify:track:" + response.tracks[0].id) // build out the format needed for the api call to push songs into playlist
            });
        }
    //============================
    // LOAD TOP TRACKS INTO OUR NEW PLAYLIST   
    }).then(function() {
        console.log("placeholder: add tracks to playlist");
        $.ajax({
            async: false,
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
    }).then(function() {
        console.log("placeholder: embed playlist on the page");
        var playerFrame = '<iframe src="https://open.spotify.com/embed/user/' + spotifyUserID + '/playlist/' + playlistID + '" width="300" height="380" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe>'
        $("#rightSide").empty();
        $("#rightSide").append(playerFrame);
    });
    //============================

}); // close onClick monitoring