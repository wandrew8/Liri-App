require("dotenv").config();

var axios = require("axios");
var keys = require("./keys.js");
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);
var moment = require('moment');
var fs = require("fs");


var userCommand = process.argv[2];
var userSearch = process.argv.slice(3).join(" ");

if (userCommand === "concert-this") {
    concert();
} else if (userCommand === "movie-this") {
    movie();
} else if (userCommand === "spotify-this-song") {
    spotifySong();
} else if (userCommand === "do-what-it-says") {
    userSearch = 
    doIt();
}   else {
    console.log("That is an invalid command. Try one of these commands instead: concert-this, movie-this, spotify-this-song, or do-what-it-says")
}


function concert() {

    var queryUrl = "https://rest.bandsintown.com/artists/" + userSearch + "/events?app_id=codingbootcamp";
    
    axios
    .get(queryUrl)
    .then(function(response) {
        console.log("Here are the concert details for " + userSearch + "!")
        
        for (let i=0; i<response.data.length; i++) {
            var venueName = response.data[i].venue.name;
            var venueLocation = response.data[i].venue.country;
            var date = moment(response.data[i].datetime).format("MM-DD-YYYY");
            

            console.log(`- ${venueName} ${venueLocation} ${date}`);
        }
    })
    .catch(function(error) {
        throw error;          
    });
}

function movie() {
    var queryUrl = "http://www.omdbapi.com/?t=" + userSearch + "&y=&plot=short&apikey=trilogy";

    axios
    .get(queryUrl)
    .then(function(response) {
        if (userSearch === "") {
            userSearch = "mr nobody"
        } 
            console.log("Here are some details about the movie you chose!")
            console.log("Title: " + response.data.Title);
            console.log("Year of Release: " + response.data.Year);
            console.log("IMDB Score: " + response.data.imdbRating);
            console.log("Rotten Tomatoes Score: " + response.data.Ratings[1].Value);
            console.log("Country: " + response.data.Country);
            console.log("Language: " + response.data.Language);
            console.log("Synopsis: " + response.data.Plot);
            console.log("Actors: " + response.data.Actors);
        
    });

}

function spotifySong() {
      
      spotify.search({ type: 'track', query: userSearch, limit: 1}, function(err, data) {
        if (err) {
          return console.log('Error occurred: ' + err);
        }
        console.log("Here are details for the song " + userSearch + "!")
      console.log("Artist: " + data.tracks.items[0].album.artists[0].name); 
      console.log("Song Title: " + userSearch);
      console.log("Link to Song: " + data.tracks.items[0].album.external_urls.spotify);
      console.log("Album: " + data.tracks.items[0].album.name); 
      });
}

function doIt() {
    fs.readFile("random.txt", "utf8", function(err, data) {

        if (err) {
          console.log(err);
        }
      
        else {
            var dataArr = data.split(",");

            if (dataArr[0] === "concert-this") {
                console.log("This is working")
                // concert();
            } else if (dataArr[0] === "movie-this") {
                console.log("This is working")
                // movie();
            } else if (dataArr[0] === "spotify-this-song") {
                console.log("This is working")
                // spotifySong();
            } else if (dataArr[0] === "do-what-it-says") {
                console.log("This is working")
                // doIt();
            }   else {
                console.log("Hmm...let's add another command to the list")
            }
      
        }
    })
}
