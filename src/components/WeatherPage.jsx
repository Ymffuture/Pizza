import React, { useEffect, useState, useCallback } from "react";
import { Card, Spin, Button, Input, Tabs, message } from "antd";
import {
  Cloud,
  Sun,
  Sun,
  Wind,
  Droplets,
  Thermometer,
  MapPin,
  Clock,
  CloudRain,
  ArrowRight,
  History,
  CloudSnow,
  Zap,
} from "lucide-react";

const weatherIcons = {
  Clear: Sun,
  Clouds: Cloud,
  Rain: CloudRain,
  Snow: CloudSnow,
  Thunderstorm: Zap,
  Drizzle: Droplets,
};

export default function WeatherPage() {
  const [loading, setLoading] = useState(false);
  const [cityInput, setCityInput] = useState("");
  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [history, setHistory] = useState([]);

  const API_KEY = "378c0d8b5246ceb52c1c6c6899b3446e";

  useEffect(() => {
    const saved = localStorage.getItem("weather_history");
    if (saved) setHistory(JSON.parse(saved));
  }, []);

  const saveToHistory = (entry) => {
    const updated = [entry, ...history].slice(0, 20);
    setHistory(updated);
    localStorage.setItem("weather_history", JSON.stringify(updated));
  };

  const formatDate = (dt) => new Date(dt * 1000).toLocaleDateString("en-US", { weekday: 'short', month: 'short', day: 'numeric' });
  const formatTime = (dt) => new Date(dt * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const fetchWeather = async (lat, lon, city = "") => {
    try {
      setLoading(true);
      const url = city
        ? `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
        : `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;

      const res = await fetch(url);
      if (!res.ok) throw new Error(city ? "City not found" : "Failed to fetch");
      const data = await res.json();

      // Fetch 5-day forecast
      const forecastRes = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${data.coord.lat}&lon=${data.coord.lon}&appid=${API_KEY}&units=metric`
      );
      const forecastData = await forecastRes.json();

      setCurrentWeather(data);
      setForecast(forecastData.list.filter((_, i) => i % 8 === 0).slice(0, 5)); // Daily at noon
      saveToHistory(data);
    } catch (err) {
      message.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) return message.error("Geolocation not supported");
    navigator.geolocation.getCurrentPosition(
      (pos) => fetchWeather(pos.coords.latitude, pos.coords.longitude),
      () => message.error("Location access denied")
    );
  };

  const searchCity = () => {
    if (!cityInput.trim()) return;
    fetchWeather(null, null, cityInput);
    setCityInput("");
  };

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const WeatherIcon = weatherIcons[currentWeather?.weather[0]?.main] || Cloud;

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-400 via-blue-500 to-indigo-600 p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-5xl font-extrabold text-white text-center mb-10 drop-shadow-lg">
          Weather Today & Tomorrow
        </h1>

        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <Input
            size="large"
            placeholder="Search city..."
            value={cityInput}
            onChange={(e) => setCityInput(e.target.value)}
            onPressEnter={searchCity}
            className="flex-1 text-lg rounded-xl"
          />
          <Button size="large" type="primary" onClick={searchCity} icon={<ArrowRight className="w-5 h-5" />}>
            Search
          </Button>
          <Button size="large" onClick={getCurrentLocation} icon={<MapPin className="w-5 h-5" />}>
            My Location
          </Button>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Spin size="large" />
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Current Weather - Large Card */}
            {currentWeather && (
              <div className="lg:col-span-2">
                <Card className="backdrop-blur-xl bg-white/20 border-white/30 text-white rounded-3xl shadow-2xl overflow-hidden">
                  <div className="p-10">
                    <div className="flex justify-between items-start mb-8">
                      <div>
                        <h2 className="text-4xl font-bold flex items-center gap-3">
                          <MapPin className="w-10 h-10" />
                          {currentWeather.name}, {currentWeather.sys.country}
                        </h2>
                        <p className="text-xl opacity-90 mt-2">{formatTime(currentWeather.dt)}</p>
                      </div>
                      <WeatherIcon className="w-28 h-28 opacity-90" />
                    </div>

                    <div className="text-8xl font-bold mb-6">{Math.round(currentWeather.main.temp)}°</div>
                    <p className="text-2xl capitalize mb-8">{currentWeather.weather[0].description}</p>

                    <div className="grid grid-cols-2 gap-6 text-lg">
                      <div className="flex items-center gap-3"><Wind className="w-6 h-6" /> {currentWeather.wind.speed} m/s</div>
                      <div className="flex items-center gap-3"><Droplets className="w-6 h-6" /> {currentWeather.main.humidity}%</div>
                      <div className="flex items-center gap-3"><Thermometer className="w-6 h-6" /> Feels {Math.round(currentWeather.main.feels_like)}°</div>
                      <div className="flex items-center gap-3"><Cloud className="w-6 h-6" /> {currentWeather.clouds.all}% clouds</div>
                    </div>
                  </div>
                </Card>
              </div>
            )}

            {/* Tomorrow + 5-Day Forecast */}
            <div className="space-y-6">
              {forecast.length > 1 && (
                <>
                  <h3 className="text-2xl font-bold text-white">Tomorrow</h3>
                  <Card className="backdrop-blur-md bg-white/25 rounded-2xl p-6 text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-lg opacity-90">{formatDate(forecast[1].dt)}</p>
                        <p className="text-4xl font-bold mt-2">{Math.round(forecast[1].main.temp)}°</p>
                        <p className="capitalize mt-1">{forecast[1].weather[0].description}</p>
                      </div>
                      {React.createElement(weatherIcons[forecast[1].weather[0].main] || Cloud, { className: "w-20 h-20 opacity-80" })}
                    </div>
                  </Card>
                </>
              )}

              <h3 className="text-2xl font-bold text-white">5-Day Forecast</h3>
              <div className="space-y-4">
                {forecast.slice(1).map((day) => {
                  const Icon = weatherIcons[day.weather[0].main] || Cloud;
                  return (
                    <Card key={day.dt} className="backdrop-blur-md bg-white/20 rounded-xl p-4 text-white flex items-center justify-between">
                      <div>
                        <p className="font-semibold">{formatDate(day.dt)}</p>
                        <p className="text-2xl font-bold">{Math.round(day.main.temp)}°</p>
                      </div>
                      <Icon className="w-12 h-12" />
                      <p className="capitalize text-sm opacity-90">{day.weather[0].description}</p>
                    </Card>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* History Tab */}
        {history.length > 0 && (
          <div className="mt-12">
            <Tabs
              defaultActiveKey="1"
              items={[
                {
                  key: "1",
                  label: <span className="text-white text-lg"><History className="w-5 h-5 inline mr-2" />Recent Searches</span>,
                  children: (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                      {history.slice(0, 8).map((h, i) => (
                        <Card key={i} className="bg-white/20 backdrop-blur text-white border-none rounded-xl text-center p-4">
                          <p className="font-semibold">{h.name}</p>
                          <p className="text-2xl">{Math.round(h.main.temp)}°</p>
                          <p className="text-sm opacity-80">{formatTime(h.dt)}</p>
                        </Card>
                      ))}
                    </div>
                  ),
                },
              ]}
              className="text-white"
            />
          </div>
        )}
      </div>
    </div>
  );
}
