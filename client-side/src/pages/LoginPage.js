import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/HeaderTwo";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";
import '../assets/styles/Register.css';
import { Helmet } from "react-helmet";

function Login() {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
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
        
        if (!formData.email) {
            newErrors.email = 'Email is required';
        }
        if (!formData.password) {
            newErrors.password = 'Password is required';
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
            const response = await fetch('/api/v1/users/auth', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password
                })
            });

            let data;
            try {
                data = await response.json();  // Attempt to parse JSON
                console.log(data)
            } catch (e) {
                throw new Error('Failed to parse JSON response');  // Handle parsing errors
            }

            if (response.ok) {
                const token = data.token;

                localStorage.setItem('token', token);
                console.log('Login successful, token stored in localStorage:', token);
                console.log('Local Token:', localStorage.getItem('token'));
                // Redirect to the home page or dashboard
                navigate('/dashboard');
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
                <title>Login | OCULUS</title>
            </Helmet>
            <Header />
            <br />
            <br />
            <div className="register">
                <span className="form-img"></span>
                <form onSubmit={handleSubmit}>
                    <h4>Login</h4>
                    <div>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            required
                            placeholder="Enter your email"
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
                    {errors.apiError && <div className="error">{errors.apiError}</div>}
                    <br />
                    <br />
                    <button type="submit">Login</button> &nbsp;&nbsp;&nbsp; <span className="swtch">Not a User? &nbsp;<Link to="/sign-up">Sign Up!</Link></span>
                </form>
            </div><br /><br /><br /><br />
            <Footer />
        </div>
    );
}

export default Login;
