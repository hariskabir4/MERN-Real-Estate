import axios from 'axios';

const API_URL = 'http://localhost:5000/api/properties';
const BASE_URL = 'http://localhost:5000';
const API_BASE_URL = 'http://localhost:5000';

let isRequestInProgress = false;

const getToken = () => {
  return localStorage.getItem('token') || sessionStorage.getItem('currentToken');
};

const propertyService = {
  getMyListings: async () => {
    // Prevent multiple simultaneous requests
    if (isRequestInProgress) {
      console.warn('Request already in progress, skipping duplicate request');
      return [];
    }

    try {
      isRequestInProgress = true;
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('No auth token found');
      }

      const response = await axios.get(`${API_URL}/my-listings`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      // Transform the data to include full image URLs
      const listings = response.data.map(listing => ({
        ...listing,
        imageSrc: listing.imageSrc && listing.imageSrc.startsWith('/uploads/')
          ? `${BASE_URL}${listing.imageSrc}`
          : 'https://placehold.jp/800x600.png'
      }));

      return listings;
    } catch (error) {
      console.error('Error fetching my listings:', error);
      throw error;
    } finally {
      isRequestInProgress = false;
    }
  },
  updateProperty: async (id, propertyData) => {
    try {
      const response = await fetch(`${API_URL}/update/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify(propertyData)
      });

      if (!response.ok) {
        throw new Error('Failed to update property');
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  },
  getPropertyById: async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/properties/property/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch property details');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Service Error:', error);
      throw error;
    }
  },
  verifyToken: () => {
    const token = localStorage.getItem('token');
    console.log('Current token in localStorage:', token);
    return token;
  },
  updateProperty: async (id, propertyData) => {
    try {
      const response = await fetch(`http://localhost:5000/api/properties/update/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(propertyData)
      });

      if (!response.ok) {
        throw new Error('Failed to update property');
      }

      return await response.json();
    } catch (error) {
      console.error('Update Error:', error);
      throw error;
    }
  }
};

export default propertyService;