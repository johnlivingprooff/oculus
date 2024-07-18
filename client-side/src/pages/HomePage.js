import Header from "../components/Header";
import Footer from "../components/Footer";
import hero from "../assets/imgs/hero-img.jpg";
import about from "../assets/imgs/about-img.jpg";
import { Typewriter } from 'react-simple-typewriter';
import { Link } from "react-router-dom";
import '../assets/styles/HomePage.css';

function HomePage() {
    return (
        <div>
            <Header />
            <div className="hero">
                <img src={hero} alt="hero-img" />
                <div className="hero-text">
                    <h1>
                        <Typewriter
                            words={['Meet OCULUS','The Future of Agriculture']}
                            loop={0}
                            cursor
                            cursorStyle="|"
                            typeSpeed={70}
                            deleteSpeed={50}
                            delaySpeed={3600}
                        />
                    </h1>
                    <p>Increase your crop yield with OCULUS Technology, Sign up Today for a 3-Month Free Trial</p>
                    <br></br><br></br>
                    <Link to="/sign-up"> <button id="sign-up">  Sign Up! </button> </Link>
                    <a href="#about"> <button id="learn-more">  Learn More </button> </a>
                </div>
            </div>
            <div className="about-us" id="about">
                <img src={about} alt="about-oculus" />
                <div className="abt-text"><h2>About Us</h2>
                <p>OCULUS is a smart agriculture platform that provides farmers with real-time data and insights on their crops. Our platform uses IoT devices and sensors to monitor the health of crops and soil. With OCULUS, farmers can make data-driven decisions to optimize their crop yield and reduce costs. <br/><br/>Sign up today for a <b>3-month free trial!</b></p>
                <button>SIGN UP</button></div>
            </div>

            <div id="features" className="features">
                <h2>Features</h2>
                <div className="feature-cards">
                    <div className="feature-card">
                        <h3>Real-Time Monitoring</h3>
                        <p>Get real-time data on the health of your crops and soil.</p>
                    </div>
                    <div className="feature-card">
                        <h3>Insights</h3>
                        <p>Get actionable insights to optimize your crop yield.</p>
                    </div>
                    <div className="feature-card">
                        <h3>Cost Reduction</h3>
                        <p>Reduce costs by making data-driven decisions.</p>
                    </div>
                    <div className="feature-card">
                        <h3>Easy to Use</h3>
                        <p>Our platform is easy to use and requires no technical expertise.</p>
                    </div>
                </div>
            </div>

            <div id="team" className="team">
            </div>

            <form id="contact" className="contact-us">
                <h2>Contact Us</h2>
                <span className="form">
                    <input type="text" placeholder="Name" />
                    <input type="email" placeholder="Email" />
                    <textarea placeholder="Message"></textarea>
                    <button>SEND</button>
                </span>
            </form>

            <Footer />
        </div>
    );
}

export default HomePage;