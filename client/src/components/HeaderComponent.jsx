import React from 'react';
import './HeaderComponent.css';
import { Navigate, useNavigate } from 'react-router-dom';

const HeaderComponent = () => {

    const navigate = useNavigate();

    const handlelogin = () => { navigate('/login'); };
    const handleSale = () => { navigate('/properties'); };

    const handlePropertyListing = () => { navigate('/new-listing')};

    return (
        <div className="header-container">
            <div className="header-overlay">
                <header className="header">
                    <div className="header-logo">Bunyaad</div>
                    <div className="header-buttons">
                        <button onClick={handlelogin} className="login-btn">Login</button>
                        <button onClick={handlePropertyListing} className="new-listing-btn">New Listing</button>
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
                        <button className="search-button" onClick={handleSale}>
                            <img src="/icons8-search.svg" alt="Search" className="search-icon" />
                            <i className="fa fa-search"></i>
                        </button>
                    </div>

                    <div className="categories">
                        <div onClick={handleSale} className="category">Sale</div>
                        <div onClick={handleSale} className="category">Rent</div>
                        <div onClick={handleSale} className="category">House</div>
                        <div onClick={handleSale} className="category">Workplace</div>
                        <div onClick={handleSale}className="category">Land</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HeaderComponent;
