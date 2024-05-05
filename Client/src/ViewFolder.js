import axios from "axios";
import {React, useState, useEffect} from "react";
import { Link, useParams } from 'react-router-dom';
import './index.css';
import './App.css';
import Template from './Template.js'
import FolderTemplate from "./FolderTemplate";

const ViewFolder = () => {

    const [title, setTitle] = useState("");
    const [parentID, setParentID] = useState('');
    const [parentTitle, setParentTitle] = useState("");

    const { folderID } = useParams();

    useEffect(() =>{
        axios.post('http://localhost:9000/getFolderByID', {folderID })
        .then((res) => {
            setTitle(res.data.title);
            if (res.data.parent){
                setParentID(res.data.parent._id);
                setParentTitle(res.data.parent.title);
            }
            else{
                setParentID('');
                setParentTitle("");
            }
        })
        .catch((err) => {
            alert("ERROR: " + err);
        })
    }, [folderID])

    return Template( "View Folder",
        <div className="background">
            <h1>{
                    parentID != null &&  <Link to={`/viewFolder/${parentID}`}>{parentTitle}</Link>
                } 
                {
                    parentID === '' && <Link to="/home">Home</Link>
                }
                {" >"} {title}
            </h1>
            <FolderTemplate folderID = {folderID}/>
        </div>
    )
}
export default ViewFolder;
