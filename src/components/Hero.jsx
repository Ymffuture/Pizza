import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaCode, FaPalette } from "react-icons/fa";
import { MdDevices } from "react-icons/md";
import { BsPatchCheckFill } from "react-icons/bs";

const Hero = () => {
  const [heroImg, setHeroImg] = useState("");

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const url =
          "https://api.unsplash.com/photos/random?query=web+design&client_id=vKvUZ1Wv3ez0cdcjK-d9KMB8_wPVRLNQaC2P8FVssaw";

        const response = await fetch(url);
        const data = await response.json();
        setHeroImg(data.urls.regular);
      } catch (error) {
        console.log("Image fetch failed:", error);
      }
    };

    fetchImage();
  }, []);

  return (
    <section className="bg-white dark:bg-black text-black dark:text-white
    min-h-[90vh] flex flex-col-reverse lg:flex-row items-center justify-center
    px-4 md:px-10 lg:px-16 gap-14 pt-24 transition-colors duration-300">

      {/* LEFT SIDE */}
      <motion.div
        className="lg:w-1/2 w-full text-center lg:text-left"
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

        <div className="mt-8 flex flex-col sm:flex-row items-center gap-6 max-w-xl mx-auto lg:mx-0">
          <motion.button
            whileHover={{ scale: 1.05 }}
            className="bg-blue-600 hover:bg-blue-700 transition text-white font-semibold rounded-full px-7 py-3 shadow-lg shadow-blue-500/20 w-full sm:w-auto"
          >
            Get A Website
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            className="border border-blue-600 hover:bg-blue-600 hover:text-white transition text-blue-600 font-semibold rounded-full px-7 py-3 w-full sm:w-auto"
          >
           <a href="https://futurecv.vercel.app" >View Portfolio</a>
          </motion.button>
        </div>
      </motion.div>

      {/* RIGHT SIDE */}
      <motion.div
        className="lg:w-1/2 w-full flex justify-center relative"
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.9 }}
      >
        {/* Gradient Glow */}
        <div className="absolute w-[350px] h-[350px] md:w-[450px] md:h-[450px] rounded-full 
        bg-blue-500/20 blur-3xl top-10 md:top-5"></div>

        {/* Floating Image */}
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
    </section>
  );
};

export default Hero;
