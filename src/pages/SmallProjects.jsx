// src/pages/SmallProjects.jsx
import { Laptop, CheckCircle, ArrowRight, Film, Loader2 } from "lucide-react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

const MOVIE_API =
  "https://imdb.iamidiotareyoutoo.com/search?tt=tt2250912";

const SmallProjects = () => {
  const [movies, setMovies] = useState([]);
  const [visibleCount, setVisibleCount] = useState(10);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchMovies = async () => {
    try {
      setLoading(true);
      const res = await fetch(MOVIE_API);

      if (!res.ok) throw new Error("Failed to fetch movies");

      const data = await res.json();

      if (!data?.short) throw new Error("Invalid movie format");

      // API only returns ONE movie, so we fake multiple for UI
      const fakeMovies = Array(20).fill(data.short);

      setMovies(fakeMovies);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  const loadMore = () => {
    setVisibleCount((prev) => prev + 5);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <Helmet>
        <title>Small Projects | Quorvex Institute</title>
        <meta
          name="description"
          content="Affordable and fast digital small project services."
        />
      </Helmet>

      <div className="max-w-5xl mx-auto bg-white p-8 rounded-3xl shadow-xl">
        <h1 className="text-4xl font-bold flex items-center gap-3 mb-6">
          <Laptop className="text-indigo-600" /> Small Projects
        </h1>

        <p className="text-gray-700 mb-6">
          Small projects are affordable and fast-delivery digital services for
          individuals and startups.
        </p>

        <h2 className="text-2xl font-semibold mb-3">What We Offer</h2>

        <ul className="space-y-3 mb-10">
          <li className="flex items-center gap-3">
            <CheckCircle className="text-green-500" /> Landing pages & portfolio
            websites
          </li>
          <li className="flex items-center gap-3">
            <CheckCircle className="text-green-500" /> Simple dashboards
          </li>
          <li className="flex items-center gap-3">
            <CheckCircle className="text-green-500" /> Authentication setup
            (Login / Signup)
          </li>
          <li className="flex items-center gap-3">
            <CheckCircle className="text-green-500" /> Responsive UI components
          </li>
        </ul>

        <Link
          to="/contact"
          className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-xl mb-12 hover:bg-indigo-700"
        >
          Start a Small Project <ArrowRight />
        </Link>

        {/*  MOVIE SECTION */}
        <h2 className="text-3xl font-bold flex items-center gap-2 mb-4">
          <Film className="text-red-600" /> Movies
        </h2>

        {loading && (
          <div className="flex justify-center py-8">
            <Loader2 className="animate-spin text-indigo-600" size={32} />
          </div>
        )}

        {error && <p className="text-red-600 mb-4">{error}</p>}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {movies.slice(0, visibleCount).map((m, i) => (
            <div
              key={i}
              className="border rounded-2xl shadow p-4 bg-gray-50 hover:shadow-lg transition"
            >
              <img
                src={m.image}
                alt={m.name}
                className="w-full h-60 object-cover rounded-xl"
              />

              <h3 className="text-xl font-semibold mt-3">{m.name}</h3>

              <p className="text-gray-600 mt-1 text-sm">{m.description}</p>

              <p className="text-sm text-gray-500 mt-2">
                ⭐ {m.aggregateRating?.ratingValue} / 10
              </p>
            </div>
          ))}
        </div>

        {/* Load More */}
        {visibleCount < movies.length && (
          <button
            onClick={loadMore}
            className="mt-6 w-full bg-indigo-600 text-white py-3 rounded-xl hover:bg-indigo-700"
          >
            Load 5 More
          </button>
        )}
      </div>
    </div>
  );
};

export default SmallProjects;
