import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { 
  FaNodeJs, FaPython, FaGitAlt, FaDatabase, FaCss3Alt, FaLaptopCode, 
  FaAngular, FaVuejs, FaDocker, FaPhp 
} from "react-icons/fa";
import { MdDevices, MdSecurity } from "react-icons/md";
import { SiNextdotjs, SiTailwindcss } from "react-icons/si";
import { BsPatchCheckFill } from "react-icons/bs";
import { Link } from "react-router-dom";

const Hero = () => {
  const [heroImg, setHeroImg] = useState("");

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const QUERIES = [
          "web design",
          "frontend development",
          "javascript programming",
          "reactjs developer",
          "python coding",
          "UI UX design",
        ];
        const randomQuery = QUERIES[Math.floor(Math.random() * QUERIES.length)];
        const url = `https://api.unsplash.com/photos/random?query=${encodeURIComponent(
          randomQuery
        )}&client_id=vKvUZ1Wv3ez0cdcjK-d9KMB8_wPVRLNQaC2P8FVssaw`;

        const response = await fetch(url);
        const data = await response.json();
        if (data?.urls?.regular) {
          setHeroImg(data.urls.regular);
          localStorage.setItem(
            "hero_cache",
            JSON.stringify({ img: data.urls.regular, fetchedAt: Date.now() })
          );
        }
      } catch (error) {
        console.log("Image fetch failed:", error);
      }
    };

    const cache = localStorage.getItem("hero_cache");
    if (cache) {
      const { img, fetchedAt } = JSON.parse(cache);
      if (Date.now() - fetchedAt < 7 * 24 * 60 * 60 * 1000) {
        setHeroImg(img);
        return;
      }
    }
    fetchImage();
  }, []);

  return (
    <section className="bg-white dark:bg-[#0A0A0D] text-black dark:text-white
      min-h-[90vh] flex flex-col-reverse lg:flex-row items-center justify-center
      px-4 md:px-10 lg:px-16 gap-14 pt-24 transition-colors duration-300 relative overflow-hidden">

<FaNodeJs className="absolute text-green-500/20 text-6xl top-10 right-20 animate-bounce-slow" />
<FaPython className="absolute text-blue-400/20 text-6xl bottom-1/4 left-5 animate-spin-slow" />
<FaGitAlt className="absolute text-red-500/20 text-5xl top-1/3 left-1/4 animate-pulse-slow" />
<FaDatabase className="absolute text-indigo-400/20 text-5xl bottom-32 right-1/3 animate-bounce-slow" />
<FaCss3Alt className="absolute text-blue-600/20 text-6xl top-1/4 right-10 animate-spin-slow" />
<FaLaptopCode className="absolute text-purple-400/20 text-5xl bottom-20 left-1/2 animate-pulse-slow" />
<FaAngular className="absolute text-red-400/20 text-5xl top-20 left-3/4 animate-bounce-slow" />
<FaVuejs className="absolute text-green-400/20 text-6xl bottom-10 right-1/4 animate-pulse-slow" />
<FaDocker className="absolute text-blue-500/20 text-5xl top-1/2 left-3/4 animate-spin-slow" />
<FaPhp className="absolute text-indigo-500/20 text-6xl bottom-1/3 right-10 animate-bounce-slow" />

{/* Bonus icons for diversity */}
<MdDevices className="absolute text-green-300/20 text-6xl top-5 left-1/2 animate-pulse-slow" />
<MdSecurity className="absolute text-red-300/20 text-5xl bottom-1/4 right-1/2 animate-spin-slow" />
<SiNextdotjs className="absolute text-black/20 text-6xl top-3/4 left-20 animate-bounce-slow" />
<SiTailwindcss className="absolute text-cyan-400/20 text-5xl bottom-5 left-3/4 animate-pulse-slow" />

      {/* LEFT SIDE */}
      <motion.div
        className="lg:w-1/2 w-full text-center lg:text-left z-10"
        initial={{ opacity: 0, x: -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7 }}
      >
        <div className="inline-flex items-center mb-4 text-blue-500 font-medium justify-center lg:justify-start">
          <BsPatchCheckFill className="mr-2" /> Professional Web Services
        </div>

        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
          Elevate Your{" "}
          <span className="text-blue-600">Online Presence</span>
          <br />
          with Modern <span className="text-blue-600">Web Design</span>
        </h1>

        <p className="mt-4 text-gray-600 dark:text-gray-300 max-w-xl mx-auto lg:mx-0">
          Fast, responsive, visually stunning websites built with cutting-edge
          technologies like React, Next.js, Tailwind, and advanced UI/UX design.
        </p>

        <div className="mt-12 flex flex-col sm:flex-row items-center justify-around gap-8 mb-12 max-w-xl mx-auto lg:mx-0">
          {/* Glowing buttons */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            className="relative bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full px-7 py-3 w-full sm:w-auto overflow-hidden"
          >
            <span className="absolute inset-0 rounded-full animate-glow bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-400 blur-2xl opacity-60"></span>
            <span className="relative z-10">
              <Link to="/start-quiz">Start Your Class</Link>
            </span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            className="relative border border-blue-600 hover:bg-blue-600 hover:text-white transition text-blue-600 font-semibold rounded-full px-7 py-3 w-full sm:w-auto overflow-hidden"
          >
            <span className="absolute inset-0 rounded-full animate-glow bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-400 blur-2xl opacity-50"></span>
            <span className="relative z-10">
              <a href="https://futurecv.vercel.app">View Portfolio</a>
            </span>
          </motion.button>
        </div>
      </motion.div>

      {/* RIGHT SIDE */}
      <motion.div
        className="lg:w-1/2 w-full flex justify-center relative z-10"
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.9 }}
      >
        {/* Gradient Glow */}
        <div className="absolute w-[350px] h-[350px] md:w-[450px] md:h-[450px] rounded-full 
        bg-blue-500/20 blur-3xl top-10 md:top-5"></div>

        {/* Floating Image */}
        {heroImg ? (
          <motion.img
            src={heroImg}
            alt="Web Design"
            className="rounded-3xl w-[90%] max-w-[450px] object-cover shadow-2xl relative z-3"
            animate={{
              y: [0, -10, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-[400px]">
            <svg
              role="img"
              aria-label="Loading image"
              className="w-16 h-16 animate-spin text-blue-500"
              viewBox="0 0 50 50"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                className="opacity-20"
                cx="25"
                cy="25"
                r="20"
                fill="none"
                stroke="currentColor"
                strokeWidth="5"
              />
              <path
                className="opacity-90"
                fill="currentColor"
                d="M25 5a20 20 0 1 1-14.142 34.142"
              />
            </svg>
            <span className="mt-3 text-sm text-gray-500">Loading image…</span>
          </div>
        )}

        {/* BADGES */}
        <motion.div
          className="absolute top-6 right-8 bg-white dark:bg-gray-900 text-black dark:text-white 
          text-sm px-3 py-1 rounded-full flex items-center shadow-lg z-6"
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <FaCode className="text-blue-600 mr-2" /> Clean Code
        </motion.div>

        <motion.div
          className="absolute bottom-16 left-5 bg-white dark:bg-gray-900 text-black dark:text-white 
          text-sm px-3 py-1 rounded-full flex items-center shadow-lg z-7"
          initial={{ opacity: 0, x: -15 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.9 }}
        >
          <FaPalette className="text-purple-600 mr-2" /> UI/UX Design
        </motion.div>

        <motion.div
          className="absolute bottom-5 right-5 bg-white dark:bg-gray-900 text-black dark:text-white 
          text-sm px-3 py-1 rounded-full flex items-center shadow-lg z-9"
          initial={{ opacity: 0, x: 15 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.1 }}
        >
          <MdDevices className="text-green-600 mr-2" /> Responsive
        </motion.div>
      </motion.div>

      {/* Glow animation for buttons (Tailwind plugin or custom CSS) */}
      <style>{`
        @keyframes glow {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .animate-glow {
          animation: glow 3s linear infinite;
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-bounce-slow { animation: bounce-slow 5s ease-in-out infinite; }
        @keyframes spin-slow {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .animate-spin-slow { animation: spin-slow 20s linear infinite; }
        @keyframes pulse-slow {
          0%,100% { opacity:0.3; }
          50% { opacity:0.8; }
        }
        .animate-pulse-slow { animation: pulse-slow 3s ease-in-out infinite; }
      `}</style>
    </section>
  );
};

export default Hero;
