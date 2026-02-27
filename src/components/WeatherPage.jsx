import React, { useEffect, useState, useCallback, useMemo } from "react";
import { Card, Button, Input, Tabs, message, Tooltip, Badge, Empty, Tag, Skeleton } from "antd";
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
  Navigation,
  Sunrise,
  Sunset,
  Eye,
  Gauge,
  RefreshCw,
  Trash2,
  TrendingUp,
  TrendingDown,
  Minus,
  Umbrella,
  Snowflake,
  Zap,
  Moon,
  CloudLightning,
  CloudFog
} from "lucide-react";
import { Helmet } from "react-helmet";

// --- Enhanced country & flag map ---
const COUNTRY_NAMES = {
  ZA: { name: "South Africa", flag: "🇿🇦", region: "Africa" },
  US: { name: "United States", flag: "🇺🇸", region: "Americas" },
  GB: { name: "United Kingdom", flag: "🇬🇧", region: "Europe" },
  CA: { name: "Canada", flag: "🇨🇦", region: "Americas" },
  AU: { name: "Australia", flag: "🇦🇺", region: "Oceania" },
  IN: { name: "India", flag: "🇮🇳", region: "Asia" },
  CN: { name: "China", flag: "🇨🇳", region: "Asia" },
  JP: { name: "Japan", flag: "🇯🇵", region: "Asia" },
  DE: { name: "Germany", flag: "🇩🇪", region: "Europe" },
  FR: { name: "France", flag: "🇫🇷", region: "Europe" },
  BR: { name: "Brazil", flag: "🇧🇷", region: "Americas" },
  MX: { name: "Mexico", flag: "🇲🇽", region: "Americas" },
  RU: { name: "Russia", flag: "🇷🇺", region: "Europe" },
  IT: { name: "Italy", flag: "🇮🇹", region: "Europe" },
  ES: { name: "Spain", flag: "🇪🇸", region: "Europe" },
  NL: { name: "Netherlands", flag: "🇳🇱", region: "Europe" },
  SE: { name: "Sweden", flag: "🇸🇪", region: "Europe" },
  NO: { name: "Norway", flag: "🇳🇴", region: "Europe" },
  KR: { name: "South Korea", flag: "🇰🇷", region: "Asia" },
  SG: { name: "Singapore", flag: "🇸🇬", region: "Asia" },
  AE: { name: "UAE", flag: "🇦🇪", region: "Asia" },
  SA: { name: "Saudi Arabia", flag: "🇸🇦", region: "Asia" },
  EG: { name: "Egypt", flag: "🇪🇬", region: "Africa" },
  NG: { name: "Nigeria", flag: "🇳🇬", region: "Africa" },
  KE: { name: "Kenya", flag: "🇰🇪", region: "Africa" },
};

// --- Enhanced weather icons with Lucide components ---
const WeatherIcon = ({ condition, size = 24, className = "" }) => {
  const iconMap = {
    Clear: <Sun size={size} className={`text-yellow-500 ${className}`} />,
    Clouds: <Cloud size={size} className={`text-gray-500 ${className}`} />,
    Rain: <CloudRain size={size} className={`text-blue-500 ${className}`} />,
    Drizzle: <CloudRain size={size} className={`text-blue-400 ${className}`} />,
    Thunderstorm: <CloudLightning size={size} className={`text-purple-600 ${className}`} />,
    Snow: <Snowflake size={size} className={`text-cyan-400 ${className}`} />,
    Mist: <CloudFog size={size} className={`text-gray-400 ${className}`} />,
    Fog: <CloudFog size={size} className={`text-gray-400 ${className}`} />,
    Haze: <CloudFog size={size} className={`text-yellow-300 ${className}`} />,
    Dust: <Wind size={size} className={`text-orange-400 ${className}`} />,
    Sand: <Wind size={size} className={`text-orange-500 ${className}`} />,
    Tornado: <Zap size={size} className={`text-red-600 ${className}`} />,
    Squall: <Wind size={size} className={`text-blue-600 ${className}`} />,
  };
  
  return iconMap[condition] || <Sun size={size} className={`text-yellow-500 ${className}`} />;
};

// --- Helper: format UNIX timestamp ---
const formatDate = (ts, options = {}) => 
  new Date(ts * 1000).toLocaleString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    ...options
  });

const formatTime = (ts) => 
  new Date(ts * 1000).toLocaleTimeString(undefined, { 
    hour: '2-digit', 
    minute: '2-digit' 
  });

// --- Temperature trend indicator ---
const TempTrend = ({ current, previous }) => {
  if (!previous) return null;
  const diff = current - previous;
  if (diff > 2) return <TrendingUp size={16} className="text-red-500" />;
  if (diff < -2) return <TrendingDown size={16} className="text-blue-500" />;
  return <Minus size={16} className="text-gray-400" />;
};

export default function WeatherPage() {
  const [loading, setLoading] = useState(false);
  const [cityInput, setCityInput] = useState("");
  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [history, setHistory] = useState([]);
  const [activeTab, setActiveTab] = useState("1");
  const [lastUpdated, setLastUpdated] = useState(null);
  const [unit, setUnit] = useState("metric"); // metric or imperial
  const [favorites, setFavorites] = useState([]);

  // Load favorites from localStorage
  useEffect(() => {
    const savedFavs = localStorage.getItem("weather_favorites");
    if (savedFavs) setFavorites(JSON.parse(savedFavs));
  }, []);

  const API_KEY = "378c0d8b5246ceb52c1c6c6899b3446e";

  // Dynamic page title
  const pageTitle = useMemo(() => {
    if (loading) return "Loading Weather...";
    if (currentWeather) {
      const temp = Math.round(currentWeather.main.temp);
      const condition = currentWeather.weather[0].main;
      return `${temp}°C ${condition} in ${currentWeather.name} | Weather Forecast`;
    }
    return "Weather Forecast - Real-time Climate Updates";
  }, [loading, currentWeather]);

  // Dynamic meta description
  const metaDescription = useMemo(() => {
    if (currentWeather) {
      return `Current weather in ${currentWeather.name}: ${Math.round(currentWeather.main.temp)}°C, 
        ${currentWeather.weather[0].description}. Humidity: ${currentWeather.main.humidity}%, 
        Wind: ${currentWeather.wind.speed} m/s. 7-day forecast available.`;
    }
    return "Get real-time weather updates, 7-day forecasts, and weather history for any city worldwide.";
  }, [currentWeather]);

  /********************* Enhanced Loader *********************/
  const Loader = () => (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="relative">
        <div className="absolute inset-0 bg-blue-500 blur-xl opacity-20 animate-pulse rounded-full" />
        <svg
          width="80"
          height="80"
          viewBox="0 0 100 100"
          className="animate-spin text-blue-600"
        >
          <circle
            cx="50"
            cy="50"
            r="40"
            stroke="currentColor"
            strokeWidth="4"
            strokeLinecap="round"
            fill="none"
            strokeDasharray="200"
            strokeDashoffset="50"
            className="opacity-25"
          />
          <circle
            cx="50"
            cy="50"
            r="40"
            stroke="currentColor"
            strokeWidth="4"
            strokeLinecap="round"
            fill="none"
            strokeDasharray="200"
            strokeDashoffset="50"
            className="opacity-75"
            style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <Cloud size={24} className="text-blue-600 animate-bounce" />
        </div>
      </div>
      <p className="text-gray-500 mt-4 text-sm font-medium animate-pulse">
        Fetching weather data...
      </p>
      <p className="text-gray-400 text-xs mt-1">This may take a moment</p>
    </div>
  );

  /********************* History Management *********************/
  useEffect(() => {
    const saved = localStorage.getItem("weather_history");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Validate data structure
        if (Array.isArray(parsed)) {
          setHistory(parsed.slice(0, 50)); // Limit to 50 items
        }
      } catch (e) {
        console.error("Failed to parse history:", e);
      }
    }
  }, []);

  const saveToHistory = useCallback((entry) => {
    setHistory(prev => {
      // Remove duplicates based on city name
      const filtered = prev.filter(h => 
        h.name.toLowerCase() !== entry.name.toLowerCase()
      );
      const updated = [{
        ...entry,
        fetchedAt: Date.now(),
        id: `${entry.name}-${Date.now()}`
      }, ...filtered].slice(0, 30);
      
      localStorage.setItem("weather_history", JSON.stringify(updated));
      return updated;
    });
  }, []);

  const clearHistory = () => {
    if (window.confirm("Are you sure you want to clear all history?")) {
      setHistory([]);
      localStorage.removeItem("weather_history");
      message.success("History cleared");
    }
  };

  const removeFromHistory = (id) => {
    setHistory(prev => {
      const updated = prev.filter(h => h.id !== id);
      localStorage.setItem("weather_history", JSON.stringify(updated));
      return updated;
    });
  };

  /********************* Weather Fetching *********************/
  const fetchWeatherByCoords = useCallback(async (lat, lon, locationName = null) => {
    try {
      setLoading(true);
      setLastUpdated(new Date());

      // Parallel fetching for better performance
      const [curRes, oneRes] = await Promise.all([
        fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=${unit}`),
        fetch(`https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,alerts&units=${unit}&appid=${API_KEY}`)
      ]);

      if (!curRes.ok) throw new Error("Failed to fetch current weather");
      
      const curData = await curRes.json();
      if (locationName) curData.name = locationName; // Override with searched name
      
      const oneData = oneRes.ok ? await oneRes.json() : null;

      setCurrentWeather(curData);
      setForecast(oneData?.daily || null);
      saveToHistory(curData);
      setActiveTab("1"); // Switch to current weather tab
      
      // Success feedback
      message.success(`Weather updated for ${curData.name}`);
      
    } catch (err) {
      message.error(err.message || "Failed to fetch weather data");
      console.error("Weather fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, [unit, saveToHistory]);

  const fetchWeatherByCity = async () => {
    const query = cityInput.trim();
    if (!query) {
      message.warning("Please enter a city name");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(query)}&appid=${API_KEY}&units=${unit}`
      );

      if (res.status === 404) throw new Error("City not found. Please check the spelling.");
      if (!res.ok) throw new Error("Failed to fetch weather data");

      const data = await res.json();
      await fetchWeatherByCoords(data.coord.lat, data.coord.lon, data.name);
      setCityInput("");
      
    } catch (err) {
      message.error(err.message);
      setLoading(false);
    }
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      message.error("Geolocation is not supported by your browser");
      return;
    }

    message.info("Requesting location access...");
    
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        fetchWeatherByCoords(pos.coords.latitude, pos.coords.longitude);
      },
      (error) => {
        let errorMsg = "Location access denied";
        switch(error.code) {
          case error.PERMISSION_DENIED:
            errorMsg = "Location permission denied. Please enable location access in your browser settings.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMsg = "Location information unavailable.";
            break;
          case error.TIMEOUT:
            errorMsg = "Location request timed out.";
            break;
        }
        message.error(errorMsg);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  // Refresh current weather
  const refreshWeather = () => {
    if (currentWeather?.coord) {
      fetchWeatherByCoords(currentWeather.coord.lat, currentWeather.coord.lon);
    } else {
      getCurrentLocation();
    }
  };

  useEffect(() => {
    getCurrentLocation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /********************* Enhanced Components *********************/
  
  // Weather condition badge with color coding
  const WeatherBadge = ({ condition }) => {
    const colorMap = {
      Clear: "success",
      Clouds: "default",
      Rain: "processing",
      Drizzle: "processing",
      Thunderstorm: "error",
      Snow: "cyan",
      Mist: "warning",
      Fog: "warning",
    };
    
    return (
      <Tag color={colorMap[condition] || "default"} className="text-xs uppercase tracking-wide">
        {condition}
      </Tag>
    );
  };

  // Country label with tooltip
  const CountryLabel = ({ countryCode, showRegion = false }) => {
    const info = COUNTRY_NAMES[countryCode] || { 
      name: countryCode, 
      flag: "🏳️",
      region: "Unknown"
    };
    
    return (
      <Tooltip title={`${info.name}${showRegion ? ` • ${info.region}` : ''}`}>
        <span className="inline-flex items-center gap-2 cursor-help">
          <span className="text-xl">{info.flag}</span>
          <span className="text-sm text-gray-600 dark:text-gray-300 font-medium">
            {info.name}
          </span>
          {showRegion && (
            <span className="text-xs text-gray-400">({info.region})</span>
          )}
        </span>
      </Tooltip>
    );
  };

  // Stat card component
  const StatCard = ({ icon: Icon, label, value, subtext, color = "blue" }) => (
    <div className="p-4 rounded-xl bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all duration-300 group">
      <div className="flex items-start justify-between">
        <div className={`p-2 rounded-lg bg-${color}-100 dark:bg-${color}-900/30 text-${color}-600`}>
          <Icon size={20} />
        </div>
        {subtext && (
          <span className="text-xs text-gray-400">{subtext}</span>
        )}
      </div>
      <div className="mt-3">
        <div className="text-2xl font-bold text-gray-800 dark:text-gray-100">{value}</div>
        <div className="text-xs text-gray-500 mt-1">{label}</div>
      </div>
    </div>
  );

  /********************* Enhanced Weather Card *********************/
  const WeatherCard = ({ w }) => {
    if (!w) {
      return (
        <Card 
          bordered={false} 
          className="rounded-2xl shadow-sm bg-white/60 backdrop-blur-lg min-h-[400px] flex items-center justify-center"
        >
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={
              <div className="text-center">
                <p className="text-gray-500 mb-2">No weather data available</p>
                <p className="text-xs text-gray-400">Search for a city or use your current location</p>
                <Button 
                  type="primary" 
                  icon={<MapPin size={16} />} 
                  onClick={getCurrentLocation}
                  className="mt-4 rounded-lg"
                >
                  Use My Location
                </Button>
              </div>
            }
          />
        </Card>
      );
    }

    const countryInfo = COUNTRY_NAMES[w.sys?.country] || { 
      name: w.sys?.country, 
      flag: "",
      region: ""
    };
    
    const isDay = w.dt > w.sys.sunrise && w.dt < w.sys.sunset;
    const weatherMain = w.weather[0].main;
    const weatherDesc = w.weather[0].description;

    // Calculate local time
    const localTime = new Date((w.dt + w.timezone) * 1000);
    const timeString = localTime.toUTCString().replace("GMT", "");

    return (
      <div className="space-y-6">
        {/* Main Weather Card */}
        <Card
          bordered={false}
          className="rounded-3xl shadow-xl overflow-hidden relative"
          bodyStyle={{ padding: 0 }}
        >
          {/* Dynamic background based on weather */}
          <div className={`absolute inset-0 bg-gradient-to-br ${
            weatherMain === 'Clear' ? 'from-blue-400 to-blue-600' :
            weatherMain === 'Clouds' ? 'from-gray-400 to-gray-600' :
            weatherMain === 'Rain' ? 'from-blue-700 to-gray-800' :
            weatherMain === 'Snow' ? 'from-blue-100 to-blue-300' :
            weatherMain === 'Thunderstorm' ? 'from-purple-700 to-gray-900' :
            'from-sky-400 to-blue-600'
          } opacity-90`} />
          
          <div className="relative z-10 p-6 md:p-8 text-white">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-white/20 rounded-full backdrop-blur-md">
                  <MapPin size={24} className="text-white" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold">{w.name}</h2>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-2xl">{countryInfo.flag}</span>
                    <span className="text-white/80">{countryInfo.name}</span>
                    <Badge 
                      status={isDay ? "success" : "default"} 
                      text={isDay ? "Daytime" : "Nighttime"}
                      className="ml-2 text-white/80"
                    />
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <Tooltip title="Click to refresh">
                  <Button 
                    type="text" 
                    icon={<RefreshCw size={16} className="text-white" />}
                    onClick={refreshWeather}
                    className="text-white hover:text-white/80"
                  >
                    {lastUpdated?.toLocaleTimeString()}
                  </Button>
                </Tooltip>
                <div className="text-sm text-white/70 mt-1">
                  Local: {timeString}
                </div>
              </div>
            </div>

            {/* Main Temperature Display */}
            <div className="flex flex-col md:flex-row items-center gap-8 mb-8">
              <div className="flex items-center gap-6">
                <WeatherIcon 
                  condition={weatherMain} 
                  size={80} 
                  className="drop-shadow-lg" 
                />
                <div>
                  <div className="text-7xl font-bold tracking-tighter">
                    {Math.round(w.main.temp)}°
                    <span className="text-4xl text-white/60">{unit === 'metric' ? 'C' : 'F'}</span>
                  </div>
                  <div className="text-xl capitalize mt-2 font-medium">
                    {weatherDesc}
                  </div>
                  <WeatherBadge condition={weatherMain} />
                </div>
              </div>
              
              <div className="flex-1 w-full md:w-auto">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-sm">
                    <Droplets size={20} className="mx-auto mb-2 opacity-80" />
                    <div className="text-2xl font-bold">{w.main.humidity}%</div>
                    <div className="text-xs opacity-70">Humidity</div>
                  </div>
                  <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-sm">
                    <Wind size={20} className="mx-auto mb-2 opacity-80" />
                    <div className="text-2xl font-bold">{w.wind.speed}</div>
                    <div className="text-xs opacity-70">m/s Wind</div>
                  </div>
                  <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-sm">
                    <Gauge size={20} className="mx-auto mb-2 opacity-80" />
                    <div className="text-2xl font-bold">{w.main.pressure}</div>
                    <div className="text-xs opacity-70">hPa</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Feels like & extremes */}
            <div className="flex flex-wrap gap-4 text-sm bg-white/10 rounded-xl p-4 backdrop-blur-sm">
              <span className="flex items-center gap-2">
                <Thermometer size={16} />
                Feels like {Math.round(w.main.feels_like)}°
              </span>
              <span className="w-px h-4 bg-white/30 hidden md:block" />
              <span className="flex items-center gap-2">
                <TrendingUp size={16} />
                High {Math.round(w.main.temp_max)}°
              </span>
              <span className="w-px h-4 bg-white/30 hidden md:block" />
              <span className="flex items-center gap-2">
                <TrendingDown size={16} />
                Low {Math.round(w.main.temp_min)}°
              </span>
              <span className="w-px h-4 bg-white/30 hidden md:block" />
              <span className="flex items-center gap-2">
                <Eye size={16} />
                Visibility {(w.visibility / 1000).toFixed(1)} km
              </span>
            </div>
          </div>
        </Card>

        {/* Detailed Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard 
            icon={Sunrise} 
            label="Sunrise" 
            value={formatTime(w.sys.sunrise)}
            color="orange"
          />
          <StatCard 
            icon={Sunset} 
            label="Sunset" 
            value={formatTime(w.sys.sunset)}
            color="purple"
          />
          <StatCard 
            icon={Navigation} 
            label="Wind Direction" 
            value={`${w.wind.deg}°`}
            subtext={getWindDirection(w.wind.deg)}
            color="cyan"
          />
          <StatCard 
            icon={Cloud} 
            label="Cloud Cover" 
            value={`${w.clouds?.all || 0}%`}
            color="gray"
          />
        </div>

        {/* 7-Day Forecast */}
        {forecast && forecast.length > 0 && (
          <Card 
            title={
              <div className="flex items-center gap-2">
                <Clock size={18} className="text-blue-600" />
                <span className="font-bold">7-Day Forecast</span>
              </div>
            }
            bordered={false}
            className="rounded-2xl shadow-md bg-white/80 backdrop-blur-lg"
          >
            <div className="space-y-3">
              {forecast.slice(0, 7).map((day, i) => {
                const date = new Date(day.dt * 1000);
                const isToday = i === 0;
                
                return (
                  <div 
                    key={day.dt} 
                    className={`flex items-center justify-between p-3 rounded-xl transition-all ${
                      isToday ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200' : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`}
                  >
                    <div className="flex items-center gap-4 min-w-[120px]">
                      <div className="text-sm font-semibold w-12">
                        {isToday ? 'Today' : date.toLocaleDateString(undefined, { weekday: 'short' })}
                      </div>
                      <div className="text-xs text-gray-500">
                        {date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 flex-1 justify-center">
                      <WeatherIcon condition={day.weather[0].main} size={24} />
                      <span className="text-sm capitalize hidden md:block text-gray-600">
                        {day.weather[0].description}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-4 min-w-[140px] justify-end">
                      <div className="text-right">
                        <div className="font-bold text-lg">{Math.round(day.temp.day)}°</div>
                        <div className="text-xs text-gray-500">Day</div>
                      </div>
                      <div className="text-right text-gray-400">
                        <div className="font-medium">{Math.round(day.temp.night)}°</div>
                        <div className="text-xs">Night</div>
                      </div>
                      {day.pop > 0 && (
                        <Tooltip title={`${Math.round(day.pop * 100)}% chance of precipitation`}>
                          <div className="flex items-center gap-1 text-blue-500 text-xs">
                            <Umbrella size={12} />
                            {Math.round(day.pop * 100)}%
                          </div>
                        </Tooltip>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        )}
      </div>
    );
  };

  // Helper for wind direction
  const getWindDirection = (deg) => {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    return directions[Math.round(deg / 45) % 8];
  };

  /********************* Enhanced History List *********************/
  const HistoryList = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-700">Recent Searches</h3>
        {history.length > 0 && (
          <Button 
            danger 
            size="small" 
            icon={<Trash2 size={14} />}
            onClick={clearHistory}
          >
            Clear All
          </Button>
        )}
      </div>
      
      {history.length === 0 ? (
        <Empty 
          description="No search history yet" 
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      ) : (
        <div className="grid gap-3">
          {history.map((h) => (
            <Card 
              key={h.id || `${h.name}-${h.fetchedAt}`}
              bordered={false}
              className="rounded-xl bg-white/70 hover:bg-white transition-all cursor-pointer group"
              bodyStyle={{ padding: '12px 16px' }}
              onClick={() => fetchWeatherByCoords(h.coord.lat, h.coord.lon)}
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-full text-blue-600">
                    <History size={16} />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                      {h.name}
                    </div>
                    <div className="text-xs text-gray-500 flex items-center gap-2">
                      <span>{COUNTRY_NAMES[h.sys?.country]?.flag}</span>
                      <span>{COUNTRY_NAMES[h.sys?.country]?.name || h.sys?.country}</span>
                      <span>•</span>
                      <Clock size={12} />
                      {new Date(h.fetchedAt).toLocaleString()}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-2xl font-bold text-blue-600">
                      {Math.round(h.main.temp)}°
                    </div>
                    <div className="text-xs text-gray-500 capitalize">
                      {h.weather[0].main}
                    </div>
                  </div>
                  <Button
                    type="text"
                    danger
                    size="small"
                    icon={<Trash2 size={14} />}
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFromHistory(h.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  />
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );

  /********************* Animated Background *********************/
  const AnimatedBackground = () => {
    const [mounted, setMounted] = useState(false);
    
    useEffect(() => setMounted(true), []);
    
    if (!mounted) return null;
    
    return (
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        {/* Gradient base */}
        <div className="absolute inset-0 bg-gradient-to-b from-sky-100 via-blue-50 to-white dark:from-gray-900 dark:via-gray-900 dark:to-black" />
        
        {/* Animated clouds */}
        <div className="absolute inset-0 opacity-30">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 60}%`,
                animationDelay: `${i * 2}s`,
                animationDuration: `${20 + Math.random() * 10}s`
              }}
            >
              <Cloud 
                size={60 + Math.random() * 100} 
                className="text-white dark:text-gray-700 opacity-20" 
              />
            </div>
          ))}
        </div>
        
        {/* Stars for dark mode */}
        <div className="absolute inset-0 dark:opacity-100 opacity-0 transition-opacity duration-1000">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full animate-twinkle"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`
              }}
            />
          ))}
        </div>
      </div>
    );
  };

  /********************* Render *********************/
  return (
    <div className="relative min-h-screen">
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={metaDescription} />
        <meta name="theme-color" content={currentWeather ? 
          (currentWeather.weather[0].main === 'Clear' ? '#3B82F6' : 
           currentWeather.weather[0].main === 'Rain' ? '#1F2937' : '#60A5FA') 
          : '#3B82F6'
        } />
      </Helmet>

      <AnimatedBackground />

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-8 md:py-12">
        {/* Header */}
        <div className="text-center mb-8 space-y-2">
          <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-blue-600 via-sky-500 to-cyan-400 text-transparent bg-clip-text">
            Weather Forecast
          </h1>
          <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
            Real-time climate updates with 7-day forecasts and detailed weather analytics
          </p>
        </div>

        {/* Search Bar */}
        <Card 
          bordered={false} 
          className="rounded-2xl shadow-lg mb-6 bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl"
        >
          <div className="flex flex-col md:flex-row gap-3">
            <Input
              placeholder="Search for a city (e.g., London, Tokyo, New York)..."
              value={cityInput}
              onChange={(e) => setCityInput(e.target.value)}
              size="large"
              className="rounded-xl flex-1"
              onPressEnter={fetchWeatherByCity}
              prefix={<MapPin size={18} className="text-gray-400" />}
              suffix={
                cityInput && (
                  <Button 
                    type="text" 
                    size="small" 
                    onClick={() => setCityInput("")}
                  >
                    Clear
                  </Button>
                )
              }
            />
            <div className="flex gap-2">
              <Button 
                size="large" 
                type="primary" 
                onClick={fetchWeatherByCity}
                icon={<ArrowRight size={18} />}
                className="rounded-xl px-6 bg-gradient-to-r from-blue-600 to-sky-500 border-0 hover:opacity-90"
                loading={loading}
              >
                Search
              </Button>
              <Tooltip title="Use my current location">
                <Button 
                  size="large" 
                  onClick={getCurrentLocation}
                  icon={<Navigation size={18} />}
                  className="rounded-xl"
                >
                  <span className="hidden md:inline">My Location</span>
                </Button>
              </Tooltip>
            </div>
          </div>
          
          {/* Quick suggestions */}
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="text-xs text-gray-400 py-1">Popular:</span>
            {['London', 'New York', 'Tokyo', 'Paris', 'Sydney'].map(city => (
              <Tag 
                key={city}
                className="cursor-pointer hover:bg-blue-50 transition-colors"
                onClick={() => {
                  setCityInput(city);
                  fetchWeatherByCity();
                }}
              >
                {city}
              </Tag>
            ))}
          </div>
        </Card>

        {/* Main Content */}
        {loading ? (
          <div className="py-12">
            <Loader />
          </div>
        ) : (
          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            items={[
              {
                key: '1',
                label: (
                  <span className="flex items-center gap-2 px-2">
                    <Sun size={18} className="text-yellow-500" />
                    <span className="font-medium">Current</span>
                    {currentWeather && (
                      <Badge 
                        count={Math.round(currentWeather.main.temp) + '°'} 
                        style={{ backgroundColor: '#52c41a' }}
                        offset={[10, 0]}
                      />
                    )}
                  </span>
                ),
                children: <WeatherCard w={currentWeather} />
              },
              {
                key: '2',
                label: (
                  <span className="flex items-center gap-2 px-2">
                    <History size={18} className="text-gray-500" />
                    <span className="font-medium">History</span>
                    {history.length > 0 && (
                      <Badge count={history.length} offset={[10, 0]} />
                    )}
                  </span>
                ),
                children: <HistoryList />
              }
            ]}
            className="bg-white/50 dark:bg-gray-800/50 rounded-2xl p-2 backdrop-blur-sm"
          />
        )}

        {/* Footer */}
        <div className="mt-12 text-center space-y-2">
          <div className="flex justify-center gap-4 text-gray-400">
            <Tooltip title="Data provided by OpenWeatherMap">
              <span className="text-xs hover:text-gray-600 cursor-help">OpenWeather API</span>
            </Tooltip>
            <span className="text-gray-300">|</span>
            <span className="text-xs">Updated every 10 minutes</span>
          </div>
          <p className="text-xs text-gray-400">
            © {new Date().getFullYear()} Weather Forecast App. All rights reserved.
          </p>
        </div>
      </div>

      {/* Global styles for animations */}
      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateX(-100px) translateY(0px); }
          50% { transform: translateX(calc(100vw + 100px)) translateY(-20px); }
        }
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
        .animate-float {
          animation: float linear infinite;
        }
        .animate-twinkle {
          animation: twinkle 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
