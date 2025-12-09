import React, { useEffect, useState, useCallback, useMemo } from "react";
import { Card, Spin, Button, Input, Tabs, message, Row, Col } from "antd";
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
  CalendarDays,
  Moon,
} from "lucide-react";

/**
 * NOTE: For production move this key to server-side.
 * Keep as-is for quick demo.
 */
const API_KEY = "378c0d8b5246ceb52c1c6c6899b3446e";

/* small helper to pick emoji or icon for condition */
const OW_ICON_URL = (code) => `https://openweathermap.org/img/wn/${code}@4x.png`;

const formatLocal = (unixTs, opts) =>
  new Date(unixTs * 1000).toLocaleString(undefined, opts || {});

const dayName = (unixTs) =>
  new Date(unixTs * 1000).toLocaleDateString(undefined, { weekday: "long" });

export default function WeatherPage() {
  const [loading, setLoading] = useState(false);
  const [cityInput, setCityInput] = useState("");
  const [weatherPack, setWeatherPack] = useState(null);
  const [history, setHistory] = useState([]);

  // load history
  useEffect(() => {
    const saved = localStorage.getItem("weather_history");
    if (saved) setHistory(JSON.parse(saved));
  }, []);

  const saveToHistory = useCallback(
    (entry) => {
      try {
        const updated = [entry, ...history].slice(0, 20);
        setHistory(updated);
        localStorage.setItem("weather_history", JSON.stringify(updated));
      } catch (e) {
        // ignore
      }
    },
    [history]
  );

  // fetch current weather (by coord) + onecall (daily) concurrently
  const fetchWeatherByCoords = useCallback(
    async (lat, lon, label) => {
      const cacheKey = `weather_${lat.toFixed(3)}_${lon.toFixed(3)}_${new Date()
        .toISOString()
        .slice(0, 10)}`; // daily cache
      try {
        setLoading(true);

        // try cache first
        const cachedRaw = localStorage.getItem(cacheKey);
        if (cachedRaw) {
          const cached = JSON.parse(cachedRaw);
          setWeatherPack(cached);
          // push history if label provided
          if (label) saveToHistory({ at: Date.now(), label, pack: cached });
          return;
        }

        // run current + onecall in parallel for speed
        const curPromise = fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
        ).then((r) => {
          if (!r.ok) throw new Error("Failed to fetch current weather");
          return r.json();
        });

        const oneCallPromise = fetch(
          `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,alerts&units=metric&appid=${API_KEY}`
        ).then((r) => {
          if (!r.ok) throw new Error("Failed to fetch forecast");
          return r.json();
        });

        const [cur, one] = await Promise.all([curPromise, oneCallPromise]);

        const pack = {
          current: cur,
          onecall: one,
          fetchedAt: Date.now(),
        };

        localStorage.setItem(cacheKey, JSON.stringify(pack));
        setWeatherPack(pack);

        if (label) saveToHistory({ at: Date.now(), label, pack });
      } catch (err) {
        message.error(err.message || "Unable to fetch weather");
      } finally {
        setLoading(false);
      }
    },
    [saveToHistory]
  );

  // geolocation entrypoint
  const getCurrentLocation = useCallback(() => {
    if (!navigator.geolocation) {
      return message.error("Geolocation not supported in this browser");
    }
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        fetchWeatherByCoords(latitude, longitude, "Current location");
      },
      (err) => {
        setLoading(false);
        message.error("Location access denied or failed");
      },
      { enableHighAccuracy: false, timeout: 10000 }
    );
  }, [fetchWeatherByCoords]);

  // city lookup - we first fetch current weather by city which returns coord, then onecall
  const fetchWeatherByCity = useCallback(async () => {
    if (!cityInput.trim()) return;
    try {
      setLoading(true);
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
          cityInput.trim()
        )}&appid=${API_KEY}&units=metric`
      );
      if (!res.ok) throw new Error("City not found");
      const data = await res.json();
      // now fetch onecall via coords
      const lat = data.coord.lat;
      const lon = data.coord.lon;
      await fetchWeatherByCoords(lat, lon, `${data.name}, ${data.sys.country}`);
      setCityInput("");
    } catch (err) {
      message.error(err.message || "Failed to fetch city");
      setLoading(false);
    }
  }, [cityInput, fetchWeatherByCoords]);

  // auto-run on mount
  useEffect(() => {
    getCurrentLocation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // intentionally run once

  // derive "today" and "tomorrow" from weatherPack
  const today = useMemo(() => {
    if (!weatherPack) return null;
    const cur = weatherPack.current;
    const one = weatherPack.onecall;
    return {
      name: cur.name,
      country: cur.sys?.country,
      temp: Math.round(cur.main.temp),
      feelsLike: Math.round(cur.main.feels_like),
      description: cur.weather?.[0]?.description,
      icon: cur.weather?.[0]?.icon,
      humidity: cur.main.humidity,
      wind: cur.wind.speed,
      sunrise: one.current.sunrise,
      sunset: one.current.sunset,
      dt: cur.dt,
    };
  }, [weatherPack]);

  const tomorrow = useMemo(() => {
    if (!weatherPack) return null;
    const daily = weatherPack.onecall.daily;
    // daily[0] == today, daily[1] == tomorrow (if present)
    const t = daily && daily.length > 1 ? daily[1] : null;
    if (!t) return null;
    return {
      dt: t.dt,
      tempMin: Math.round(t.temp.min),
      tempMax: Math.round(t.temp.max),
      description: t.weather?.[0]?.description,
      icon: t.weather?.[0]?.icon,
      pop: Math.round((t.pop || 0) * 100),
      sunrise: t.sunrise,
      sunset: t.sunset,
    };
  }, [weatherPack]);

  // small, memoized current card for re-use
  const WeatherCard = React.useMemo(
    () =>
      function ({ day }) {
        if (!day) return null;
        return (
          <Card
            bordered={false}
            className="rounded-2xl shadow-lg p-6 bg-white/80 dark:bg-[#071626]/80 backdrop-blur-md"
            aria-label="Weather summary"
          >
            <div className="flex flex-col md:flex-row gap-6 items-center">
              <div className="flex items-center gap-4">
                <img
                  src={OW_ICON_URL(day.icon)}
                  alt={day.description || "weather icon"}
                  className="w-28 h-28"
                />
              </div>

              <div className="flex-1 min-w-0">
                <div className="text-3xl md:text-4xl font-bold flex items-center gap-3">
                  <Thermometer /> <span>{day.temp}°C</span>
                  <span className="text-sm font-medium text-gray-500 ml-2">
                    Feels like {day.feelsLike}°C
                  </span>
                </div>

                <div className="mt-3 grid grid-cols-2 gap-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Sun size={16} /> <span className="capitalize">{day.description}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Wind size={16} /> <span>{day.wind} m/s</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Droplets size={16} /> <span>{day.humidity}% humidity</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={16} /> <span>{formatLocal(day.dt, { hour: "numeric", minute: "numeric" })}</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        );
      },
    []
  );

  // Tomorrow card
  const TomorrowCard = ({ t }) => {
    if (!t) return null;
    return (
      <Card
        bordered={false}
        className="rounded-2xl shadow-md p-4 bg-white/70 dark:bg-[#021826]/70 backdrop-blur-md"
        aria-label="Tomorrow forecast"
      >
        <div className="flex gap-3 items-center">
          <img src={OW_ICON_URL(t.icon)} alt={t.description} className="w-20 h-20" />
          <div>
            <div className="text-lg font-semibold">{dayName(t.dt)} — Tomorrow</div>
            <div className="mt-1 text-sm text-gray-600">
              <div className="flex gap-3 items-center">
                <div className="flex items-center gap-2">
                  <Thermometer size={14} /> <span>{t.tempMax}° / {t.tempMin}°</span>
                </div>
                <div className="flex items-center gap-2">
                  <CloudRain size={14} /> <span>{t.pop}% chance of rain</span>
                </div>
              </div>
              <div className="mt-2 capitalize text-gray-700">{t.description}</div>
            </div>
          </div>
        </div>
      </Card>
    );
  };

  return (
    <main className="p-6 max-w-5xl mx-auto">
      {/* HERO / HEADER */}
      <section
        className="rounded-3xl p-6 mb-6"
        style={{
          background:
            "linear-gradient(135deg, rgba(6,40,69,0.9) 0%, rgba(16,72,103,0.85) 50%, rgba(3,30,43,0.95) 100%)",
          color: "white",
        }}
        aria-label="Weather header"
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-extrabold flex items-center gap-3">
              <Cloud size={40} /> Weather — Today & Tomorrow
            </h1>
            <p className="mt-2 text-gray-200 max-w-xl">
              Fast, accurate weather with a clean UI. Use search or detect your location. Data is cached for the day.
            </p>

            <div className="mt-4 flex gap-2 items-center">
              <Input
                placeholder="Search city (e.g. Johannesburg)"
                value={cityInput}
                onChange={(e) => setCityInput(e.target.value)}
                aria-label="Search city"
                style={{ width: 320 }}
              />
              <Button type="primary" onClick={fetchWeatherByCity} icon={<ArrowRight />}>
                Search
              </Button>
              <Button onClick={getCurrentLocation} icon={<MapPin />}>
                Use my location
              </Button>
            </div>
          </div>

          <div className="text-right">
            <div className="text-sm text-gray-300">Local time</div>
            <div className="mt-1 text-xl font-medium">{new Date().toLocaleString()}</div>
            <div className="mt-3 text-xs text-gray-300">Auto-refresh on reload; daily cache used.</div>
          </div>
        </div>
      </section>

      {/* MAIN GRID */}
      <section aria-live="polite">
        {loading ? (
          <div className="flex justify-center py-16">
            <Spin tip="Loading weather..." size="large" />
          </div>
        ) : !weatherPack ? (
          <div className="text-center py-16">
            <p className="text-gray-500">No weather yet — search a city or allow location.</p>
            <div className="mt-4">
              <Button onClick={getCurrentLocation} icon={<MapPin />}>
                Detect location
              </Button>
            </div>
          </div>
        ) : (
          <Row gutter={[20, 20]}>
            <Col xs={24} lg={16}>
              {/* Today's main card */}
              <div className="mb-4">
                <WeatherCard day={today} />
              </div>

              {/* Details panel */}
              <Card
                bordered={false}
                className="rounded-2xl shadow-sm p-4 bg-white/70 dark:bg-[#071626]/70 backdrop-blur-md"
              >
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-500">Sunrise</span>
                    <span className="font-medium">{formatLocal(today?.sunrise, { hour: "2-digit", minute: "2-digit" })}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-500">Sunset</span>
                    <span className="font-medium">{formatLocal(today?.sunset, { hour: "2-digit", minute: "2-digit" })}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-500">Pressure</span>
                    <span className="font-medium">{weatherPack?.current?.main?.pressure} hPa</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-500">Visibility</span>
                    <span className="font-medium">{(weatherPack?.current?.visibility || 0) / 1000} km</span>
                  </div>
                </div>
              </Card>
            </Col>

            <Col xs={24} lg={8}>
              {/* Tomorrow */}
              <div className="mb-4">
                <TomorrowCard t={tomorrow} />
              </div>

              {/* Quick facts */}
              <Card bordered={false} className="rounded-2xl shadow-sm p-4">
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Thermometer size={16} /> <strong>Temperature</strong>
                    </div>
                    <div>{weatherPack?.current?.main?.temp}°C</div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Droplets size={16} /> <strong>Humidity</strong>
                    </div>
                    <div>{weatherPack?.current?.main?.humidity}%</div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Wind size={16} /> <strong>Wind</strong>
                    </div>
                    <div>{weatherPack?.current?.wind?.speed} m/s</div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CalendarDays size={16} /> <strong>Updated</strong>
                    </div>
                    <div>{formatLocal(weatherPack?.fetchedAt / 1000)}</div>
                  </div>
                </div>
              </Card>

              {/* History */}
              <Card bordered={false} className="rounded-2xl shadow-sm p-4 mt-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <History size={16} /> <strong>History</strong>
                  </div>
                  <Button
                    size="small"
                    onClick={() => {
                      setHistory([]);
                      localStorage.removeItem("weather_history");
                    }}
                  >
                    Clear
                  </Button>
                </div>

                <div className="flex flex-col gap-2 max-h-60 overflow-auto">
                  {history.length === 0 && <div className="text-sm text-gray-500">No records</div>}
                  {history.map((h, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-2 rounded hover:bg-gray-50 cursor-pointer"
                      onClick={() => {
                        // clicking history re-sets view
                        setWeatherPack(h.pack);
                      }}
                    >
                      <div className="text-sm">
                        <div className="font-medium">{h.label}</div>
                        <div className="text-xs text-gray-500">{new Date(h.at).toLocaleString()}</div>
                      </div>
                      <div className="font-medium">{h.pack?.current?.main?.temp}°C</div>
                    </div>
                  ))}
                </div>
              </Card>
            </Col>
          </Row>
        )}
      </section>
    </main>
  );
}
