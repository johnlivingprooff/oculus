import '../assets/styles/Header.css';
import React from 'react';
import { Link } from 'react-router-dom';

function Header() {
  return (
    <header className="top">
      <h1>OCULUS</h1>
      <div className="nav-bar">
        <ul>
          <li> <Link to="/">Home</Link> </li>
          <li> <a href="#about">Market Insights</a> </li>
          {/* <li> <a href="#features">What we Offer?</a> </li>
          <li> <a href="#team">Our Team</a> </li> */}
          <li> <a href="#contact">Contact Us</a> </li>
        </ul>
        <button> <Link to="/login">Log Out</Link> </button>
      </div>
    </header>
  );
}

export default Header;