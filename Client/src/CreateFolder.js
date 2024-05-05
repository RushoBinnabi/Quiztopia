import axios from "axios";
import React, { useState } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import './index.css';
import './App.css';
import Navbar from "./NavBar";

function CreateFolder(){
    const navigate = useNavigate();
    const [title, setTitle] = useState("");
    const { folderID } = useParams();

    const handleCreateFolder = (event) => {
        event.preventDefault();
        axios.post('http://localhost:9000/createFolder', {title : title, parentID : folderID})
        .then((res) =>{
            if (res.data){
                alert('Great success!');
                navigate(`/viewFolder/${folderID}`);
            }
            else{
                alert("No.");
            }
        })
        .catch((err) => {
            alert("ERROR: " + err);
        });
    }

    return (
        <div className="background">
          <Navbar/>
          <h1>Create New Folder!</h1>
          <form className="center">
            Title:
            <input className="inputBoxSizes" value={title} onChange={(e) => {setTitle(e.target.value)}} />
            <br />
            <button className="loginButtonSpacing" disabled={!(title)} onClick={handleCreateFolder} type="submit">submit</button>
          </form>
        </div>
    );
}

export default CreateFolder;