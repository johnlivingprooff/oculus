import '../assets/styles/Footer.css';

function Footer() {
    return (
        <footer className="buttom">
            <div className="footer-content">
                <h1>OAK</h1>
                <p>P.O. BOX 123, XYZ Street, ABC - Earth</p>
            </div>
            <div className="links">
                <ul>
                    <li>Home</li>
                    <li>About Us</li>
                    <li>What we Offer?</li>
                    <li>Our Team</li>
                    <li>Contact Us</li>
                </ul>
            </div>
            <form className="subscribe">
                <input type="email" placeholder="Newsletter? Enter your email" />
                <button>Subscribe</button>
            </form>
        </footer>
    );
}

export default Footer;