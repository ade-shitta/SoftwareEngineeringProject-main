import React, { useState, useEffect } from "react";
import "./footer.css";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p>&copy; Created by Group 19 2024</p>
        <div className="footer-links">
          <Link to="/contact">Contact</Link>
          <Link to="/terms">Terms</Link>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
