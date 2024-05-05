import axios from "axios";
import {React, useState, useEffect} from "react";
import { Link } from 'react-router-dom';
import './index.css';
import './App.css';

function FolderTemplate(folder_ID){
    const {folderID} = folder_ID;
    const [children, setChildren] = useState([]);
    const [sets, setSets] = useState([]);

    useEffect(() =>{
        axios.post('http://localhost:9000/getFolderByID', {folderID : folderID})
        .then((res) => {
            setChildren(res.data.children);
            setSets(res.data.sets);
        })
        .catch((err) => {
            alert("ERROR: /getFolderByID: " + err);
        })
    }, [folderID])

    const handleDeleteFolder = (folder_id) => {
        //event.preventDefault()
        axios.post('http://localhost:9000/deleteFolder', { deletedID: folder_id })
        .catch((err) => {
            alert('Error in Deleting Folder: ' + err)
        });
    }

    return (
        <div>
            <h3>
                Folders: <Link to={`/createFolder/${folderID}`}>Create New Folder</Link>
            </h3>
            <ul>
              {children.map((child) => {
                return (
                  <li>
                    <Link to={`/ViewFolder/${child._id}`}>{child.title}</Link>
                    <button onClick={() => handleDeleteFolder(child._id)}> Delete </button>
                  </li>
                );
              })}
            </ul>
            <h3>
                Sets: <Link to={`/createCardSet/${folderID}`}>Create New Set</Link>
            </h3>
            <ul>
              {sets.map((set) => {
                return (
                  <li>
                    <Link to={`/viewCardSet/${set._id}`}>{set.title}</Link>
                  </li>
                );
              })
              }
            </ul>
        </div>
    )
}

export default FolderTemplate;
