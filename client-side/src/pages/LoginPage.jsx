import React, { useState } from 'react';
import '../assets/styles/SignUp.css';
import Footer from '../components/Footer';
import { Helmet } from 'react-helmet';
import { useAuth } from '../context/AuthContext'; // Import useAuth to access AuthContext

function Login() {
    // State for form inputs
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // State for error messages
    const [error, setError] = useState('');

    // Access login function from AuthContext
    const { login } = useAuth();

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent form from submitting the traditional way

        try {
            // Clear any existing errors
            setError('');

            // Call login function from AuthContext
            await login(email, password);
        } catch (error) {
            // Handle different types of errors
            if (error.response && error.response.status === 400) {
                setError('Invalid email or password.');
            } else if (error.response && error.response.status === 401) {
                setError('Unauthorized access.');
            } else {
                setError('An error occurred. Please try again.');
            }
            console.error("Login error:", error);
        }
    };

    return (
        <div className='bdy'>
            <Helmet>
                <title>LogIn | Oculus</title>
            </Helmet>
            <div className='overlay'>
                <div className="f-box">
                    <form onSubmit={handleSubmit}>
                        <h3>Welcome Back!</h3>
                        <i>Enter your registered details</i>
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

                        {/* Render error message if any */}
                        {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}

                        <button type="submit">LogIn</button>
                        <div className="sigh">
                            Not Registered? &nbsp;<a href="/sign-up">Sign Up</a>
                        </div>
                    </form>
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default Login;
