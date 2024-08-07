import '../assets/styles/Header.css';
import React from 'react';
import { Link } from 'react-router-dom';

function Header () {
  const handleLogout = async () => {
    try {
      const response = await fetch('https://oculus-server.onrender.com/api/v1/users/logout', {
        method: 'GET',
        credentials: 'include'
      });

      if (response.ok) {
        window.location.href = '/';
      } else {
        console.error('Failed to logout');
      }
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <header className='top'>
      <Link to={'/'}><h1>OCULUS</h1></Link>
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
