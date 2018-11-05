require("dotenv").config();
const keysFile = require("./keys");
const request = require("request");
const searchTerm = process.argv[3];
const command = process.argv[2];

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
    console.log("Spotifying: " + song);
}

function concertThis(concert) {
    console.log("Concerting: " + concert);
}

function movieThis(movie) {
    const url = `http://www.omdbapi.com/?i=${keysFile.omdb.id}&apikey=${keysFile.omdb.apiKey}&t=${movie}`;

    const backupURL = `http://www.omdbapi.com/?i=${keysFile.omdb.id}&apikey=${keysFile.omdb.apiKey}&t=Mr.Nobody`;

    if (movie === undefined) {
        console.log("Invalid movie search..Mr.Nobody is cool though");
        request(backupURL, function(error, response, body) {
            if (!error && response.statusCode === 200) {
                console.log(JSON.parse(body));
            }
        });

    } else { 
        console.log(`I'm movieing ${movie} :)`);
        request(url, function(error, response, body) {
            if (!error && response.statusCode === 200) {
            const movieInfo = JSON.parse(body);
            const mackWant = ["Title", "Year", "imdbRating", "Ratings", "Country", "Language", "Plot", "Actors"];
            console.log(typeof(movieInfo));
            Object.keys(movieInfo).forEach(element => {
                if (mackWant.includes(element)) {
                    if (element === "Ratings") {
                        // tiddies
                        let ratingsArray = movieInfo[element];
                        let RTRatings = ratingsArray
                            .find(ele => ele.Source === "Rotten Tomatoes").Value;
                        console.log(`Rotten Tomatoes: ${RTRatings}`);
                    }
                    else {console.log(`${element}: ${movieInfo[element]}`);}
                };
            });
                // console.log(movieInfo);
                // console.log(JSON.parse(body).Search[0].Title, JSON.parse(body).Search[1].Year);
            }
        });
    }
}