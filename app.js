require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:

const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

hbs.registerHelper('ifEquals', function (arg1, arg2, options) {
    return (arg1 == arg2) ? options.fn(this) : options.inverse(this);   // ternary operator as return ? -> :
                                                                        //Handlebars always invokes helpers with the current context as this, so you can invoke the block with this to evaluate the block in the current context.
});                                                                     //which means that there is more markup or template syntax between the {{#each}} and {{/each}} tags. When you use this syntax, Handlebars passes an options parameter to your helper as the last argument. 
                                                                        // https://devdocs.io/handlebars/

// setting the spotify-api goes here:

const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });
  
  // Retrieve an access token

  spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));

// Our routes go here:

app.get("/", (req, res) => {
    res.render("home");
});


app.get("/artist-search", (req, res) => {
    spotifyApi
        .searchArtists(req.query.artistSearch)
        .then(data => {
            const artistsArr = data.body.artists.items;
            res.render("artist-search-results", { artistsArr }) // ES6 deconstructed
        })
        .catch(error => console.log('Error while searching artists: ', error));
});


app.get("/albums/:artistId", (req, res) => {
    spotifyApi
        .getArtistAlbums(req.params.artistId)
        .then(data => {
            const albumsArr = data.body.items;
            res.render("albums", { albumsArr }) // ES6 deconstructed
        })
        .catch(error => console.log('Error while searching artists albums: ', error))
})


app.get("/tracks/:trackId", (req, res) => {
    spotifyApi
        .getAlbumTracks(req.params.trackId)
        .then(data => {
            const tracksArr = data.body.items;
            res.render("tracks", { tracksArr }) // ES6 deconstructed
        })
        .catch(error => console.log('Error while searching albums tracks: ', error))
})

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
