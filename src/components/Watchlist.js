import React, { useEffect, useState } from 'react';
import Movieitem from './Movieitem';

const Watchlist = () => {
  const [watchlist, setWatchlist] = useState([]);

  useEffect(() => {
    const list = JSON.parse(localStorage.getItem('watchlist')) || [];
    setWatchlist(list);
  }, []);

  return (
    <div className="container my-3">
      <h1>Your Watchlist</h1>
      <div className='row'>
        {watchlist.length === 0 ? (
          <p>No movies in your watchlist yet.</p>
        ) : (
          watchlist.map(movie => (
            <div className="col-6 col-md-2" key={movie.id}>
              <Movieitem {...movie} />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Watchlist;