import Alert from './Alert';
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

function Navbar({alert}) {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`?search=${encodeURIComponent(searchQuery)}`);
  };

  const handleLogout = () => {
    localStorage.removeItem("auth-token");
    navigate('/login');
  };

  const showSearchBar = location.pathname !== '/login' && location.pathname !== '/signup';

  return (
    <>
      <nav className="navbar navbar-expand-md">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/">
            Screenly
          </Link>
          
          <button 
            className="navbar-toggler" 
            type="button" 
            data-bs-toggle="collapse" 
            data-bs-target="#navbarSupportedContent" 
            aria-controls="navbarSupportedContent" 
            aria-expanded="false" 
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav mx-auto mb-2 mb-md-0">
              <li className="nav-item">
                <Link className="nav-link active" aria-current="page" to="/home">Home</Link>
              </li>
              <li className="nav-item dropdown">
                <Link className="nav-link dropdown-toggle" to="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                  Genre
                </Link>
                <ul className="dropdown-menu">
                  <li><Link className="dropdown-item" to="/action">Action</Link></li>
                  <li><Link className="dropdown-item" to="/adventure">Adventure</Link></li>
                  <li><Link className="dropdown-item" to="/animation">Animation</Link></li>
                  <li><Link className="dropdown-item" to="/comedy">Comedy</Link></li>
                  <li><Link className="dropdown-item" to="/crime">Crime</Link></li>
                  <li><Link className="dropdown-item" to="/drama">Drama</Link></li>
                  <li><Link className="dropdown-item" to="/family">Family</Link></li>
                  <li><Link className="dropdown-item" to="/fantasy">Fantasy</Link></li>
                  <li><Link className="dropdown-item" to="/horror">Horror</Link></li>
                </ul>
              </li>
              <li className="nav-item dropdown">
                <Link className="nav-link dropdown-toggle" to="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                  Country
                </Link>
                <ul className="dropdown-menu">
                  <li><Link className="dropdown-item" to="/US">US</Link></li>
                  <li><Link className="dropdown-item" to="/IN">India</Link></li>
                  <li><Link className="dropdown-item" to="/FR">France</Link></li>
                  <li><Link className="dropdown-item" to="/JP">Japan</Link></li>
                  <li><Link className="dropdown-item" to="/KR">Korea</Link></li>
                  <li><Link className="dropdown-item" to="/DE">Germany</Link></li>
                  <li><Link className="dropdown-item" to="/GB">UK</Link></li>
                  <li><Link className="dropdown-item" to="/CN">China</Link></li>
                  <li><Link className="dropdown-item" to="/CA">Canada</Link></li>
                </ul>
              </li>
              <li className="nav-item">
                <Link className="nav-link active" aria-current="page" to="/toprated">Top Rated</Link>
              </li>
              <li className="nav-item dropdown">
                <Link className="nav-link dropdown-toggle" to="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                  Year
                </Link>
                <ul className="dropdown-menu">
                  <li><Link className="dropdown-item" to="/2025">2025</Link></li>
                  <li><Link className="dropdown-item" to="/2024">2024</Link></li>
                  <li><Link className="dropdown-item" to="/2023">2023</Link></li>
                </ul>
              </li>
              <li className="nav-item">
                <Link className="nav-link active" aria-current="page" to="/watchlist">Watchlist</Link>
              </li>
            </ul>

            <div className="ms-auto d-flex auth-buttons">
              {!localStorage.getItem("auth-token") ? (
                <>
                  <Link to="/login" className="btn btn-outline-success mx-2">
                    Login
                  </Link>
                  <Link to="/signup" className="btn btn-outline-success mx-2">
                    Sign Up
                  </Link>
                </>
              ) : (
                <button 
                  onClick={handleLogout} 
                  className="btn btn-outline-success mx-2"
                >
                  Logout
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>
      <Alert alert={alert}/>

      {showSearchBar && (
        <div className="search-section">
          <div className="container">
            <h2 className="search-heading">Find Movies, TV Shows, and More</h2>
            <form className="search-form" role="search" onSubmit={handleSearch}>
              <div className="input-group">
                <span className="input-group-text">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#FFD700"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                </span>
                <input
                  className="form-control"
                  type="search"
                  placeholder="Enter keywords..."
                  aria-label="Search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <button className="btn btn-search" type="submit">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#000"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default Navbar;