import '../css/Song.css'

export default function Song({img, artists, name}) {

    return (
        <div className='song-container'>
            <img className='song-img' src={img} />
            <div className='song-right'>
                <p className='song-name'>{name}</p>
                <div className='song-artist'>
                    {artists.map((art) => {
                        return <p className='art'>{art}</p>
                    })}
                </div>
            </div>
        </div>
    );
}