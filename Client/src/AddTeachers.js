import axios from 'axios'
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import Template from './Template.js';

function AddTeacher(){

    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const {classID} = useParams();
    
    const addTeacher = (() => {
        axios.post('http://localhost:9000/addTeacher', {
            classID : classID,
            teacherUsername : username
        })
        .then((res) => {
            alert("Great success! :)");
            navigate(`/viewClass/${classID}`);
        })
        .catch((err) => {
            alert("ERROR: /addTeacher: " +  err);
        });
    });

    return (Template("Add Teacher", (
      <div className='background'>
        <label>
          Enter the teacher's username here:
        </label>
        <br/>
        <input
          className="inputBoxSizes"
          type="text"
          value={username}
          onChange={(e) => {setUsername(e.target.value)}}
          placeholder="Teacher's username"
          required
        />
        <br/>
        <button
          type="submit"
          onClick={addTeacher}
          disabled = {!username}
        >
          Add Teacher.
        </button>
      </div>
    )))
}

export default AddTeacher;