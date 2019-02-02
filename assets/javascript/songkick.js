console.log("songkick.js is loaded");

var songkickAPI = function() {
    console.log("songkickAPI() called");
    //============================
    // ALL OUR SONGKICK API CALLS:
    //============================
    // GET METRO AREA BASED ON CITY
    // TODO: need to delete any entries in the songkick table before writing more (in case the city is update by user and we need to rebuild the table on the fly)
    // TODO: we need to be writing the songkick metro area to local storage
    var builtURL = 'https://api.songkick.com/api/3.0/search/locations.json?query=' + localStorage.getItem('city') + ' ' + localStorage.getItem('state') + '&apikey=A1gWVGMiT6nFuDTr';
    console.log("builtURL: " + builtURL);
    $.ajax({ // the request to the API
        url: builtURL, // where the data is
        method: 'GET'
    }).then(function(response) { // what to do when the API returns data. in this case we're putting the api response into this function
        console.log('location search response came back!!!');
        console.log(response);
        metroArea = response.resultsPage.results.location[0].metroArea.id;
        console.log("metroArea: " + metroArea);
        metroAreaName = response.resultsPage.results.location[0].metroArea.displayName;
        console.log("songkick metroAreaName: " + metroAreaName);
        // TODO: display songkick metroArea on the screen
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
            console.log("eventArray:");
            console.log(eventArray);
            for (i=0;i<eventArray.length;i++) { // loop through the events array
                for (x=0;x<eventArray[i].performance.length;x++) {// within each event, loop through the artists array and print out a row for each artist
                    var insertRow = '<tr>';
                    // var insertRow = insertRow + '<td><img src="https://images.sk-static.com/images/media/profile_images/artists/' + eventArray[i].performance[x].artist.id + '/avatar" width="50" height="50" class="img-thumbnail"></td>'; // image would go here
                    var insertRow = insertRow + '<td><a href="' + eventArray[i].uri + '">' + eventArray[i].performance[x].artist.displayName + '</a></td>';
                    var insertRow = insertRow + '<td><a href="' + eventArray[i].venue.uri + '">' + eventArray[i].venue.displayName + '</a></td>';
                    var insertRow = insertRow + '<td>' + eventArray[i].start.date + '</td>';
                    // TODO: ^^^ Need to strip the year out of this
                    // var insertRow = insertRow + '<td>' + eventArray[i].start.time + '</td>';
                    var insertRow = insertRow + '<td><a href="#">Favorite Link</a></td>';
                    var insertRow = insertRow + '</tr>';
                    $("#eventTable").append(insertRow);
                    artistNameArray.push(eventArray[i].performance[x].artist.displayName); // add the artist name to artistNameArray[] that we'll use to query spotify
                } // close FOR loop
            } // close FOR loop
            console.log("artistNameArray:");
            console.log(artistNameArray);
        }).then(function() { // trigger playlist creation if we're coming back from spotify
            console.log("this should trigger after all songkick processing happens")
            
        });
    }) // close then
}; // close songkick()


// The only time we'd want the spotify playlist to be created is if we're coming back from a trip to the spotify authentication, or if the user manually requested it to happen.