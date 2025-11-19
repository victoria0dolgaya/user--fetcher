import { useState, useRef, useEffect } from "react";
import toast from "react-hot-toast";

export default function useWeather() {
  const [selectedWeather, setSelectedWeather] = useState(null);
  const [isInfoOpen, setIsInfoOpen] = useState(false);

  const intervalRef = useRef(null);

  async function fetchWeather(user) {
    try {
      let latitude = parseFloat(user.location.coordinates.latitude);
      let longitude = parseFloat(user.location.coordinates.longitude);

      // Validating coordinates
      if (
        Number.isNaN(latitude) ||
        Number.isNaN(longitude) ||
        latitude === 0 ||
        longitude === 0
      ) {
        console.warn("Invalid coordinates - fetching via geocoding...");

        const city = user.location.city;
        const country = user.location.country;

        const geoRes = await fetch(
          `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
            city
          )}&country=${encodeURIComponent(country)}`
        );
        const geoData = await geoRes.json();

        if (geoData.results && geoData.results.length > 0) {
          latitude = geoData.results[0].latitude;
          longitude = geoData.results[0].longitude;
        } else {
          console.warn("Geocoding failed - fallback to Kyiv");
          latitude = 50.4501;
          longitude = 30.5234;
        }
      }

      // Fetching weather
      const res = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&daily=temperature_2m_max,temperature_2m_min&temperature_unit=celsius&forecast_days=1&timezone=auto`
      );

      if (!res.ok) throw new Error("Weather request failed");
      const data = await res.json();

      // Temperature validation
      const currentTemp = Math.round(data.current_weather?.temperature ?? null);
      const minTemp = Math.round(data.daily?.temperature_2m_min[0] ?? null);
      const maxTemp = Math.round(data.daily?.temperature_2m_max[0] ?? null);

      const isInvalid =
        currentTemp === null ||
        currentTemp < -50 ||
        currentTemp > 50 ||
        minTemp < -50 ||
        maxTemp > 50;

      if (isInvalid) {
        console.warn("Suspicious temperature values detected");
        setSelectedWeather({
          name: `${user.name.first} ${user.name.last}`,
          location: `${user.location.city}, ${user.location.country}`,
          temperature: "Unavailable",
          min: "-",
          max: "-",
          weathercode: null,
        });
        return setIsInfoOpen(true);
      }

      // Valid weather
      setSelectedWeather({
        name: `${user.name.first} ${user.name.last}`,
        location: `${user.location.city}, ${user.location.country}`,
        temperature: currentTemp,
        min: minTemp,
        max: maxTemp,
        weathercode: data.current_weather.weathercode,
      });

      setIsInfoOpen(true);
      startAutoRefresh(user);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch weather. Try again later 🌧️");
      setIsInfoOpen(false);
    }
  }

  function startAutoRefresh(user) {
    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      fetchWeather(user);
    }, 300000); // 5 min update time
  }

  function closeWeather() {
    setIsInfoOpen(false);
    clearInterval(intervalRef.current);
  }

  // Cleanup
  useEffect(() => {
    return () => clearInterval(intervalRef.current);
  }, []);

  return {
    selectedWeather,
    isInfoOpen,
    fetchWeather,
    closeWeather,
  };
}
