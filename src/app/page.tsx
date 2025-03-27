"use client";

import React, { useState } from "react";
import axios from "axios";
import {
  WiDaySunny, WiCloud, WiRain, WiSnow, WiThunderstorm, WiFog,
} from "react-icons/wi";

const HomePage = () => {
  const api_key = process.env.NEXT_PUBLIC_API_KEY;

  const [loading, setLoading] = useState(false);
  const [city, setCity] = useState("");

  interface WeatherData {
    name: string;
    weather: {
      main: string;
      description: string;
    }[];
    main: {
      temp: number;
      humidity: number;
    };
    wind: {
      speed: number;
    };
  }
  const [weather, setWeather] =useState<WeatherData | null>(null);

  interface ForecastItem {
    dt: number;
    dt_txt: string;
    main: {
      temp: number;
    };
    weather: {
      main: string;
    }[];
  }

  const [forecast, setForecast] = useState<ForecastItem[] | null>(null);
  const fetchWeather = async () => {
    if (!city) return;
    setLoading(true);

    try {
      const res = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${api_key}`
      );

      const forecastRes = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${api_key}`
      );
      
      const weatherData = res.data;
      const dailyForecast = forecastRes.data.list.filter((item: ForecastItem) =>
        item.dt_txt.includes("12:00:00")
      );
      setForecast(dailyForecast);

      setWeather(weatherData);
    } catch (err) {
      console.log("Error fetching weather data", err);
      setWeather(null);
      setForecast(null);
    }
    setLoading(false);
  };
  const getWeatherIcon = (weatherMain: string) => {
    switch (weatherMain) {
      case "Clear":
        return <WiDaySunny className="text-yellow-500 text-5xl" />;
      case "Clouds":
        return <WiCloud className="text-gray-500 text-5xl" />;
      case "Rain":
        return <WiRain className="text-blue-500 text-5xl" />;
      case "Snow":
        return <WiSnow className="text-blue-300 text-5xl" />;
      case "Thunderstorm":
        return <WiThunderstorm className="text-purple-600 text-5xl" />;
      case "Fog":
      case "Mist":
      case "Haze":
        return <WiFog className="text-gray-400 text-5xl" />;
      default:
        return <WiDaySunny className="text-yellow-500 text-5xl" />;
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-500 to-blue-300 p-6">
      <h1 className="text-4xl font-bold text-white mb-6">Weather App </h1>
      <div className="flex space-x-2 w-full max-w-md">
        <input
          type="text"
          className="flex-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Enter city"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <button
          className="bg-white text-blue-600 px-5 py-3 rounded-lg font-semibold shadow-md hover:bg-gray-100"
          onClick={fetchWeather}
        >
          {loading ? "Loading..." : "Search"}
        </button>
      </div>

      {weather && (
        <div className="mt-8 bg-white p-6 rounded-lg shadow-xl text-center w-80">
          <h2 className="text-2xl font-semibold text-gray-700">
            {weather.name}
          </h2>
          <p className="text-lg text-gray-500">
            {weather.weather[0].description}
          </p>
          <div className="mt-4 flex flex-col items-center">
            {getWeatherIcon(weather.weather[0].main)}
            <p className="text-5xl font-bold text-blue-600 mt-2">
              {weather.main.temp}°C
            </p>
            <div className="mt-3 flex justify-center gap-6 text-gray-600 text-sm">
              <div className="flex flex-col items-center">
                <p className="text-lg font-semibold">
                  {weather.wind.speed} m/s
                </p>
                <span className="text-xs">Wind Speed</span>
              </div>
              <div className="flex flex-col items-center">
                <p className="text-lg font-semibold">
                  {weather.main.humidity}%
                </p>
                <span className="text-xs">Humidity</span>
              </div>
            </div>
          </div>
        </div>
      )}

{forecast && (
        <div className="mt-8 bg-white p-6 rounded-lg shadow-xl text-center w-full max-w-md">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">5-Day Forecast</h3>
          <div className="flex justify-between space-x-2">
            {forecast.map((day: any, index: number) => (
              <div key={index} className="flex flex-col items-center">
                <p className="text-sm font-medium text-gray-600">
                  {new Date(day.dt * 1000).toLocaleDateString("en-US", { weekday: "short" })}
                </p>
                {getWeatherIcon(day.weather[0].main)}
                <p className="text-lg font-semibold text-gray-700">{Math.round(day.main.temp)}°C</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
