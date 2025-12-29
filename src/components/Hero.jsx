import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { FaCode, FaPalette } from "react-icons/fa";
import { MdDevices } from "react-icons/md";
import { BsPatchCheckFill } from "react-icons/bs";
import { Link } from "react-router-dom";

/* =======================
   Mouse Reactive Particles
======================= */
const Particles = () => {
  const containerRef = useRef(null);
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const container = containerRef.current;
    const particles = [];
    const count = 40;

    const handleMouseMove = (e) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
    };

    window.addEventListener("mousemove", handleMouseMove);

    for (let i = 0; i < count; i++) {
      const el = document.createElement("span");
      el.className =
        "absolute w-1.5 h-1.5 rounded-full bg-blue-500/30";
      container.appendChild(el);

      particles.push({
        el,
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: 0,
        vy: 0,
      });
    }

    let animationId;
    const animate = () => {
      particles.forEach((p) => {
        const dx = mouse.current.x - p.x;
        const dy = mouse.current.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;

        const force = Math.min(120 / dist, 0.8);

        p.vx += (dx / dist) * force * 0.04;
        p.vy += (dy / dist) * force * 0.04;

        p.vx *= 0.92;
        p.vy *= 0.92;

        p.x += p.vx;
        p.y += p.vy;

        p.el.style.transform = `translate(${p.x}px, ${p.y}px)`;
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("mousemove", handleMouseMove);
      particles.forEach((p) => p.el.remove());
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 overflow-hidden pointer-events-none z-0"
    />
  );
};

/* =======================
        HERO
======================= */
const Hero = () => {
  const [heroImg, setHeroImg] = useState("");

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const queries = [
          "web design",
          "frontend development",
          "javascript programming",
          "reactjs developer",
          "python coding",
          "UI UX design",
        ];
        const random = queries[Math.floor(Math.random() * queries.length)];
        const url = `https://api.unsplash.com/photos/random?query=${random}&client_id=vKvUZ1Wv3ez0cdcjK-d9KMB8_wPVRLNQaC2P8FVssaw`;
        const res = await fetch(url);
        const data = await res.json();
        if (data?.urls?.regular) setHeroImg(data.urls.regular);
      } catch {}
    };
    fetchImage();
  }, []);

  return (
    <section className="relative bg-white dark:bg-[#0A0A0D] min-h-[90vh] overflow-hidden">
      {/* Particles */}
      <Particles />

      <div className="relative z-10 flex flex-col-reverse lg:flex-row items-center justify-center gap-14 px-6 lg:px-16 pt-24">

        {/* LEFT */}
        <motion.div
          className="lg:w-1/2 text-center lg:text-left"
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
        >
          <div className="inline-flex items-center mb-4 text-blue-500 font-medium">
            <BsPatchCheckFill className="mr-2" /> Professional Web Services
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
            Elevate Your <span className="text-blue-600">Online Presence</span>
            <br />
            with Modern <span className="text-blue-600">Web Design</span>
          </h1>

          <p className="mt-4 text-gray-600 dark:text-gray-300 max-w-xl">
            Fast, responsive, visually stunning websites built with React,
            Next.js, Tailwind, and modern UI/UX systems.
          </p>

          {/* Buttons */}
          <div className="mt-12 flex flex-col sm:flex-row gap-8">
            {/* Primary */}
            <motion.div whileHover={{ scale: 1.06 }} className="relative group">
              <div className="absolute -inset-[2px] rounded-full bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-600 blur-md opacity-75 animate-pulse" />
              <Link
                to="/start-quiz"
                className="relative bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full px-7 py-3"
              >
                Start Your Class
              </Link>
            </motion.div>

            {/* Secondary */}
            <motion.div whileHover={{ scale: 1.06 }} className="relative group">
              <div className="absolute -inset-[2px] rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 blur-md opacity-40" />
              <a
                href="https://futurecv.vercel.app"
                className="relative border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white rounded-full px-7 py-3 font-semibold transition"
              >
                View Portfolio
              </a>
            </motion.div>
          </div>
        </motion.div>

        {/* RIGHT */}
        <motion.div
          className="lg:w-1/2 relative flex justify-center"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9 }}
        >
          {/* Glow */}
          <div className="absolute w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-blue-500/30 via-cyan-400/20 to-purple-500/20 blur-[120px]" />

          {heroImg && (
            <motion.img
              src={heroImg}
              alt="Hero"
              className="rounded-3xl w-[90%] max-w-[450px] object-cover shadow-2xl z-10"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
            />
          )}

          {/* Floating badges */}
          <div className="absolute top-6 right-8 bg-white dark:bg-gray-900 px-3 py-1 rounded-full flex items-center shadow-lg">
            <FaCode className="text-blue-600 mr-2" /> Clean Code
          </div>
          <div className="absolute bottom-16 left-5 bg-white dark:bg-gray-900 px-3 py-1 rounded-full flex items-center shadow-lg">
            <FaPalette className="text-purple-600 mr-2" /> UI/UX
          </div>
          <div className="absolute bottom-5 right-5 bg-white dark:bg-gray-900 px-3 py-1 rounded-full flex items-center shadow-lg">
            <MdDevices className="text-green-600 mr-2" /> Responsive
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
