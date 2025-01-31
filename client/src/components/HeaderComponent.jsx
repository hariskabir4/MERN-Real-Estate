


import React from 'react';
import './HeaderComponent.css';
import { useNavigate } from 'react-router-dom';

const HeaderComponent = () => {
    const navigate = useNavigate();

    const handleSignup = () => { 
        navigate('/login'); 
    };

    const handleNewListing = () => {
        const token = localStorage.getItem('authToken'); // Check if user is logged in

        if (token) {
            navigate('/new-listing'); // If logged in, go to New Listing Page
        } else {
            navigate('/login'); // If not logged in, redirect to login page
        }
    };

    return (
        <div className="header-container">
            <div className="header-overlay">
                <header className="header">
                    <div className="header-logo">Bunyaad</div>
                    <div className="header-buttons">
                        <button onClick={handleSignup} className="login-btn">Login</button>
                        <button onClick={handleNewListing} className="new-listing-btn">New Listing</button>
                    </div>
                </header>

                <div className="header-content">
                    <h1 className="header-title">Find and Discover Your Dream Estate</h1>
                    <div className="search-bar">
                        <input
                            type="text"
                            placeholder="Search for a location or listing title..."
                            className="search-input"
                        />
                        <button className="search-button">
                            <i className="fa fa-search"></i>
                        </button>
                    </div>

                    <div className="categories">
                        <div className="category">Sale</div>
                        <div className="category">Rent</div>
                        <div className="category">House</div>
                        <div className="category">Workplace</div>
                        <div className="category">Land</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HeaderComponent;
