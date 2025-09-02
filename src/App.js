import React, {useState, useEffect} from 'react';
import './App.css';
import Movies from './components/Movies';
import Navbar from './components/Navbar';
import LandingPage from './components/LandingPage';
import {
  Routes,
  Route,
  useLocation, 
  useNavigate
} from "react-router-dom";
import Login from './components/Authentication/Login';
import Signup from './components/Authentication/Signup';
import Watchlist from './components/Watchlist'; 


function App() {
  const apiKey = process.env.REACT_APP_API_KEY; 
  const [alert, setAlert] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const [authToken, setAuthToken] = useState(localStorage.getItem("auth-token"));
  

  const showAlert = (message, type)=>{
    setAlert({
    message: message,
    type: type
    });
    setTimeout(() => {
      setAlert(null);
    }, 700);
  }


 // Component to handle Google OAuth callback
 const GoogleAuthHandler = ({ setAuthToken, showAlert }) => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const loginStatus = urlParams.get("login");
    const token = urlParams.get("token");
    const error = urlParams.get("error");

    if (loginStatus === "success" && token) {
      // Save token
      localStorage.setItem("auth-token", token);
      setAuthToken(token); // <-- update React state immediately
      showAlert("Logged in successfully with Google!", "success");

      // Redirect to homepage
      navigate("/");

      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (error) {
      let errorMessage = "Login failed";
      if (error === "auth_failed") errorMessage = "Google authentication failed";
      else if (error === "server_error") errorMessage = "Server error occurred";

      showAlert(errorMessage, "danger");

      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [location, navigate, setAuthToken, showAlert]);

  return null;
};

  return (
   <>
       <GoogleAuthHandler setAuthToken={setAuthToken} showAlert={showAlert} />
       <Navbar authToken={authToken} setAuthToken={setAuthToken} alert={alert} />
    <Routes>
      <Route path="/" element={<Movies  apiKey={apiKey}/>}/>
      <Route path="/home" element={<Movies apiKey={apiKey}/>}/>
      <Route path="/action" element={<Movies genre_id="28" apiKey={apiKey} key={28}/>}/>
      <Route path="/adventure" element={<Movies genre_id="12" apiKey={apiKey} key={12}/>}/>
      <Route path="/animation" element={<Movies genre_id="16" apiKey={apiKey} key={16}/>}/>
      <Route path="/comedy" element={<Movies genre_id="35" apiKey={apiKey} key={35}/>}/>
      <Route path="/crime" element={<Movies genre_id="80" apiKey={apiKey} key={80}/>}/>
      <Route path="/drama" element={<Movies genre_id="18" apiKey={apiKey} key={18}/>}/>
      <Route path="/family" element={<Movies genre_id="10751" apiKey={apiKey} key={10751}/>}/>
      <Route path="/fantasy" element={<Movies genre_id="14" apiKey={apiKey} key={14}/>}/>
      <Route path="/horror" element={<Movies genre_id="27" apiKey={apiKey} key={27}/>}/>


      <Route path="/US" element={<Movies country="US" apiKey={apiKey} key="US"/>}/>
      <Route path="/IN" element={<Movies country="IN" apiKey={apiKey} key="IN"/>}/>
      <Route path="/FR" element={<Movies country="FR" apiKey={apiKey} key="FR"/>}/>
      <Route path="/JP" element={<Movies country="JP" apiKey={apiKey} key="JP"/>}/>
      <Route path="/KR" element={<Movies country="KR" apiKey={apiKey} key="KR"/>}/>
      <Route path="/DE" element={<Movies country="DE" apiKey={apiKey} key="DE"/>}/>
      <Route path="/GB" element={<Movies country="GB" apiKey={apiKey} key="GB"/>}/>
      <Route path="/CN" element={<Movies country="CN" apiKey={apiKey} key="CN"/>}/>
      <Route path="/CA" element={<Movies country="CA" apiKey={apiKey} key="CA"/>}/>

      <Route path="/toprated" element={<Movies movieList="top_rated" apiKey={apiKey}/>}/>


      <Route path="/2025" element={<Movies year="2025" apiKey={apiKey} key={2025}/>}/>
      <Route path="/2024" element={<Movies year="2024" apiKey={apiKey} key={2024}/>}/>
      <Route path="/2023" element={<Movies year="2023" apiKey={apiKey} key={2023}/>}/>

    
      <Route exact path="/login" element={<Login showAlert={showAlert} setAuthToken={setAuthToken}/>}/>
      <Route exact path="/signup" element={<Signup showAlert={showAlert} setAuthToken={setAuthToken}/>} />

      <Route path="/landingpage" element={<LandingPage apiKey={apiKey}/>}/>

      <Route path="/watchlist" element={<Watchlist />} />
      
      
    </Routes>
   </>
  );
}

export default App;