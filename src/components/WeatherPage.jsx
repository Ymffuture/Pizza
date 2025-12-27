import React, {
  useEffect,
  useState,
  useCallback,
  useMemo,
  useTransition,
  useDeferredValue,
  useRef,
  useSyncExternalStore,
} from "react";
import { Card, Button, Input, Tabs, message } from "antd";
import {
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

/* ----------------------------------
   Constants
----------------------------------- */

const COUNTRY_NAMES = {
  ZA: { name: "South Africa", flag: "🇿🇦" },
  US: { name: "United States", flag: "🇺🇸" },
  GB: { name: "United Kingdom", flag: "🇬🇧" },
  CA: { name: "Canada", flag: "🇨🇦" },
  AU: { name: "Australia", flag: "🇦🇺" },
  IN: { name: "India", flag: "🇮🇳" },
};

/* ----------------------------------
   LocalStorage (Concurrent-Safe)
----------------------------------- */

function subscribe(callback) {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

function getSnapshot() {
  return JSON.parse(localStorage.getItem("weather_history") || "[]");
}

function useWeatherHistory() {
  return useSyncExternalStore(subscribe, getSnapshot);
}

/* ----------------------------------
   Small UI Components
----------------------------------- */

const Loader = React.memo(() => (
  <div className="flex flex-col items-center py-12">
    <svg className="animate-spin" width="64" height="64" viewBox="0 0 100 100">
      <circle
        cx="50"
        cy="50"
        r="40"
        stroke="gray"
        strokeWidth="6"
        fill="none"
        strokeDasharray="250"
        strokeDashoffset="190"
      />
    </svg>
    <p className="text-gray-500 mt-2 text-sm">Loading weather…</p>
  </div>
));

const StarBackground = React.memo(() => (
  <div
    style={{
      position: "absolute",
      inset: 0,
      pointerEvents: "none",
      overflow: "hidden",
    }}
  >
    <style>{`
      @keyframes moveStars {
        from { transform: translate3d(0,0,0); }
        to { transform: translate3d(-600px,-300px,0); }
      }
    `}</style>
    <div
      style={{
        position: "absolute",
        width: "200%",
        height: "200%",
        backgroundImage:
          "radial-gradient(rgba(255,255,255,.8) 1px, transparent 1px)",
        backgroundSize: "60px 60px",
        animation: "moveStars 160s linear infinite",
      }}
    />
  </div>
));

/* ----------------------------------
   Weather Card
----------------------------------- */

const WeatherCard = React.memo(({ weather, forecast }) => {
  const country = useMemo(
    () => COUNTRY_NAMES[weather?.sys?.country] || {},
    [weather?.sys?.country]
  );

  const week = useMemo(() => forecast?.slice(0, 7) || [], [forecast]);

  if (!weather) {
    return (
      <Card className="rounded-xl">
        <div className="text-center text-gray-500">
          Search for a city or use your location.
        </div>
      </Card>
    );
  }

  return (
    <Card className="rounded-xl shadow-md">
      <div className="flex justify-between mb-4">
        <div>
          <h2 className="text-xl font-bold">{weather.name}</h2>
          <div className="text-sm text-gray-500">
            {country.flag} {country.name}
          </div>
        </div>
        <div className="text-sm text-gray-400">
          Updated {new Date().toLocaleTimeString()}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <div className="text-5xl font-bold flex items-center gap-2">
            <Thermometer /> {Math.round(weather.main.temp)}°C
          </div>
          <div className="capitalize text-gray-600">
            {weather.weather[0].description}
          </div>
        </div>

        <div className="md:col-span-2 grid grid-cols-2 gap-3 text-sm">
          <div><Droplets /> Humidity: {weather.main.humidity}%</div>
          <div><Wind /> Wind: {weather.wind.speed} m/s</div>
          <div><CloudRain /> Clouds: {weather.clouds?.all}%</div>
          <div>Feels like: {Math.round(weather.main.feels_like)}°C</div>
        </div>
      </div>

      {week.length > 0 && (
        <div className="mt-5">
          <div className="font-semibold mb-2">7-Day Forecast</div>
          <div className="flex gap-2 overflow-x-auto">
            {week.map((d, i) => (
              <div
                key={i}
                className="min-w-[100px] bg-gray-100 rounded-lg p-2 text-center"
              >
                <div className="font-semibold">
                  {new Date(d.dt * 1000).toLocaleDateString(undefined, {
                    weekday: "short",
                  })}
                </div>
                <div>{Math.round(d.temp.day)}°C</div>
                <div className="text-xs capitalize">
                  {d.weather[0].main}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
});

/* ----------------------------------
   History List
----------------------------------- */

const HistoryList = React.memo(({ history }) => (
  <div className="flex flex-col gap-3">
    {history.length === 0 && (
      <div className="text-center text-gray-500 text-sm">
        No previous searches
      </div>
    )}

    {history.map((h, i) => (
      <Card key={i} className="rounded-lg">
        <div className="flex justify-between">
          <div>
            <div className="font-semibold">{h.name}</div>
            <div className="text-xs text-gray-500">
              {COUNTRY_NAMES[h.sys?.country]?.flag}
              {COUNTRY_NAMES[h.sys?.country]?.name}
            </div>
          </div>
          <div className="font-bold text-blue-600">
            {Math.round(h.main.temp)}°C
          </div>
        </div>
        <div className="text-xs text-gray-400 mt-2 flex items-center gap-1">
          <Clock size={12} /> {new Date(h.fetchedAt).toLocaleString()}
        </div>
      </Card>
    ))}
  </div>
));

/* ----------------------------------
   Main Page
----------------------------------- */

export default function WeatherPage() {
  const apiKeyRef = useRef("378c0d8b5246ceb52c1c6c6899b3446e");
  const abortRef = useRef(null);

  const history = useWeatherHistory();

  const [cityInput, setCityInput] = useState("");
  const deferredCity = useDeferredValue(cityInput);

  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);

  const [isPending, startTransition] = useTransition();

  const saveToHistory = useCallback(
    (entry) => {
      const updated = [entry, ...history].slice(0, 30);
      localStorage.setItem("weather_history", JSON.stringify(updated));
    },
    [history]
  );

  const fetchByCoords = useCallback((lat, lon) => {
    if (abortRef.current) abortRef.current.abort();
    abortRef.current = new AbortController();

    startTransition(async () => {
      try {
        const cur = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKeyRef.current}`,
          { signal: abortRef.current.signal }
        ).then((r) => r.json());

        const one = await fetch(
          `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,alerts&units=metric&appid=${apiKeyRef.current}`,
          { signal: abortRef.current.signal }
        ).then((r) => r.json());

        setWeather(cur);
        setForecast(one.daily);
        saveToHistory({ ...cur, fetchedAt: Date.now() });
      } catch (e) {
        if (e.name !== "AbortError") message.error("Fetch failed");
      }
    });
  }, [saveToHistory]);

  const fetchByCity = useCallback(() => {
    if (!deferredCity.trim()) return message.warn("Enter a city");

    startTransition(async () => {
      try {
        const res = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
            deferredCity
          )}&units=metric&appid=${apiKeyRef.current}`
        ).then((r) => r.json());

        fetchByCoords(res.coord.lat, res.coord.lon);
        setCityInput("");
      } catch {
        message.error("City not found");
      }
    });
  }, [deferredCity, fetchByCoords]);

  useEffect(() => {
    navigator.geolocation?.getCurrentPosition(
      (pos) => fetchByCoords(pos.coords.latitude, pos.coords.longitude),
      () => message.error("Location denied")
    );
  }, [fetchByCoords]);

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-sky-50 to-white p-6">
      <StarBackground />

      <div className="relative max-w-3xl mx-auto">
        <h1 className="text-4xl font-extrabold text-center mb-8">
          Weather Forecast
        </h1>

        <div className="flex gap-3 mb-6">
          <Input
            value={cityInput}
            onChange={(e) => setCityInput(e.target.value)}
            onPressEnter={fetchByCity}
            placeholder="Search city"
            size="large"
          />
          <Button type="primary" size="large" onClick={fetchByCity}>
            <ArrowRight size={16} />
          </Button>
          <Button size="large" onClick={() => navigator.geolocation.getCurrentPosition(
            (p) => fetchByCoords(p.coords.latitude, p.coords.longitude)
          )}>
            <MapPin size={16} />
          </Button>
        </div>

        {isPending ? (
          <Loader />
        ) : (
          <Tabs
            items={[
              {
                key: "1",
                label: <span className="flex gap-2"><Sun size={16} /> Now</span>,
                children: <WeatherCard weather={weather} forecast={forecast} />,
              },
              {
                key: "2",
                label: <span className="flex gap-2"><History size={16} /> History</span>,
                children: <HistoryList history={history} />,
              },
            ]}
          />
        )}
      </div>
    </div>
  );
}
