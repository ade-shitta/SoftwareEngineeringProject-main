import React, { useState, useEffect } from "react";
import "./index.css";
import { Link } from "react-router-dom";

function Index() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if the user is logged in by fetching data from your backend
    fetch("/api/checkLoginStatus")
      .then((response) => {
        if (response.ok) {
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
        }
      })
      .catch((error) => {
        console.error("Error checking login status:", error);
      });
  }, []);

  return (
    <div>
      <div id="page-content">
        <h2 id="welcome-header">Welcome to FDM CLOCK-IN</h2>
        <div id="home-container" className="sections">
          <div className="content-container">
            <div className="intro-text">
              <p>
                Clock-in is a simple and efficient timesheet logging and
                management webapp for our consultants, line managers and finance
                team.
              </p>

              <p>
                Please contact your line manager or admin team if you occur any
                issues while accessing the site.
              </p>
            </div>
            <div className="button-list">
              <Link to="/login" id="login-button">
                Log in
              </Link>
              <Link to="/register" id="register-button">
                Register
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Index;
