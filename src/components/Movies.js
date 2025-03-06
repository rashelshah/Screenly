import React,{useState,useEffect} from "react";
import Movieitem from "./Movieitem";
import InfiniteScroll from 'react-infinite-scroll-component';
import Loader from "./Loader";
import { useLocation } from "react-router-dom";

const genres = {
  '28': 'Action',
  '12': 'Adventure',
  '16': 'Animation',
  '35': 'Comedy',
  '80': 'Crime',
  '18': 'Drama',
  '10751': 'Family',
  '14': 'Fantasy',
  '27': 'Horror'
};

const countries = {
  'US': 'United States',
  'IN': 'India',
  'FR': 'France',
  'JP': 'Japan',
  'KR': 'South Korea',
  'DE': 'Germany',
  'GB': 'United Kingdom',
  'CN': 'China',
  'CA': 'Canada'
}; 
const Movies = (props) => {
  const location = useLocation();
  const [results, setResults] = useState([])
  const [total_results, settotalResults] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [category, setCategory] = useState("movie");
  const [hasMore, setHasMore] = useState(true);

  console.log("Gnere ID:", props.genre_id);
  console.log("Country ID:", props.country);
  console.log("Year ID:", props.year);
  console.log("Category:", category);
  console.log("Movie List:", props.movieList);



  const getSearchQuery = () => {
    const params = new URLSearchParams(location.search);
    return params.get('search');
  };

  const fetchData = async (pageNum) => {
    const searchQuery = getSearchQuery();
    let url;

    if (searchQuery) {
      url = `https://api.themoviedb.org/3/search/${category}?api_key=${props.apiKey}&query=${searchQuery}&page=${pageNum}`;
    } else {
      url = `https://api.themoviedb.org/3/discover/${category}?api_key=${props.apiKey}&sort_by=popularity.desc&page=${pageNum}`;
      // Add existing filters here
    }

    const response = await fetch(url);
    const data = await response.json();
    return data;
  };

  useEffect(() => {
    const loadInitialData = async () => {
      const data = await fetchData(1);
      setResults(data.results);
      setHasMore(data.page < data.total_pages);
      setPage(1);
    };
    loadInitialData();
  }, [location.search, category]);

  const loadMore = async () => {
    const data = await fetchData(page + 1);
    setResults(prev => [...prev, ...data.results]);
    setHasMore(data.page < data.total_pages);
    setPage(prev => prev + 1);
  };
  const movieList = "top_rated";

  const updateMovies = async ()=>{
     let url = `https://api.themoviedb.org/3/discover/${category}?api_key=${props.apiKey}&sort_by=popularity.desc`;   

    if(props.movieList){
      url = `https://api.themoviedb.org/3/${category}/top_rated?api_key=${props.apiKey}&sort_by=popularity.desc`;
    } 

  if(props.genre_id) {
    url += `&with_genres=${props.genre_id}`;
  }

  if(props.country) {
    url += `&with_origin_country=${props.country}`;
  }

  if(props.year) {
    url += category === "movie" ? `&primary_release_year=${props.year}` : `&first_air_date_year=${props.year}`;
  }

  let data = await fetch(url);
  let parsedData = await data.json();
    setResults(parsedData.results)
    setLoading(false);
    settotalResults(parsedData.total_results) 
    setPage(1);
  }



  useEffect(() => { 
     updateMovies();
  }, [props.genre_id, props.country,props.year,category, props.movieList]);

  const getActiveFilters = () => {
    const filters = [];
    
    if (props.movieList === "top_rated") {
      filters.push("Top Rated");
    }

    if(props.genre_id && genres[props.genre_id]) {
      filters.push(genres[props.genre_id]);
    }
    
    if(props.country && countries[props.country]) {
      filters.push(countries[props.country]);
    }
    if(props.category && category[props.category]) {
      filters.push(category[props.category]);
    }
    
    if(props.year) {
      filters.push(`${props.year}`);
    }

    return filters;
  };

  const getHeadingText = () => {
    const activeFilters = getActiveFilters();
    const categoryText = category === 'movie' ? 'Movies' : 'TV Shows';
    
    if(activeFilters.length > 0) {
      return `${activeFilters.join(' • ')} - ${categoryText}`;
    }
    return categoryText;
  };




  return (
    <div className="container my-3">
{    /*<h1>{`${category} - `}</h1>*/}
  <div className="button-btn">
  <button 
    className={`btn btn-category ${category === "movie" ? 'active' : ''}`} 
    onClick={() => setCategory("movie")}
  >
    Movies
  </button>
  <button 
    className={`btn btn-category ${category === "tv" ? 'active' : ''}`} 
    onClick={() => setCategory("tv")}
  >
    TV Shows
  </button>
    </div>
    <div className="type-heading">
      <h1>{getHeadingText()}</h1>
    </div>
    {loading && <Loader/>}
    <InfiniteScroll
          dataLength={results.length}
          next={loadMore}
          hasMore={hasMore}
         /*next={fetchMoreData}
          hasMore={results.length < total_results}*/
          loader={<Loader/>}
        >
    <div className='row' style={{marginTop:'1px'}}>
      {results.map((element)=>{
      return <div className="col-6 col-md-2">
         <Movieitem
         key={element.id}
         title={element.title|| element.name}
         poster={element.poster_path}
         date={element.release_date|| element.first_air_date}
         vote_average={element.vote_average}
         overview={element.overview}
         genre_id={element.genre_ids}
         id={element.id}
         media_type={category}
         />
      </div>
      })}
      </div>
      </InfiniteScroll>
    </div>
  );
};

export default Movies;
