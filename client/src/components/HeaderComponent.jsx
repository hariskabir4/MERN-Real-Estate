import React, { useState } from "react";
import './HeaderComponent.css';
import { Navigate, useNavigate } from 'react-router-dom';

const HeaderComponent = () => {

    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState("");

    const handlelogin = () => { navigate('/login'); };

    const handlePropertyListing = () => { navigate('/new-listing') };

    const handleSearch = () => {
        if (searchTerm.trim() === "") {
            navigate("/search-results"); // Show all properties when search is empty
        } else {
            navigate(`/search-results?query=${encodeURIComponent(searchTerm)}`);
        }
    };

    // // Function to navigate with a specific category query
    // const handleCategoryClick = (category) => {
    //     // console.log("handleCategory function is working");
    //     navigate(`/properties/search?category=${category}`);
    // };

    // Function to handle search by title
    // const handleSearch = () => {
    //     if (searchQuery.trim() !== "") {
    //         console.log("handleSearch function is working");
    //         navigate(`/properties/search?query=${searchQuery}`);
    //     }
    // };


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
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <button className="search-button" onClick={handleSearch}>
                            <img src="/icons8-search.svg" alt="Search" className="search-icon" />
                            <i className="fa fa-search"></i>
                        </button>
                    </div>

                    <div className="categories">
                        <div onClick={() => navigate('/search-results?category=Sell')} className="category">Sale</div>
                        <div onClick={() => navigate('/search-results?category=Rent')} className="category">Rent</div>
                        <div onClick={() => navigate('/search-results?category=House')} className="category">House</div>
                        <div onClick={() => navigate('/search-results?category=Workplace')} className="category">Workplace</div>
                        <div onClick={() => navigate('/search-results?category=Land')} className="category">Land</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HeaderComponent;
