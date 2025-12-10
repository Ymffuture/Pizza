import React, { useEffect, useState } from "react";
import axios from "axios";
import MenuCard from "../layouts/MenuCard";

// Swiper Imports
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCube, Pagination, Navigation } from "swiper/modules";

// Swiper Styles
import "swiper/css";
import "swiper/css/effect-cube";
import "swiper/css/pagination";
import "swiper/css/navigation";

const keywords = [
  "ecommerce",
  "html css",
  "reactjs",
  "nextjs",
  "portfolio",
  "business",
  "landing page design",
  "web application react js",
];

const services = [
  { id: 1, name: "E-Commerce Website", tag: "Popular", price: "From R1499" },
  { id: 2, name: "HTML & CSS Website", tag: "New", price: "From R499" },
  { id: 3, name: "React Website", tag: "Hot", price: "From R799" },
  { id: 4, name: "Next.js Website", tag: "", price: "From R899" },
  { id: 5, name: "Portfolio Website", tag: "Popular", price: "From R399" },
  { id: 6, name: "Business Website", tag: "New", price: "From R1299" },
  { id: 7, name: "Landing Page Design", tag: "", price: "From R299" },
  { id: 8, name: "Custom Web Application", tag: "Hot", price: "From R999" },
];

const Menu = () => {
  const [images, setImages] = useState(Array(8).fill(null));

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

    const checkAndFetch = () => {
      const lastFetch = localStorage.getItem("lastFetchTime");
      const cachedImages = localStorage.getItem("cachedImages");
      const threeDays = 3 * 24 * 60 * 60 * 1000;

      if (lastFetch && cachedImages) {
        const elapsed = Date.now() - parseInt(lastFetch);
        if (elapsed < threeDays) {
          setImages(JSON.parse(cachedImages));
          return;
        }
      }

      fetchImages();
    };

    checkAndFetch();
  }, []);

  return (
    <section className="py-16 transition-colors duration-300 bg-gray-50 dark:bg-neutral-900 text-gray-900 dark:text-white">
      <div className="text-center mb-10">
        <p className="text-gray-500 dark:text-gray-400 uppercase tracking-wide text-sm">
          Our Services
        </p>
        <h2 className="text-3xl md:text-4xl font-bold">Websites We Build</h2>
      </div>

      {/* ====================== */}
      {/*      SWIPER CUBE       */}
      {/* ====================== */}
      <Swiper
        effect="cube"
        grabCursor={true}
        loop={true}
        navigation={true}
        pagination={{ clickable: true }}
        modules={[EffectCube, Pagination, Navigation]}
        className="w-[90%] md:w-[70%] lg:w-[50%] mx-auto"
        cubeEffect={{
          shadow: true,
          slideShadows: true,
          shadowOffset: 20,
          shadowScale: 0.94,
        }}
      >
        {services.map((service, index) => (
          <SwiperSlide key={service.id}>
            <MenuCard
              {...service}
              image={images[index] ?? "https://via.placeholder.com/600x400"}
            />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* ============================ */}
      {/* Optional: Show 2 slides via grid under Swiper */}
      {/* ============================ */}
      <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 px-4 md:px-20">
        {services.slice(0, 6).map((service, index) => (
          <MenuCard
            key={service.id}
            {...service}
            image={images[index] ?? "https://via.placeholder.com/600x400"}
          />
        ))}
      </div>
    </section>
  );
};

export default Menu;
