import React, { useState } from 'react';
import './navBar.css';
import { Link } from 'react-router-dom';

import homeIcon from '../../resources/fdm-logo.png';
import profileIcon from '../../resources/profile-icon.png';

import { database }  from "../../firebase.js";
import { getDoc, doc } from 'firebase/firestore';

function NavBar() {
  const [userRole, setUserRole] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
    
  };

  const reset = () =>{
    setIsDropdownOpen(!isDropdownOpen);
  }

  function handleLogout() {
    console.log("logout");
    sessionStorage.setItem("loggedIn", "");
    window.location.href = '/index';
  }

  function checkSessionStorage() {
    const loggedIn = sessionStorage.getItem("loggedIn");
    if (loggedIn && loggedIn != "") {
      const docRef = doc(database, "users", loggedIn);

      getDoc(docRef).then((doc) => {
        if (doc.exists()) {
          setUserRole(doc.data().role);
        } else {
          alert("User not found");
        }
      }).catch(error => {
        console.error("Error fetching user:", error);
      });
    }
  }

  function dropdown() {
    const loggedIn = sessionStorage.getItem("loggedIn");
    if (loggedIn && loggedIn != "") { // if logged in
      checkSessionStorage();
      if (userRole === "consultant"){
        return(
          <div>
            <Link to="/myaccount">My Account</Link>
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/timesheet">Timesheets</Link>
            <Link onClick={handleLogout}>Log Out</Link>
          </div>
        )
      }
      if (userRole === "manager"){
        return(
          <div>
            <Link to="/myaccount">My Account</Link>
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/manager">ManagerView</Link>
            <Link onClick={handleLogout}>Log Out</Link>
          </div>
        )
      }
      if (userRole === "finance"){
        return(
          <div>
            <Link to="/myaccount">My Account</Link>
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/finance">FinanceView</Link>
            <Link onClick={handleLogout}>Log Out</Link>
          </div>
        )
      }
      
      if (userRole === "admin"){
        return(
          <div>
            <Link to="/myaccount">My Account</Link>
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/admin">AdminView</Link>
            <Link onClick={handleLogout}>Log Out</Link>
          </div>
        )
      }
      
      return(
        <div>
          <Link to="/myaccount">My Account</Link>
          <Link to="/dashboard">Dashboard</Link>
          <Link onClick={handleLogout}>Log Out</Link>
        </div>
      )
    }
    // else
    return (
      <Link to="/Login">Login</Link>
    )
  }

  return (
    <div className='header'>
      <Link to={sessionStorage.getItem("loggedIn") == ""? "index": "dashboard"}>
        <img src={homeIcon} className="header-icon" id="home-icon" alt="Home" />
      </Link>
      <div className="dropdown" onClick={toggleDropdown} onMouseLeave={reset}>
        <img src={profileIcon} className="header-icon" id="profile-icon" alt="Profile" />
        {isDropdownOpen && (
          <div className="dropdown-content">
            {dropdown()}
          </div>
        )}
      </div>
    </div>
  );
}

export default NavBar;
