import React from 'react';
import './Movieitem.css'; 
import Rating from './Rating';
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay } from '@fortawesome/free-solid-svg-icons';
import { faPlus } from '@fortawesome/free-solid-svg-icons';



const Movieitem = (props) => {
  let { title, poster, date, vote_average, overview, genre_id,category,id} = props;
  const navigate = useNavigate();

  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  const handleClick = () => {
    console.log("Navigating with poster:", poster); // Debug log
    navigate('/landingpage', { 
      state: { 
        title: title, 
        poster: poster,  // Make sure this is explicitly passed
        overview: overview,
        genre_id: genre_id,  
        id: props.id,       // Make sure this exists
        media_type: props.media_type 
      } 
    });
  };
  return (
    <>
        <div className='movie-item my-2'>
      <div className='image-container'>
      <FontAwesomeIcon icon={faPlus} className='watchlist-icon' />
        <img src={`https://image.tmdb.org/t/p/w500${poster}`} className="card-img-top" onClick={handleClick} alt="..." />
      <Rating value={vote_average}/>
      </div>
      <div className='play-icon'>
      <FontAwesomeIcon icon={faPlay} onClick={handleClick} style={{ fontSize: '2.5rem' }} />
      </div>
      <h7 className="card-title"><b>{title}</b></h7>
      <p className='card-date'>{formattedDate}</p>

    </div>
</>
  );
}

export default Movieitem;