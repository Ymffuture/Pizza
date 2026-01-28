import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Lock, Mail } from "lucide-react";

const ADMIN_EMAIL = "futurekgomotso@gmail.com";
const ADMIN_PASSWORD = "2354";

export default function AdminGate() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [authenticated, setAuthenticated] = useState(false);

  const handleLogin = e => {
    e.preventDefault();
    setError("");

    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      setAuthenticated(true);
    } else {
      setError("Invalid admin credentials");
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black to-gray-900 px-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-2xl"
      >
        {!authenticated ? (
          <>
            <h1 className="text-3xl font-extrabold text-white text-center mb-6">
              Admin Access
            </h1>

            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="text-sm text-gray-300">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full h-12 pl-10 pr-4 rounded-xl bg-black/40 text-white border border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Admin email"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm text-gray-300">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
                  <input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full h-12 pl-10 pr-4 rounded-xl bg-black/40 text-white border border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Admin password"
                  />
                </div>
              </div>

              {error && (
                <p className="text-sm text-red-500 bg-red-500/10 p-2 rounded">
                  {error}
                </p>
              )}

              <button
                type="submit"
                className="w-full h-12 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold transition"
              >
                Login
              </button>
            </form>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-bold text-white text-center mb-6">
              Admin Dashboard
            </h2>

            <div className="space-y-4">
              <button
                onClick={() => navigate("/admin")}
                className="w-full h-12 rounded-xl bg-green-600 hover:bg-green-700 text-white font-semibold"
              >
                Go to Admin
              </button>

              <button
                onClick={() => navigate("/admin-ticket")}
                className="w-full h-12 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold"
              >
                Go to Admin Tickets
              </button>

              <button
                onClick={() => navigate("/admin/applications")}
                className="w-full h-12 rounded-xl bg-yellow-600 hover:bg-yellow-700 text-white font-semibold"
              >
                Go to Admin applications
              </button>
            </div>
          </>
        )}
      </motion.div>
    </main>
  );
}
