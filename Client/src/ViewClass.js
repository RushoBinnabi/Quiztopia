import axios from "axios";
import React, { useState, useEffect } from "react";
import {Link, useParams} from 'react-router-dom';
import Template from './Template.js'
import FolderTemplate from "./FolderTemplate.js";
import './index.css';
import './App.css';

const ViewClass = () => {

    const loggedInUser = localStorage.getItem('loggedInUser');

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [folderID, setFolderID] = useState('');
    const [ownerID, setOwnerID] = useState('');
    const [studentIDs, setStudentIDs] = useState([]);
    const [teacherIDs, setTeacherIDs] = useState([]);
    const [students, setStudents] = useState([]);
    const [teachers, setTeachers] = useState([]);
    const [loading, setLoading] = useState(true);

    const { classID } = useParams();

    // Get class info.
    useEffect(() => {
        axios.post('http://localhost:9000/getClass', {classID})
        .then((res) => {
            setTitle(res.data.title);
            setDescription(res.data.description);
            setFolderID(res.data.folder);
            setLoading(false);
            setOwnerID(res.data.owner);
            setTeacherIDs(res.data.teachers);
            setStudentIDs(res.data.students);
        })
        .catch((err) => {
            alert("ERROR: /getClass: " + err);
        });
    }, [classID]);

    // Get student info
    useEffect(() => {
        if (studentIDs !== null && studentIDs.length !== 0){
            axios.post('http://localhost:9000/getUsers', {userIDs : studentIDs})
            .then((res) => {
                setStudents(res.data);
            })
            .catch((err) => {
                alert('ERROR: Student /getUsers: ' + err);
            });
        }
    }, [studentIDs]);

    // Get teacher info
    useEffect(() => {
        if (teacherIDs !== null && teacherIDs.length !== 0){
            axios.post('http://localhost:9000/getUsers', {userIDs : teacherIDs})
            .then((res) => {
                setTeachers(res.data);
            })
            .catch((err) => {
                alert('ERROR: Teachers /getUsers: ' + err);
            });
        }
    }, [teacherIDs]);

    const removeTeacher = (teacherID) => {
        axios.post('http://localhost:9000/removeTeacher', {
            classID : classID,
            teacherID : teacherID,
        })
        .then((res) => {
            setTeacherIDs(res.data);
        })
        .catch((err) =>{
            alert('ERROR: /removeStudent: ' + err)
        })
    };

    const removeStudent = (studentID) => {
        axios.post('http://localhost:9000/removeStudent', {
            classID : classID,
            studentID : studentID,
        })
        .then((res) => {
            setStudentIDs(res.data);
        })
        .catch((err) =>{
            alert('ERROR: /removeStudent: ' + err)
        })
    };

    return Template(title, 
      <div className="background">
        <p>{description}</p>
        { loggedInUser === ownerID &&
          <>
            <h2>Teachers: <Link to={`/addTeacher/${classID}`}>Add teachers</Link></h2>
            <ul>
              {teachers.map((teacher) => {
                return (
                    <li>
                      {`${teacher.firstName} ${teacher.lastName} `}
                      <button 
                        type="button"
                        onClick = {() => removeTeacher(teacher._id)}
                      >Remove teacher</button>
                    </li>
                )
              })}
            </ul>
          </>
        }
        { (loggedInUser === ownerID || teacherIDs.indexOf(loggedInUser) !== -1) &&
            <>
              <h2>Students: <Link to={`/addStudent/${classID}`}>Add students</Link></h2>
              <ul>
                {students.map((student) => {
                    return (
                        <li>
                          {`${student.firstName} ${student.lastName} `}
                            <button
                              type="button"
                              onClick = {() => removeStudent(student._id)}
                            >
                              Remove Student
                            </button>
                        </li>
                    )
                })}
              </ul>
            </>
        }
        {!loading && folderID && 
          <FolderTemplate folderID = {folderID}/>
        }
      </div>
    );
}
export default ViewClass;
