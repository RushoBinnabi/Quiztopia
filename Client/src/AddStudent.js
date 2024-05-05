import axios from 'axios'
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import Template from './Template.js';

function AddStudent(){

    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const {classID} = useParams();
    
    const addStudent = (() => {
        axios.post('http://localhost:9000/addStudent', {
            classID : classID,
            studentUsername : username
        })
        .then((res) => {
            alert("Great success! :)");
            navigate(`/viewClass/${classID}`);
        })
        .catch((err) => {
            alert("ERROR: /addStudent: " +  err);
        });
    });

    return (Template("Add Student", (
      <div className='background'>
        <label>
          Enter the students's username here:
        </label>
        <br/>
        <input
          className="inputBoxSizes"
          type="text"
          value={username}
          onChange={(e) => {setUsername(e.target.value)}}
          placeholder="Student's username"
          required
        />
        <br/>
        <button
          type="submit"
          onClick={addStudent}
          disabled = {!username}
        >
          Add Student.
        </button>
      </div>
    )))
}

export default AddStudent;