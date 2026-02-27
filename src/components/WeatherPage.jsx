import React, { useEffect, useState, useCallback } from "react";
import { Card, Button, Input, Tabs, message, Tooltip, Badge, Tag } from "antd";
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
  Sunrise,
  Sunset,
  Eye,
  Gauge,
  Navigation,
  Calendar,
  TrendingUp,
  TrendingDown,
  Info,
  RefreshCw,
  Search,
  LocateFixed
} from "lucide-react";
import { Helmet } from "react-helmet";
import { motion, AnimatePresence } from "framer-motion";

// --- Enhanced country data ---
const COUNTRY_DATA = {
  ZA: { name: "South Africa", flag: "🇿🇦", timezone: "Africa/Johannesburg" },
  US: { name: "United States", flag: "🇺🇸", timezone: "America/New_York" },
  GB: { name: "United Kingdom", flag: "🇬🇧", timezone: "Europe/London" },
  CA: { name: "Canada", flag: "🇨🇦", timezone: "America/Toronto" },
  AU: { name: "Australia", flag: "🇦🇺", timezone: "Australia/Sydney" },
  IN: { name: "India", flag: "🇮🇳", timezone: "Asia/Kolkata" },
  DE: { name: "Germany", flag: "🇩🇪", timezone: "Europe/Berlin" },
  FR: { name: "France", flag: "🇫🇷", timezone: "Europe/Paris" },
  JP: { name: "Japan", flag: "🇯🇵", timezone: "Asia/Tokyo" },
  BR: { name: "Brazil", flag: "🇧🇷", timezone: "America/Sao_Paulo" },
};

// --- Weather condition configurations ---
const WEATHER_CONFIG = {
  Clear: { 
    emoji: "☀️", 
    color: "from-orange-400 to-yellow-300",
    bg: "bg-orange-50",
    icon: Sun,
    label: "Clear Sky"
  },
  Clouds: { 
    emoji: "☁️", 
    color: "from-gray-400 to-gray-300",
    bg: "bg-gray-50",
    icon: Cloud,
    label: "Cloudy"
  },
  Rain: { 
    emoji: "🌧️", 
    color: "from-blue-600 to-blue-400",
    bg: "bg-blue-50",
    icon: CloudRain,
    label: "Rainy"
  },
  Drizzle: { 
    emoji: "🌦️", 
    color: "from-blue-400 to-cyan-300",
    bg: "bg-cyan-50",
    icon: CloudRain,
    label: "Drizzle"
  },
  Thunderstorm: { 
    emoji: "⛈️", 
    color: "from-purple-600 to-indigo-400",
    bg: "bg-indigo-50",
    icon: CloudRain,
    label: "Stormy"
  },
  Snow: { 
    emoji: "❄️", 
    color: "from-cyan-300 to-blue-200",
    bg: "bg-cyan-50",
    icon: Cloud,
    label: "Snowy"
  },
  Mist: { 
    emoji: "🌫️", 
    color: "from-gray-300 to-gray-200",
    bg: "bg-gray-50",
    icon: Cloud,
    label: "Misty"
  },
  Fog: { 
    emoji: "🌫️", 
    color: "from-gray-400 to-gray-300",
    bg: "bg-gray-100",
    icon: Cloud,
    label: "Foggy"
  },
};

// --- Helper functions ---
const formatTime = (ts, timezone = "local") => {
  return new Date(ts * 1000).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: timezone !== "local" ? timezone : undefined,
  });
};

const formatDate = (ts) => {
  return new Date(ts * 1000).toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  });
};

const getLocalTime = (timezone) => {
  return new Date().toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: timezone,
    timeZoneName: "short",
  });
};

export default function WeatherPage() {
  const [loading, setLoading] = useState(false);
  const [cityInput, setCityInput] = useState("");
  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [history, setHistory] = useState([]);
  const [selectedDay, setSelectedDay] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const API_KEY = "378c0d8b5246ceb52c1c6c6899b3446e";

  // Load history from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("weather_history");
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse history");
      }
    }
  }, []);

  // Save to history
  const saveToHistory = useCallback((entry) => {
    setHistory((prev) => {
      const filtered = prev.filter((h) => h.name !== entry.name);
      const updated = [entry, ...filtered].slice(0, 20);
      localStorage.setItem("weather_history", JSON.stringify(updated));
      return updated;
    });
  }, []);

  // Fetch weather by coordinates
  const fetchWeatherByCoords = useCallback(async (lat, lon, locationName = null) => {
    try {
      setLoading(true);
      
      const [curRes, oneRes] = await Promise.all([
        fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`),
        fetch(`https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=minutely&units=metric&appid=${API_KEY}`)
      ]);

      if (!curRes.ok) throw new Error("Failed to fetch current weather");
      
      const curData = await curRes.json();
      const oneData = oneRes.ok ? await oneRes.json() : null;

      const weatherData = {
        ...curData,
        timezone: oneData?.timezone || "local",
        hourly: oneData?.hourly?.slice(0, 24) || [],
        daily: oneData?.daily || [],
      };

      setCurrentWeather(weatherData);
      setForecast(oneData?.daily || null);
      setSelectedDay(null);
      saveToHistory({ ...weatherData, fetchedAt: Date.now() });
      
    } catch (err) {
      message.error(err.message);
    } finally {
      setLoading(false);
    }
  }, [saveToHistory]);

  // Fetch by city name
  const fetchWeatherByCity = async () => {
    if (!cityInput.trim()) {
      message.warn("Please enter a city name");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(cityInput)}&appid=${API_KEY}&units=metric`
      );

      if (!res.ok) throw new Error("City not found");
      const data = await res.json();
      
      await fetchWeatherByCoords(data.coord.lat, data.coord.lon, data.name);
      setCityInput("");
    } catch (err) {
      message.error(err.message);
      setLoading(false);
    }
  };

  // Get current location
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      message.error("Geolocation is not supported by your browser");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => fetchWeatherByCoords(pos.coords.latitude, pos.coords.longitude),
      () => message.error("Unable to retrieve your location"),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  // Refresh current weather
  const refreshWeather = async () => {
    if (!currentWeather?.coord) return;
    setRefreshing(true);
    await fetchWeatherByCoords(currentWeather.coord.lat, currentWeather.coord.lon);
    setRefreshing(false);
    message.success("Weather updated");
  };

  // Initial load
  useEffect(() => {
    getCurrentLocation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Get weather config
  const getWeatherConfig = (weatherMain) => {
    return WEATHER_CONFIG[weatherMain] || WEATHER_CONFIG.Clouds;
  };

  // Page title
  const pageTitle = loading
    ? "Loading Weather..."
    : currentWeather
    ? `${getWeatherConfig(currentWeather.weather[0].main).emoji} ${currentWeather.name} • ${Math.round(currentWeather.main.temp)}°C`
    : "Weather Forecast";

  // Components
  const WeatherIcon = ({ condition, size = 24, className = "" }) => {
    const config = getWeatherConfig(condition);
    const Icon = config.icon;
    return <Icon size={size} className={className} />;
  };

  const StatCard = ({ icon: Icon, label, value, subValue, color = "blue" }) => (
    <div className="bg-white/60 dark:bg-white/5 backdrop-blur rounded-2xl p-4 border border-white/20 dark:border-white/10 hover:shadow-lg transition-all duration-300">
      <div className="flex items-start justify-between">
        <div className={`p-2 rounded-xl bg-${color}-100 dark:bg-${color}-900/20`}>
          <Icon size={20} className={`text-${color}-600 dark:text-${color}-400`} />
        </div>
        {subValue && (
          <span className="text-xs text-gray-500 dark:text-gray-400">{subValue}</span>
        )}
      </div>
      <div className="mt-3">
        <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mt-1">{label}</p>
      </div>
    </div>
  );

  const CurrentWeatherCard = () => {
    if (!currentWeather) return null;
    
    const config = getWeatherConfig(currentWeather.weather[0].main);
    const countryInfo = COUNTRY_DATA[currentWeather.sys?.country] || { 
      name: currentWeather.sys?.country, 
      flag: "🌍",
      timezone: "local"
    };
    const localTime = getLocalTime(currentWeather.timezone);

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Main Weather Card */}
        <div className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${config.color} p-8 text-white shadow-2xl`}>
          <div className="absolute inset-0 bg-white/10 backdrop-blur-sm" />
          
          <div className="relative z-10">
            {/* Header */}
            <div className="flex items-start justify-between mb-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-4xl">{countryInfo.flag}</span>
                  <div>
                    <h2 className="text-3xl font-bold">{currentWeather.name}</h2>
                    <p className="text-white/80 text-sm">{countryInfo.name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-white/70 text-sm">
                  <Clock size={14} />
                  <span>Local time: {localTime}</span>
                </div>
              </div>
              
              <Tooltip title="Refresh weather data">
                <button
                  onClick={refreshWeather}
                  className={`p-3 rounded-full bg-white/20 hover:bg-white/30 transition-all ${refreshing ? 'animate-spin' : ''}`}
                >
                  <RefreshCw size={20} />
                </button>
              </Tooltip>
            </div>

            {/* Main Temperature */}
            <div className="flex items-center gap-6 mb-6">
              <div className="text-7xl font-bold tracking-tighter">
                {Math.round(currentWeather.main.temp)}°
              </div>
              <div className="space-y-1">
                <div className="text-3xl">{config.emoji}</div>
                <div className="text-lg font-medium capitalize">{currentWeather.weather[0].description}</div>
                <div className="text-sm text-white/70">
                  Feels like {Math.round(currentWeather.main.feels_like)}°
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="flex items-center gap-2 bg-white/20 rounded-xl p-3">
                <TrendingUp size={18} className="text-white/80" />
                <div>
                  <p className="text-xs text-white/70">High</p>
                  <p className="font-semibold">{Math.round(currentWeather.main.temp_max)}°</p>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-white/20 rounded-xl p-3">
                <TrendingDown size={18} className="text-white/80" />
                <div>
                  <p className="text-xs text-white/70">Low</p>
                  <p className="font-semibold">{Math.round(currentWeather.main.temp_min)}°</p>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-white/20 rounded-xl p-3">
                <Droplets size={18} className="text-white/80" />
                <div>
                  <p className="text-xs text-white/70">Humidity</p>
                  <p className="font-semibold">{currentWeather.main.humidity}%</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard 
            icon={Wind} 
            label="Wind Speed" 
            value={`${currentWeather.wind.speed} m/s`}
            subValue={`Direction: ${currentWeather.wind.deg}°`}
            color="cyan"
          />
          <StatCard 
            icon={Gauge} 
            label="Pressure" 
            value={`${currentWeather.main.pressure} hPa`}
            color="purple"
          />
          <StatCard 
            icon={Eye} 
            label="Visibility" 
            value={`${(currentWeather.visibility / 1000).toFixed(1)} km`}
            color="emerald"
          />
          <StatCard 
            icon={Cloud} 
            label="Cloud Cover" 
            value={`${currentWeather.clouds.all}%`}
            color="gray"
          />
        </div>

        {/* Sun Times */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-orange-50 dark:bg-orange-900/20 rounded-2xl p-4 border border-orange-100 dark:border-orange-800">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 dark:bg-orange-800 rounded-xl">
                <Sunrise size={24} className="text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Sunrise</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">
                  {formatTime(currentWeather.sys.sunrise, currentWeather.timezone)}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl p-4 border border-indigo-100 dark:border-indigo-800">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-100 dark:bg-indigo-800 rounded-xl">
                <Sunset size={24} className="text-indigo-600 dark:text-indigo-400" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Sunset</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">
                  {formatTime(currentWeather.sys.sunset, currentWeather.timezone)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Hourly Forecast */}
        {currentWeather.hourly?.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Clock size={20} className="text-gray-400" />
              24-Hour Forecast
            </h3>
            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-thin">
              {currentWeather.hourly.map((hour, idx) => (
                <div key={idx} className="flex-shrink-0 text-center min-w-[80px] p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                    {idx === 0 ? 'Now' : formatTime(hour.dt, currentWeather.timezone)}
                  </p>
                  <div className="text-2xl mb-2">
                    {getWeatherConfig(hour.weather[0].main).emoji}
                  </div>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {Math.round(hour.temp)}°
                  </p>
                  <div className="flex items-center justify-center gap-1 mt-1 text-xs text-gray-400">
                    <Droplets size={10} />
                    {Math.round(hour.pop * 100)}%
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 7-Day Forecast */}
        {forecast && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Calendar size={20} className="text-gray-400" />
              7-Day Forecast
            </h3>
            <div className="space-y-3">
              {forecast.slice(0, 7).map((day, idx) => {
                const dayConfig = getWeatherConfig(day.weather[0].main);
                const isSelected = selectedDay === idx;
                
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    onClick={() => setSelectedDay(isSelected ? null : idx)}
                    className={`p-4 rounded-xl cursor-pointer transition-all ${
                      isSelected 
                        ? 'bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800' 
                        : 'bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-16 text-sm font-medium text-gray-600 dark:text-gray-400">
                          {idx === 0 ? 'Today' : new Date(day.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' })}
                        </div>
                        <div className="text-3xl">{dayConfig.emoji}</div>
                        <div className="hidden sm:block">
                          <p className="font-medium text-gray-900 dark:text-white capitalize">{day.weather[0].description}</p>
                          <p className="text-xs text-gray-500">Humidity: {day.humidity}%</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="font-bold text-lg text-gray-900 dark:text-white">{Math.round(day.temp.max)}°</p>
                          <p className="text-sm text-gray-500">{Math.round(day.temp.min)}°</p>
                        </div>
                        {day.pop > 0 && (
                          <Badge 
                            count={`${Math.round(day.pop * 100)}%`} 
                            style={{ backgroundColor: '#3b82f6' }}
                          />
                        )}
                      </div>
                    </div>
                    
                    {/* Expanded Details */}
                    <AnimatePresence>
                      {isSelected && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600"
                        >
                          <div className="grid grid-cols-3 gap-4 text-sm">
                            <div>
                              <p className="text-gray-500 dark:text-gray-400">Morning</p>
                              <p className="font-semibold text-gray-900 dark:text-white">{Math.round(day.temp.morn)}°</p>
                            </div>
                            <div>
                              <p className="text-gray-500 dark:text-gray-400">Afternoon</p>
                              <p className="font-semibold text-gray-900 dark:text-white">{Math.round(day.temp.day)}°</p>
                            </div>
                            <div>
                              <p className="text-gray-500 dark:text-gray-400">Evening</p>
                              <p className="font-semibold text-gray-900 dark:text-white">{Math.round(day.temp.eve)}°</p>
                            </div>
                            <div>
                              <p className="text-gray-500 dark:text-gray-400">Wind</p>
                              <p className="font-semibold text-gray-900 dark:text-white">{day.wind_speed} m/s</p>
                            </div>
                            <div>
                              <p className="text-gray-500 dark:text-gray-400">UV Index</p>
                              <p className="font-semibold text-gray-900 dark:text-white">{day.uvi}</p>
                            </div>
                            <div>
                              <p className="text-gray-500 dark:text-gray-400">Rain</p>
                              <p className="font-semibold text-gray-900 dark:text-white">{day.rain || 0} mm</p>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}
      </motion.div>
    );
  };

  const HistoryList = () => (
    <div className="space-y-4">
      {history.length === 0 ? (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          <History size={48} className="mx-auto mb-4 opacity-30" />
          <p>No search history yet</p>
          <p className="text-sm mt-1">Search for a city to see it here</p>
        </div>
      ) : (
        <div className="grid gap-3">
          {history.map((h, i) => {
            const config = getWeatherConfig(h.weather[0].main);
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Card 
                  hoverable
                  onClick={() => fetchWeatherByCoords(h.coord.lat, h.coord.lon)}
                  className="rounded-2xl border-0 shadow-sm hover:shadow-md transition-all cursor-pointer bg-white dark:bg-gray-800"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="text-3xl">{config.emoji}</div>
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white text-lg">{h.name}</h4>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <span>{COUNTRY_DATA[h.sys?.country]?.flag || "🌍"}</span>
                          <span>{COUNTRY_DATA[h.sys?.country]?.name || h.sys?.country}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">
                        {Math.round(h.main.temp)}°C
                      </div>
                      <div className="text-xs text-gray-500 capitalize">{h.weather[0].description}</div>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between text-xs text-gray-400">
                    <span className="flex items-center gap-1">
                      <Clock size={12} />
                      {new Date(h.fetchedAt).toLocaleString()}
                    </span>
                    <Tag size="small" className="rounded-full">Click to refresh</Tag>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}
      
      {history.length > 0 && (
        <Button 
          onClick={() => {
            setHistory([]);
            localStorage.removeItem("weather_history");
            message.success("History cleared");
          }}
          danger
          block
          className="mt-4 rounded-xl"
        >
          Clear History
        </Button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-white dark:from-gray-900 dark:via-gray-900 dark:to-black py-8 px-4">
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content="Real-time weather forecasts with detailed hourly and 7-day outlook." />
      </Helmet>

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-3 mb-4"
          >
            <div className="p-3 bg-gradient-to-br from-blue-500 to-sky-400 rounded-2xl shadow-lg shadow-blue-500/25">
              <Cloud size={32} className="text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-sky-500 bg-clip-text text-transparent">
              Weather
            </h1>
          </motion.div>
          <p className="text-gray-500 dark:text-gray-400">Real-time forecasts • Hourly updates • 7-day outlook</p>
        </div>

        {/* Search Bar */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg shadow-black/5 p-2 mb-6"
        >
          <div className="flex gap-2">
            <Input
              size="large"
              placeholder="Search for a city..."
              value={cityInput}
              onChange={(e) => setCityInput(e.target.value)}
              onPressEnter={fetchWeatherByCity}
              prefix={<Search size={18} className="text-gray-400" />}
              className="flex-1 rounded-xl border-0 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder:text-gray-400"
            />
            <Button
              type="primary"
              size="large"
              onClick={fetchWeatherByCity}
              icon={<ArrowRight size={18} />}
              className="rounded-xl bg-blue-600 hover:bg-blue-700 border-0 px-6"
            >
              Search
            </Button>
            <Tooltip title="Use my location">
              <Button
                size="large"
                onClick={getCurrentLocation}
                icon={<LocateFixed size={18} />}
                className="rounded-xl border-gray-200 dark:border-gray-600"
              />
            </Tooltip>
          </div>
        </motion.div>

        {/* Content */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-16 h-16 border-4 border-blue-200 dark:border-blue-900 border-t-blue-600 rounded-full animate-spin" />
            <p className="mt-4 text-gray-500 dark:text-gray-400">Fetching weather data...</p>
          </div>
        ) : (
          <Tabs
            defaultActiveKey="current"
            className="weather-tabs"
            items={[
              {
                key: "current",
                label: (
                  <span className="flex items-center gap-2 px-2">
                    <Sun size={16} />
                    Current
                  </span>
                ),
                children: <CurrentWeatherCard />,
              },
              {
                key: "history",
                label: (
                  <span className="flex items-center gap-2 px-2">
                    <History size={16} />
                    History
                    {history.length > 0 && (
                      <span className="ml-1 px-2 py-0.5 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 text-xs rounded-full">
                        {history.length}
                      </span>
                    )}
                  </span>
                ),
                children: <HistoryList />,
              },
            ]}
          />
        )}

        {/* Footer */}
        <div className="mt-12 text-center text-xs text-gray-400 dark:text-gray-600 space-y-1">
          <p>Data provided by OpenWeatherMap • Updates every 10 minutes</p>
          <p>© {new Date().getFullYear()} Weather App</p>
        </div>
      </div>
    </div>
  );
}
