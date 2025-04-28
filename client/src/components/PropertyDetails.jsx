import React, { useState, useEffect } from "react";
import "./PropertyDetail.css";
import { useNavigate, useParams } from "react-router-dom";
import { useUserContext } from "../Usercontext";

const PropertyDetail = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [property, setProperty] = useState(null);
    const [loading, setLoading] = useState(true);
    const { user } = useUserContext();

    useEffect(() => {
        const fetchPropertyDetails = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/property/${id}`);
                if (!response.ok) {
                    throw new Error('Property not found');
                }
                const data = await response.json();
                setProperty(data);
            } catch (error) {
                console.error('Error fetching property details:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPropertyDetails();
    }, [id]);

    const handleChat = (e) => {
        e.preventDefault();
        
        if (!user || !user.id) {
            console.log("User not authenticated, redirecting to login");
            navigate('/login', { 
                state: { 
                    from: `/property/${id}`,
                    intent: 'chat',
                    propertyId: id
                } 
            });
            return;
        }

        if (property && property.userId) {
            console.log("Navigating to chat between viewer:", user.id, "and owner:", property.userId);
            navigate(`/chat/${user.id}/${property.userId}`);
        } else {
            console.error('Property owner information not available');
        }
    };

    const handleMakeOffer = () => {
        navigate(`/make-offer/${id}`);
    }

    // Function to get image URL
    const getImageUrl = (imageName) => {
        if (!imageName) {
            // Return placeholder if no image (800x600 is a common property image ratio)
            return "https://placehold.jp/800x600.png";
        }
        return `http://localhost:5000/uploads/${imageName}`;
    };

    if (loading) {
        return <div className="property-detail loading">Loading...</div>;
    }

    if (!property) {
        return <div className="property-detail error">Property not found</div>;
    }

    // Function to render property features based on property type
    const renderPropertyFeatures = () => {
        if (property.propertyType === 'Residential') {
            return (
                <>
                    {property.bedrooms && <span>{property.bedrooms} beds</span>}
                    {property.bathrooms && <span>{property.bathrooms} baths</span>}
                    {property.features?.includes('parking') && <span>Parking spot</span>}
                    {property.features?.includes('furnished') && <span>Furnished</span>}
                </>
            );
        } else {
            return (
                <>
                    {property.features?.split(',').map((feature, index) => (
                        <span key={index}>{feature.trim()}</span>
                    ))}
                </>
            );
        }
    };

    return (
        <div className="property-detail">
            <img
                src={getImageUrl(property.images?.[0])}
                alt={property.title}
                className="property-image"
            />
            <div className="property-info">
                <h2>{property.title}</h2>
                <p className="location">
                    <span role="img" aria-label="location">
                        📍
                    </span>{" "}
                    {property.location || `${property.city}, ${property.state}`}
                </p>
                <p className="description">
                    <strong>Description: </strong>{property.description || property.features}
                </p>
                <div className="property-features">
                    {renderPropertyFeatures()}
                    {property.size && <span>{property.size} sq yards</span>}
                </div>
                <div className="price-info">
                    <span className="price">${property.price?.toLocaleString()}</span>
                    <span className="status">{property.purpose === "Rent" ? "For Rent" : "For Sale"}</span>
                </div>
                <div className="actions">
                    <button onClick={handleChat} className="chat-button">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            className="chat-icon"
                            style={{ width: "16px", height: "16px", marginRight: "5px" }}
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M8.25 15h7.5M8.25 12h7.5m-10.5 9v-3.659a9.213 9.213 0 01-2.615-3.034A8.962 8.962 0 013 9.75C3 5.246 7.03 2.25 12 2.25s9 2.996 9 7.5-4.03 7.5-9 7.5c-.566 0-1.123-.039-1.667-.114A9.164 9.164 0 016.75 19.5z"
                            />
                        </svg>
                        Chat with Owner
                    </button>
                    <button onClick={handleMakeOffer} className="make-offer">Make an Offer</button>
                </div>
            </div>
        </div>
    );
};

export default PropertyDetail;
