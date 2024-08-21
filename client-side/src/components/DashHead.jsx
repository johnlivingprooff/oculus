import '../assets/styles/DashB2.css';
import React from 'react';
import { Link } from 'react-router-dom';
import { IoNotifications } from "react-icons/io5";
import { IoSearch } from "react-icons/io5";
import { FaCircleUser } from "react-icons/fa6";
import logo from "../assets/imgs/oak-icon.png";

function DashHead() {
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
            </div>
        </div>
    );
}

export default DashHead;