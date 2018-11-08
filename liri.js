require("dotenv").config();
const keysFile = require("./keys");
const request = require("request");
const CLIinput = process.argv;
const command = process.argv[2];
const searchTerm = CLIinput.slice(3).join(' ');
const spotify = require("node-spotify-api");

//make decision based on the command
switch (command) {
    case "concert-this":
        concertThis(searchTerm);
        break;
    case "spotify-this-song":
        spotifyThisSong(searchTerm);
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

function spotifyThisSong(song) {
    const spotifyInfo = new spotify(keysFile.spotify);

    spotifyInfo.search({
        type: "track",
        query: song,
        limit: 1

    }, function(err, response) {
        if (err) {
            console.log(":( "+ err);
        } else if (!err) {
            console.log("Spotifying: " + song);
            console.log("-------------------");       
            getSpotifyInfo(response);
        }
    });
}

function getSpotifyInfo(data) {
    const ogPath = data.tracks.items[0];    
    const songName = ogPath.name;
    const artist = ogPath.artists[0].name;
    const album = ogPath.album.name;
    const previewURL = ogPath.preview_url;
    console.log(`The song ${songName} in the album ${album} by ${artist} can previewed here: 
    ${previewURL}`);
}
//     get Artist(s), Song Name, Album, Preview Link
//     no song: "The Sign" by Ace of Base
// }

function concertThis(concert) {
    console.log("Concerting: " + concert);
    const bandsURL = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp"
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
