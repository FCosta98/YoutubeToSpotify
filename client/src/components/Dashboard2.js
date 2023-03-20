import React, { useEffect, useState } from 'react';
import axios from "axios"
import Song from './Song';
import '../css/Dashboard.css'


export default function Dashboard2({spotifyApi}) {
    const [userData, setUserData] = useState(null);
    const [playlistId, setPlaylistId] = useState('');
    const [playlistName, setPlaylistName] = useState('');
    const [inputValid, setInputValid] = useState(true);
    const [music, setMusic] = useState(null);

    //ADDED check if dev
    const loc = window.location;
    console.log("TEST LOC:", loc.hostname);
    if(loc.hostname === 'localhost'){
        axios.defaults.baseURL = `${loc.protocol}//${loc.hostname}${loc.hostname === 'localhost' ? ':3001' : ''}`;
    }
    else{
        axios.defaults.baseURL = `https://yuotube-to-spotify.onrender.com`;
    }

    const isFormCompleted = playlistName && playlistId;

    useEffect(() => {
        spotifyApi.getMe().then((data) => {
            setUserData(data.body);
        }).catch((err) => {
            console.error(err);
        });
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('accessToken2');
        localStorage.removeItem('refreshToken2');
        window.location.href = '/';
    };

    async function createSpotifyPlaylist(name, items) {
        try {
            const { body: playlist } = await spotifyApi.createPlaylist(name, {
                description: 'Playlist crée avec le site YouTube to Spotify',
                public: true,
            });

            console.log('Created playlist ID:', playlist.id);

            const musicObject = await Promise.all(
                items.map(async (song) => {
                    const musicId = await getMusicSpotify(song.name);
                    return musicId;
                })
            );
            console.log("TABLEAU AVEC LES INFOS: ", musicObject)
            setMusic(musicObject);

            const musicURI = musicObject.map((obj) => {
                return obj.uri;
            })

            console.log('TABLEAU AVEC LES URI: ', musicURI);

            const final = await addMusicToSpotifyPlaylist(playlist.id, musicURI);

            return musicURI;
        } catch (err) {
            console.log('Something went wrong!', err);
        }
    }

    async function addMusicToSpotifyPlaylist(playlist_id, uriTab) {
        try {
            const data = await spotifyApi.addTracksToPlaylist(playlist_id, uriTab);
            console.log('Added tracks to playlist!');
            return data;
        } catch (err) {
            console.log('Something went wrong with addMusicToSpotifyPlaylist!', err);
        }
    };

    async function getMusicSpotify(name) {
        try {
            const data = await spotifyApi.searchTracks(name);
            console.log('Music Spotify: ', data.body.tracks.items[0]);
            console.log('Music NAME: ', data.body.tracks.items[0].name);

            //on crée tableau avec nom des artistes
            const artists = data.body.tracks.items[0].artists.map((art) => {
                return art.name;
            })

            return {
                uri: data.body.tracks.items[0].uri,
                img: data.body.tracks.items[0].album.images[0].url,
                artist: artists,
                name: data.body.tracks.items[0].name
            };

            //return data.body.tracks.items[0];
        } catch (err) {
            console.log('Something went wrong with getMusicSpotify ', err);
        }
    };

    async function getYoutubePlaylistItems(playlistId, pageToken) {
        const response = await axios.get("/playlist", { params: { playlistId, pageToken } });
        const items = response.data.items;
        if (response.data.nextPageToken) {
            const nextItems = await getYoutubePlaylistItems(playlistId, response.data.nextPageToken);
            return [...items, ...nextItems];
        }
        return items;
    }

    async function getYtb(playlistId) {
        const items = await getYoutubePlaylistItems(playlistId, null);

        const items2 = items.map((item) => {
            let title = item.snippet.title;

            return {
                name: title,
                channel: item.snippet.videoOwnerChannelTitle,
            }
        });

        console.log("ITEMS 2:", items2);
        const playlistSpotifyId = await createSpotifyPlaylist(playlistName, items2);
    }

    const handleSubmitUrl = async (event) => {
        event.preventDefault();

        // Check if input is valid
        if (playlistName.trim() === '' || playlistId.trim() === '') {
            setInputValid(false);
            return;
        }

        setInputValid(true);
        const newPlaylistId = playlistId.split("list=")[1];
        await getYtb(newPlaylistId);
        setPlaylistId('');
        setPlaylistName('');
    }


    return (
        <div>
            {userData ? (
                <div className='db-container'>
                    <div className='header'>
                        <div className='profile'>
                            <img className='user-img' src={userData.images[0].url} />
                            <p className='username'>{userData.display_name}</p>
                        </div>
                        <button className='logout-btn' onClick={handleLogout}>Logout</button>
                    </div>
                    <h1 className='title'>YouTube to Spotify</h1>
                    <div className='main-section'>
                        <form className='form-section' onSubmit={handleSubmitUrl}>
                            <input className='form-input' type="text" value={playlistName} onChange={e => setPlaylistName(e.target.value)} placeholder="Name of your playlist"/>
                            <input className='form-input' type="text" value={playlistId} onChange={e => setPlaylistId(e.target.value)} placeholder="Enter playlist URL"/>
                            {!inputValid && <p style={{color: 'red'}}>Please fill in both fields</p>}
                            <button className='form-btn' type="submit">Submit URL</button>
                        </form>
                    </div>
                    {music ? 
                        <div className='song-section'>
                            <h1>{music.length} songs were added to your new playlist:</h1>
                            <div className='song-section2'>
                                {music.map((item, id) => {
                                    return <Song key={id} img={item.img} artists={item.artist} name={item.name} />
                                })}
                            </div>
                        </div>
                    :
                        null
                    }
                </div>
            ) : (
                <div className='loading-container'>
                    <h1 className='loading-txt'>Loading...</h1>
                </div>
            )}
        </div>
    );
}