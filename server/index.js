const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

const MONGODB_URI = process.env.MONGODB_URI;
mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

app.use(cors());
app.use(express.json());

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
    // Extract weather data from the request body
    const { city, country, temperature, description, icon } = req.body;

    // Creates a new document using the WeatherData model
    const weatherData = new WeatherData({
      city,
      country,
      temperature,
      description,
      icon,
    });

    // Save the weather data to the database
    await weatherData.save();

    // Responds with success message if successful, otherwise sends an error response
    res.json({ message: 'The weather data was saved successfully' });
  } catch (error) {
    console.error('An error occured whilst saving weather data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Start the server on the specified port
app.listen(PORT, () => {
  console.log(`The server is running on port ${PORT}`);
});
