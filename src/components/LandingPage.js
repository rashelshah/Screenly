import React, { useState, useEffect, useRef } from 'react';
import './LandingPage.css';
import { useLocation, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilm, faStar, faTrash } from '@fortawesome/free-solid-svg-icons';

const LandingPage = (props) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { title, poster, overview, genre_id, id, media_type } = location.state || {};
  const [cast, setCast] = useState([]);
  const [inWatchlist, setInWatchlist] = useState(false);
  const [trailer, setTrailer] = useState(null);
  const [isTrailerLoading, setIsTrailerLoading] = useState(true);
  const [trailerError, setTrailerError] = useState(null);
  const [similarContent, setSimilarContent] = useState([]);
  const [isSimilarLoading, setIsSimilarLoading] = useState(true);
  const [reviews, setReviews] = useState([]);
  const [isReviewsLoading, setIsReviewsLoading] = useState(true);
  const [reviewText, setReviewText] = useState('');
  const [rating, setRating] = useState(5);
  const [expandedReviews, setExpandedReviews] = useState({});

  // Calculate review statistics
  const calculateReviewStats = () => {
    if (!reviews || reviews.length === 0) return { average: 0, count: 0 };

    const validReviews = reviews.filter(review => 
      review.author_details?.rating && !isNaN(review.author_details.rating)
    );
    
    if (validReviews.length === 0) return { average: 0, count: 0 };

    const total = validReviews.reduce((sum, review) => sum + review.author_details.rating, 0);
    const average = total / validReviews.length;
    
    return {
      average: parseFloat(average.toFixed(1)),
      count: reviews.length
    };
  };

  const reviewStats = calculateReviewStats();

  // Initialize from localStorage
  useEffect(() => {
    const storedReviews = JSON.parse(localStorage.getItem('movieReviews')) || {};
    const mediaKey = `${media_type}-${id}`;
    
    if (storedReviews[mediaKey]) {
      setReviews(storedReviews[mediaKey]);
      setIsReviewsLoading(false);
    }
  }, [id, media_type]);

  useEffect(() => {
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 0);
  }, [location.key]);

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
        
        const response = await fetch(`${endpoint}?api_key=${props.apiKey || 'b3e9a66b3b6e02b9aafd6a5c465f7d3b'}&language=en-US`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (!data.results || data.results.length === 0) {
          setTrailerError('No videos found for this title');
          setTrailer(null);
          return;
        }
        
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
      watchlist.splice(movieIndex, 1);
      setInWatchlist(false);
    } else {
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
        setCast(data.cast.slice(0, 12));

      } catch (error) {
        console.error('Cast fetch error:', error);
        setCast([]);
      }
    };

    fetchCast();
  }, [id, media_type]);

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
        setSimilarContent(data.results.slice(0, 9));
        
      } catch (error) {
        console.error('Similar content fetch error:', error);
        setSimilarContent([]);
      } finally {
        setIsSimilarLoading(false);
      }
    };

    fetchSimilarContent();
  }, [id, media_type, props.apiKey]);

  useEffect(() => {
    const fetchTMDBReviews = async () => {
      try {
        if (!id || !media_type) return;
        
        const endpoint = `https://api.themoviedb.org/3/${media_type}/${id}/reviews`;
        const response = await fetch(`${endpoint}?api_key=${props.apiKey}&language=en-US&page=1`);
        
        if (!response.ok) throw new Error('Failed to fetch reviews');
        
        const data = await response.json();
        
        // Get user reviews from localStorage
        const storedReviews = JSON.parse(localStorage.getItem('movieReviews')) || {};
        const mediaKey = `${media_type}-${id}`;
        const userReviews = storedReviews[mediaKey] || [];
        
        // Combine TMDB reviews with user reviews
        setReviews([...userReviews, ...data.results]);
        
      } catch (error) {
        console.error('Reviews fetch error:', error);
        
        // If TMDB fails, just show user reviews
        const storedReviews = JSON.parse(localStorage.getItem('movieReviews')) || {};
        const mediaKey = `${media_type}-${id}`;
        const userReviews = storedReviews[mediaKey] || [];
        setReviews(userReviews);
      } finally {
        setIsReviewsLoading(false);
      }
    };

    // Only fetch from TMDB if we haven't loaded from localStorage yet
    if (reviews.length === 0) {
      fetchTMDBReviews();
    }
  }, [id, media_type, props.apiKey, reviews.length]);

  const saveReviewsToStorage = (reviewsList) => {
    const storedReviews = JSON.parse(localStorage.getItem('movieReviews')) || {};
    const mediaKey = `${media_type}-${id}`;
    
    storedReviews[mediaKey] = reviewsList.filter(review => review.author === "You");
    localStorage.setItem('movieReviews', JSON.stringify(storedReviews));
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!reviewText.trim()) return;
    
    const newReview = {
      id: Date.now(),
      author: "You", 
      content: reviewText,
      created_at: new Date().toISOString(),
      author_details: {
        rating: rating
      }
    };
    
    const updatedReviews = [newReview, ...reviews];
    setReviews(updatedReviews);
    saveReviewsToStorage(updatedReviews);
    setReviewText('');
    setRating(5);
  };

  const handleDeleteReview = (reviewId) => {
    const updatedReviews = reviews.filter(review => review.id !== reviewId);
    setReviews(updatedReviews);
    saveReviewsToStorage(updatedReviews);
  };

  const toggleReviewExpanded = (reviewId) => {
    setExpandedReviews(prev => ({
      ...prev,
      [reviewId]: !prev[reviewId]
    }));
  };

  if (!location.state) return <div className="container">No movie data found</div>

  const genreNames = genre_id.map(id => genreMapping[id]);
  
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
                        setIsSimilarLoading(true);
                        setTimeout(() => {
                          navigate('/landingpage', {
                            state: {
                              title: item.title || item.name,
                              poster: item.poster_path,
                              overview: item.overview,
                              genre_id: item.genre_ids,
                              id: item.id,
                              media_type: media_type
                            }
                          });
                        }, 200);
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

            <div className="reviews-section">
              <h2>User Reviews</h2>
              
              <div className="overall-rating">
                <div className="rating-big">{reviewStats.average || 'N/A'}</div>
                <div className="rating-count">
                  {reviewStats.count === 0 
                    ? 'No reviews yet' 
                    : `${reviewStats.count} ${reviewStats.count === 1 ? 'review' : 'reviews'}`}
                </div>
              </div>

              <h3 className="featured-reviews-title">Featured reviews</h3>
              
              <form onSubmit={handleReviewSubmit} className="review-form">
                <div className="rating-input">
                  <label>Your Rating:</label>
                  <select value={rating} onChange={(e) => setRating(Number(e.target.value))}>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                      <option key={num} value={num}>{num}</option>
                    ))}
                  </select>
                </div>
                <textarea
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="Write your review..."
                  rows="4"
                />
                <button type="submit" className="btn btn-outline-warning">Submit Review</button>
              </form>
              
              {isReviewsLoading ? (
                <div className="reviews-loading">
                  <div className="spinner-border text-warning" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <p>Loading reviews...</p>
                </div>
              ) : reviews.length > 0 ? (
                <div className="reviews-grid">
                  {reviews.map((review) => {
                    const isExpanded = expandedReviews[review.id];
                    const content = isExpanded 
                      ? review.content 
                      : review.content.length > 150 
                        ? review.content.slice(0, 150) + '...' 
                        : review.content;
                        
                    return (
                      <div key={review.id} className="review-item">
                        <div className="review-rating-big">
                          <FontAwesomeIcon icon={faStar} className="star-icon" />
                          <span>{review.author_details?.rating || 'N/A'}</span>
                        </div>
                        <div className="review-header">
                          <h4>{review.author}</h4>
                          {review.author === "You" && (
                            <button 
                              onClick={() => handleDeleteReview(review.id)}
                              className="delete-review-btn"
                            >
                              <FontAwesomeIcon icon={faTrash} />
                            </button>
                          )}
                        </div>
                        <p className="review-content">{content}</p>
                        {review.content.length > 150 && (
                          <button 
                            className="read-more-btn"
                            onClick={() => toggleReviewExpanded(review.id)}
                          >
                            {isExpanded ? 'Show less' : 'Read full review'}
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="no-reviews">No reviews yet. Be the first to review!</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LandingPage;