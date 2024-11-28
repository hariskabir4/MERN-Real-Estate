import React from "react";
import './Footer.css';

const Footer = () => {
    return (
        <div>
            <footer className="footer">
                <div className="footer-content">
                    <p>&copy; 2024 My Website. All rights reserved.</p>
                    <ul className="footer-links">
                        <li><a href="#privacy-policy" className="footer-link">Privacy Policy</a></li>
                        <li><a href="#terms-of-service" className="footer-link">Terms of Service</a></li>
                        <li><a href="#contact" className="footer-link">Contact</a></li>
                    </ul>
                </div>
            </footer>

        </div>
    )
}

export default Footer;