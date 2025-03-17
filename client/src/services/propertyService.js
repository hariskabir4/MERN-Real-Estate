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
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('authToken');
      
      const response = await fetch('http://localhost:5000/api/properties/my-listings', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('authToken');
        window.location.href = '/login';
        throw new Error('Session expired. Please login again.');
      }

      if (!response.ok) {
        throw new Error('Failed to fetch listings');
      }

      const data = await response.json();
      
      // Transform the data to include full image URLs
      const listings = data.map(listing => ({
        ...listing,
        imageSrc: listing.imageSrc && listing.imageSrc.startsWith('/uploads/')
          ? `${BASE_URL}${listing.imageSrc}`
          : 'https://placehold.jp/800x600.png'
      }));

      return listings;
    } catch (error) {
      console.error('Error fetching my listings:', error);
      throw error;
    }
  },
  updateProperty: async (id, formData) => {
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('authToken');
      
      const response = await fetch(`http://localhost:5000/api/properties/update/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('authToken');
        window.location.href = '/login';
        throw new Error('Session expired. Please login again.');
      }

      if (!response.ok) {
        throw new Error('Failed to update property');
      }

      return await response.json();
    } catch (error) {
      console.error('Update Error:', error);
      throw error;
    }
  },
  getPropertyById: async (id) => {
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('authToken');
      
      const response = await fetch(`http://localhost:5000/api/properties/property/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('authToken');
        window.location.href = '/login';
        throw new Error('Session expired. Please login again.');
      }

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
  }
};

export default propertyService;