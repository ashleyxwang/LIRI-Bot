console.log("this is loaded");

exports.spotify = {
    id: process.env.SPOTIFY_ID,
    secret: process.env.SPOTIFY_SECRET
};

exports.omdb = {
    id: process.env.OMDB_API_ID,
    apiKey: process.env.OMDB_API_KEY
};
