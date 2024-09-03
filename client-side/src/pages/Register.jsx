import React, { useState } from 'react';
import '../assets/styles/SignUp.css';
import Footer from '../components/Footer';
import { Helmet } from 'react-helmet';
import { useAuth } from '../context/AuthContext'; // Import useAuth to access AuthContext

function Register() {
    // State for form inputs
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // State for error messages
    const [error, setError] = useState('');

    // Access register function from AuthContext
    const { register } = useAuth();

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent form from submitting the traditional way

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        try {
            // Clear any existing errors
            setError('');

            // Call register function from AuthContext
            await register(`${firstName}_${lastName}`, email, password);
        } catch (error) {
            console.error("Registration error:", error);
        }
    };

    return (
        <div className='bdy'>
            <Helmet>
                <title>Register | Oculus</title>
            </Helmet>
            <div className='overlay'>
                <div className="f-box">
                    <form onSubmit={handleSubmit}>
                        <h3>Welcome To Oculus</h3>
                        <i>Fields marked <span style={{ color: '#ff000d', fontSize: '14px' }}>*</span> are required</i>
                        <div className="input-box">
                            <input 
                                type="text" 
                                placeholder="First Name *" 
                                required 
                                value={firstName} 
                                onChange={(e) => setFirstName(e.target.value)} 
                            />
                        </div>
                        <div className="input-box">
                            <input 
                                type="text" 
                                placeholder="Last Name *" 
                                required 
                                value={lastName} 
                                onChange={(e) => setLastName(e.target.value)} 
                            />
                        </div>
                        <div className="input-box">
                            <input 
                                type="email" 
                                placeholder="Email *" 
                                required 
                                value={email} 
                                onChange={(e) => setEmail(e.target.value)} 
                            />
                        </div>
                        <div className="input-box">
                            <input 
                                type="password" 
                                placeholder="Password *" 
                                required 
                                value={password} 
                                onChange={(e) => setPassword(e.target.value)} 
                            />
                        </div>
                        <div className="input-box">
                            <input 
                                type="password" 
                                placeholder="Confirm Password *" 
                                required 
                                value={confirmPassword} 
                                onChange={(e) => setConfirmPassword(e.target.value)} 
                            />
                        </div>

                        {/* Render error message if passwords do not match */}
                        {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}

                        <button type="submit">Sign Up</button>
                        <div className="sigh">
                            Already a User? &nbsp;<a href="/login">Log In</a>
                        </div>
                    </form>
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default Register;
