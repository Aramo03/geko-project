import axios from 'axios';
import { BASE_URL } from '../../../../utils/utils';
// Endpoint URL
const api = `${BASE_URL}/api/contact/`;

export async function postData(data, setSelectedCategory, setSelectedCountry) {
  try {
    // Log data being sent
    console.log('Data being sent to the API:', data);

    // If CSRF token is needed, get it from a cookie or a hidden input field (assuming Django backend)
    const csrfToken = getCookie('csrftoken'); // Helper function to get the CSRF token from the cookie

    // Send POST request
    const response = await axios.post(api, data, {
      headers: {
        'Content-Type': 'application/json', // Ensure correct header
        'X-CSRFToken': csrfToken, // Include CSRF token in the request
      },
    });

    console.log('Response from API:', response.data); // Log success

    // Reset dropdown states
    setSelectedCategory(""); // Reset category dropdown state
    setSelectedCountry("");  // Reset country dropdown state

    return response.data; // Return the response data

  } catch (error) {
    if (error.response) {
      // Server error
      console.error('Server responded with error status:', error.response.status);
      console.error('Error response context:', error.response.data); // Detailed error info
    } else if (error.request) {
      // No response from the server
      console.error('No response received from server.');
    } else {
      // General error (e.g., network issues)
      console.error('Error:', error.message);
    }
    throw error; // Rethrow the error to be handled by calling function
  }
}

// Helper function to retrieve CSRF token from cookies (for Django or similar frameworks)
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null; // Return null if no CSRF token is found
}
