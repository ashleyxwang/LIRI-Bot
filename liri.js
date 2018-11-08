require("dotenv").config();
const keysFile = require("./keys");
const fs = require("fs")
const request = require("request");
const moment = require("moment");
const CLIinput = process.argv;
const command = process.argv[2];
const searchTerm = CLIinput.slice(3).join(' ');
const spotify = require("node-spotify-api");

//make decision based on the command
switch (command) {
    case "concert-this":
        if (!searchTerm) {
            console.log("Invalid artist name, try again!")
    } else {concertThis(searchTerm)}
        break;
    case "spotify-this-song":
        if (!searchTerm) {
            spotifyThisSong("The Sign Ace of Base")
        } else {spotifyThisSong(searchTerm)}
        break;
    case "movie-this":
        movieThis(searchTerm);
        break;
    case "do-what-it-says":
        doWhatItSays();
        break;
    default:
        console.log("No Comprende :/ Ask le Foogle Bot");
        break;
}

//event find by artist; show: name of venue, location, and date(MM/DD/YYYY)
function concertThis(artist) {
    const bandsURL = "https://rest.bandsintown.com/artists/" + artist + `/events?app_id=${keysFile.band}`;

    request(bandsURL, function(err, response, body) {
        const allInfo = JSON.parse(body);
        console.log("Upcoming " + artist + " concerts--");
        if (allInfo.length < 1) {
            console.log("This artist has no upcoming concerts.");
        } else if (!err && response.statusCode === 200){
            for (let i = 0; i < 5; i++) {
                const eventVenue = allInfo[i].venue;
                const state = eventVenue.region;
                const eventDate = moment(allInfo[0].datetime).format("MM/DD/YYYY h:mm a" );
                //formatted concert search response
                if (!state) {
                    console.log(`This concert is at the ${eventVenue.name} in ${eventVenue.city}, ${eventVenue.country} at ${eventDate}
                    `);
                } else {
                    console.log(`This concert is at the ${eventVenue.name} in ${eventVenue.city}, ${state}, ${eventVenue.country} at ${eventDate}
                    `);
                }
            }
        }
    });
}

function spotifyThisSong(song) {
    const spotifyInfo = new spotify(keysFile.spotify);

    spotifyInfo.search({
        type: "track",
        query: song,
        limit: 5,
    }, function(err, response) {
        console.log("Spotifying: " + song);

        for (let i = 0; i < response.tracks.items.length; i++) {
            const ogPath = response.tracks.items[i];    
            const songName = ogPath.name;
            const artist = ogPath.artists[0].name;
            const album = ogPath.album.name;
            const previewURL = ogPath.preview_url;
            if (!searchTerm) {
                console.log("Your search term was invalid so we took the sign and are showing you The Sign--");

                response.tracks.items.length = 1;

                console.log(`
                The song ${songName} in the album ${album} by ${artist} can previewed here: 
                ${previewURL}`);

            } else if (!err) {
                console.log(`
                ------------------------------------
                The song ${songName} in the album ${album} by ${artist} can previewed here: 
                ${previewURL}`);
            }
        }
    });
}

function movieThis(movie) {
    const url = `http://www.omdbapi.com/?i=${keysFile.omdb.id}&apikey=${keysFile.omdb.apiKey}&t=${movie}`;

    const backupURL = `http://www.omdbapi.com/?i=${keysFile.omdb.id}&apikey=${keysFile.omdb.apiKey}&t=Mr.Nobody`;

    if (movie === undefined) {
        console.log("Invalid movie search..Mr.Nobody is cool though");
        request(backupURL, function(error, response, body) {
            if (!error && response.statusCode === 200) {
                const omdbMrNobody = JSON.parse(body);
                getMovieInfo(omdbMrNobody);
            }
        });

    } else { 
        console.log(`I'm movieing ${movie} :)`);
        request(url, function(error, response, body) {
            if (!error && response.statusCode === 200) {
            const omdbInfo = JSON.parse(body);
            getMovieInfo(omdbInfo);
            }
        });
    }
}

function getMovieInfo(omdbInfo) {
    const liriMovieOutputs = ["Title", "Year", "imdbRating", "Ratings", "Country", "Language", "Plot", "Actors"];
    Object.keys(omdbInfo).forEach(objectKey => {
        if (liriMovieOutputs.includes(objectKey)) {
            if (objectKey === "Ratings") {
                let ratingsArray = omdbInfo[objectKey];
                let RTRatings = ratingsArray.find(ele => ele.Source === "Rotten Tomatoes").Value;
                console.log(`Rotten Tomatoes: ${RTRatings}`);
            }
            else {
                console.log(`${objectKey}: ${omdbInfo[objectKey]}`);
            }
        }
    });
}

function doWhatItSays () {
    const textCommand = fs.readFileSync("./random.txt", "utf8")
        console.log(textCommand);
    
}