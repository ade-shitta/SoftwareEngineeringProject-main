// dashboard.js

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./dashboard.css";

function Dashboard({ userRole }) {
  const [currentTime, setCurrentTime] = useState('');
  const [ustTime, setUstTime] = useState('');

  useEffect(() => {
    const getTime = () => {
      const currentDate = new Date();
      setCurrentTime(formatTime(currentDate));
      
      // Calculate UST time
      const utcHours = padZero(currentDate.getUTCHours());
      const utcMinutes = padZero(currentDate.getUTCMinutes());
      const utcSeconds = padZero(currentDate.getUTCSeconds());
      const ustTimeString = `${utcHours}:${utcMinutes}:${utcSeconds}`;
      setUstTime(ustTimeString);
    };


    getTime();
    const intervalId = setInterval(getTime, 1000);
    return () => clearInterval(intervalId);
  }, []);

  // Function to format time to "hh:mm" format
  const formatTime = (date) => {
    const hours = padZero(date.getHours());
    const minutes = padZero(date.getMinutes());
    const seconds = padZero(date.getSeconds());
    return `${hours}:${minutes}:${seconds}`;
  };

  const padZero = (value) => {
    return value < 10 ? `0${value}` : value;
  };

  return (
    <div>
      <div>
        <h1>Dashboard</h1>
      </div>
      <div className="card-container">
        {/* My Account Card */}
        <div className="card">
          <h2>My Account</h2>
          <p>Your account details</p>
          <Link to="/myaccount" className="button">
            View Account
          </Link>
        </div>
        
    
        {userRole === "admin" && (
          <div className="card">
            <h2>Admin Card</h2>
            <p>Special features for admin</p>
          
          </div>
        )}

        {userRole === "consultant" && (
          <div className="card">
          <h2>New Timesheet</h2>
          <p>Create a new timesheet</p>
          <Link to="/timesheet" className="button">
            Create Timesheet
          </Link>
        </div>
        )}

        {userRole === "manager" && (
          <div className="card">
            <h2>Manager Card</h2>
            <p>Special features for manager</p>
            
          </div>
        )}

        {userRole === "finance" && (
          <div className="card">
            <h2>Finance Card</h2>
            <p>Special features for finance</p>
           
          </div>
        )}

        {/* Current Time and UST Card */}
        <div className="card">
          <h2>Current Time and UST</h2>
          <p>Current Time: {currentTime}</p>
          <p> UST: {ustTime}</p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
