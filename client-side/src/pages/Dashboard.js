import React, { useState, useEffect } from 'react';
import Header from '../components/DashHeader';
import Footer from '../components/Footer';
import '../assets/styles/Dashboard.css';
import calender from '../assets/imgs/calender.png';
import { Helmet } from 'react-helmet';

function Dashboard() {
    const [currentDateTime, setCurrentDateTime] = useState(new Date());
    const [fields, setFields] = useState([]);
    const [selectedField, setSelectedField] = useState(null);
    const [weatherData, setWeatherData] = useState(null);
    const [showFieldForm, setShowFieldForm] = useState(false);
    const [newField, setNewField] = useState({
        fieldName: '',
        fieldSize: '',
        fieldLocation: '',
        crop: '',
        fieldLog: []
    });

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentDateTime(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

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
            const response = await fetch('/api/v1/fields/list_fields', {
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
            const response = await fetch(`/api/v1/weather?location=${location}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            const data = await response.json();
            setWeatherData(data);
        } catch (error) {
            console.error('Error fetching weather data:', error);
        }
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
            const response = await fetch('/api/v1/fields/add_field', {
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
                setShowFieldForm(false); // Hide the form after adding a field
                window.location.reload(); // Reload the app
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

    const formatDateTime = (date) => {
        const day = date.toLocaleString('en-US', { weekday: 'long' });
        const month = date.toLocaleString('en-US', { month: 'long' });
        const dayOfMonth = date.getDate();
        const year = date.getFullYear();
        return `${day}, ${month} ${dayOfMonth}, ${year}`;
    };

    return (
        <div>
            <Helmet>
                <title>Dashboard  |  OCULUS</title>
            </Helmet>
            <Header />
            <div className='main-container'>
                <div className='container-one'>
                    <span className='head'>
                        <h1>Daily Overview</h1>
                        <img src={calender} alt='calender-icon' /> {formatDateTime(currentDateTime)}
                    </span>
                    <div className='weather-box'>
                        {selectedField ? (
                            weatherData ? (
                                <div className='w-info'>
                                    <img src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`} alt='weather-icon' id='w-icon'/>
                                    <div><span id='temp'>{weatherData.main.temp}</span><sup id='deg'>°C</sup>
                                    <h4 id='city'>City: {selectedField.fieldLocation}</h4></div><br/>
                                </div>
                            ) : (
                                <p>Loading weather data...</p>
                            )
                        ) : (
                            <p>No field selected</p>
                        )}
                    </div>
                    <div className='weather-box-two'>
                        {selectedField ? (
                            weatherData ? (
                                <div className='w-info2'>
                                    <p>H: {weatherData.main.humidity}%</p>
                                    <p style={{ color: '#6cdda8' }}>&nbsp;|&nbsp;</p>
                                    <p>P: {weatherData.main.pressure}hPa</p>
                                    <p style={{ color: '#6cdda8' }}>&nbsp;|&nbsp;</p>
                                    <p>WS: {weatherData.wind.speed}m/s</p>
                                </div>
                            ) : (
                                <p>Loading weather data...</p>
                            )
                        ) : (
                            <p>No field selected</p>
                        )}
                    </div>
                </div>
                <div className='container-one'>
                    <h2>Select a Field</h2>
                    <select id='select-field' onChange={handleFieldSelection} value={selectedField ? selectedField.fieldName : ''}>
                        {fields.map((field) => (
                            <option key={field._id} value={field.fieldName} id='options'>
                                {field.fieldName}
                            </option>
                        ))}
                    </select>
                    <button id="add-field" onClick={() => setShowFieldForm(!showFieldForm)}>
                        {showFieldForm ? 'Cancel' : 'Add New Field'}
                    </button>
                    {showFieldForm && (
                        <div className='field-form'>
                            <h2>Add a New Field</h2>
                            <form onSubmit={handleAddField}>
                                <input
                                    type="text"
                                    name="fieldName"
                                    placeholder="Field Name"
                                    value={newField.fieldName}
                                    onChange={handleFieldChange}
                                    required
                                />
                                <input
                                    type="number"
                                    name="fieldSize"
                                    placeholder="Field Size in acres"
                                    value={newField.fieldSize}
                                    onChange={handleFieldChange}
                                    required
                                />
                                <input
                                    type="text"
                                    name="fieldLocation"
                                    placeholder="Field Location"
                                    value={newField.fieldLocation}
                                    onChange={handleFieldChange}
                                    required
                                />
                                <input
                                    type="text"
                                    name="crop"
                                    placeholder="Crop"
                                    value={newField.crop}
                                    onChange={handleFieldChange}
                                    required
                                />
                                <button type="submit">Add Field</button>
                            </form>
                        </div>
                    )}
                </div>
                <div className='container-one'>THREE</div>
            </div>
            <Footer />
        </div>
    );
}

export default Dashboard;
