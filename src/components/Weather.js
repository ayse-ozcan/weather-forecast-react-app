import React, { useState } from "react";
import axios from "axios";
import "./Weather.css";

const Weather = () => {
  const [cityName, setCityName] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const apiKey = process.env.REACT_APP_API_KEY;
  const forecastApiUrl = process.env.REACT_APP_API_URL;

  const handleInputChange = (e) => {
    setCityName(e.target.value);
  };

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${forecastApiUrl}?q=${cityName}&appid=${apiKey}`
      );
      const data = response.data;

      const dailyForecasts = data.list
        .filter((forecast, index) => index % 8 === 0)
        .slice(0, 5);

      const formattedForecasts = dailyForecasts.map((dailyForecast) => {
        return {
          date: new Date(dailyForecast.dt * 1000).toLocaleDateString(),
          temperature: Math.round(dailyForecast.main.temp - 273.15),
          humidity: Math.round(dailyForecast.main.humidity),
          windSpeed: Math.round(dailyForecast.wind.speed * 3.6),
          precipitation: dailyForecast.rain
            ? Math.round(dailyForecast.rain["3h"])
            : 0,
          cloudiness: Math.round(dailyForecast.clouds.all),
        };
      });

      setWeatherData(formattedForecasts);
    } catch (error) {
      window.alert("An error occurred while fetching weather data");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchData();
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          <input
            type="text"
            placeholder="Enter a city name"
            value={cityName}
            onChange={handleInputChange}
          />
        </label>
        <button type="submit">What’s the weather like?</button>
      </form>
      {weatherData && (
        <div className="weather-container">
          {weatherData.map((forecast, index) => (
            <div key={index} className="forecast">
              <h3>{forecast.date}</h3>
              <p>Temperature: {forecast.temperature} °C</p>
              <p>Humidity: {forecast.humidity}%</p>
              <p>Wind Speed: {forecast.windSpeed} km/h</p>
              <p>Precipitation: {forecast.precipitation} mm</p>
              <p>Cloudiness: {forecast.cloudiness}%</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Weather;
