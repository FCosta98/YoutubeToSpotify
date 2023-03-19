require('dotenv').config()
const express = require('express');
const fetch = require('node-fetch');//for YOUTUBE
const cors = require('cors');
const bodyParser = require('body-parser');
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();
app.use(cors());
app.use(bodyParser.json());

/** YOUTUBE SECTION */

const ytb_api_key = process.env.YTB_KEY;
const maxResults = 50;

app.get('/playlist', (req, res) => {
    const { playlistId, pageToken } = req.query;
    if (!playlistId) {
        return res.status(400).json({ error: 'Missing playlist ID' });
    }

    let url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${playlistId}&key=${ytb_api_key}&maxResults=${maxResults}`;
    if(pageToken){
        url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${playlistId}&key=${ytb_api_key}&maxResults=${maxResults}&pageToken=${pageToken}`;
    }
    //const url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${playlistId}&key=${ytb_api_key}&maxResults=${maxResults}&pageToken=${pageToken}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            res.json(data);
        })
        .catch(error => {
            console.error(error);
            res.status(500).json({ error: 'Failed to fetch playlist data' });
        });
});

/** SPOTIFY SECTION */

app.post('/refresh', (req, res) => {
    const refreshToken = req.body.refreshToken

    const spotifyApi = new SpotifyWebApi({
        redirectUri: process.env.REDIRECT_URI,
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        refreshToken
    })

    spotifyApi
        .refreshAccessToken()
        .then(data => {
            res.json({
                accessToken: data.body.access_token,
                expiresIn: data.body.expires_in,
            })
        })
        .catch(err => {
            console.log(err)
            res.sendStatus(400)
        })
})

app.post('/login', (req, res) => {

    const code = req.body.code;

    const spotifyApi = new SpotifyWebApi({
        redirectUri: process.env.REDIRECT_URI,
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET
    })

    spotifyApi
        .authorizationCodeGrant(code)
        .then(data => {
            res.json({
                accessToken: data.body.access_token,
                refreshToken: data.body.refresh_token,
                expiresIn: data.body.expires_in,
            })
        })
        .catch(err => {
            console.log(err);
            res.sendStatus(400);
        })
})



app.listen(process.env.PORT || 3001)