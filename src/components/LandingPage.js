import React,{useState, useEffect} from 'react';
import './LandingPage.css';
import { useLocation } from 'react-router-dom';

const LandingPage = () => {
  const location = useLocation();
  const { title, poster, overview, genre_id, id, media_type  } = location.state || {};
  const [cast, setCast] = useState([]);

  const genreMapping = {
    28: 'Action',
    12: 'Adventure',
    16: 'Animation',
    35: 'Comedy',
    80: 'Crime',
    99: 'Documentary',
    18: 'Drama',
    10751: 'Family',
    14: 'Fantasy',
    36: 'History',
    27: 'Horror',
    10402: 'Music',
    9648: 'Mystery',
    10749: 'Romance',
    878: 'Science Fiction',
    10770: 'TV Movie',
    53: 'Thriller',
    10752: 'War',
    37: 'Western'
  };
 

  useEffect(() => {
    const fetchCast = async () => {
      try {
        if (!id || !media_type) return;
        const url = `https://api.themoviedb.org/3/${media_type}/${id}/credits?api_key=b3e9a66b3b6e02b9aafd6a5c465f7d3b`;
        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to fetch cast');
        const data = await response.json();
        setCast(data.cast.slice(0, 12)); // Show top 12 cast members
      } catch (error) {
        console.error('Cast fetch error:', error);
        setCast([]);
      }
    };

    fetchCast();
  }, [id, media_type]);

  // Handle potential missing data
  if (!location.state) return <div className="container">No movie data found</div>

  const genreNames =  genre_id.map(id => genreMapping[id]);


  
  console.log("Genre", genreNames)
  
  return (  
    <>
      <div className='landing-page'>
        <div className='background-image'>
          <img src={`https://image.tmdb.org/t/p/original${poster}`} alt={title} />   
        </div>
        <div className='movie-content'>
          <img src={`https://image.tmdb.org/t/p/w500${poster}`} className="card-img1" alt={title} />    
          <div className="movie-details">
            <h1>{title}</h1>
            <div className='description'>
              <p>{overview}</p>
            </div>
            <div className='genre'>
            {genreNames.map((genre, i) => (
            <span key={i} className='genre-box'>{genre} </span>
            ))}
            </div>
            <div className="cast-section">
            <h2>Top Cast</h2>
            <div className="cast-grid">
              {cast.map((member) => (
                <div key={member.id} className="cast-member">
                <img
  src={member.profile_path 
    ? `https://image.tmdb.org/t/p/w200${member.profile_path}`
    : 'https://via.placeholder.com/200x300?text=No+Image'}
  alt={member.name}
  className="cast-photo"
/>  
                  <div className="cast-info">
                    <h4>{member.name}</h4>
                    <p>{member.character}</p>
                  </div>
                </div>
              ))}
              {cast.length === 0 && <p>No cast information available</p>}
            </div>
          </div>
          </div>
        </div>
      </div>
      
    </>
  );
};

export default LandingPage;