import { useLocation } from "react-router";
import useWeather from "../../api/weather";

export default function HeaderWrapper() {
  const { weatherData, loading, error } = useWeather();
  const location = useLocation();

  const routeTitles = {
    "/staff/dashboard": "Dashboard",
    "/admin/dashboard": "Admin Dashboard",
    "/staff/notification": "Notification",
    "/attendance": "Attendance",
    "/staff/leave-request": "Leave Requests",
    "/staff-payroll": "Staff Payroll",
    "/file-leave": "File Leave",
    "/staff/profile": "Profile",
    "/admin/payroll": "Staff Payroll",
    "/admin/staffs": "Staffs",
    "/admin/requests": "Leave Requests",
  };

  const title = routeTitles[location.pathname] || "Untitled";

  // WMO Weather Code mapping (Open-Meteo uses WMO codes)
  const getWeatherInfo = (code) => {
    const weatherMap = {
      0: { main: "Clear", description: "Clear sky", icon: "☀️", color: "text-yellow-400" },
      1: { main: "Clear", description: "Mainly clear", icon: "🌤️", color: "text-yellow-300" },
      2: { main: "Clouds", description: "Partly cloudy", icon: "⛅", color: "text-gray-300" },
      3: { main: "Clouds", description: "Overcast", icon: "☁️", color: "text-gray-300" },
      45: { main: "Mist", description: "Foggy", icon: "🌫️", color: "text-gray-200" },
      48: { main: "Mist", description: "Depositing rime fog", icon: "🌫️", color: "text-gray-200" },
      51: { main: "Drizzle", description: "Light drizzle", icon: "🌦️", color: "text-blue-300" },
      53: { main: "Drizzle", description: "Moderate drizzle", icon: "🌦️", color: "text-blue-300" },
      55: { main: "Drizzle", description: "Dense drizzle", icon: "🌧️", color: "text-blue-300" },
      61: { main: "Rain", description: "Slight rain", icon: "🌧️", color: "text-blue-400" },
      63: { main: "Rain", description: "Moderate rain", icon: "🌧️", color: "text-blue-400" },
      65: { main: "Rain", description: "Heavy rain", icon: "🌧️", color: "text-blue-500" },
      71: { main: "Snow", description: "Slight snow", icon: "🌨️", color: "text-white" },
      73: { main: "Snow", description: "Moderate snow", icon: "❄️", color: "text-white" },
      75: { main: "Snow", description: "Heavy snow", icon: "❄️", color: "text-white" },
      77: { main: "Snow", description: "Snow grains", icon: "🌨️", color: "text-white" },
      80: { main: "Rain", description: "Slight rain showers", icon: "🌦️", color: "text-blue-400" },
      81: { main: "Rain", description: "Moderate rain showers", icon: "🌧️", color: "text-blue-400" },
      82: { main: "Rain", description: "Violent rain showers", icon: "⛈️", color: "text-blue-500" },
      85: { main: "Snow", description: "Slight snow showers", icon: "🌨️", color: "text-white" },
      86: { main: "Snow", description: "Heavy snow showers", icon: "❄️", color: "text-white" },
      95: { main: "Thunderstorm", description: "Thunderstorm", icon: "⛈️", color: "text-purple-400" },
      96: { main: "Thunderstorm", description: "Thunderstorm with hail", icon: "⛈️", color: "text-purple-400" },
      99: { main: "Thunderstorm", description: "Thunderstorm with heavy hail", icon: "⛈️", color: "text-purple-500" },
    };

    return weatherMap[code] || { 
      main: "Unknown", 
      description: "Unknown conditions", 
      icon: "🌡️", 
      color: "text-white" 
    };
  };

  const weatherCode = weatherData?.current?.weatherCode;
  const weatherInfo = weatherCode !== undefined ? getWeatherInfo(weatherCode) : null;

  // Convert Celsius to Fahrenheit
  const celsiusToFahrenheit = (celsius) => {
    return ((celsius * 9/5) + 32).toFixed(1);
  };

  return (
    <header
      className="w-full top-0 px-6 py-4 flex items-center justify-between
      bg-white/10 backdrop-blur-xs shadow-md font-mono"
    >
      <h1 className="text-xl font-bold text-white drop-shadow-md">{title}</h1>
      <div className="flex items-center gap-3 text-lg">
        {loading && <span className="text-yellow-300 animate-pulse">...</span>}
        {error && <span className="text-red-400">Error: {error}</span>}
        {weatherData && weatherInfo && (
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-white">Today's Weather:</span>
            <span className="font-semibold text-green-300">
              {weatherData.location.name}
            </span>
            <span className="font-bold text-orange-700">
              {celsiusToFahrenheit(weatherData.current.temperature)}°F
            </span>
            <span className={`font-semibold ${weatherInfo.color}`}>
              {weatherInfo.main} ({weatherInfo.description})
            </span>
            <span className="text-3xl" role="img" aria-label={weatherInfo.description}>
              {weatherInfo.icon}
            </span>
          </div>
        )}
      </div>
    </header>
  );
}