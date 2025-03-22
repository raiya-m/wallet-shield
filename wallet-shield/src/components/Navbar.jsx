import React from "react"; 
import {Link} from "react-router-dom"; 
import "../styles.css";

const Navbar = () => {
    return (
        <nav className="navbar">
            <div>
                <Link to="/">Home</Link>
            </div>
            <div>
                <Link to="/getstarted">Get Started</Link>
                <Link to="/about">About</Link>
            </div>
        </nav>
    );
};

export default Navbar; 