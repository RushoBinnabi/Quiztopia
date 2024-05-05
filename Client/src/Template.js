import React from "react";
import { Link } from 'react-router-dom';
import './App.css';
import Navbar from "./NavBar";

function Template(title, content) {

    const loggedInUser = localStorage.getItem('loggedInUser')

    return (<div className="background">
        <Navbar />
        <h1>{title}</h1>
        <>
            {loggedInUser != null &&
                content
            }
        </>

        <>
            {loggedInUser == null &&
                <p className="text-center">
                    This page is unavailable unless you have an account. <br />
                    Already have an account? <Link to="/login">Login</Link>
                    <br />
                    Want to create an account? <Link to="/signUp">Sign Up</Link>
                </p>
            }
        </>
    </div>)
}

export default Template;
