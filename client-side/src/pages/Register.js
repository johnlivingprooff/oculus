import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/HeaderTwo";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import '../assets/styles/Register.css';

function Register() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const validateForm = () => {
        const newErrors = {};
        
        if (!formData.name) {
            newErrors.name = 'Full Name is required';
        }
        if (!formData.email) {
            newErrors.email = 'Email is required';
        }
        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }
        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Confirm Password is required';
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }
        setErrors({});

        try {
            const response = await fetch('http://localhost:3010/api/v1/users/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: formData.name,
                    email: formData.email,
                    password: formData.password
                })
            });

            const data = await response.json();

            if (response.ok) {
                // alert('Registration successful');
                navigate('/login');
            } else {
                setErrors({ apiError: data.message });
            }
        } catch (error) {
            console.error('Error:', error);
            setErrors({ apiError: 'An error occurred. Please try again.' });
        }
    };

    return (
        <div className="bdy">
            <Helmet>
                <title>Register | OCULUS</title>
            </Helmet>
            <Header />
            <br />
            <br />
            <div className="register">
                <span className="form-img"></span>
                <form onSubmit={handleSubmit}>
                    {/* <h4>Register</h4> */}
                    <div>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            required
                            placeholder="Create your username (ex. john_doe)"
                            value={formData.name}
                            onChange={handleChange}
                        />
                        {errors.name && <div className="error">{errors.name}</div>}
                    </div>
                    <div>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            required
                            placeholder="Your Email (ex. yourname@example.com)"
                            value={formData.email}
                            onChange={handleChange}
                        />
                        {errors.email && <div className="error">{errors.email}</div>}
                    </div>
                    <div>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            required
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleChange}
                        />
                        {errors.password && <div className="error">{errors.password}</div>}
                    </div>
                    <div>
                        <input
                            type="password"
                            id="confirm-password"
                            name="confirmPassword"
                            required
                            placeholder="Confirm Password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                        />
                        {errors.confirmPassword && <div className="error">{errors.confirmPassword}</div>}
                    </div>
                    {errors.apiError && <div className="error">{errors.apiError}</div>}
                    <br />
                    <br />
                    <button type="submit">Register</button> &nbsp;&nbsp; <span className="swtch">Already a User? &nbsp;<Link to="/login">Login</Link></span>
                </form>
            </div>
            <Footer />
        </div>
    );
}

export default Register;
