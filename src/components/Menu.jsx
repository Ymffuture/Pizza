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
  { 
    id: 1, 
    name: "E-Commerce Website", 
    tag: "Popular", 
    price: "R1499",
    description: "A complete online store with product pages, cart, checkout, payments, order tracking, and a mobile-friendly design. Ideal for selling products or services 24/7."
  },

  { 
    id: 2, 
    name: "HTML & CSS Website", 
    tag: "⭐", 
    price: "R499",
    description: "A fast, simple, lightweight website built using HTML & CSS. Perfect for portfolios, simple business pages, or landing pages that do not require advanced features."
  },

  { 
    id: 3, 
    name: "React.js App", 
    tag: "50% Off", 
    price: "R799",
    description: "A modern, dynamic, and highly interactive web app built using React.js. Great for dashboards, SaaS platforms, modern front-end systems, and real-time interfaces."
  },

  { 
    id: 4, 
    name: "Next.js", 
    tag: "⭐", 
    price: "R899",
    description: "A high-performance website/app with SEO optimization, server-side rendering, API routes, and fast loading speeds using Next.js. Perfect for business websites and apps."
  },

  { 
    id: 5, 
    name: "Portfolio", 
    tag: "50% Off", 
    price: "R399",
    description: "A clean, modern personal portfolio to showcase your skills, work, projects, and experience. Ideal for freelancers, creators, designers, and developers."
  },

  { 
    id: 6, 
    name: "Business Website", 
    tag: "New", 
    price: "R1299",
    // description: "A professional corporate website for companies, agencies, and startups. Includes services, contact pages, branding, SEO, and responsive design."
  },

  { 
    id: 7, 
    name: "Landing Page Design", 
    tag: "70% Off", 
    price: "R299",
    description: "A high-converting landing page designed for ads, promotions, or lead-generation campaigns. Optimized for sales, speed, UX, and mobile performance."
  },

  { 
    id: 8, 
    name: "Custom Web Application", 
    tag: "New", 
    price: "R999",
    description: "A fully tailored web application built to your requirements. Ideal for management systems, booking apps, dashboards, automation tools, and advanced platforms."
  },
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

    const checkAndFetch = () => {
      const lastFetch = localStorage.getItem("lastFetchTime");
      const cachedImages = localStorage.getItem("cachedImages");
      const nDays = 7 * 24 * 60 * 60 * 1000;

      if (lastFetch && cachedImages) {
        const elapsed = Date.now() - parseInt(lastFetch);
        if (elapsed < nDays) {
          setImages(JSON.parse(cachedImages));
          return;
        }
      }

      fetchImages();
    };

    checkAndFetch();
  }, []);

  return (
    <section className="transition-colors duration-300 text-black dark:text-black bg-white">
      <div className="text-center mb-10">
        <p className="text-gray-500 dark:text-gray-700 uppercase tracking-wide text-sm">
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
        className="w-[100%] md:w-[80%] lg:w-[60%] mx-auto"
        cubeEffect={{
          shadow: true,
          slideShadows: true,
          shadowOffset: 28,
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
      {/* ============================
      <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 px-4 md:px-20">
        {services.slice(0, 6).map((service, index) => (
          <MenuCard
            key={service.id}
            {...service}
            image={images[index] ?? "https://via.placeholder.com/600x400"}
          />
        ))}
      </div>*/} 
    </section>
  );
};

export default Menu;
