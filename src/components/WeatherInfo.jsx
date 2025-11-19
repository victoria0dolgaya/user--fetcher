import React from "react";

function WeatherIcon({ code }) {
  const icons = {
    0: "☀️", // clear sky
    1: "🌤️", // mainly clear
    2: "⛅", // partly cloudy
    3: "☁️", // overcast
    45: "🌫️", // fog
    48: "🌫️", // fog
    51: "🌦️", // drizzle
    61: "🌧️", // rain
    71: "🌨️", // snow
    95: "⛈️", // thunderstorm
  };
  return <div className="text-6xl mb-2">{icons[code] || "🌍"}</div>;
}

export default function WeatherInfo({ weather, onClose }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white rounded-xl p-6 shadow-lg max-w-sm w-full text-center">
        <h2 className="text-2xl font-bold mb-1">{weather.name}</h2>
        <p className="text-gray-600 mb-3">{weather.location}</p>

        <WeatherIcon code={weather.weathercode} />

        {weather.temperature === "Unavailable" ? (
        <p className="text-gray-500 italic text-lg mt-2">
          🌧️ Weather data unavailable
        </p>
        ) : (
        <>
        <p className="text-2xl font-semibold mt-2">
          🌡️ {weather.temperature === "Unavailable" ? "Unavailable" : `${weather.temperature}`}°C
        </p>
         <p className="text-gray-700 mt-1">
          Min: {weather.min}°C | Max: {weather.max}°C
        </p>
        </>
      )}

        <button
          onClick={onClose}
          className="mt-5 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Close
        </button>
      </div>
    </div>
  );
}
