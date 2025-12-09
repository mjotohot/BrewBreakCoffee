import { useState, useEffect } from "react";

const CACHE_KEY = "weatherCache";
const CACHE_TTL = 10 * 60 * 1000; // 10 minutes in milliseconds

const useWeather = (city = "butuan") => {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        // Check cache
        const cached = JSON.parse(localStorage.getItem(CACHE_KEY));
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

        const url = `https://open-weather13.p.rapidapi.com/city?city=${city}&lang=EN`;
        const options = {
          method: "GET",
          headers: {
            "x-rapidapi-key":
              "aef7037091mshd61d057342cdadfp1ebae4jsnacd9667d28ca",
            "x-rapidapi-host": "open-weather13.p.rapidapi.com",
          },
        };

        const response = await fetch(url, options);
        if (!response.ok) throw new Error("Network response was not ok");

        const data = await response.json();
        setWeatherData(data);
        localStorage.setItem(
          CACHE_KEY,
          JSON.stringify({ city, data, timestamp: now })
        );
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [city]);

  return { weatherData, loading, error };
};

export default useWeather;
