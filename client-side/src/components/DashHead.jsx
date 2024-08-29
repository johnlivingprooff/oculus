import '../assets/styles/DashB2.css';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { IoNotifications, IoSearch, IoCloseSharp, IoMenu } from "react-icons/io5";
import { FaCircleUser } from "react-icons/fa6";
import logo from "../assets/imgs/oak-icon.png";

function DashHead() {
  // State to manage menu visibility
  const [isMenuVisible, setMenuVisible] = useState(false);

  // Toggle menu visibility
  const toggleMenu = () => {
    setMenuVisible(!isMenuVisible);
  };

  return (
    <div className='h-all'>
      <div className="o-logo">
        <Link to={'/'}><img src={logo} alt="oak-icon" /></Link>
      </div>
      <div className="h-links">
        <Link to={'/dashboard-two'}>Dashboard</Link>
        <Link>Reports</Link>
        <Link>Analytics</Link>
        <Link>Market</Link>
      </div>

      <div className="h-icons">
        <div><IoSearch className="search-icon" /></div>
        <div><IoNotifications className="bell-icon" /></div>
        <div><FaCircleUser className="user-icon" /></div>
        <div><IoMenu className='menu-icon' id='menu-toggle' onClick={toggleMenu} /></div>
      </div>

      {/* Conditionally render menu based on state */}
      {isMenuVisible && (
        <div id='menu' className="h-menu">
          <IoCloseSharp className='times' onClick={toggleMenu} />
          <div>Dashboard</div>
          <div>Reports</div>
          <div>Analytics</div>
          <div>Market</div>
        </div>
      )}
    </div>
  );
}

export default DashHead;
