import '../css/Login.css'

export default function Login2() {

    let handleLogin = () => {
        const authorizeUrl = "https://accounts.spotify.com/authorize?client_id=9e6a9593ba0c40e8be113a49ac48f487&response_type=code&redirect_uri=http://localhost:3000/callback&scope=streaming%20user-read-email%20user-read-private%20user-library-read%20user-library-modify%20user-read-playback-state%20user-modify-playback-state%20playlist-modify-private%20playlist-modify-public";
        window.location.href = authorizeUrl;
    };
    //ADDED check if dev
    const loc = window.location;
    if(loc.hostname === 'localhost'){
        handleLogin = () => {
            const authorizeUrl = "https://accounts.spotify.com/authorize?client_id=9e6a9593ba0c40e8be113a49ac48f487&response_type=code&redirect_uri=http://localhost:3000/callback&scope=streaming%20user-read-email%20user-read-private%20user-library-read%20user-library-modify%20user-read-playback-state%20user-modify-playback-state%20playlist-modify-private%20playlist-modify-public";
            window.location.href = authorizeUrl;
        };
    }
    else{
        handleLogin = () => {
            //client URL
            console.log("CLIENT GOGOGO");
            const authorizeUrl = "https://accounts.spotify.com/authorize?client_id=9e6a9593ba0c40e8be113a49ac48f487&response_type=code&redirect_uri=https://6418aa848019ce0008c56ba4--lucky-biscuit-d37265.netlify.app/callback&scope=streaming%20user-read-email%20user-read-private%20user-library-read%20user-library-modify%20user-read-playback-state%20user-modify-playback-state%20playlist-modify-private%20playlist-modify-public";
            window.location.href = authorizeUrl;
            console.log("CLIENT GOGOGO 2");
        };
    }
    // const handleLogin = () => {
    //     const authorizeUrl = "https://accounts.spotify.com/authorize?client_id=9e6a9593ba0c40e8be113a49ac48f487&response_type=code&redirect_uri=http://localhost:3000/callback&scope=streaming%20user-read-email%20user-read-private%20user-library-read%20user-library-modify%20user-read-playback-state%20user-modify-playback-state%20playlist-modify-private%20playlist-modify-public";
    //     window.location.href = authorizeUrl;
    // };

    return (
        <div>
            <div className='container'>
            <h1 className='title'>YouTube to Spotify</h1>
            <button className='login-btn' onClick={handleLogin}>Login with Spotify</button>
            <h2 className='presentation-title'>Transfer your favorite YouTube's playlist into Spotify in 3 easy steps :</h2>
            <div className='presentation-section'>
                <div className='presentation-item'>
                    <h2>Step 1:</h2>
                    <p className='step-description'>Login with your Spotify account</p>
                </div>
                <div className='presentation-item'>
                    <h2>Step 2:</h2>
                    <p className='step-description'>Copy the playlist's url from YouTube </p>
                    <p>Your playlist should be public, otherwise we won't have access to it.</p>
                </div>
                <div className='presentation-item'>
                    <h2>Step 3:</h2>
                    <p className='step-description'>Paste the url and click on the "Submit" button </p>
                </div>
            </div>
        </div>
        </div>
    );
}