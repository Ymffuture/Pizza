import React, { useEffect, useState, useCallback } from "react";
import { Card, Button, Input, Tabs, message } from "antd";
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

// --- Small country & flag map (expand as needed) ---
const COUNTRY_NAMES = {
  ZA: { name: "South Africa", flag: "🇿🇦" },
  US: { name: "United States", flag: "🇺🇸" },
  GB: { name: "United Kingdom", flag: "🇬🇧" },
  CA: { name: "Canada", flag: "🇨🇦" },
  AU: { name: "Australia", flag: "🇦🇺" },
  IN: { name: "India", flag: "🇮🇳" },
};

// --- Helper: format UNIX timestamp (seconds) ---
const formatDate = (ts) => new Date(ts * 1000).toLocaleString();

export default function WeatherPage() {
  const [loading, setLoading] = useState(false);
  const [cityInput, setCityInput] = useState("");
  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecast, setForecast] = useState(null); // daily forecast
  const [history, setHistory] = useState([]);

  // Replace with your key or keep environment variable in production
  const API_KEY = "378c0d8b5246ceb52c1c6c6899b3446e";

  /********************* Loader (small) *********************/
  const Loader = () => (
    <div className="flex flex-col items-center justify-center bg-transparent">
      <svg
        width="64"
        height="64"
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
        className="animate-spin text-gray-300 dark:text-gray-700"
      >
        <circle
          cx="50"
          cy="50"
          r="40"
          stroke="currentColor"
          strokeWidth="6"
          strokeLinecap="round"
          fill="none"
          strokeDasharray="250"
          strokeDashoffset="190"
        />
        <circle cx="50" cy="50" r="10" fill="#00E5FF">
          <animate attributeName="r" values="10;14;10" dur="2.6s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="1;0.6;1" dur="1.9s" repeatCount="indefinite" />
        </circle>
      </svg>
      <p className="text-gray-500 dark:text-gray-400 mt-3 text-sm tracking-wide">Loading weather...</p>
    </div>
  );

  /********************* History (localStorage) *********************/
  useEffect(() => {
    const saved = localStorage.getItem("weather_history");
    if (saved) setHistory(JSON.parse(saved));
  }, []);

  const saveToHistory = (entry) => {
    const updated = [entry, ...history].slice(0, 30);
    setHistory(updated);
    localStorage.setItem("weather_history", JSON.stringify(updated));
  };

  /********************* Fetch by coordinates (current + daily forecast) *********************/
  const fetchWeatherByCoords = useCallback(
    async (lat, lon) => {
      try {
        setLoading(true);

        // Current weather
        const curRes = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
        );
        if (!curRes.ok) throw new Error("Failed to fetch current weather");
        const curData = await curRes.json();

        // OneCall for daily forecast (5-7 days)
        const oneRes = await fetch(
          `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,alerts&units=metric&appid=${API_KEY}`
        );
        let oneData = null;
        if (oneRes.ok) oneData = await oneRes.json();

        setCurrentWeather(curData);
        setForecast(oneData?.daily || null);
        saveToHistory({ ...curData, fetchedAt: Date.now() });
      } catch (err) {
        message.error(err.message);
      } finally {
        setLoading(false);
      }
    },
    [history]
  );

  /********************* Fetch by city name *********************/
  const fetchWeatherByCity = async () => {
    if (!cityInput.trim()) return message.warn("Enter a city");

    try {
      setLoading(true);
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
          cityInput
        )}&appid=${API_KEY}&units=metric`
      );

      if (!res.ok) throw new Error("City not found");
      const data = await res.json();

      // also fetch forecast via onecall
      await fetchWeatherByCoords(data.coord.lat, data.coord.lon);

      setCityInput("");
      // currentWeather will be set in fetchWeatherByCoords (keeps single source)
    } catch (err) {
      message.error(err.message);
      setLoading(false);
    }
  };

  /********************* Get current location *********************/
  const getCurrentLocation = () => {
    if (!navigator.geolocation) return message.error("Geolocation not supported");

    navigator.geolocation.getCurrentPosition(
      (pos) => fetchWeatherByCoords(pos.coords.latitude, pos.coords.longitude),
      () => message.error("Location access denied")
    );
  };

  useEffect(() => {
    // fetch on mount
    getCurrentLocation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /********************* Small presentational pieces *********************/
  const CountryLabel = ({ countryCode }) => {
    const info = COUNTRY_NAMES[countryCode] || { name: countryCode, flag: "" };
    return (
      <span className="inline-flex items-center gap-2">
        <span className="text-lg">{info.flag}</span>
        <span className="text-sm text-gray-600 dark:text-gray-300">{info.name}</span>
      </span>
    );
  };

  /********************* WeatherCard (full) *********************/
  const WeatherCard = ({ w }) => {
    if (!w) return (
      <Card bordered={false} className="rounded-2xl shadow-sm bg-white/60 backdrop-blur-lg p-6">
        <div className="text-center text-gray-500">No weather yet. Search a city or use your location.</div>
      </Card>
    );

    const countryInfo = (COUNTRY_NAMES[w.sys?.country] || { name: w.sys?.country, flag: "" });

    return (
      <Card
        bordered={false}
        className="rounded-2xl shadow-md bg-gradient-to-br from-white/70 to-white/30 dark:from-black/60 dark:to-black/40 p-5"
        title={
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <MapPin size={18} className="text-blue-600" />
              <div>
                <div className="font-semibold text-lg">{w.name}</div>
                <div className="text-xs text-gray-500 flex items-center gap-2">
                  <span>{countryInfo.flag}</span>
                  <span>{countryInfo.name}</span>
                </div>
              </div>
            </div>
            <div className="text-sm text-gray-500">Updated: {new Date().toLocaleTimeString()}</div>
          </div>
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          <div className="flex flex-col items-center md:items-start gap-2 md:col-span-1">
            <div className="flex items-center gap-3 text-5xl font-bold text-sky-600">
              <Thermometer size={44} /> {Math.round(w.main.temp)}°C
            </div>
            <div className="text-sm text-gray-600 capitalize">{w.weather[0].description}</div>
            <div className="mt-2 flex gap-2 items-center text-sm text-gray-500">
              <span className="inline-flex items-center gap-1"> <Droplets size={14} /> {w.main.humidity}%</span>
              <span className="inline-flex items-center gap-1"> <Wind size={14} /> {w.wind.speed} m/s</span>
              <span className="inline-flex items-center gap-1"> <CloudRain size={14} /> {w.clouds?.all}%</span>
            </div>
          </div>

          <div className="md:col-span-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-white/40">Feels like: <strong>{Math.round(w.main.feels_like)}°C</strong></div>
              <div className="p-3 rounded-xl bg-white/40">Pressure: <strong>{w.main.pressure} hPa</strong></div>
              <div className="p-3 rounded-xl bg-white/40">Visibility: <strong>{(w.visibility/1000).toFixed(1)} km</strong></div>
              <div className="p-3 rounded-xl bg-white/40">Sunrise: <strong>{new Date(w.sys.sunrise*1000).toLocaleTimeString()}</strong></div>
            </div>

            {/* Forecast preview */}
            {forecast && (
              <div className="mt-4">
                <div className="text-sm text-gray-600 font-semibold mb-2">7-day outlook</div>
                <div className="flex gap-2 overflow-x-auto py-1">
                  {forecast.slice(0, 7).map((d, i) => (
                    <div key={i} className="min-w-[120px] p-2 rounded-xl bg-white/30 flex flex-col items-center text-sm">
                      <div className="font-semibold">{new Date(d.dt*1000).toLocaleDateString(undefined,{weekday:'short'})}</div>
                      <div className="mt-1 text-xs text-gray-600">{Math.round(d.temp.day)}°C</div>
                      <div className="text-xs capitalize">{d.weather[0].main}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>
      </Card>
    );
  };

  /********************* History list *********************/
  const HistoryList = () => (
    <div className="flex flex-col gap-3">
      {history.length === 0 && <div className="text-center text-sm text-gray-500">No previous records</div>}
      {history.map((h, i) => (
        <Card key={i} bordered={false} className="rounded-xl bg-gray-50/60 p-3">
          <div className="flex justify-between items-center">
            <div>
              <div className="font-semibold">{h.name}</div>
              <div className="text-xs text-gray-500">{COUNTRY_NAMES[h.sys?.country]?.flag} {COUNTRY_NAMES[h.sys?.country]?.name || h.sys?.country}</div>
            </div>
            <div className="text-blue-600 font-bold">{Math.round(h.main.temp)}°C</div>
          </div>
          <div className="text-xs text-gray-500 mt-2 flex items-center gap-2"><Clock size={12} /> {new Date(h.fetchedAt || Date.now()).toLocaleString()}</div>
        </Card>
      ))}
    </div>
  );

  /********************* Inline star background (simple & performant) *********************/
  const StarBackground = () => (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
      <style>{`@keyframes moveStars {from { transform: translate3d(0,0,0);} to { transform: translate3d(-600px,-300px,0);} }`}</style>
      <div style={{ position: 'absolute', width: '200%', height: '200%', backgroundImage: 'radial-gradient(rgba(255,255,255,0.9) 1px, transparent 1px), radial-gradient(rgba(255,255,255,0.7) 1px, transparent 1px)', backgroundSize: '40px 40px, 80px 80px', opacity: 0.6, animation: 'moveStars 120s linear infinite' }} />
      <div style={{ position: 'absolute', width: '200%', height: '200%', backgroundImage: 'radial-gradient(rgba(255,255,255,0.6) 1px, transparent 1px)', backgroundSize: '120px 120px', opacity: 0.3, animation: 'moveStars 220s linear infinite' }} />
    </div>
  );

  /********************* Render *********************/
  return (
    <div className="relative min-h-screen flex items-start justify-center py-10 px-4 bg-gradient-to-b from-sky-50 to-white dark:from-gray-900 dark:to-black">

      {/* star bg */}
      <StarBackground />

      <div style={{ position: 'relative', zIndex: 10 }} className="w-full max-w-3xl">

        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-blue-600 to-sky-400 text-transparent bg-clip-text tracking-tight">Weather Forecast</h1>
          <p className="text-gray-500 mt-1 text-sm">Real-time climate updates · 7-day outlook · History</p>
        </div>

        {/* Search & actions */}
        <div className="flex gap-3 mb-5">
          <Input
            placeholder="Search city, e.g. Johannesburg"
            value={cityInput}
            onChange={(e)=>setCityInput(e.target.value)}
            size="large"
            className="rounded-xl"
            onPressEnter={fetchWeatherByCity}
          />
          <Button size="large" type="primary" onClick={fetchWeatherByCity} icon={<ArrowRight size={16}/> } className="rounded-xl">Search</Button>
          <Button size="large" onClick={getCurrentLocation} icon={<MapPin size={16}/>} className="rounded-xl">My Location</Button>
        </div>

        {/* Content */}
        <div className="bg-transparent">
          {loading ? (
            <div className="py-12 flex justify-center"><Loader/></div>
          ) : (
            <Tabs defaultActiveKey="1" items={[
              { key: '1', label: <span className="flex items-center gap-2"><Sun size={16} className="text-yellow-600" /> Now</span>, children: <WeatherCard w={currentWeather} /> },
              { key: '2', label: <span className="flex items-center gap-2"><History size={14}/> History</span>, children: <HistoryList /> }
            ]} />
          )}
        </div>

        {/* Footer small */}
        <div className="mt-6 text-center text-xs text-gray-500">Built with OpenWeather · Data may be delayed · © {new Date().getFullYear()}</div>
      </div>

    </div>
  );
}
