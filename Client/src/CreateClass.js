import axios from 'axios';
import { React, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './index.css';
import Template from './Template.js';
import './App.css';

    const CreateClass = () => {

        const navigate = useNavigate();
        const loggedInUser = localStorage.getItem('loggedInUser')

        //const [owner, setOwner] = useState("");
        const [title, setTitle] = useState("");
        const [description, setDescription] = useState("");

        const handleCreateClass = (event) => {

            event.preventDefault();
            axios.post('http://localhost:9000/createClass', {
                title : title, 
                description : description, 
                owner : loggedInUser
            })
            .then((res) => {
                if (res.data){
                    alert("Great success! :)");
                    navigate(`/viewClass/${res.data._id}`);
                }
                else
                    alert("Error creating class.");
            })
            .catch((err) => {
                alert("Error: /createClass: " + err);
            })
        };

        // useEffect(() => {
        //     setOwner(loggedInUser);
        // });

        return Template("Create Class", 
          <div className='background'>
            <h2>
              Enter the name and description of your class. 
              (Don't worry, you can add students and teachers later.)
            </h2>
            <form>
              <label>Enter a title: </label>
              <br/>
              <input 
                className="inputBoxSizes"
                type="text"
                value={title}
                onChange={(e) => {setTitle(e.target.value)}}
                placeholder="Title"
                required
              />
              <br/>
              <label>Enter a description: </label>
              <br/>
              <input
                className="inputBoxSizes"
                type="text"
                value={description}
                onChange={(e) => {setDescription(e.target.value)}}
                placeholder="Description"
                required
              />
              <br/>
              
            </form>
            <button 
              type = "submit"
              onClick = {handleCreateClass}
              disabled = {!(title && description)}
            >
              Create Class!
            </button>
          </div>
        );
    }

    export default CreateClass;
    