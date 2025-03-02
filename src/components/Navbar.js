import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`?search=${encodeURIComponent(searchQuery)}`);
  };

  return (
    <>
    <nav className="navbar navbar-expand-md">
  <div className="container-fluid">
  <Link className="navbar-brand" to="/">
          Screenly {/* Text added instead of image */}
        </Link>
     
    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
      <span className="navbar-toggler-icon"></span>
    </button>
    <div className="collapse navbar-collapse" id="navbarSupportedContent">
    <ul className="navbar-nav mx-auto mb-2 mb-lg-0">
            <li className="nav-item">
          <Link className="nav-link active" aria-current="page" to="/home">Home</Link>
        </li>
        <li className="nav-item dropdown">
          <Link className="nav-link dropdown-toggle" to="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
              Genre
          </Link>
          <ul className="dropdown-menu"> 
            <li><Link className="dropdown-item" to="/action">Action</Link></li>
            <li><Link className="dropdown-item" to="/adventure"> Adventure</Link></li>
            <li><Link className="dropdown-item" to="/animation"> Animation</Link></li>
            <li><Link className="dropdown-item" to="/comedy"> Comedy</Link></li>
            <li><Link className="dropdown-item" to="/crime"> Crime</Link></li>
            <li><Link className="dropdown-item" to="/drama"> Drama</Link></li>
            <li><Link className="dropdown-item" to="/family"> Family</Link></li>
            <li><Link className="dropdown-item" to="/fantasy"> Fantasy</Link></li>
            <li><Link className="dropdown-item" to="/horror"> Horror</Link></li>
          </ul>
        </li>

        <li className="nav-item dropdown">
          <Link className="nav-link dropdown-toggle" to="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
              Country
          </Link>
          <ul className="dropdown-menu"> 
            <li><Link className="dropdown-item" to="/US">United States</Link></li>
            <li><Link className="dropdown-item" to="/IN"> India</Link></li>
            <li><Link className="dropdown-item" to="/FR"> France</Link></li>
            <li><Link className="dropdown-item" to="/JP"> Japan</Link></li>
            <li><Link className="dropdown-item" to="/KR"> South Korea</Link></li>
            <li><Link className="dropdown-item" to="/DE"> Germany</Link></li>
            <li><Link className="dropdown-item" to="/GB"> United Kingdom</Link></li>
            <li><Link className="dropdown-item" to="/CN"> China</Link></li>
            <li><Link className="dropdown-item" to="/CA"> Canada</Link></li>
          </ul>
        </li>

        <Link className="nav-link active" aria-current="page" to="/toprated">Top Rated</Link>
  

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
        <Link className="nav-link active" aria-current="page" to="/watchlist">Watch List</Link>

        <Link className="nav-link active" aria-current="page" to="/landing"></Link>
      </ul>
      <form className="d-flex" role="search" onSubmit={handleSearch}>
        <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search" value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}/>
        <button className="btn btn-outline-success" type="submit">Search</button>
      </form>
    </div>
  </div>
</nav>
    </>
  )
}

export default Navbar