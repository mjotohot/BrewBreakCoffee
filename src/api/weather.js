import { useState, useEffect } from "react";

const CACHE_KEY = "weatherCache";
const CACHE_TTL = 10 * 60 * 1000; // 10 minutes

const useWeather = (city = "butuan") => {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        setLoading(true);
        setError(null);

        // Check cache - using in-memory storage instead of localStorage
        const cachedData = sessionStorage.getItem(CACHE_KEY);
        const cached = cachedData ? JSON.parse(cachedData) : null;
        const now = new Date().getTime();

        if (
          cached &&
          cached.city === city &&
          now - cached.timestamp < CACHE_TTL
        ) {
          setWeatherData(cached.data);
          setLoading(false);
          return;
        }

        // Step 1: Get coordinates from city name using Open-Meteo Geocoding API
        const geoResponse = await fetch(
          `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
            city
          )}&count=1&language=en&format=json`
        );

        if (!geoResponse.ok) {
          throw new Error("Failed to fetch location data");
        }

        const geoData = await geoResponse.json();

        if (!geoData.results || geoData.results.length === 0) {
          throw new Error(`City "${city}" not found`);
        }

        const { latitude, longitude, name, country } = geoData.results[0];

        // Step 2: Get weather data using coordinates
        const weatherResponse = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m,wind_direction_10m&timezone=auto`
        );

        if (!weatherResponse.ok) {
          throw new Error("Failed to fetch weather data");
        }

        const weatherRawData = await weatherResponse.json();

        // Transform data to a more usable format
        const transformedData = {
          location: {
            name: name,
            country: country,
            latitude: latitude,
            longitude: longitude,
          },
          current: {
            temperature: weatherRawData.current.temperature_2m,
            feelsLike: weatherRawData.current.apparent_temperature,
            humidity: weatherRawData.current.relative_humidity_2m,
            precipitation: weatherRawData.current.precipitation,
            weatherCode: weatherRawData.current.weather_code,
            windSpeed: weatherRawData.current.wind_speed_10m,
            windDirection: weatherRawData.current.wind_direction_10m,
            time: weatherRawData.current.time,
          },
          units: {
            temperature: weatherRawData.current_units.temperature_2m,
            windSpeed: weatherRawData.current_units.wind_speed_10m,
            precipitation: weatherRawData.current_units.precipitation,
          },
        };

        setWeatherData(transformedData);

        // Cache the result
        sessionStorage.setItem(
          CACHE_KEY,
          JSON.stringify({
            city,
            data: transformedData,
            timestamp: now,
          })
        );
      } catch (err) {
        setError(err.message);
        setWeatherData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [city]);

  return { weatherData, loading, error };
};

export default useWeather;