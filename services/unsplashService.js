// services/unsplashService.js
const axios = require('axios');

exports.getRandomBackgroundImage = async (weatherDescription) => {
  const unsplashApiKey = process.env.UNSPLASH_API_KEY;
  const apiUrl = `https://api.unsplash.com/photos/random?query=${weatherDescription}&client_id=${unsplashApiKey}`;

  try {
    const response = await axios.get(apiUrl);
    return response.data.urls.regular;
  } catch (error) {
    throw new Error('Error fetching background image');
  }
};
