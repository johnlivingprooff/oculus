import React, { useState, useEffect } from 'react';
import Header from '../components/DashHead';
import Footer from '../components/Footer';
import '../assets/styles/DashB2.css';
import calender from '../assets/imgs/calender.png';
import { Helmet } from 'react-helmet';
// import { FaLocationPin } from "react-icons/fa6";
import { MdLocationPin } from "react-icons/md";
import { TiWeatherWindyCloudy } from "react-icons/ti";
import { TiWeatherShower } from "react-icons/ti";

function Dashboard2() {
    // get date & time
    const now = new Date();

    const formatDateTime = (date) => {
        const shortDay = date.toLocaleString('en-US', { weekday: 'short' }); // 'Wed', 'Thur', etc.
        const dayOfMonth = date.getDate().toString().padStart(2, '0'); // Adds leading zero if needed
        const month = date.toLocaleString('en-US', { month: 'long' }); // 'July'
        const year = date.getFullYear(); // '2024'
        const hours = date.getHours();
        const minutes = date.getMinutes().toString().padStart(2, '0'); // Adds leading zero
        const ampm = hours >= 12 ? 'PM' : 'AM'; // 'AM' or 'PM'
        const formattedHours = (hours % 12 || 12).toString().padStart(2, '0'); // 12-hour format, with leading zero
      
        return `${shortDay}-${dayOfMonth}, ${month} ${year} | ${formattedHours}:${minutes}${ampm}`;
    };

    // Get the next 5 days
    const formatDateTime5 = (date) => {
        const shortDay = date.toLocaleString('en-US', { weekday: 'short' }); // 'Wed', 'Thur', etc.
        const dayOfMonth = date.getDate().toString().padStart(2, '0'); // Adds leading zero if needed
        const month = date.toLocaleString('en-US', { month: 'long' }); // 'July'
      
        return `${shortDay}-${dayOfMonth}`;
    };

    const getNextFiveDays = () => {
        const dates = [];
        const today = new Date();
        for (let i = 1; i <= 5; i++) {
            const nextDate = new Date(today);
            nextDate.setDate(today.getDate() + i);
            dates.push(formatDateTime5(nextDate));
        }
        return dates;
    };

    const nextFiveDays = getNextFiveDays();
      

    return (
        <div>
            <Helmet>
                <title>Dashboard - OCULUS</title>
                <meta name="description" content="Your OCULUS Dashboard" />
                <meta name="keywords" content="OCULUS, Agriculture, Crop Yield, IoT, Farming, Technology" />
            </Helmet>
            <Header />
            <div className="d-body">
                <div className="l-block">
                    <h1>Daily Overview</h1>
                    <span className="date-time">
                        <img src={calender} alt="calender-icon" />
                        {formatDateTime(now)}
                    </span>
                    <div className="weather-blck">
                        <p>Weather</p>
                        <hr width="90%" />
                        <div>
                            <MdLocationPin className='pin' />
                            <select name="fieldLocations" id="a-fields">
                                <option value="">Field Locations</option>
                                <option value="">Option One</option>
                                <option value="">Option One</option>
                                <option value="">Option One</option>
                                <option value="">Option One</option>
                            </select>
                        </div>
                        <div className="w-info">
                            <div><span id="temp">
                                52
                            </span><sup>ºC</sup></div>
                            <div className='w-icon'>
                                <TiWeatherWindyCloudy className='ico-w' />
                            </div>
                        </div>
                        <span className="w-data">
                            <p><b>WS:</b> 56m/s</p><p><b>P:</b> 40hpa</p>
                        </span>
                    </div>
                    <div className="f-weather">
                        <ul>
                            {nextFiveDays.map((date, index) => (
                                <li key={index}>
                                    <div className='w-flex'><TiWeatherShower className='ico-s' />   
                                    {date}
                                    </div>
                                    <b>20ºC</b>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
                <div className="m-block"></div>
                <div className="r-block"></div>
            </div>
            <Footer />
        </div>
    );
}

export default Dashboard2;