import axios from 'axios';

// Get API base URL from environment or use default
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api';

// Create axios instance for API requests
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Send voice query to the backend
 * 
 * @param {Blob} audioBlob - The recorded audio as a Blob
 * @param {Array} conversationHistory - Previous conversation messages
 * @returns {Promise} - Response with transcript, text and audio response
 */
export const sendVoiceQuery = async (audioBlob, conversationHistory = []) => {
  try {
    // Create form data to send audio file
    const formData = new FormData();
    formData.append('audio', audioBlob, 'recording.wav');
    formData.append('user_id', localStorage.getItem('user_id') || 'anonymous');
    formData.append('conversation_history', JSON.stringify(conversationHistory));
    
    // Send request to backend
    const response = await axios.post(`${API_BASE_URL}/voice`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  } catch (error) {
    console.error('API Error (Voice Query):', error);
    throw error;
  }
};

/**
 * Fetch all products
 * 
 * @param {string} category - Optional category filter
 * @param {string} search - Optional search term
 * @returns {Promise} - Response with product data
 */
export const fetchProducts = async (category = null, search = null) => {
  try {
    // Build query parameters
    const params = {};
    if (category) params.category = category;
    if (search) params.search = search;
    
    // Send request to backend
    const response = await apiClient.get('/products', { params });
    return response.data;
  } catch (error) {
    console.error('API Error (Fetch Products):', error);
    throw error;
  }
};

/**
 * Fetch a single product by ID
 * 
 * @param {string} productId - The product ID
 * @returns {Promise} - Response with product data
 */
export const fetchProduct = async (productId) => {
  try {
    const response = await apiClient.get(`/products/${productId}`);
    return response.data;
  } catch (error) {
    console.error('API Error (Fetch Product):', error);
    throw error;
  }
};

/**
 * Fetch order status
 * 
 * @param {string} orderId - The order ID
 * @returns {Promise} - Response with order status data
 */
export const fetchOrderStatus = async (orderId) => {
  try {
    const response = await apiClient.get(`/orders/${orderId}`);
    return response.data;
  } catch (error) {
    console.error('API Error (Fetch Order Status):', error);
    throw error;
  }
};