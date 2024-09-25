import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './myaccount.css';
import './forgotPassword.css'

function ForgotPassword() {
  const [pass1, setPass1] = useState('');
  const [pass2, setPass2] = useState('');
  const [error, setError] = useState(null); // Add the error state variable

  const handleSubmit = (e) => {
    e.preventDefault();
    let symbols = ['!', '"', '#', '$', '%', '&', "'", '(', ')', '*', '+', ',', '-', '.', '/', ':', ';', '<', '=', '>', '?', '@', '[', '\\', ']', '^', '_', '`', '{', '|', '}', '~'];
    let numbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    let valid = false;
    if (pass1.length > 7 && pass1.length < 21) {
      valid = true;
    } else {
      setError("Your password should be 8-20 characters"); // Set error message
      return;
    }
    for (let i of numbers) {
      if (!pass1.includes(i)) {
        valid = false;
      } else {
        valid = true;
        break;
      }
    }
    if (valid === false) {
      setError("Your password should have at least one number"); // Set error message
      return;
    }
    for (let j of symbols) {
      if (!pass1.includes(j)) {
        valid = false;
      } else {
        valid = true;
        break;
      }
    }
    if (valid === false) {
      setError("Your password should have at least one symbol"); // Set error message
      return;
    }

    if (pass1 !== pass2) {
      setError("Passwords do not match"); // Set error message
      return;
    } else {
      window.location.href = '/myaccount';
    }
  };

  return (
    <div>
      <h1>ClockIn</h1>
      <form className="forgot-password-form" onSubmit={handleSubmit}>
        <fieldset>
          <div id="forgot-password-enter">
            <legend className="forgot-password-legend">Change password</legend>
            <label className="forgot-password-label">New Password</label>
            <input type="password" placeholder="Enter new password" value={pass1} onChange={(e) => setPass1(e.target.value)}></input>
            <label className="forgot-password-label">Repeat Password</label>
            <input type="password" placeholder="Repeat password above" value={pass2} onChange={(e) => setPass2(e.target.value)}></input>
            <caption className="forgot-password-caption">Your password should be 8-20 characters, and contains at least one number and symbol</caption>
          </div>
        </fieldset>
        <div id="footer">
          <button type="submit" className="buttons" id="back">Change password</button>
          <Link to="/myaccount" type="button" className="buttons" id="back">Back</Link>
        </div>
      </form>
      {/* Display the error overlay */}
      {error && (
        <div className="overlay">
          <div className="error-message">
            {error}
            <button className="close-button" onClick={() => setError(null)}>X</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ForgotPassword;
