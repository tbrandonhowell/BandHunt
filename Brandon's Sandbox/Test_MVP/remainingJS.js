// TODO: Need to push spotify info into local storage so the page will work without the accessToken in the URL


//===////////////////////////////
window.onload = function () { // open onload
    //===////////////////////////////
    

    
 
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
                async: false
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
            async: false
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
    }; // close onload
    //===////////////////////////////