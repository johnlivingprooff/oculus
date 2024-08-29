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
        "Abidjan", "Abuja", "Accra", "Addis Ababa", "Alexandria", "Antananarivo", "Aswan", "Asmara",
        "Bamako", "Bangui", "Benghazi", "Bloemfontein", "Brazzaville", "Bujumbura",
        "Cairo", "Cape Town", "Casablanca", "Conakry", "Dar es Salaam", "Dodoma", "Douala", "Durban",
        "Entebbe", "Freetown", "Gaborone", "Gaborone", "Harare", "Harare", "Johannesburg", "Kampala",
        "Khartoum", "Kigali", "Kinshasa", "Kinshasa", "Kumasi", "Lagos", "Libreville", "Lilongwe",
        "Lomé", "Luanda", "Luanda", "Lusaka", "Lusaka", "Malabo", "Malabo", "Maputo", "Maputo",
        "Maseru", "Maseru", "Mbabane", "Mbabane", "Mogadishu", "Mogadishu", "Monrovia", "Monrovia",
        "Nairobi", "Nairobi", "Ndola", "Niamey", "Nouakchott", "Ouagadougou", "Ouagadougou", "Port Elizabeth",
        "Port Louis", "Pretoria", "Rabat", "Rabat", "Salisbury", "San Salvador", "Sebastopol", "Sao Tome",
        "Tamale", "The Hague", "Tunis", "Tunis", "Tripoli", "Ulaanbaatar", "Victoria Island", "Windhoek",
        "Windhoek"
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
    const [showLogForm, setShowLogForm] = useState(false);
    const [newLog, setNewLog] = useState({
        title: '',
        description: '',
    });
    const [errors, setErrors] = useState({});
    const [marketInsights, setMarketInsights] = useState(null);

    const mapContainer = {
        height: "100%",
        width: "100%"
    };


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
                    temp: Math.round(entry.main.temp), // Round temperature to the nearest integer
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

    // Adding Logs to fields
    const handleLogChange = (e) => {
        const { name, value } = e.target;
        setNewLog({
            ...newLog,
            [name]: value
        });
    };

    const handleAddLog = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`https://oculus-server.onrender.com/api/v1/fields/${selectedField._id}/add_log`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(newLog)
            });
            const data = await response.json();

            if (response.ok) {
                setSelectedField(prevField => ({
                    ...prevField,
                    fieldLog: [...prevField.fieldLog, data]
                }));
                setNewLog({
                    title: '',
                    description: ''
                });
                setShowLogForm(false);
                window.location.reload();
            } else {
                console.error('Error adding log');
            }
        } catch (error) {
            console.error('Error adding log:', error);
        }
    };

    const handleLogFormToggle = () => {
        setShowLogForm(!showLogForm);
    };

    // Get Market Insights
    const handleGetInsights = async () => {
        if (!selectedField) {
            setErrors({ apiError: 'No field selected' });
            return;
        }

        try {
            const response = await fetch(`https://oculus-server.onrender.com/api/v1/fields/${selectedField._id}/market_insights`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            
            const data = await response.json();

            if (response.ok) {
                setMarketInsights(data);
                setSelectedField(prevField => ({
                    ...prevField,
                    marketInsights: data
                }));
                window.location.reload();
            } else {
                setErrors({ apiError: data.message });
            }
        } catch (error) {
            console.error('Error:', error);
            setErrors({ apiError: 'An error occurred. Please try again.' });
        }
    };

    const getDemandClass = (demand) => {
        switch (demand.toLowerCase()) {
            case 'low':
                return 'demand-low';
            case 'medium':
                return 'demand-medium';
            case 'high':
                return 'demand-high';
            default:
                return '';
        }
    };

    const getSupplyClass = (supply) => {
        switch (supply.toLowerCase()) {
            case 'low':
                return 'supply-low';
            case 'medium':
                return 'supply-medium';
            case 'high':
                return 'supply-high';
            default:
                return '';
        }
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
                            <select
                                name="fieldLocations"
                                id="a-fields"
                                onChange={handleFieldSelection}
                                value={selectedField ? selectedField.fieldName : ''}
                            >
                                <option value="">Select Field</option>
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
                                    <div>
                                        <span id="temp">
                                            {parseInt(weatherData.list[0].main.temp)}
                                        </span>
                                        <sup>ºC</sup>
                                    </div>
                                    <div className='w-icon'>
                                        <img
                                            src={`https://openweathermap.org/img/wn/${weatherData.list[0].weather[0].icon}@4x.png`}
                                            alt='weather-icon'
                                        />
                                    </div>
                                </div>
                            ) : (
                                <p>Loading weather data...</p>
                            )
                        ) : (
                            <p>...</p>
                        )}

                        <span className="w-data">
                            {selectedField ? (
                                weatherData ? (
                                    <span>
                                        <p><b>WS:</b> {weatherData.list[0].wind.speed} m/s</p>
                                        <p><b>P:</b> {weatherData.list[0].main.pressure} hPa</p>
                                    </span>
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
                            {weatherForecast && weatherForecast.length > 0 ? (
                                weatherForecast.map((forecast, index) => (
                                    <li key={index}>
                                        <div className="w-flex">
                                            {forecast.icon ? (
                                                <img
                                                    src={`https://openweathermap.org/img/wn/${forecast.icon}@4x.png`}
                                                    alt="weather-icon"
                                                    className="ico-s"
                                                />
                                            ) : (
                                                <div className="placeholder-icon">N/A</div> 
                                            )}
                                            {forecast.date ? forecast.date : 'N/A'}
                                        </div>
                                        <b>{forecast.temp ? `${forecast.temp}ºC` : 'N/A'}</b> 
                                    </li>
                                ))
                            ) : (
                                <li>No forecast data available</li> 
                            )}
                        </ul>
                    </div>


                </div>

                <div className="m-block">
                    {selectedField ? (
                        <h5><b>Map Overview</b> - {selectedField.fieldLocation}</h5>
                    ) : (
                        <h5><b>Map Overview</b> - Location</h5>
                    )}
                    <div className="map">
                    {weatherData && (
                        <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
                            <GoogleMap
                            mapContainerStyle={mapContainer}
                            center={{ lat: weatherData.city.coord.lat, lng: weatherData.city.coord.lon }}
                            zoom={10}
                            >
                            <></>
                            </GoogleMap>
                        </LoadScript>
                    )}
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
                            <i onClick={handleLogFormToggle}><FaPlus id='add-log' /> Add log</i>
                        </span>
                        {selectedField ? (
                            selectedField.fieldLog.length > 0 ? (
                                selectedField.fieldLog.map((log, index) => (
                                    <div className="f-data" key={index}>
                                        <p>
                                            <b>{log.title}</b>
                                            {log.description}
                                        </p>
                                    </div>
                                ))
                            ) : (
                                <p>No logs added</p>
                            )
                        ) : (
                            <p>No field selected</p>
                        )}
                    </div>
                    {/* Pop-up Form */}
                    {showLogForm && (
                        <div className="popup-form">
                            <div className="popup-form-content">
                                <span className="close" onClick={handleLogFormToggle}><IoCloseCircleSharp /></span>
                                <h2>Add New Log</h2>
                                <form onSubmit={handleAddLog}>
                                    <label>Title:</label>
                                    <input type="text" name="title" value={newLog.title} onChange={handleLogChange} required id='log-title' />
                                    
                                    <textarea name="description" value={newLog.description} onChange={handleLogChange} required placeholder='Write your Notes Here' />
                                    
                                    <button type="submit">Add Log</button>
                                </form>
                            </div>
                        </div>
                    )}
                    <div className="f-over">
                        <span className="log-t">
                            <h5>Market Insight</h5>
                            <i onClick={handleGetInsights}><MdRefresh id='add-log' /> refresh</i>
                        </span>
                        {selectedField ? (
                            selectedField.marketInsights ? (
                                <div className="f-data">
                                    <p><i className={getDemandClass(selectedField.marketInsights.demand)}><b>Demand:</b> {selectedField.marketInsights.demand}</i> &nbsp;&nbsp;|&nbsp;&nbsp;
                                    <i className={getSupplyClass(selectedField.marketInsights.supply)}><b>Supply:</b> {selectedField.marketInsights.supply}<br /></i>
                                    <b>Market Price:</b> ${selectedField.marketInsights.currentPrice}/kg </p>
                                </div>
                            ) : (
                                <>
                                    <p>No market insights available</p>
                                    <button id='g-insight' onClick={handleGetInsights}>Get Insights</button>
                                </>
                            )
                        ) : (
                            <p>No field selected</p>
                        )}
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default Dashboard2;