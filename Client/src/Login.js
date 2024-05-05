import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import './Login.css';
import Navbar from "./NavBar";

function Login() {
  const navigate = useNavigate();
  // Intialize state for user input.
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  const handleLogin = (event) => {
    event.preventDefault();
    // TODO: does password hashing happen here or in "server"?
    const loginValues = { username: username, password : password};
    // Reset values, needed if user creates multiple accounts in successsion.
    setPassword("");
    setUsername("");
    // TODO: should this be a get
    axios.post('http://localhost:9000/loginUser', loginValues)
      .then((res) => {
        if (res.data) {
          // update local storage with new user
          localStorage.clear()
          localStorage.setItem('loggedInUser', res.data._id)
          navigate("/Home");
          alert('Login Successful')
        }
        else
          alert('Wrong Credentials')
      })
      // TODO: maybe have better errors.
      .catch((_) => alert('Error in Login'));
  };
  
  return (
    <div className="background">
      <Navbar/>
      <form className="Login">
        <h1>Login</h1>
          <div className="usr">
          <label><b>Username:</b></label>
          <input 
            value={username} 
            onChange={(e) => {setUsername(e.target.value)}}
          />
          <br/>
          <div className="psw"></div>
            <label><b>Password:</b></label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => {setPassword(e.target.value)}}
            />
          </div>
          <br/>
        <button 
          className="submit" 
          disabled={!(username && password)} 
          onClick={handleLogin} 
          type="submit"
        >
          Login!
        </button>
      </form>
    </div>)
}

export default Login;
