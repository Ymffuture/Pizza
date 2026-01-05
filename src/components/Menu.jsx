import React, { useEffect, useState } from "react";
import axios from "axios";
import MenuCard from "../layouts/MenuCard";

import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCube, Pagination, Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/effect-cube";
import "swiper/css/pagination";
import "swiper/css/navigation";

const keywords = [
  "ecommerce website",
  "html css website",
  "reactjs",
  "nextjs",
  "portfolio website",
  "business website",
  "landing page design",
  "web application react js",
];

const services = [
  { id: 1, name: "E-Commerce Website", tag: "Popular", price: "R1499", description: "A complete online store with payments, checkout, and order tracking." },
  { id: 2, name: "HTML & CSS Website", tag: "⭐", price: "R499", description: "Lightweight static websites for portfolios and small businesses." },
  { id: 3, name: "React.js App", tag: "50% Off", price: "R799", description: "Modern interactive dashboards and apps built with React." },
  { id: 4, name: "Next.js", tag: "⭐", price: "R899", description: "SEO-optimized websites using server-side rendering." },
  { id: 5, name: "Portfolio", tag: "50% Off", price: "R399", description: "Personal portfolios for creators and developers." },
  { id: 6, name: "Business Website", tag: "New", price: "R1299" },
  { id: 7, name: "Landing Page Design", tag: "70% Off", price: "R299", description: "High-converting landing pages for marketing." },
  { id: 8, name: "Custom Web Application", tag: "New", price: "R999", description: "Fully custom web systems and dashboards." },
];

const Menu = () => {
  const [images, setImages] = useState(Array(16).fill(null));

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const requests = keywords.map((kw) =>
          axios.get(
            `https://api.unsplash.com/photos/random?query=${encodeURIComponent(
              kw
            )}&client_id=vKvUZ1Wv3ez0cdcjK-d9KMB8_wPVRLNQaC2P8FVssaw`
          )
        );

        const responses = await Promise.all(requests);
        const imgList = responses.map((res) => res.data.urls.regular);

        localStorage.setItem("cachedImages", JSON.stringify(imgList));
        localStorage.setItem("lastFetchTime", Date.now().toString());

        setImages(imgList);
      } catch (error) {
        console.error("Unsplash Error:", error);
      }
    };

    const lastFetch = localStorage.getItem("lastFetchTime");
    const cachedImages = localStorage.getItem("cachedImages");
    const sevenDays = 7 * 24 * 60 * 60 * 1000;

    if (lastFetch && cachedImages && Date.now() - lastFetch < sevenDays) {
      setImages(JSON.parse(cachedImages));
    } else {
      fetchImages();
    }
  }, []);

  return (
    <section className="relative section-glow py-20 transition-colors duration-300">
      {/* Header */}
      <div className="text-center mb-14 space-y-3">
        <p className="uppercase tracking-widest text-sm text-cyan-500 font-semibold">
          Our Services
        </p>

        <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white">
          Websites We Build
        </h2>

        <p className="max-w-xl mx-auto text-gray-500 dark:text-gray-400">
          High-quality, modern websites and web applications designed to scale with your business.
        </p>
      </div>

      {/* Swiper */}
      <Swiper
        effect="cube"
        grabCursor
        loop
        centeredSlides
        navigation
        pagination={{ clickable: true }}
        modules={[EffectCube, Pagination, Navigation]}
        className="w-full md:w-[85%] lg:w-[65%] mx-auto"
        cubeEffect={{
          shadow: true,
          slideShadows: true,
          shadowOffset: 40,
          shadowScale: 0.9,
        }}
      >
        {services.map((service, index) => (
          <SwiperSlide key={service.id} className="flex justify-center">
            <MenuCard
              {...service}
              image={images[index] ?? "https://via.placeholder.com/600x400"}
              loading={!images[index]}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default Menu;
