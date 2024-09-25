import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./register.css";
import { database } from "../firebase.js";
import { 
  setDoc, 
  collection, 
  doc, 
  getDoc 
} from "firebase/firestore";

function Register() {
  const [formData, setFormData] = useState({
    fname: "",
    sname: "",
    role: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!validateForm()) return;

    const userExists = await checkUserExists();

    if (userExists) {
      setError("Email is already registered.");
      return;
    }

    const registerUserInfo = {
      fname: formData.fname,
      sname: formData.sname,
      email: formData.email,
      password: formData.password,
      role: formData.role,
      manager: "manager@mail.com"
    };

    await registerUser(registerUserInfo);
    sessionStorage.setItem("loggedIn", formData.email);
    window.location.href = '/dashboard';
  };

  const validateForm = () => {
    if (
      formData.fname === "" ||
      formData.sname === "" ||
      formData.email === "" ||
      formData.password === "" 
    ) {
      setError("Please fill in all the required fields.");
      shakeInputFields();
      return false;
    }

    if (formData.role === "") {
      setError("Please select your role.");
      shakeInputFields();
      return false;
    }

    const passwordValid = validatePassword();
    if (!passwordValid) return false;

    return true;
  };

  const validatePassword = () => {
    const symbols = ["!", '"', "#", "$", "%", "&", "'", "(", ")", "*", "+", ",", "-", ".", "/", ":", ";", "<", "=", ">", "?", "@", "[", "\\", "]", "^", "_", "`", "{", "|", "}", "~"];
    const numbers = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

    if (formData.password.length < 8 || formData.password.length > 20) {
      passError("Your password should be 8-20 characters");
      return false;
    }

    let valid = false;
    for (let i of numbers) {
      if (formData.password.includes(i)) {
        valid = true;
        break;
      }
    }
    if (!valid) {
      passError("Your password should have at least one number");
      return false;
    }

    valid = false;
    for (let j of symbols) {
      if (formData.password.includes(j)) {
        valid = true;
        break;
      }
    }
    if (!valid) {
      passError("Your password should have at least one symbol");
      return false;
    }

    return true;
  };

  const passError = (msg) => {
    setError(msg);
    const passField = document.getElementById("password");
    passField.classList.add("shake");
    setTimeout(() => {
      passField.classList.remove("shake");
    }, 500);
  };

  const shakeInputFields = () => {
    const inputFields = document.querySelectorAll("input");
    inputFields.forEach((field) => {
      field.classList.add("shake");
      setTimeout(() => {
        field.classList.remove("shake");
      }, 500);
    });
  };

  const checkUserExists = async () => {
    const docRef = doc(collection(database, "users"), formData.email);
    const docSnapshot = await getDoc(docRef);
    return docSnapshot.exists();
  };

  const registerUser = async (userInfo) => {
    const collectionRef = collection(database, "users");
    const registerDocRef = doc(collectionRef, formData.email);
    await setDoc(registerDocRef, userInfo);
  };

  const handleCloseError = () => {
    setError("");
  };

  return (
    <div className="container">
      <h1 id="registerH1">Clock-In</h1>
      <form onSubmit={handleSubmit} className="container">
        <fieldset>
          <div id="enter">
            <legend>Register</legend>
            <label htmlFor="fname">First name</label>
            <br />
            <input
              type="text"
              id="fname"
              name="fname"
              placeholder="Enter your first name"
              value={formData.fname}
              onChange={handleInputChange}
            />
            <br />
            <label htmlFor="sname">Second name</label>
            <br />
            <input
              type="text"
              id="sname"
              name="sname"
              placeholder="Enter your second name"
              value={formData.sname}
              onChange={handleInputChange}
            />
            <br />
            <label htmlFor="role">Role</label>
            <br />
            <select
              id="dropdownOptions"
              name="role"
              onChange={handleInputChange}
            >
              <option value="">Select your role</option>
              <option value="consultant">Consultant</option>
              <option value="manager">Manager</option>
              <option value="finance">Finance</option>
            </select>
            <label htmlFor="email">Email</label>
            <br />
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter email address"
              value={formData.email}
              onChange={handleInputChange}
            />
            <br />
            <label htmlFor="password">Password</label>
            <br />
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter password"
              value={formData.password}
              onChange={handleInputChange}
            />
            <br />
            <caption>
              Your password should be 8-20 characters, and contains at least one
              number and symbol
            </caption>
          </div>
          <a href="login">Already have an account? Login</a>
        </fieldset>
        <div id="footer" className="container">
          <button type="submit" id="signupButton" className="rbuttons">
            Signup
          </button>
          <Link to="/index" id="backk" className="rbuttons">
            Back
          </Link>
        </div>
      </form>
      {error && (
        <div className="overlay">
          <div className="error-message">
            {error}
            <button className="close-button" onClick={handleCloseError}>
              X
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Register;
