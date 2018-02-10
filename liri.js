//Liri is node.js application that can read Twitter, Spotify, and OMDB.

// dotenv is a zero dependency module that loads environment variables 
//from a .env file into process.env.  A .env file is created in the root
//directory of the project and process.env has the keys and values defined
//in the .env file.
require("dotenv").config();



//Load exports from keys.js.  Holds the API keys.
var keys = require("./key.js");

//NPM module used to access Twitter API
var Twitter = require('twitter');

//NPM module used to read the random.txt file.
var fs = require('fs');

//NPM module used to access OMDB API
var request = require('request');

//NPM module used to access Spotify API
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);
var liriArgument = process.argv[2];

//-----------------------------------------------------------------------------------

switch(liriArgument) {
	case 'my-tweets': 
		myTweets(); 
		break;
	
	case 'spotify-this-song': 
	spotifyThisSong(); 
	break;
	
	case 'movie-this': 
	movieThis(); 
	break;

	case 'do-what-it-says':
	doWhatItSays();
	break;

}

//------------------------------------------------------------------------------------
// MY-TWEETS FUNCTION 
function myTweets() {
	var client = new Twitter(keys.twitter);
	var twitterUsername = process.argv[3];
	if(!twitterUsername){
		twitterUsername = "teresagatech";
	}

params = {screen_name: twitterUsername};

client.get('statuses/user_timeline', params, function(error, tweets, response){
	if(!error) {
		console.log("------------------------------------------------------------------------");
		console.log("My 20 MOST RECENT TWEETS");
		console.log("------------------------------------------------------------------------");
		for(var i = 0; i <tweets.length; i++) {
		
		var twittResults = 
		"\n@" + tweets[i].user.screen_name + "\n" +
		"\n" + "Created: " + tweets[i].created_at + "\n" +
		"\nTweet: " + tweets[i].text + "\n" + "-------------------------------------------------------------------------------"
		
		console.log(twittResults);
	}

	} 
	else {
		console.log("Error occured"); 
		console.log("");
		return;
	}

});

}

//-----------------------------------------------------------------------------------
// SPOTIFY FUNCTION
function spotifyThisSong(songName) {
	var songName = process.argv[3];
	if(!songName) {
		songName = "The Sign";
	}

	params = songName;
	
	spotify.search({ type: 'track', query: params }, function(err, data) {
  if (err) {
        console.log('Error occured: ' + err); 
        return;
   } else {

    	var songInfo = data.tracks.items;
        //An array to hold the information
        var data = [];

    	for (var i = 0; i < 5; i++) {
    		data.push({
            "Artist ":  songInfo[i].artists[0].name,
            "Song: " : songInfo[i].name,
            "Preview Link: " : songInfo[i].preview_url,
            "Album the song is from: " : songInfo[i].album.name,
            });

        }
    }
        console.log(data);
    });
}


//----------------------------------------------------------------------------------
// MOVIE THIS FUNCTION 
function movieThis(movieName) {
		var movieName = process.argv[3];
	if (!movieName) {
		movieName = "Mr Nobody";

	}
//var queryUrl ="http://www.omdbapi.com/?t=" + movieName + "&apikey=ad9da69d";
var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&apikey=ad9da69d&plot=short&tomatoes=true&r=json";

request(queryUrl, function(error, response, body) {
	var data = [];
	var jsonData = JSON.parse(body);
	//push info into the data array
	data.push({
		'Title: ' : jsonData.Title,
		'Year: ' : jsonData.Year,
		'imdbRating: ' : jsonData.imdbRating,
		'Country: ' : jsonData.Country,
		'Language: ' : jsonData.Language,
		'Plot: ' : jsonData.Plot,
		'Actors: ' : jsonData.Actors,
		'Rotten Tomatoes Rating: ' : jsonData.tomatoRating
	});
	console.log(data);
}

)};


//----------------------------------------------------------------------------------

function doWhatItSays() {
	fs.readFile("random.txt", "utf8", function(error, data){
		if (error) {
			console.log("Error: Can't read random.txt file -- " + error);
			return;
		} else {

		//splits the data in the text into an array
		var newData = data.split(',');
		console.log(newData);

		spotifyThisSong(newData[1]);
		//console.log(newData[1]);
	};
}
)}
//Pseudo-code
//I couldn't figure how to get the data in the random text to do what the command told it to do
//new Data [1] is the name of the song in random text file; it brings up random artists and songs




