import React,{useState, useEffect, useRef} from 'react';
import './LandingPage.css';
import { useLocation, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faFilm } from '@fortawesome/free-solid-svg-icons';

const LandingPage = (props) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { title, poster, overview, genre_id, id, media_type  } = location.state || {};
  const [cast, setCast] = useState([]);
  const [inWatchlist, setInWatchlist] = useState(false);
  const [trailer, setTrailer] = useState(null);
  const [isTrailerLoading, setIsTrailerLoading] = useState(true);
  const [trailerError, setTrailerError] = useState(null);
  const [similarContent, setSimilarContent] = useState([]);
  const [isSimilarLoading, setIsSimilarLoading] = useState(true);

  useEffect(() => {
    document.documentElement.scrollTop = 0; // Reset scroll position
  }, []);

  // Update the trailer fetching useEffect
  useEffect(() => {
    const fetchTrailer = async () => {
      setIsTrailerLoading(true);
      setTrailerError(null);
      
      try {
        if (!id || !media_type) {
          setTrailerError('Missing movie/show ID or media type');
          return;
        }
        
        const endpoint = media_type === 'movie' 
          ? `https://api.themoviedb.org/3/movie/${id}/videos` 
          : `https://api.themoviedb.org/3/tv/${id}/videos`;
        
        console.log('Fetching trailer from:', endpoint);
        
        const response = await fetch(`${endpoint}?api_key=${props.apiKey || 'b3e9a66b3b6e02b9aafd6a5c465f7d3b'}&language=en-US`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Trailer API response:', data);
        
        if (!data.results || data.results.length === 0) {
          setTrailerError('No videos found for this title');
          setTrailer(null);
          return;
        }
        
        // Find the best quality English trailer
        const officialTrailer = data.results.find(video => 
          video.type === 'Trailer' && 
          video.official &&
          video.site === 'YouTube'
        );
        
        const fallbackTrailer = data.results.find(video => 
          video.type === 'Trailer' && 
          video.site === 'YouTube'
        );
        
        const anyYouTubeVideo = data.results.find(video => 
          video.site === 'YouTube'
        );
        
        const selectedTrailer = officialTrailer || fallbackTrailer || anyYouTubeVideo;
        
        if (selectedTrailer) {
          console.log('Selected trailer:', selectedTrailer);
          setTrailer(selectedTrailer);
        } else {
          setTrailerError('No YouTube videos found for this title');
          setTrailer(null);
        }
        
      } catch (error) {
        console.error('Trailer fetch error:', error);
        setTrailerError(`Failed to load trailer: ${error.message}`);
        setTrailer(null);
      } finally {
        setIsTrailerLoading(false);
      }
    };
  
    fetchTrailer();
  }, [id, media_type, props.apiKey]);

  useEffect(() => {
    const watchlist = JSON.parse(localStorage.getItem('watchlist')) || [];
    const isInWatchlist = watchlist.some((movie) => movie.id === id);
    setInWatchlist(isInWatchlist);
  }, [id]);
  
  const toggleWatchlist = () => {
    const watchlist = JSON.parse(localStorage.getItem('watchlist')) || [];
    const movieIndex = watchlist.findIndex((movie) => movie.id === id);

    if (movieIndex !== -1) {
      // Movie is already in watchlist, remove it
      watchlist.splice(movieIndex, 1);
      setInWatchlist(false);
    } else {
      // Movie is not in watchlist, add it
      watchlist.push({ title, poster, overview, genre_id, id, media_type });
      setInWatchlist(true);
    }

    localStorage.setItem('watchlist', JSON.stringify(watchlist));
  };

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

  // Fetch similar content
  useEffect(() => {
    const fetchSimilarContent = async () => {
      setIsSimilarLoading(true);
      try {
        if (!id || !media_type) return;
        
        const endpoint = media_type === 'movie' 
          ? `https://api.themoviedb.org/3/movie/${id}/similar` 
          : `https://api.themoviedb.org/3/tv/${id}/similar`;
        
        const response = await fetch(`${endpoint}?api_key=${props.apiKey}&language=en-US&page=1`);
        
        if (!response.ok) throw new Error('Failed to fetch similar content');
        
        const data = await response.json();
        setSimilarContent(data.results.slice(0, 9)); // Show top 12 similar items
        
      } catch (error) {
        console.error('Similar content fetch error:', error);
        setSimilarContent([]);
      } finally {
        setIsSimilarLoading(false);
      }
    };

    fetchSimilarContent();
  }, [id, media_type, props.apiKey]);

  // Handle potential missing data
  if (!location.state) return <div className="container">No movie data found</div>

  const genreNames = genre_id.map(id => genreMapping[id]);

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
            <div className='watchlist-button'>
            <button
                type="button"
                className="btn btn-outline-success mx-2"
                onClick={toggleWatchlist}
              >
                {inWatchlist ? 'Remove From WatchList' : 'Add To WatchList'}
              </button>            
            </div>

            <div className="trailer-section">
              <h2>Trailer</h2>
              
              {isTrailerLoading ? (
                <div className="trailer-loading">
                  <div className="spinner-border text-warning" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <p>Loading trailer...</p>
                </div>
              ) : trailerError ? (
                <div className="no-trailer">
                  <FontAwesomeIcon icon={faFilm} size="2x" />
                  <p>{trailerError}</p>
                </div>
              ) : trailer ? (
                <div className="trailer-container">
                  <div style={{ 
                    position: 'relative',
                    paddingBottom: '56.25%',
                    height: 0,
                    overflow: 'hidden'
                  }}>
                    <iframe
                      src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1&modestbranding=1&rel=0&showinfo=0&iv_load_policy=3&mute=1`}
                      title="Movie Trailer"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        borderRadius: '8px'
                      }}
                    />
                  </div>
                </div>
              ) : (
                <div className="no-trailer">
                  <FontAwesomeIcon icon={faFilm} size="2x" />
                  <p>No trailer available</p>
                </div>
              )}
            </div>

            <div className="cast-section">
              <h2>Top Cast</h2>
              <div className="cast-grid">
                {cast.map((member) => (
                  <div 
                    key={member.id} 
                    className="cast-member"
                    onClick={() => window.open(`https://www.google.com/search?q=${encodeURIComponent(member.name + ' actor')}`, '_blank')}
                    style={{ cursor: 'pointer' }}
                  >
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

            <div className="similar-section">
              <h2>Similar {media_type === 'movie' ? 'Movies' : 'TV Shows'}</h2>
              {isSimilarLoading ? (
                <div className="similar-loading">
                  <div className="spinner-border text-warning" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <p>Loading similar content...</p>
                </div>
              ) : (
                <div className="similar-grid">
                  {similarContent.map((item) => (
                    <div 
                      key={item.id} 
                      className="similar-item"
                      onClick={() => {
                        window.scrollTo(0, 0);
                        setIsSimilarLoading(true);

                        // Navigate to the new movie/show page
                        navigate('/landingpage', {
                          state: {
                            title: item.title || item.name,
                            poster: item.poster_path,
                            overview: item.overview,
                            genre_id: item.genre_ids,
                            id: item.id,
                            media_type: media_type
                          }
                        })
                      
                        }}
                      style={{ cursor: 'pointer' }}
                    >
                      <img
                        src={item.poster_path 
                          ? `https://image.tmdb.org/t/p/w300${item.poster_path}`
                          : 'https://via.placeholder.com/300x450?text=No+Image'}
                        alt={item.title || item.name}
                        className="similar-poster"
                      />
                      <div className="similar-info">
                        <h4>{item.title || item.name}</h4>
                        <p className="similar-rating">
                          ⭐ {item.vote_average ? item.vote_average.toFixed(1) : 'N/A'}
                        </p>
                        <p className="similar-year">
                          {item.release_date ? new Date(item.release_date).getFullYear() : 
                           item.first_air_date ? new Date(item.first_air_date).getFullYear() : 'Unknown'}
                        </p>
                      </div>
                    </div>
                  ))}
                  {similarContent.length === 0 && <p>No similar content available</p>}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LandingPage;