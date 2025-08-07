import React, { useState, useEffect } from 'react';
import './Movieitem.css'; 
import Rating from './Rating';
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faPlus, faCheck } from '@fortawesome/free-solid-svg-icons';

const Movieitem = (props) => {
  let { title, poster, date, vote_average, overview, genre_id, category, id } = props;
  const navigate = useNavigate();
  const [inWatchlist, setInWatchlist] = useState(false);

  useEffect(() => {
    const watchlist = JSON.parse(localStorage.getItem('watchlist')) || [];
    const isInWatchlist = watchlist.some(movie => movie.id === id);
    setInWatchlist(isInWatchlist);
  }, [id]);

  const toggleWatchlist = () => {
    const watchlist = JSON.parse(localStorage.getItem('watchlist')) || [];
  
    const movieIndex = watchlist.findIndex(movie => movie.id === id);
  
    if (movieIndex !== -1) {
      // Movie is already in watchlist, remove it
      watchlist.splice(movieIndex, 1);
      setInWatchlist(false);
    } else {
      // Movie is not in watchlist, add it
      watchlist.push({ title, poster, date, vote_average, overview, genre_id, category, id });
      setInWatchlist(true);
    }
  
    localStorage.setItem('watchlist', JSON.stringify(watchlist));
  };


  const handleClick = () => {
    navigate('/landingpage', { 
      state: { title, poster, overview, genre_id, id, media_type: props.media_type } 
    });
  };

  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className='movie-item my-2'>
      <div className='image-container'>
      <FontAwesomeIcon 
  icon={inWatchlist ? faCheck : faPlus} 
  className='watchlist-icon' 
  onClick={toggleWatchlist}
  style={{ 
    cursor: 'pointer',
    color: inWatchlist ? 'gold' : 'white',
    transition: 'transform 0.25s ease, color 0.25s ease'
  }}
  onMouseDown={e => e.currentTarget.style.transform = 'scale(1.2)'}
  onMouseUp={e => {
    const el = e.currentTarget;
    if (el) {
      setTimeout(() => {
        if (el) el.style.transform = 'scale(1)';
      }, 150);
    }
  }}
/>
        <img 
          src={`https://image.tmdb.org/t/p/w500${poster}`} 
          className="card-img-top" 
          onClick={handleClick} 
          alt={title} 
        />
        <Rating value={vote_average} />
      </div>
      <div className='play-icon'>
        <FontAwesomeIcon icon={faPlay} onClick={handleClick} style={{ fontSize: '2.5rem' }} />
      </div>
      <h7 className="card-title"><b>{title}</b></h7>
      <p className='card-date'>{formattedDate}</p>
    </div>
  );
};

export default Movieitem;