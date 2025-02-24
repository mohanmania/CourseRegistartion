import React from "react";
import { Link } from "react-router-dom";
import "./nav.css"

function Navbar (){
    return(
        <div className="nav-div">
            <nav className="nav-bar">
                <Link to="/menu">Menu</Link>
                <Link to="/course">Courses</Link>
    
                <Link to="/signup">Logout</Link>
    
            </nav>
        </div>
    ) 

}
export default Navbar
