import '../assets/styles/Header.css';
import React from 'react';
import { Link } from 'react-router-dom';

function Header () {
  const handleLogout = async () => {
    try {
      const response = await fetch('http://localhost:3010/api/v1/users/logout', {
        method: 'POST',
        credentials: 'include' // Ensure cookies (like the JWT) are sent with the request
      });

      if (response.ok) {
        window.location.href = '/'; // Redirect to the home page after successful logout
      } else {
        console.error('Failed to logout');
      }
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <header className='top'>
      <Link to='/'><h1>OCULUS</h1></Link>
      <div className='nav-bar'>
        <ul>
          <li> <Link to='/'>Home</Link> </li>
          <li> <a href='#about'>Market Insights</a> </li>
          {/* <li> <a href="#features">What we Offer?</a> </li>
          <li> <a href="#team">Our Team</a> </li> */}
          <li> <a href='#contact'>Fields</a> </li>
        </ul>
        <button onClick={handleLogout}> Log Out </button>
      </div>
    </header>
  );
}

export default Header;
