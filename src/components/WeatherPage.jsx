import React, { useEffect, useState, useCallback } from "react";
import { Card, Spin, Button, Input, Tabs, message } from "antd";
import {
  Cloud,
  Sun,
  Wind,
  Droplets,
  Thermometer,
  MapPin,
  Clock,
  CloudRain,
  ArrowRight,
  History,
} from "lucide-react";

export default function WeatherPage() {
  const [loading, setLoading] = useState(false);
  const [cityInput, setCityInput] = useState("");
  const [currentWeather, setCurrentWeather] = useState(null);
  const [history, setHistory] = useState([]);

  const API_KEY = "YOUR_OPENWEATHER_KEY";

  // ---------------------------------------------
  // LOAD PREVIOUS WEATHER RECORDS
  // ---------------------------------------------
  useEffect(() => {
    const saved = localStorage.getItem("weather_history");
    if (saved) setHistory(JSON.parse(saved));
  }, []);

  const saveToHistory = (entry) => {
    const updated = [entry, ...history].slice(0, 20); // keep latest 20
    setHistory(updated);
    localStorage.setItem("weather_history", JSON.stringify(updated));
  };

  // ---------------------------------------------
  // FORMAT DATE
  // ---------------------------------------------
  const formatDate = (ts) => {
    return new Date(ts * 1000).toLocaleString();
  };

  // ---------------------------------------------
  // FETCH WEATHER BY COORDINATES
  // ---------------------------------------------
  const fetchWeatherByCoords = useCallback(async (lat, lon) => {
    try {
      setLoading(true);
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
      );

      if (!res.ok) throw new Error("Failed to fetch weather");

      const data = await res.json();
      setCurrentWeather(data);
      saveToHistory(data);
    } catch (err) {
      message.error(err.message);
    } finally {
      setLoading(false);
    }
  }, [history]);

  // ---------------------------------------------
  // GET CURRENT LOCATION
  // ---------------------------------------------
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      return message.error("Geolocation not supported");
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        fetchWeatherByCoords(latitude, longitude);
      },
      () => message.error("Failed to fetch location")
    );
  };

  // ---------------------------------------------
  // FETCH WEATHER BY CITY NAME
  // ---------------------------------------------
  const fetchWeatherByCity = async () => {
    if (!cityInput.trim()) return;

    try {
      setLoading(true);
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityInput}&appid=${API_KEY}&units=metric`
      );

      if (!res.ok) throw new Error("City not found");

      const data = await res.json();
      setCurrentWeather(data);
      saveToHistory(data);
    } catch (err) {
      message.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ---------------------------------------------
  // RENDER MAIN WEATHER CARD
  // ---------------------------------------------
  const WeatherCard = ({ w }) => {
    if (!w) return null;

    return (
      <Card
        bordered
        className="rounded-2xl shadow-md p-4 bg-white"
        title={
          <div className="flex items-center gap-2">
            <MapPin size={18} />
            <span>
              {w.name}, {w.sys.country}
            </span>
          </div>
        }
      >
        <div className="flex flex-col gap-4">
          <div className="text-4xl font-bold flex items-center gap-3">
            <Thermometer /> {w.main.temp}°C
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2 text-lg">
              <Sun /> {w.weather[0].description}
            </div>
            <div className="flex items-center gap-2 text-lg">
              <Wind /> {w.wind.speed} m/s wind
            </div>
            <div className="flex items-center gap-2 text-lg">
              <Droplets /> {w.main.humidity}% humidity
            </div>
            <div className="flex items-center gap-2 text-lg">
              <CloudRain /> {w.clouds.all}% clouds
            </div>
            <div className="flex items-center gap-2 text-lg col-span-2">
              <Clock /> {formatDate(w.dt)}
            </div>
          </div>
        </div>
      </Card>
    );
  };

  // ---------------------------------------------
  // RENDER WEATHER HISTORY
  // ---------------------------------------------
  const HistoryList = () => (
    <div className="flex flex-col gap-3">
      {history.length === 0 && <p>No previous records yet.</p>}

      {history.map((h, i) => (
        <Card key={i} className="rounded-xl shadow-sm bg-gray-50">
          <div className="flex justify-between items-center">
            <div className="font-semibold">
              {h.name}, {h.sys.country}
            </div>
            <div>{h.main.temp}°C</div>
          </div>

          <div className="text-gray-600 text-sm flex gap-2 items-center mt-1">
            <Clock size={14} /> {formatDate(h.dt)}
          </div>
        </Card>
      ))}
    </div>
  );

  // ---------------------------------------------
  // USE EFFECT ON LOAD
  // ---------------------------------------------
  useEffect(() => {
    getCurrentLocation();
  }, []);

  // ---------------------------------------------
  // UI
  // ---------------------------------------------
  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-3xl font-bold mb-4 flex items-center gap-2">
        <Cloud size={32} /> Weather App
      </h1>

      <div className="flex gap-2 mb-4">
        <Input
          placeholder="Search city..."
          value={cityInput}
          onChange={(e) => setCityInput(e.target.value)}
        />
        <Button type="primary" onClick={fetchWeatherByCity} icon={<ArrowRight />}>
          Go
        </Button>
        <Button onClick={getCurrentLocation} icon={<MapPin />}>
          My Location
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-10">
          <Spin size="large" />
        </div>
      ) : (
        <Tabs
          defaultActiveKey="1"
          items={[
            {
              key: "1",
              label: "Current Weather",
              children: <WeatherCard w={currentWeather} />,
            },
            {
              key: "2",
              label: (
                <div className="flex items-center gap-1">
                  <History size={16} /> Previous Records
                </div>
              ),
              children: <HistoryList />,
            },
          ]}
        />
      )}
    </div>
  );
}
