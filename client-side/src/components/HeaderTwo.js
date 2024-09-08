import '../assets/styles/Header.css';
import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/imgs/oak-icon.png'

function Header() {
  return (
    <header className="top">
      <Link to={'/'}><h1>{logo}</h1></Link>
      <img src={logo} alt="OAK Logo" id='oak-icon' />
      <div className="nav-bar">
        {/* <ul>
          <li> <Link to="/">Home</Link> </li>
          <li> <a href="#about">About Us</a> </li>
          <li> <a href="#features">What we Offer?</a> </li>
          <li> <a href="#team">Our Team</a> </li>
          <li> <a href="#contact">Contact Us</a> </li>
        </ul> */}
        {/* <button> <Link to="/sign-up">LogIn / Register</Link> </button> */}
      </div>
    </header>
  );
}

export default Header;