import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './login.css';
import { database } from "../firebase.js";
import { getDoc, doc } from 'firebase/firestore';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Function to handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Check if email and password are provided
    if (email === '' || password === '') {
      setError('Please fill in all the required fields.');
      shakeInputFields();
      return;
    }

    // Reference to the document in Firestore
    const docRef = doc(database, "users", email);

    // Get document from Firestore
    getDoc(docRef)
      .then((doc) => {
        if (doc.exists()) {
          // Check if the password matches
          if (password === doc.data().password) {
            // Store logged-in user in session and redirect
            sessionStorage.setItem("loggedIn", email);
            window.location.href = '/dashboard';
          } else {
            setError("Invalid password!");
          }
        } else {
          setError("Email is not associated with an account. Please register first.");
        }
      })
      .catch((error) => {
        console.error("Error checking email:", error);
        setError("An error occurred. Please try again later.");
      });
  };

  // Function to add shake animation to input fields
  const shakeInputFields = () => {
    const inputFields = document.querySelectorAll('input');
    inputFields.forEach((field) => {
      field.classList.add('shake');
      setTimeout(() => {
        field.classList.remove('shake');
      }, 500); 
    });
  };

  return (
    <div className="container">
      <h1>Clock-In</h1>
      <form onSubmit={handleSubmit} className="container">
        <fieldset>
          <div id="enter">
            <legend>Log in</legend>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              placeholder="Enter email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={error ? 'shake' : ''}
            />
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={error ? 'shake' : ''}
            />
          </div>
          <Link to="/forgotPassword">Forgot your password?</Link><br/>
          <Link to="/register">Don't have an account? Register</Link>
        </fieldset>
        <div id="footer" className="container">
            <button type="submit" className="buttons">Log in</button>
            <Link to ="/index" type="button" className="buttons" id="back">Back</Link>
        </div>
      </form>
      {error && (
        <div className="overlay">
          <div className="error-message">
            {error}
            <button className="close-button" onClick={() => setError('')}>X</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Login;
