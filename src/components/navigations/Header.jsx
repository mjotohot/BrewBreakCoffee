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
    "/profile": "My Profile",
  };

  const title = routeTitles[location.pathname] || "Untitled";

  const weatherColors = {
    Clear: "text-yellow-400",
    Clouds: "text-gray-300",
    Rain: "text-blue-400",
    Drizzle: "text-blue-300",
    Thunderstorm: "text-purple-400",
    Snow: "text-white",
    Mist: "text-gray-200",
  };

  const weatherMain = weatherData?.weather[0]?.main || "";
  const weatherClass = weatherColors[weatherMain] || "text-white";

  return (
    <header
      className="w-full top-0 px-6 py-4 flex items-center justify-between
      bg-white/10 backdrop-blur-xs shadow-md font-mono"
    >
      <h1 className="text-xl font-bold text-white drop-shadow-md">{title}</h1>
      <div className="flex items-center gap-3 text-lg">
        {loading && <span className="text-yellow-300 animate-pulse">...</span>}
        {error && <span className="text-red-400">Error: {error}</span>}
        {weatherData && (
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-white">Today's Weather:</span>
            <span className="font-semibold text-green-300">
              {weatherData.name}
            </span>
            <span className="font-bold text-orange-700">
              {weatherData.main.temp}°F
            </span>
            <span className={`font-semibold ${weatherClass}`}>
              {weatherData.weather[0].main} (
              {weatherData.weather[0].description})
            </span>
            <img
              className="w-10 h-10"
              src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}.png`}
              alt={weatherData.weather[0].description}
            />
          </div>
        )}
      </div>
    </header>
  );
}
