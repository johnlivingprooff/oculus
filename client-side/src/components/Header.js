import '../assets/styles/Header.css';
import React from 'react';
import logo from '../assets/imgs/oak-icon.png'
import { Link } from 'react-router-dom';

function Header() {
  return (
    <header className="top">
      <Link to={'/'}><img src={logo} alt="OAK Logo" id='oak-icon' /></Link>
      <div className="nav-bar">
        <ul>
          <li> <Link to="/">Home</Link> </li>
          <li> <a href="#about">About Us</a> </li>
          <li> <a href="#features">What we Offer?</a> </li>
          <li> <a href="#team">Our Team</a> </li>
          <li> <a href="#contact">Contact Us</a> </li>
        </ul>
        <Link to="/login"><button> LogIn </button> </Link> &nbsp;&nbsp;
        <Link to="/sign-up"><button> Register </button></Link>
        
      </div>
    </header>
  );
}

export default Header;