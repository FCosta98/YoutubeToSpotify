import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SpotifyWebApi from 'spotify-web-api-node';
import axios from "axios"
import Login2 from './components/Login2'
import Callback2 from './components/Callback2';
import Dashboard2 from './components/Dashboard2';

const spotifyApi = new SpotifyWebApi({
  clientId: '9e6a9593ba0c40e8be113a49ac48f487',
  redirectUri: 'http://localhost:3000/callback'
});

export default function App() {
    const [accessToken, setAccessToken] = useState(localStorage.getItem('accessToken2'));
    const [refreshToken, setRefreshToken] = useState(localStorage.getItem('refreshToken2'));
    const [expireIn, setExpireIn] = useState(localStorage.getItem('expireIn2'));
    const [isAuth, setIsAuth] = useState(false)

    //ADDED check if dev
    const loc = window.location;
    console.log("TEST LOC:", loc.hostname);
    if(loc.hostname === 'localhost'){
        axios.defaults.baseURL = `${loc.protocol}//${loc.hostname}${loc.hostname === 'localhost' ? ':3001' : ''}`;
    }
    else{
        axios.defaults.baseURL = 'https://yuotube-to-spotify.onrender.com';
    }
    

    const isAccessTokenExpired = expireIn
        ? new Date().getTime() > parseInt(expireIn) * 1000
        : true;

    const refreshAccessToken = async () => {
        if(!refreshToken){
            return;
        }
        try {
            const response = await axios.post('/refresh', {
                refreshToken,
            });

            const newAccessToken = response.data.accessToken;
            const expiresIn = response.data.expiresIn;

            spotifyApi.setAccessToken(newAccessToken);
            setAccessToken(newAccessToken);
            setExpireIn(expiresIn);
            localStorage.setItem('accessToken2', newAccessToken);
            localStorage.setItem('expireIn2', expiresIn);

            //console.log('Access token refreshed!');
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        if (accessToken && refreshToken) {
            spotifyApi.setAccessToken(accessToken);
            spotifyApi.setRefreshToken(refreshToken);
            setIsAuth(true);
        }
        // console.log(accessToken);
        // console.log(refreshToken);
        // console.log(isAuth);

        const intervalId = setInterval(() => {
            if (isAccessTokenExpired) {
                refreshAccessToken();
            }
        }, 5000);

        return () => clearInterval(intervalId);
    }, [accessToken, refreshToken, isAccessTokenExpired]);
    

    return (
        <Router>
            <Routes>
                <Route path="/" element={<NewRoute isAuth={isAuth} />} />
                <Route path="/callback" element={<Callback2 />} />
            </Routes>
        </Router>
    );
}

function NewRoute({ isAuth }) {
    if (isAuth) {
        return <Dashboard2 spotifyApi={spotifyApi} />
    }
    else {
        return <Login2 />
    }
}
