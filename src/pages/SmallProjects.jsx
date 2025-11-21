// src/pages/SmallProjects.jsx
import React, { useState } from "react";
import axios from "axios";
import { Laptop, CheckCircle, ArrowRight } from "lucide-react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";

const SEARCH_API = "https://imdb.iamidiotareyoutoo.com/search?q=movie";

const FALLBACK_POSTER =
  "https://upload.wikimedia.org/wikipedia/commons/f/fc/No_picture_available.png";

const MovieCard = ({ movie }) => {
  const title = movie.title || movie.name || "Untitled";
  const year = movie.year || movie.startYear || "";
  const image = movie.image || movie.poster || FALLBACK_POSTER;
  const id = movie.id || movie.imdbId || movie.tconst;

  const imdbUrl = id ? `https://www.imdb.com/title/${id}` : null;

  return (
    <div className="flex gap-4 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
      <div className="w-24 h-36 overflow-hidden rounded-md bg-gray-100 dark:bg-gray-900">
        <img src={image} alt={title} className="w-full h-full object-cover" />
      </div>

      <div className="flex-1">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          {title}{" "}
          {year && <span className="text-sm text-gray-500">({year})</span>}
        </h3>

        {movie.plot && (
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 line-clamp-3">
            {movie.plot}
          </p>
        )}

        <div className="mt-3">
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
            <p className="text-sm text-gray-500">No link available</p>
          )}
        </div>
      </div>
    </div>
  );
};

const SmallProjects = () => {
  const [movies, setMovies] = useState([]);
  const [visibleCount, setVisibleCount] = useState(10);
  const [loadingMovies, setLoadingMovies] = useState(false);
  const [movieError, setMovieError] = useState(null);

  const fetchMovies = async () => {
    setLoadingMovies(true);
    setMovieError(null);

    try {
      const res = await axios.get(SEARCH_API);
      let payload = res.data;

      if (Array.isArray(payload.results)) {
        payload = payload.results;
      }

      if (!Array.isArray(payload)) {
        throw new Error("Invalid API format");
      }

      setMovies(payload);
      setVisibleCount(10);
    } catch (err) {
      setMovieError("Could not load movies. Try again later.");
    } finally {
      setLoadingMovies(false);
    }
  };

  const loadMore = () => {
    setVisibleCount((prev) => prev + 5);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <Helmet>
        <title>Small Projects | Quorvex Institute</title>
      </Helmet>

      <div className="max-w-5xl mx-auto bg-white p-8 rounded-3xl shadow-xl space-y-6">
        {/* Normal Page Content */}
        <div>
          <h1 className="text-4xl font-bold flex items-center gap-3 mb-6">
            <Laptop className="text-indigo-600" /> Small Projects
          </h1>

          <p className="text-gray-700 mb-6">
            Small projects are affordable and fast-delivery digital services.
          </p>

          <h2 className="text-2xl font-semibold mb-3">What We Offer</h2>

          <ul className="space-y-3">
            <li className="flex items-center gap-3">
              <CheckCircle className="text-green-500" /> Landing pages & portfolio websites
            </li>
            <li className="flex items-center gap-3">
              <CheckCircle className="text-green-500" /> Dashboards
            </li>
            <li className="flex items-center gap-3">
              <CheckCircle className="text-green-500" /> Authentication setup
            </li>
            <li className="flex items-center gap-3">
              <CheckCircle className="text-green-500" /> Responsive components
            </li>
          </ul>

          <Link
            to="/contact"
            className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-xl mt-8 hover:bg-indigo-700"
          >
            Start a Small Project <ArrowRight />
          </Link>
        </div>

        {/* MOVIE SECTION */}
        <section className="pt-6 border-t border-gray-200 dark:border-gray-800">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold">Movie Explorer (IMDB)</h2>

            <button
              onClick={fetchMovies}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              {movies.length ? "Refresh Movies" : "Load Movies"}
            </button>
          </div>

          {loadingMovies && (
            <div className="py-6 text-center text-gray-600">Loading movies…</div>
          )}

          {movieError && (
            <div className="py-4 px-4 bg-red-100 text-red-700 rounded-lg">{movieError}</div>
          )}

          {movies.length > 0 && (
            <>
              <div className="grid grid-cols-1 gap-4">
                {movies.slice(0, visibleCount).map((mv, index) => (
                  <MovieCard movie={mv} key={mv.id || index} />
                ))}
              </div>

              {visibleCount < movies.length && (
                <button
                  onClick={loadMore}
                  className="mt-4 w-full bg-gray-100 py-3 rounded-lg hover:bg-gray-200"
                >
                  Load 5 more
                </button>
              )}

              <p className="text-sm text-gray-500 pt-2">
                Showing {visibleCount} of {movies.length}
              </p>
            </>
          )}
        </section>
      </div>
    </div>
  );
};

export default SmallProjects;
