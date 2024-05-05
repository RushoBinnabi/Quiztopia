import { React, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
//import Template from './Template';
import './App.css';
import FolderTemplate from './FolderTemplate';
import Navbar from './NavBar';

function Home() {
  const loggedInUser = localStorage.getItem('loggedInUser');

  const [username, setUsername] = useState("");
  const [folderID, setFolderID] = useState("");
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (loggedInUser != null) {
      axios.post('http://localhost:9000/getUser', { userID: loggedInUser })
        .then((res) => {
          setUsername(res.data.username);
          setFolderID(res.data.folder);
          setLoading(false);
          if (res.data.classes)
            setClasses(res.data.classes);
        })
        .catch((err) => {
          alert("/getUser: " + err);
        })
    }
  }, [loggedInUser]);


  return (
    <div className='background'>
      <Navbar/>
      <h1>
        Welcome{loggedInUser != null && `, ${username}`} to Quiztopia!!!
      </h1>

      {loggedInUser != null &&
        <>
            {classes != null &&
              <>
                <h2>
                  Classes:
                </h2>
                <ul>
                  {classes.map((clase) => {
                    return (
                      <li>
                        <Link to={`/ViewClass/${clase._id}`}>{clase.title}</Link>
                      </li>
                    );
                  })}
                </ul>
              </>
            }
            {!loading && folderID &&
              <>
                <FolderTemplate folderID={folderID} />
              </>
            }
        </>
          }
        </div>
      )
}

export default Home;
