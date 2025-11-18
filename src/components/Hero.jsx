import React, { useEffect, useState } from "react";
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
    <section className="bg-white dark:bg-black text-black dark:text-white min-h-screen flex flex-col-reverse lg:flex-row items-center justify-center md:justify-between px-3 lg:px-14 gap-4 pt-2 md:pt-0 transition-colors duration-300">

      {/* LEFT CONTENT */}
      <div className="lg:w-1/2 w-full text-center lg:text-left">
        <div className="inline-flex items-center mb-4 text-blue-500 font-medium justify-center lg:justify-start">
          <BsPatchCheckFill className="mr-2" /> Professional Web Services
        </div>

        <h1 className="text-4xl md:text-5xl font-bold leading-tight">
          Modern{" "}
          <span className="text-blue-600">Website Design</span>
          <br />
          & <span className="text-blue-600">Web Development</span>
        </h1>

        <p className="mt-4 text-gray-600 dark:text-gray-300 max-w-xl mx-auto lg:mx-0">
          Build fast, responsive, beautiful websites for your business. From
          HTML, CSS, React.js, to Next.js — we design and develop everything you
          need to stand out online.
        </p>

        {/* CTA BUTTONS */}
        <div className="mt-6 flex flex-col sm:flex-row items-center gap-6 max-w-xl mx-auto lg:mx-0">
          <button className="bg-blue-600 hover:bg-blue-700 transition text-white font-semibold rounded-full px-6 py-3 w-full sm:w-auto">
            Get A Website
          </button>

          <button className="border border-blue-600 hover:bg-blue-600 hover:text-white transition text-blue-600 font-semibold rounded-full px-6 py-3 w-full sm:w-auto">
            View Portfolio
          </button>
        </div>
      </div>

      {/* RIGHT CONTENT */}
      <div className="lg:w-1/2 w-full relative flex justify-center m-4 lg:m-5">
        <div className="relative">
          <img
            src={heroImg}
            alt="Web Design"
            className="rounded-3xl w-[400px] h-[400px] sm:w-[350px] sm:h-[350px] md:w-[430px] md:h-[430px] object-cover shadow-xl"
          />
        </div>

        {/* BADGES */}
        <div className="absolute top-5 right-2 md:right-10 bg-white text-black text-sm px-3 py-1 rounded-full flex items-center shadow-lg">
          <FaCode className="text-blue-600 mr-2" /> Clean Code
        </div>

        <div className="absolute bottom-10 left-0 md:left-12 bg-white text-black text-sm px-3 py-1 rounded-full flex items-center shadow-lg">
          <FaPalette className="text-purple-600 mr-2" /> UI/UX Design
        </div>

        <div className="absolute bottom-6 right-0 md:right-10 bg-white text-black text-sm px-3 py-1 rounded-full flex items-center shadow-lg">
          <MdDevices className="text-green-600 mr-2" /> Fully Responsive
        </div>
      </div>
    </section>
  );
};

export default Hero;
