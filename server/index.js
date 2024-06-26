// Imports the required modules
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const mongoose = require('mongoose');

// Creates an Express application instance to port 3000. Can be changed to most any port number (e.g. 5000).
const app = express();
const PORT = process.env.PORT || 3000;

// MongoDB connection URI | The URI is stored in the .env file in the server directory
const MongoDB_URI = process.env.MONGODB_URI;
mongoose.connect(MongoDB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

// Middleware to parse JSON data and enable CORS
app.use(express.json());
app.use(cors());

// Creates a Mongoose model for weather data
const WeatherData = mongoose.model('WeatherData', {
  city: String,
  country: String,
  temperature: Number,
  description: String,
  icon: String,
});

// Route to handle the storing weather data in the database
app.post('/api/weather', async (req, res) => {
  try {
    // Extracts the weather data from the request body
    const { city, country, temperature, description, icon } = req.body;

    // Creates a new document using the WeatherData model
    const weatherData = new WeatherData({
      city,
      country,
      temperature,
      description,
      icon,
    });

    // Saves the weather data to the database
    await weatherData.save();

    // Responds with success message if successful, otherwise sends an error response
    res.json({ message: 'The weather data was saved successfully' });
  } catch (error) {
    console.error('An error occured whilst saving weather data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Starts the server on the specified port
app.listen(PORT, () => {
  console.log(`The server is running on port ${PORT}`);
});
