import axios from 'axios';

const API_URL = 'http://localhost:5000/api/properties';
const BASE_URL = 'http://localhost:5000';

let isRequestInProgress = false;

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
  }
};

export default propertyService;