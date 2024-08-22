import React, { useState, useEffect } from 'react';
import Header from '../components/DashHead';
import Footer from '../components/Footer';
import '../assets/styles/DashB2.css';
import calender from '../assets/imgs/calender.png';
import { Helmet } from 'react-helmet';
// import { FaLocationPin } from "react-icons/fa6";
import { MdLocationPin } from "react-icons/md";
import { TiWeatherWindyCloudy } from "react-icons/ti";
import { FaPlus } from "react-icons/fa6";
import { MdRefresh } from "react-icons/md";
import { TiWeatherShower } from "react-icons/ti";
import { GoogleMap, LoadScript } from '@react-google-maps/api';
import { IoCloseCircleSharp } from "react-icons/io5";

function Dashboard2() {

    // African Cities
    const africanCities = [
        "Abuja", "Accra", "Addis Ababa", "Algiers", "Asmara", "Bamako", "Bangui", "Brazzaville", 
        "Bujumbura", "Cairo", "Casablanca", "Conakry", "Dakar", "Dodoma", "Douala", "Durban", 
        "Freetown", "Gaborone", "Harare", "Johannesburg", "Kampala", "Kinshasa", "Kinsasha", 
        "Lagos", "Libreville", "Lilongwe", "Lomé", "Luanda", "Lusaka", "Malabo", "Maputo", "Maseru", "Mbabane", 
        "Mogadishu", "Monrovia", "Nairobi", "Niamey", "Nouakchott", "Ouagadougou", "Port Louis", 
        "Rabat", "San Salvador", "Sao Tome", "Tunis", "Victoria Island", "Windhoek"
    ];

    // get date & time
    const now = new Date();

    const formatDateTime = (date) => {
        const shortDay = date.toLocaleString('en-US', { weekday: 'short' });
        const dayOfMonth = date.getDate().toString().padStart(2, '0');
        const month = date.toLocaleString('en-US', { month: 'long' });
        const year = date.getFullYear();
        const hours = date.getHours();
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const formattedHours = (hours % 12 || 12).toString().padStart(2, '0');

        return `${shortDay}-${dayOfMonth}, ${month} ${year} | ${formattedHours}:${minutes}${ampm}`;
    };

    // Data for interactive site
    const [fields, setFields] = useState([]);
    const [selectedField, setSelectedField] = useState(null);
    const [weatherData, setWeatherData] = useState(null);
    const [weatherForecast, setWeatherForecast] = useState([]);
    const [showFieldForm, setShowFieldForm] = useState(false);
    const [newField, setNewField] = useState({
        fieldName: '',
        fieldSize: '',
        fieldLocation: '',
        crop: '',
        fieldLog: []
    });

    useEffect(() => {
        fetchFields();
    }, []);

    useEffect(() => {
        if (selectedField) {
            getWeatherData(selectedField.fieldLocation);
        }
    }, [selectedField]);

    const fetchFields = async () => {
        try {
            const response = await fetch('https://oculus-server.onrender.com/api/v1/fields/list_fields', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            const data = await response.json();
            setFields(data);
            if (data.length > 0) {
                setSelectedField(data[0]);
            }
        } catch (error) {
            console.error('Error fetching fields:', error);
        }
    };

    const getWeatherData = async (location) => {
        try {
            const response = await fetch(`https://oculus-server.onrender.com/api/v1/weather?location=${location}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            const data = await response.json();
            setWeatherData(data);
            const dailyForecast = extractDailyForecast(data);
            setWeatherForecast(dailyForecast);
        } catch (error) {
            console.error('Error fetching weather data:', error);
        }
    };

    const extractDailyForecast = (data) => {
        const dailyData = {};
        data.list.forEach((entry) => {
            const date = new Date(entry.dt_txt).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

            if (!dailyData[date]) {
                dailyData[date] = {
                    temp: entry.main.temp,
                    weather: entry.weather[0].description,
                    icon: entry.weather[0].icon,
                };
            }
        });

        return Object.entries(dailyData).slice(0, 5).map(([date, data]) => ({ date, ...data }));
    };

    const handleFieldChange = (e) => {
        const { name, value } = e.target;
        setNewField({
            ...newField,
            [name]: value
        });
    };

    const handleAddField = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('https://oculus-server.onrender.com/api/v1/fields/add_field', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(newField)
            });
            console.log('response:', response.status);
            if (response) {
                fetchFields();
                setNewField({
                    fieldName: '',
                    fieldSize: '',
                    fieldLocation: '',
                    crop: '',
                    fieldLog: []
                });
                setShowFieldForm(false);
                window.location.reload();
            } else {
                console.error('Error adding field');
            }
        } catch (error) {
            console.error('Error adding field:', error);
        }
    };

    const handleFieldSelection = (e) => {
        const selectedFieldName = e.target.value;
        const selectedField = fields.find(field => field.fieldName === selectedFieldName);
        setSelectedField(selectedField);
    };

    const handleFieldFormToggle = () => {
        setShowFieldForm(!showFieldForm);
    };

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
                            <select name="fieldLocations" id="a-fields" onChange={handleFieldSelection} value={selectedField ? selectedField.fieldName : ''}>
                                {fields.map((field) => (
                                    <option key={field._id} value={field.fieldName} id='options'>
                                        {field.fieldName}
                                    </option>
                                ))}
                            </select>
                        </div>
                        {selectedField ? (
                            weatherData ? (
                            <div className="w-info">
                                <div><span id="temp">
                                    {weatherData.main.temp}
                                </span><sup>ºC</sup></div>
                                <div className='w-icon'>
                                    <img src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`} alt='weather-icon' className='ico-w'/>
                                </div>
                            </div>
                            
                                ) : (
                                    <p>Loading weather data...</p>
                                )
                            ) : (
                                <p>...</p>
                        )}
                        <span className="w-data">
                            {selectedField ?(
                                weatherData ? (
                                    <span><p><b>WS:</b> {weatherData.wind.speed}m/s</p><p><b>P:</b> {weatherData.main.pressure}hpa</p></span>
                                ) : (
                                    <p>Loading Data ...</p>
                                )
                            ) : (
                                <span>...</span>
                            )}
                        </span>
                    </div>
                    <div className="f-weather">
                        <ul>
                            {weatherForecast.length > 0 ? (
                                weatherForecast.map((forecast, index) => (
                                    <li key={index}>
                                        <div className='w-flex'>
                                            <img src={`https://openweathermap.org/img/wn/${forecast.icon}@2x.png`} alt='weather-icon' className='ico-s' />
                                            {forecast.date}
                                        </div>
                                        <b>{forecast.temp}ºC</b>
                                    </li>
                                ))
                            ) : (
                                <p>Loading weather data...</p>
                            )}
                        </ul>
                    </div>
                </div>
                <div className="m-block">
                    <h5><b>Map Overview</b> - Location</h5>
                    <div className="map">
                    {/* <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
                        <GoogleMap
                            mapContainerStyle={mapContainer}
                            center={{ lat: 6.5244, lng: 3.3792 }}
                            zoom={50}
                        >
                            <></>
                        </GoogleMap>
                    </LoadScript> */}
                    </div>
                </div>
                <div className="r-block">
                    <div className="f-over">
                        <span className="log-t">
                            <h5>Field Overview <i>- {fields.length} fields</i></h5>
                            <i onClick={handleFieldFormToggle}><FaPlus id='add-log' /> Add field</i>    
                        </span>
                        { selectedField ? (
                            <div className="f-data">
                                <p><b>Field Name:</b> {selectedField.fieldName} &nbsp;&nbsp;|&nbsp;&nbsp;
                                <b>Location:</b> {selectedField.fieldLocation}<br />
                                <b>Area:</b> {selectedField.fieldSize} hectares &nbsp;&nbsp;|&nbsp;&nbsp;
                                <b>Crop:</b> {selectedField.crop}</p>
                            </div>
                        ) : (
                            <p>No Field selected</p>
                        )}                        
                    </div>
                    {/* Pop-up Form */}
                    {showFieldForm && (
                        <div className="popup-form">
                            <div className="popup-form-content">
                                <span className="close" onClick={handleFieldFormToggle}><IoCloseCircleSharp /></span>
                                <h2>Add New Field</h2>
                                <form onSubmit={handleAddField}>
                                    <label>Field Name:</label>
                                    <input type="text" name="fieldName" value={newField.fieldName} onChange={handleFieldChange} required />
                                    
                                    <label>Field Size (in hectares):</label>
                                    <input type="number" name="fieldSize" value={newField.fieldSize} onChange={handleFieldChange} required id='hect'/>
                                    
                                    <div className="locale">
                                        {/* <label>Field Location:</label> */}
                                        <select name="fieldLocation" value={newField.fieldLocation} onChange={handleFieldChange} required>
                                            <option value="">Select a city</option>
                                            {africanCities.map((city, index) => (
                                                <option key={index} value={city}>{city}</option>
                                            ))}
                                        </select>
                                    </div>
                                    
                                    <label>Crop:</label>
                                    <input type="text" name="crop" value={newField.crop} onChange={handleFieldChange} required id='crop'/>
                                    
                                    <button type="submit">Add Field</button>
                                </form>
                            </div>
                        </div>
                    )}
                    <div className="f-over">
                        <span className="log-t">
                            <h5>Farm Logs</h5>
                            <i><FaPlus id='add-log' /> Add log</i>
                        </span>
                        <div className="f-data">
                            <p><b>Logs:</b> 5 &nbsp;&nbsp;|&nbsp;&nbsp;
                            <b>Issues:</b> 2<br />
                            <b>Harvest:</b> 10 tons &nbsp;&nbsp;|&nbsp;&nbsp;
                            <b>Yield:</b> 20 tons</p>
                        </div>
                    </div>
                    <div className="f-over">
                        <span className="log-t">
                            <h5>Market Insight</h5>
                            <i><MdRefresh id='add-log' /> refresh</i>
                        </span>
                        <div className="f-data">
                            <p><b>Demand:</b> High &nbsp;&nbsp;|&nbsp;&nbsp;
                            <b>Supply:</b> Avg<br />
                            <b>Market Price:</b> $15/kg </p>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default Dashboard2;