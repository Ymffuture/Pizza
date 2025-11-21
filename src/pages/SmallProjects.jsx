// src/pages/SmallProjects.jsx
import { Laptop, CheckCircle, ArrowRight, Film, Loader2 } from "lucide-react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { useState } from "react";

const SmallProjects = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchMovies = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await fetch(
        "https://imdb.iamidiotareyoutoo.com/search?tt=tt2250912"
      );
      const data = await res.json();

      // Limit to 5 results
      setMovies(data?.description?.slice(0, 5) || []);
    } catch (err) {
      setError("Failed to load movies. Please try again.");
    } finally {
      setLoading(false);
    }
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
          Small projects are affordable and fast-delivery digital services
          suitable for startups or individuals needing quick solutions.
        </p>

        <h2 className="text-2xl font-semibold mb-3">What We Offer</h2>

        <ul className="space-y-3">
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

        {/* Contact Button */}
        <Link
          to="/contact"
          className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-xl mt-8 hover:bg-indigo-700"
        >
          Start a Small Project <ArrowRight />
        </Link>

        {/* NEW MOVIE SECTION */}
        <div className="mt-12 border-t pt-10">
          <h2 className="text-3xl font-bold flex items-center gap-2 mb-4">
            <Film className="text-indigo-600" /> Recommended Movies
          </h2>

          <button
            onClick={fetchMovies}
            className="bg-black text-white px-5 py-3 rounded-xl hover:bg-gray-800 flex items-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" />
                Loading...
              </>
            ) : (
              "Load Movies"
            )}
          </button>

          {error && <p className="text-red-600 mt-3">{error}</p>}

          {/* Movie List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            {movies.map((movie, index) => (
              <div
                key={index}
                className="p-4 rounded-xl shadow bg-gray-50 flex gap-4"
              >
                <img
                  src={movie.thumbnail}
                  alt={movie.title}
                  className="w-24 h-32 object-cover rounded"
                />

                <div>
                  <h3 className="font-bold text-lg">{movie.title}</h3>
                  <p className="text-sm text-gray-600">Year: {movie.year}</p>
                  <p className="text-sm text-gray-500 mt-2 line-clamp-3">
                    {movie.plot}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {movies.length > 0 && (
            <p className="text-gray-500 mt-4">Loaded 5 results</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SmallProjects;
