// src/pages/SmallProjects.jsx
import React, { useState } from "react";
import axios from "axios";
import { Laptop, CheckCircle, ArrowRight } from "lucide-react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";

const MOVIE_API = "https://imdb.iamidiotareyoutoo.com/search?tt=tt2250912";

const MovieCard = ({ movie }) => {
  // defensive property access in case API shape varies
  const title = movie.title || movie.name || movie.primaryTitle || movie.t || "Untitled";
  const year = movie.year || movie.releaseYear || movie.y || null;
  const image = movie.image || movie.poster || movie.cover || "";
  const id = movie.id || movie.imdbID || movie.movieId || movie.tconst || null;

  const imdbUrl =
    id && id.toString().startsWith("tt")
      ? `https://www.imdb.com/title/${id}`
      : movie.url || null;

  return (
    <div className="flex gap-4 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
      <div className="w-24 h-36 flex-shrink-0 overflow-hidden rounded-md bg-gray-100 dark:bg-gray-900">
        {image ? (
          <img src={image} alt={title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-sm text-gray-500">
            No Image
          </div>
        )}
      </div>

      <div className="flex-1">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          {title} {year ? <span className="text-sm font-normal text-gray-500">({year})</span> : null}
        </h3>
        {movie.rating && (
          <p className="text-sm text-yellow-500 mt-1">★ {movie.rating}</p>
        )}
        {movie.plot && (
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 line-clamp-3">
            {movie.plot}
          </p>
        )}
        <div className="mt-3 flex items-center gap-3">
          {imdbUrl ? (
            <a
              href={imdbUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-600 hover:underline"
            >
              View on IMDb
            </a>
          ) : (
            <span className="text-sm text-gray-500">No external link</span>
          )}
        </div>
      </div>
    </div>
  );
};

const SmallProjects = () => {
  const [movies, setMovies] = useState(null);
  const [visibleCount, setVisibleCount] = useState(0);
  const [loadingMovies, setLoadingMovies] = useState(false);
  const [movieError, setMovieError] = useState(null);

  // Called when user clicks "Show Movies"
  const fetchMovies = async () => {
    // If already loaded, just return (prevents re-fetch)
    if (movies) return setVisibleCount((c) => Math.max(c, 10));

    setLoadingMovies(true);
    setMovieError(null);

    try {
      const res = await axios.get(MOVIE_API, { timeout: 10000 });
      // API shape unknown: try to find a sensible array in response
      let payload = res.data;

      // If payload is nested: common patterns
      if (!Array.isArray(payload)) {
        if (Array.isArray(payload.results)) payload = payload.results;
        else if (Array.isArray(payload.data)) payload = payload.data;
        else if (payload && typeof payload === "object") {
          // try to extract any array value
          const arr = Object.values(payload).find((v) => Array.isArray(v));
          if (arr) payload = arr;
        }
      }

      if (!Array.isArray(payload)) {
        throw new Error("Unexpected API response format (not an array).");
      }

      // Save movies and set initial visible count to 10 (or length if less)
      setMovies(payload);
      setVisibleCount(Math.min(10, payload.length));
    } catch (err) {
      console.error("Movie fetch error:", err);
      setMovieError("Failed to load movies. Try again later.");
    } finally {
      setLoadingMovies(false);
    }
  };

  const loadMoreFive = () => {
    if (!movies) return;
    setVisibleCount((prev) => Math.min(movies.length, prev + 5));
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <Helmet>
        <title>Small Projects | Quorvex Institute</title>
        <meta name="description" content="Affordable and fast digital small project services." />
      </Helmet>

      <div className="max-w-5xl mx-auto bg-white p-8 rounded-3xl shadow-xl space-y-6">
        <div>
          <h1 className="text-4xl font-bold flex items-center gap-3 mb-6">
            <Laptop className="text-indigo-600" /> Small Projects
          </h1>

          <p className="text-gray-700 mb-6">
            Small projects are affordable and fast-delivery digital services suitable for startups or
            individuals needing quick solutions.
          </p>

          <h2 className="text-2xl font-semibold mb-3">What We Offer</h2>

          <ul className="space-y-3">
            <li className="flex items-center gap-3">
              <CheckCircle className="text-green-500" /> Landing pages & portfolio websites
            </li>
            <li className="flex items-center gap-3">
              <CheckCircle className="text-green-500" /> Simple dashboards
            </li>
            <li className="flex items-center gap-3">
              <CheckCircle className="text-green-500" /> Authentication setup (Login / Signup)
            </li>
            <li className="flex items-center gap-3">
              <CheckCircle className="text-green-500" /> Responsive UI components
            </li>
          </ul>

          <Link
            to="/contact"
            className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-xl mt-8 hover:bg-indigo-700"
          >
            Start a Small Project <ArrowRight />
          </Link>
        </div>

        {/* --- Movie Explorer Section --- */}
        <section className="pt-6 border-t border-gray-200 dark:border-gray-800">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold">Movie Explorer (IMDB)</h2>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={fetchMovies}
                className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                aria-label="Show Movies"
              >
                {movies ? "Show/Refresh Movies" : "Show Movies"}
              </button>

              {movies && visibleCount < movies.length && (
                <button
                  type="button"
                  onClick={loadMoreFive}
                  className="inline-flex items-center gap-2 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100 px-3 py-2 rounded-lg hover:opacity-90 transition"
                >
                  Load 5 more
                </button>
              )}
            </div>
          </div>

          {/* Loading / error */}
          {loadingMovies && (
            <div className="py-8 text-center text-gray-600">
              Loading movies...
            </div>
          )}

          {movieError && (
            <div className="py-6 px-4 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg">
              {movieError}
            </div>
          )}

          {/* Movies list */}
          {movies && movies.length > 0 && (
            <>
              <div className="grid grid-cols-1 gap-4">
                {movies.slice(0, visibleCount).map((mv, idx) => (
                  <MovieCard movie={mv} key={mv.id ?? mv.imdbID ?? mv.tconst ?? idx} />
                ))}
              </div>

              <div className="pt-4">
                <p className="text-sm text-gray-500">
                  Showing {Math.min(visibleCount, movies.length)} of {movies.length} results
                </p>
              </div>
            </>
          )}

          {movies && movies.length === 0 && (
            <div className="py-6 text-center text-gray-500">No movies found.</div>
          )}
        </section>
      </div>
    </div>
  );
};

export default SmallProjects;
