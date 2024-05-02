/**
 * Fetches weather data from the OpenWeatherMap API based on the user's current location.
 * Uses the latitude and longitude obtained from the browser's geolocation API to construct the API URL.
 * Calls the fetchWeatherData function to retrieve the weather data and save it to the state.
 **/
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

// API key for the OpenWeatherMap API | The API key is stored in the .env file in the client directory
const apikey = process.env.REACT_APP_WEATHER_API_KEY;

// App component
function App() {
  const [city, setCity] = useState('');
  const [setWeatherData] = useState(null);
  // Fetches the weather data based on the user's current location (if the permission is granted by the user)
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        const URL = `http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apikey}&units=imperial`;

        fetchWeatherData(URL);
      });
    }
  }, []);

  // Fetches weather data from the OpenWeatherMap API using the provided URL.
  const fetchWeatherData = async (URL) => {
    try {
      const response = await axios.get(URL);
      const data = response.data;
      console.log(data);
      weatherReport(data);
      setWeatherData(data);
      // Send data to backend for storage
      saveWeatherData(data);
    } catch (error) {
      console.error('Error fetching weather data:', error);
    }
  };

  // Fetches the weather data based on the city name entered by the user.
  const searchByCity = async () => {
    try {
      const URLsearch = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apikey}&units=imperial`;
      const response = await axios.get(URLsearch);
      const data = response.data;
      console.log(data);
      weatherReport(data);
      setWeatherData(data);
      // Sends the data to backend for storage
      saveWeatherData(data);
    } catch (error) {
      console.error('An error occured whilst fetching weather data:', error);
    }
    setCity('');
  };

  // Saves the weather data to the database
  const saveWeatherData = async (data) => {
    try {
      const response = await axios.post('http://localhost:3000/api/weather', {
        city: data.name,
        country: data.sys.country,
        temperature: Math.floor(data.main.temp - 273),
        description: data.weather[0].description,
        icon: data.weather[0].icon,
      });
      console.log('Weather data saved to database:', response.data);
    } catch (error) {
      console.error('An error occured whilst saving weather data to database:', error);
    }
  };

  const weatherReport = async (data) => {
    const URLcast = `http://api.openweathermap.org/data/2.5/forecast?q=${data.name}&appid=${apikey}&units=imperial`;
    try {
      // Fetches the forecast data
      const response = await axios.get(URLcast);
      const forecast = response.data;
      console.log(forecast.city);
      hourForecast(forecast);
      dayForecast(forecast);

      // Displays the current weather data
      console.log(data);
      document.getElementById('city').innerText = data.name + ', ' + data.sys.country;  // Displays the city and country code (e.g., New York, US) | Couldn't get State to work along with Mongoose with the API.
      console.log(data.name, data.sys.country); 

      console.log(Math.floor(data.main.temp));
      document.getElementById('temperature').innerText = Math.floor(data.main.temp) + ' °F';

      document.getElementById('condition').innerText = data.weather[0].description;
      console.log(data.weather[0].description);

      // Display weather icon provided by the API
      let iconIMG = data.weather[0].icon;
      let iconURL = "http://api.openweathermap.org/img/w/" + iconIMG + ".png";
      document.getElementById('img').src = iconURL;
    } catch (error) {
      console.error('An error occured whilst fetching forecast data:', error);
    }
  };

  // Displays the hourly forecast
  const hourForecast = (forecast) => {
    document.querySelector('.templist').innerHTML = '';
    // Displays the next 12 hours forecast in 5, 3-hour intervals (including initial time)
    // Provides the time, temperature, and weather description for each interval
    for (let i = 0; i < 5; i++) {
      var date = new Date(forecast.list[i].dt * 1000);
      console.log((date.toLocaleTimeString(undefined, 'America/New_York')).replace(':00', ''));

      let hourForecast = document.createElement('div');
      hourForecast.setAttribute('class', 'hourF');

      let div = document.createElement('div');
      let time = document.createElement('p');
      time.setAttribute('class', 'time');
      time.innerText = (date.toLocaleTimeString(undefined, 'America/New_York')).replace(':00', '');

      let temp = document.createElement('p');
      temp.innerText = Math.floor((forecast.list[i].main.temp_max)) + ' °F' + ' | ' + Math.floor((forecast.list[i].main.temp_min)) + ' °F';

      div.appendChild(time);
      div.appendChild(temp);

      let desc = document.createElement('p');
      desc.setAttribute('class', 'desc');
      desc.innerText = forecast.list[i].weather[0].description;

      hourForecast.appendChild(div);
      hourForecast.appendChild(desc);
      document.querySelector('.templist').appendChild(hourForecast);
    }
  };

  // Displays the daily forecast
  // Displays the forecast for the next 5 days in 24-hour intervals | I had isses with the API and I couldn't manage to get the 7-day forecast to work.
  const dayForecast = (forecast) => {
    document.querySelector('.weekF').innerHTML = '';
    for (let i = 0; i < forecast.list.length; i +=8) {
      console.log(forecast.list[i]);
      let div = document.createElement('div');
      div.setAttribute('class', 'dayF');

      let day = document.createElement('p');
      day.setAttribute('class', 'date');
      day.innerText = new Date(forecast.list[i].dt * 1000).toDateString(undefined, 'America/New_York');
      div.appendChild(day);

      let temp = document.createElement('p');
      temp.innerText = Math.floor((forecast.list[i].main.temp_max)) + ' °F' + ' | ' + Math.floor((forecast.list[i].main.temp_min)) + ' °F';
      div.appendChild(temp);

      let description = document.createElement('p');
      description.setAttribute('class', 'desc');
      description.innerText = forecast.list[i].weather[0].description;
      div.appendChild(description);

      document.querySelector('.weekF').appendChild(div);
    }
  };

  // Render the App component
  // Weather data is returned from the API and displayed on the page
  return (
    <div>
      <div className="header">
        <div>
          <input
            type="text"
            name=""
            id="input"
            placeholder="🔍 Search for location..."
            value={city}
            onChange={(e) => setCity(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                searchByCity();
              }
            }}
            className="search-input"
          />
        </div>
      </div>
  
      <main className="weather-container">
        <div className="daily-forecast">
          <p className="cast-header">Daily Forecast</p>
          <div className="weekF"></div>
        </div>
  
        <div className="current-weather">
          <h2 id="city"></h2>
          <div className="temperature-box">
            <img src="/weathericon.png" alt="" id="img" />
            <p id="temperature"></p>
          </div>
          <span id="condition"></span>
        </div>
  
        <div className="hourly-forecast">
          <p className="cast-header">Hourly Forecast</p>
          <div className="templist"></div>
        </div>
      </main>
      <div>
        <footer>
          <p>Disclaimer: I was unable to get state codes working for this project with OpenWeatherAPI, so I ended up having to use country codes. This is why you may need to enter (City, US) instead of (City, State) for cities within the US</p>
        </footer>
      </div>
    </div>
  );
}

// Export the App component
export default App;