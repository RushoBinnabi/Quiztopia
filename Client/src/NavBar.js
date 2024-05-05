import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
const Navbar = () => {
  const loggedInUser = localStorage.getItem('loggedInUser')
  const navigate = useNavigate();
  const [folderID, setFolderID] = useState("");

  useEffect(() => {
    if (loggedInUser != null) {
      axios.post('http://localhost:9000/getUser', { userID: loggedInUser })
        .then((res) => {
          setFolderID(res.data.folder);
        })
        .catch((err) => {
          alert("/getUser: " + err);
        })
    }
  }, [loggedInUser]);
  const handleLogout = (event) => {
    event.preventDefault()
    localStorage.clear()
    navigate("/Home");
  }
  
  return (
    <p className='navbar-center'>
      {loggedInUser == null &&
        <>
          <Link to="/Login">Login </Link>
          <Link to="/Signup">Signup </Link>
        </>
      }
      {loggedInUser != null &&
        <>
          <Link to='/Home'>Home </Link>
          <Link to={`/ViewFolder/${folderID}`}>View Folders </Link>
          <Link to='/CreateClass'>Create New Class</Link>
          <button onClick={(handleLogout)}>Logout</button>
        </>
      }
      <Link to='/help'>Tech Support</Link>
    </p>

  )
}

export default Navbar;
