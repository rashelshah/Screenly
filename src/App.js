import React, {useState} from 'react';
import './App.css';
import Movies from './components/Movies';
import Navbar from './components/Navbar';
import LandingPage from './components/LandingPage';
import {
  Routes,
  Route,
} from "react-router-dom";
import Login from './components/Authentication/Login';
import Signup from './components/Authentication/Signup';



function App() {
  const apiKey = process.env.REACT_APP_API_KEY; 
  const [alert, setAlert] = useState(null);
  
  
  const showAlert = (message, type)=>{
    setAlert({
    message: message,
    type: type
    });
    setTimeout(() => {
      setAlert(null);
    }, 1500);
  }




  return (
   <>
    <Navbar alert={alert}/>
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

    
      <Route exact path="/login" element={<Login showAlert={showAlert}/>}/>
      <Route exact path="/signup" element={<Signup showAlert={showAlert} />} />

      <Route path="/landingpage" element={<LandingPage apiKey={apiKey}/>}/>
      
    </Routes>
   </>
  );
}

export default App;