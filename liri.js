require("dotenv").config();

var axios = require("axios");
var keys = require("./keys.js");
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);
var moment = require('moment');
var fs = require("fs");


var userCommand = process.argv[2];
var userSearch = process.argv.slice(3).join(" ");

function appCommands(userCommand, userSearch) {

    if (userCommand === "concert-this") {
        concert();
    } else if (userCommand === "movie-this") {
        movie();
    } else if (userCommand === "spotify-this-song") {
        spotifySong();
    } else if (userCommand === "do-what-it-says") {
        doIt(userSearch);
    } else {
        console.log("That is an invalid command. Try one of these commands instead: concert-this, movie-this, spotify-this-song, or do-what-it-says")
    }
}

appCommands(userCommand, userSearch);

function concert() {

    var queryUrl = "https://rest.bandsintown.com/artists/" + userSearch + "/events?app_id=codingbootcamp";

    axios
        .get(queryUrl)
        .then(function (response) {
            console.log("Here are the concert details for " + userSearch + "!\n")

            for (let i = 0; i < response.data.length; i++) {
                var venueName = response.data[i].venue.name;
                var venueLocation = response.data[i].venue.country;
                var date = moment(response.data[i].datetime).format("MM-DD-YYYY");

                console.log("-------------------------------------")
                console.log(venueName);
                console.log(venueLocation);
                console.log(date);
                console.log("-------------------------------------\n")
            }
        })
        .catch(function (error) {
            throw error;
        });
}

function movie() {
    if (!userSearch) {userSearch = "mr nobody";};
    
    var queryUrl = "http://www.omdbapi.com/?t=" + userSearch + "&y=&plot=short&apikey=trilogy";

    axios
        .get(queryUrl)
        .then(function (response) {
            console.log("-------------------------------------")
            console.log("Here are some details about the movie you chose!\n")
            console.log("Title: " + response.data.Title);
            console.log("Year of Release: " + response.data.Year);
            console.log("IMDB Score: " + response.data.imdbRating);
            console.log("Rotten Tomatoes Score: " + response.data.Ratings[1].Value);
            console.log("Country: " + response.data.Country);
            console.log("Language: " + response.data.Language);
            console.log("Synopsis: " + response.data.Plot);
            console.log("Actors: " + response.data.Actors);
            console.log("-------------------------------------\n")
        });

}
function spotifySong() {

    spotify.search({ type: 'track', query: userSearch, limit: 1 }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }
        console.log("-------------------------------------")
        console.log("Here are details for the song " + userSearch + "!\n")
        console.log("Artist: " + data.tracks.items[0].album.artists[0].name);
        console.log("Song Title: " + userSearch);
        console.log("Link to Song: " + data.tracks.items[0].album.external_urls.spotify);
        console.log("Album: " + data.tracks.items[0].album.name);
        console.log("-------------------------------------\n")

    });
}

function doIt() {

    fs.readFile("random.txt", "utf8", function (error, data) {
        if (error) {console.log(error);}
        
        var dataArr = data.split(",");

        userCommand = dataArr[0];
        userSearch = dataArr[1];

        appCommands(userCommand, userSearch);
    });
};



