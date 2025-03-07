import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const Signup = (props) => {
  const [credentials, setCredentials] = useState({ email: "", password: "", name: "" });
  const navigate = useNavigate();

  const handleClick = async (e) => {
    e.preventDefault();
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/createuser`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email: credentials.email, password: credentials.password, name: credentials.name }),
    });
    const json = await response.json();
    console.log(json);
    if (json.success) {
      localStorage.setItem("auth-token", json.authtoken);
      navigate('/');
      props.showAlert("Account Created Successfully", "success");
    } else {
      props.showAlert("Invalid Details", "danger");
    }
  };

  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  return (
    <>
      <h2 style={{ color: "white", textAlign: "center", marginBottom: "1rem" }}>
        Sign Up to Continue
      </h2>
      <StyledWrapper>
        <form className="form" onSubmit={handleClick}>
          <div className="flex-column">
            <label htmlFor="name">Name</label>
          </div>
          <div className="inputForm">
            <input
              type="text"
              className="input"
              name="name"
              id="name"
              onChange={onChange}
              minLength={5}
              required
              placeholder="Enter your Name"
            />
          </div>
          <div className="flex-column">
            <label htmlFor="email">Email</label>
          </div>
          <div className="inputForm">
            <svg height={20} viewBox="0 0 32 32" width={20} xmlns="http://www.w3.org/2000/svg">
              <path d="m30.853 13.87a15 15 0 0 0 -29.729 4.082 15.1 15.1 0 0 0 12.876 12.918 15.6 15.6 0 0 0 2.016.13 14.85 14.85 0 0 0 7.715-2.145 1 1 0 1 0 -1.031-1.711 13.007 13.007 0 1 1 5.458-6.529 2.149 2.149 0 0 1 -4.158-.759v-10.856a1 1 0 0 0 -2 0v1.726a8 8 0 1 0 .2 10.325 4.135 4.135 0 0 0 7.83.274 15.2 15.2 0 0 0 .823-7.455zm-14.853 8.13a6 6 0 1 1 6-6 6.006 6.006 0 0 1 -6 6z" />
            </svg>
            <input
              type="email"
              className="input"
              name="email"
              id="email"
              onChange={onChange}
              minLength={5}
              required
              placeholder="Enter your Email"
            />
          </div>
          <div className="flex-column">
            <label htmlFor="password">Password</label>
          </div>
          <div className="inputForm">
            <svg height={20} viewBox="-64 0 512 512" width={20} xmlns="http://www.w3.org/2000/svg">
              <path d="m336 512h-288c-26.453125 0-48-21.523438-48-48v-224c0-26.476562 21.546875-48 48-48h288c26.453125 0 48 21.523438 48 48v224c0 26.476562-21.546875 48-48 48zm-288-288c-8.8125 0-16 7.167969-16 16v224c0 8.832031 7.1875 16 16 16h288c8.8125 0 16-7.167969 16-16v-224c0-8.832031-7.1875-16-16-16zm0 0" />
              <path d="m304 224c-8.832031 0-16-7.167969-16-16v-80c0-52.929688-43.070312-96-96-96s-96 43.070312-96 96v80c0 8.832031-7.167969 16-16 16s-16-7.167969-16-16v-80c0-70.59375 57.40625-128 128-128s128 57.40625 128 128v80c0 8.832031-7.167969 16-16 16zm0 0" />
            </svg>
            <input
              type="password"
              className="input"
              onChange={onChange}
              name="password"
              id="password"
              minLength={5}
              required
              placeholder="Enter your Password"
            />
          </div>
          <div className="inputForm">
            <svg height={20} viewBox="-64 0 512 512" width={20} xmlns="http://www.w3.org/2000/svg">
              <path d="m336 512h-288c-26.453125 0-48-21.523438-48-48v-224c0-26.476562 21.546875-48 48-48h288c26.453125 0 48 21.523438 48 48v224c0 26.476562-21.546875 48-48 48zm-288-288c-8.8125 0-16 7.167969-16 16v224c0 8.832031 7.1875 16 16 16h288c8.8125 0 16-7.167969 16-16v-224c0-8.832031-7.1875-16-16-16zm0 0" />
              <path d="m304 224c-8.832031 0-16-7.167969-16-16v-80c0-52.929688-43.070312-96-96-96s-96 43.070312-96 96v80c0 8.832031-7.167969 16-16 16s-16-7.167969-16-16v-80c0-70.59375 57.40625-128 128-128s128 57.40625 128 128v80c0 8.832031-7.167969 16-16 16zm0 0" />
            </svg>
            <input
              type="password"
              className="input"
              onChange={onChange}
              name="cpassword"
              id="cpassword"
              minLength={5}
              required
              placeholder="Confirm your Password"
            />
          </div>
          <button className="button-submit">Sign Up</button>
          <div className="flex-row">
            <button className="btn google">
              <svg version="1.1" width={20} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                <path style={{ fill: '#FBBB00' }} d="M113.47,309.408L95.648,375.94l-65.139,1.378C11.042,341.211,0,299.9,0,256c0-42.451,10.324-82.483,28.624-117.732h0.014l57.992,10.632l25.404,57.644c-5.317,15.501-8.215,32.141-8.215,49.456C103.821,274.792,107.225,292.797,113.47,309.408z" />
                <path style={{ fill: '#518EF8' }} d="M507.527,208.176C510.467,223.662,512,239.655,512,256c0,18.328-1.927,36.206-5.598,53.451c-12.462,58.683-45.025,109.925-90.134,146.187l-0.014-0.014l-73.044-3.727l-10.338-64.535c29.932-17.554,53.324-45.025,65.646-77.911h-136.89V208.176h138.887L507.527,208.176z" />
                <path style={{ fill: '#28B446' }} d="M416.253,455.624l0.014,0.014C372.396,490.901,316.666,512,256,512c-97.491,0-182.252-54.491-225.491-134.681l82.961-67.91c21.619,57.698,77.278,98.771,142.53,98.771c28.047,0,54.323-7.582,76.87-20.818L416.253,455.624z" />
                <path style={{ fill: '#F14336' }} d="M419.404,58.936l-82.933,67.896c-23.335-14.586-50.919-23.012-80.471-23.012c-66.729,0-123.429,42.957-143.965,102.724l-83.397-68.276h-0.014C71.23,56.123,157.06,0,256,0C318.115,0,375.068,22.126,419.404,58.936z" />
              </svg>
              Google
            </button>
          </div>
        </form>
      </StyledWrapper>
    </>
  );
};

const StyledWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-start; /* Changed from center to flex-start */
  min-height: 100%; /* Use full height of parent container */
  height: auto; /* Allow natural growth */
  padding: 1rem; /* Reduced padding for smaller screens */
  background: linear-gradient(135deg, #1a1a1a, #0d0d0d, #000000);

  .form {
    display: flex;
    flex-direction: column;
    gap: 8px; /* Slightly reduced gap */
    background-color: #1e1e1e;
    padding: 20px; /* Reduced padding for smaller screens */
    width: 90%;
    max-width: 450px;
    border-radius: 20px;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
    overflow-y: auto; /* Allow scrolling if content overflows */
  }

  ::placeholder {
    color: #ccc;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  }

  .flex-column > label {
    color: #fff;
    font-weight: 600;
    font-size: 14px; /* Slightly smaller font for labels */
  }

  .inputForm {
    border: 1.5px solid #333;
    border-radius: 10px;
    height: 45px; /* Reduced height for better fit */
    display: flex;
    align-items: center;
    padding-left: 10px;
    transition: 0.2s ease-in-out;
    background-color: #333;
  }

  .input {
    margin-left: 10px;
    border-radius: 10px;
    border: none;
    width: 85%;
    height: 100%;
    background-color: transparent;
    color: #fff;
    font-size: 14px; /* Smaller font for inputs */
  }

  .input:focus {
    outline: none;
  }

  .inputForm:focus-within {
    border: 1.5px solid #2d79f3;
  }

  .flex-row {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 10px;
    justify-content: space-between;
  }

  .button-submit {
    margin: 15px 0 10px 0; /* Reduced top margin */
    background-color: #2d79f3;
    border: none;
    color: white;
    font-size: 15px;
    font-weight: 500;
    border-radius: 10px;
    height: 45px; /* Reduced height */
    width: 100%;
    cursor: pointer;
  }

  .button-submit:hover {
    background-color: #1a5bbf;
  }

  .btn {
    margin-top: 10px;
    width: 100%;
    height: 45px; /* Reduced height */
    border-radius: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: 500;
    gap: 10px;
    border: 1px solid #444;
    background-color: #333;
    color: #fff;
    cursor: pointer;
    transition: 0.2s ease-in-out;
  }

  .btn:hover {
    border: 1px solid #2d79f3;
  }

  /* Media query for iPhones and smaller screens */
  @media (max-width: 768px) {
    padding: 0.5rem; /* Further reduce padding */
    .form {
      padding: 15px; /* Smaller padding */
      gap: 6px; /* Smaller gap */
    }
    .inputForm {
      height: 40px; /* Smaller input height */
    }
    .button-submit {
      height: 40px; /* Smaller button height */
      font-size: 14px;
    }
    .btn {
      height: 40px; /* Smaller button height */
      font-size: 14px;
    }
    .flex-column > label {
      font-size: 12px; /* Smaller label font */
    }
    .input {
      font-size: 12px; /* Smaller input font */
    }
  }
`;

export default Signup;