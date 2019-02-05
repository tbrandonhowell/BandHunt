// Initialize Firebase database.
var config = {
    apiKey: "AIzaSyDaJV9iK9XcUpqsXqkP5Ed13zoygmiQoTg",
    authDomain: "bandhunt-2db3e.firebaseapp.com",
    databaseURL: "https://bandhunt-2db3e.firebaseio.com",
    projectId: "bandhunt-2db3e",
    storageBucket: "bandhunt-2db3e.appspot.com",
    messagingSenderId: "874353616121"
};
firebase.initializeApp(config);

// Create a variable reference to the database.
var database = firebase.database();
// Create a holder for an array representation of the database.
var dbArray = [];

// getBandUpVotes returns the number of up votes the band has as specified in
// the database, or 0 if the bandID does not exist yet in the database.
function getBandUpVotes (thisBand) {
    var bandUpVotes = 0;     // Value to be returned by the function.  
    var bandFound = false;   // Flag indicating whether band was found in the database.
    var i = 0;               // Loop counter.

    // Search through the array until the band is found or all elements have been searched.
    while (i < dbArray.length && ! bandFound) {
        // If the specified band ID was found in the array:
        if (dbArray[i].bandID === thisBand) {
            bandFound = true;
            // Set the return value to the count specified in the database.
            bandUpVotes = dbArray[i].upVotes;
        } else {
            i = i + 1;   // Increment loop counter.
        };
    };
    // Return database value or 0.
    return bandUpVotes;
};

// getBandDownVotes returns the number of down votes the band has as specified in 
// the database, or 0 if the bandID does not exist yet in the database.
function getBandDownVotes(thisBand) {
    var bandDownVotes = 0;     // Value to be returned by the function.
    var bandFound = false;     // Flag indicating whether band was found in the database. 
    var i = 0;                 // Loop counter.

    // Search through the array until the band is found or all elements have been searched.
    while (i < dbArray.length && ! bandFound) {
        // If the specified band ID was found in the array:
        if (dbArray[i].bandID === thisBand) {
            bandFound = true;
            // Set the return value to the count specified in the database
            bandDownVotes = dbArray[i].downVotes;
        } else {
            i = i + 1;    // Increment loop counter.
        };
    };
    // Return database value or 0.
    return bandDownVotes;
};

// snapshotToArray returns an array representation of the database snapshot.
function snapshotToArray(snapshot) {
    // Initialize variable to an empty array.
    var returnArr = [];    
    // Repeat for each child in the snapshot:
    snapshot.forEach(function (childSnapshot) {
        // Create a variable with the contents of the child database element
        var item = childSnapshot.val();
        // Record the database key value for the child
        item.key = childSnapshot.key;
        // Add the object to the array
        returnArr.push(item);
    });
    // Return the array object.
    return returnArr;
};

// The ref function executes when the page is first initiate the page and then
// again every time the database is updated.
database.ref().on("value", function (snapshot) {
    // Set the global array variable to a fresh version of the database snapshot.
    dbArray = snapshotToArray(snapshot);
    var thisBandID = 0;   // Initialize a local variable for the band ID.
    // Repeat for each element in the songkickArtistArray that is created when 
    // the original list is generated.
    for (var i = 0; i < songkickArtistArray.length; i++) {
        thisBandID = songkickArtistArray[i];
        // Update the display of the number of up votes for this band.
        $("#up" + thisBandID).text(getBandUpVotes(thisBandID));
        // Update the display of the number of down votes for this band.
        $("#down" + thisBandID).text(getBandDownVotes(thisBandID));
    }
});

// The upVote function executes when the user clicks on one of the upvote buttons.
function upVote (thisBandID) {
    console.log(thisBandID + " upvote captured");
    var bandFound = false;    // Flag indicating band was found in the database.
    var i = 0;                // Loop counter.
    var newUpVotes = 1;       // New number of upvotes for the band.
    var newDownVotes = 0;     // New number of down votes for the band.

    // Repeat until the band is found in the database, or all elements have been searched.
    while (i < dbArray.length && ! bandFound) {
        // If the band was found in the database:
        if (dbArray[i].bandID === thisBandID) {
            bandFound = true;
            // Increment the number of up votes for the band by 1.
            newUpVotes = dbArray[i].upVotes + 1;
            // Record the current number of down votes for the band.
            newDownVotes = dbArray[i].downVotes;
            // Update the child in the database for this band with the new
            // number of up votes and down votes.
            database.ref(dbArray[i].key).update({
                bandID: thisBandID,
                upVotes: newUpVotes,
                downVotes: newDownVotes
            });
        } else {
            i = i + 1;    // Increment loop counter.
        };
    };
    // If the band was not found in the database:
    if (bandFound === false) {
        // Create a new child in the database with the current band ID and
        // the initial values of 1 up vote and 0 down votes.
        database.ref().push({
            bandID: thisBandID,
            upVotes: 1,
            downVotes: 0
        });
    };
};

// The downVote function executes when the user clicks on one of the downVote buttons.
function downVote (thisBandID) {
    console.log(thisBandID + " downvote captured");
    var bandFound = false;    // Flag indicating band was found in the database.
    var i = 0;                // Loop counter.
    var newUpVotes = 0;       // New number of up votes for the band.
    var newDownVotes = 1;     // New number of down votes for the band.

    // Repeat until the band is found in the database, or all elements have been searched.
    while (i < dbArray.length && !bandFound) {
        // If the band was found in the database:
        if (dbArray[i].bandID === thisBandID) {
            bandFound = true;
            // Increment the number of down votes by 1.
            newDownVotes = dbArray[i].downVotes + 1;
            // Record the current number of up votes for the band.
            newUpVotes = dbArray[i].upVotes;
            // Update the child in the database for this band with the new
            // number of up votes and down votes.
            database.ref(dbArray[i].key).update({
                bandID: thisBandID,
                upVotes: newUpVotes,
                downVotes: newDownVotes
            });
        } else {
            i = i + 1;     // Increment loop counter.
        };
    };
    // If the band was not found in the database:
    if (bandFound === false) {
        // Create a new child in the database with the current band ID and
        // the inital value of 1 down vote and 0 up votes.
        database.ref().push({
            bandID: thisBandID,
            upVotes: 0,
            downVotes: 1
        });
    };
};
