console.log("songkick.js is loaded");

var songkickAPI = function() {
    console.log("songkickAPI() called");
    //============================
    // ALL OUR SONGKICK API CALLS:
    //============================
    // GET METRO AREA BASED ON CITY
    var builtURL = 'https://api.songkick.com/api/3.0/search/locations.json?query=' + localStorage.getItem('city') + ' ' + localStorage.getItem('state') + '&apikey=A1gWVGMiT6nFuDTr';
    console.log("builtURL: " + builtURL);
    $.ajax({ // the request to the API
        url: builtURL, // where the data is
        method: 'GET'
    }).then(function(response) { // what to do when the API returns data. in this case we're putting the api response into this function
        console.log('location search response came back!!!');
        console.log(response);
        console.log("response.resultsPage.totalEntries: " + response.resultsPage.totalEntries);
        if (response.resultsPage.totalEntries === 0) { // if the town is not in songkick's database, do this:
            console.log("no match for this town");
            // update the table contents
            var newMessage = '<tr><td colspan="4">';
            newMessage = newMessage + '<h3>Did you spell that right?<h3>';
            newMessage = newMessage + '<h4>Unfortunately we weren\'t able find your town in the SongKick database. Try searching for the next largest town or city.</h4>';
            console.log(newMessage);
            $("#eventTable").empty();
            $("#eventTable").append(newMessage);
            metroArea = ""; // reset metro area
            return; // exit out of the function
        };
        metroArea = response.resultsPage.results.location[0].metroArea.id;
        console.log("metroArea: " + metroArea);
        metroAreaName = response.resultsPage.results.location[0].metroArea.displayName;
        console.log("songkick metroAreaName: " + metroAreaName);
    //============================
    // GET PERFORMANCES FROM THE METRO AREA
    }).then(function() {
        console.log("metroArea: " + metroArea);
        if (!metroArea) {
            console.log("metroArea is undefined, printing notification");
            return; // prevent the API call from happening if we don't have a metroArea with which to call the API
        }
        return $.ajax({ // the request to the API
            url: 'https://api.songkick.com/api/3.0/metro_areas/' + metroArea + '/calendar.json?apikey=A1gWVGMiT6nFuDTr', // where the data is
            method: 'GET'
        }).then(function(response) { // what to do when the API returns data. in this case we're putting the api response into this function        
            $("#eventTable").empty(); // blow out the events table
            // check to see if there are actually events for this area. if not, display a message
            console.log("repsonse.resultsPage.results.event:");
            console.log(response.resultsPage.results.event);
            if (!response.resultsPage.results.event) {
                console.log("no events for this metro area");
                // update the table contents
                var newMessage = '<tr><td colspan="4">';
                newMessage = newMessage + '<h3>Not much happening in your neck of the woods?<h3>';
                newMessage = newMessage + '<h4>Unfortunately we weren\'t able to find any shows in your area. Try searching for the next largest town or city.</h4>';
                console.log(newMessage);
                $("#eventTable").append(newMessage);
                return; // exit out of the function
            };
            // if there are events, start building out the table
            var newFirstRow = '<tbody id="eventTbody"><tr><th>Band</th><th>Venue</th><th>Date</th><th>Vote</th></tr>'; 
            $("#eventTable").append(newFirstRow); // replace first row in events table
            console.log('metro performances response came back!!!');
            console.log(response);
            eventArray = response.resultsPage.results.event;
            console.log("eventArray:");
            console.log(eventArray);
            artistNameArray = []; // reset the artistNameArray
            for (i=0;i<eventArray.length;i++) { // loop through the events array
                for (x=0;x<eventArray[i].performance.length;x++) {// within each event, loop through the artists array and print out a row for each artist
                    // convert the date
                    var cleanDate = moment(eventArray[i].start.date, "YYYY-MM-DD");
                    console.log("Is this event in the past? : " + moment(cleanDate).isBefore(moment(), 'day'));
                    // need some logic here - only create the new row if the event date is in the future
                    // this is needed b/c sometimes songkick API returns have random old dates in them
                    if ( moment(cleanDate).isBefore(moment(), 'day') === false ) { // if the date is not in the past, then add to the table
                        cleanDate = moment(cleanDate).format("MMM D"); // strip out year from date printout
                        // create the new row
                        var insertRow = '<tr>';
                        // var insertRow = insertRow + '<td><img src="https://images.sk-static.com/images/media/profile_images/artists/' + eventArray[i].performance[x].artist.id + '/avatar" width="50" height="50" class="img-thumbnail"></td>'; // image would go here
                        var insertRow = insertRow + '<td><a href="' + eventArray[i].uri + '">' + eventArray[i].performance[x].artist.displayName + '</a></td>';
                        var insertRow = insertRow + '<td><a href="' + eventArray[i].venue.uri + '">' + eventArray[i].venue.displayName + '</a></td>';
                        var insertRow = insertRow + '<td>' + cleanDate + '</td>';
                        // var insertRow = insertRow + '<td><a href="#">Favorite Link</a></td>';
                        // ^^ my original row
                        // Paul's row:
                        var thisBandID = eventArray[i].performance[x].artist.id;
                        insertRow = insertRow + "<td>";
                        insertRow = insertRow + "<img src='assets/images/Thumbs_up_font_awesome.png' ";
                        insertRow = insertRow + "class='upVote' ";
                        insertRow = insertRow + "onClick=upVote(" + thisBandID + ") ";
                        insertRow = insertRow + "data-bandID=" + thisBandID + ">";
                        insertRow = insertRow + "<div class='voteCounts' id='up" + thisBandID + "'>";
                        insertRow = insertRow + getBandUpVotes(thisBandID);
                        insertRow = insertRow + "</div>";
                        insertRow = insertRow + "<br />";
                        insertRow = insertRow + "<img src='assets/images/Thumbs_down_font_awesome.png' ";
                        insertRow = insertRow + "class='downVote' ";
                        insertRow = insertRow + "onClick=downVote(" + thisBandID + ") ";
                        insertRow = insertRow + "data-bandID=" + thisBandID + ">";
                        insertRow = insertRow + "<div class='voteCounts' id='down" + thisBandID + "'>";
                        insertRow = insertRow + getBandDownVotes(thisBandID);
                        insertRow = insertRow + "</div>";
                        insertRow = insertRow + "</td>";
                        // end paul's row
                        var insertRow = insertRow + '</tr>';
                        $("#eventTable").append(insertRow);
                        artistNameArray.push(eventArray[i].performance[x].artist.displayName); // add the artist name to artistNameArray[] that we'll use to query spotify
                    } // close the "if" check for past date
                } // close FOR loop
            } // close FOR loop
            $("eventTable").append("</tbody>"); // close the tbody so the CSS height still works
            //============================
            // DYNAMICALLY SET THE HEIGHT OF THE EVENT TABLE
            console.log("contentDiv height should be: " + ($(window).height() - $('#headerDiv').height()));
            var tableHeightObject = $('#contentDiv').height( ($(window).height() - $('#headerDiv').height()) );
            console.log("tableHeight object:");
            console.log(tableHeightObject);
            var tableHeight = tableHeightObject[0].clientHeight - 20;
            console.log(tableHeight);
            document.getElementById('eventTbody').setAttribute("style","height:" + tableHeight + "px; overflow-y: scroll;");
            // ^^^ add the styling for height here since we're overwriting the tbody styles in this function
            console.log("artistNameArray:");
            console.log(artistNameArray);
        }).then(function() { // trigger playlist creation if we're coming back from spotify
            console.log("this should trigger after all songkick processing happens")
        });
    }) // close then
}; // close songkick()


// The only time we'd want the spotify playlist to be created is if we're coming back from a trip to the spotify authentication, or if the user manually requested it to happen.