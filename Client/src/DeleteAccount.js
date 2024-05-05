import {React, useState} from "react";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import Template from "./Template";
import './App.css';

function DeleteAccount() {
  const navigate = useNavigate();
  // Intialize state for user input.
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  const handleDeleteAccount = (event) => {
    event.preventDefault();
    const deleteAccountValues = { username, password };
    setPassword("");
    setUsername("");
    axios.post('http://localhost:9000/loginUser', deleteAccountValues)
      .then(res => {
        if (res.data) {
          const userID = res.data._id;
          axios.post('http://localhost:9000/deleteUser', {userID}).then(_ => {
            localStorage.clear()
            navigate("/Home");
            alert('Account Deletion Successful')
          })
        }
        else
          alert('Wrong Credentials, could not delete acount')
      })
      .catch((_) => alert('Error in Account Deletion Up'));
  };
  return Template("Account deletion",
    <div className="background">
      <form className="center">
        Please enter your username to verify it is you
        <input className="inputBoxSizes" value={username} onChange={(e) => setUsername(e.target.value)} />
        <br />
        Please enter your password to verify it is you
        <input className="inputBoxSizes" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </form>
      <button className="loginButtonSpacing" disabled={!(username && password)}

        onClick={(event) => {
          // prompt the user with yes or no question to see if they really want ot delete their account, only try to delete it if they say yes
          if (window.confirm("Do you really want to delete your account?")) { handleDeleteAccount(event) }
        }}
        type="submit">Delete Your Account</button>
    </div>)
}

export default DeleteAccount;
