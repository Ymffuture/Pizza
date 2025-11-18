import React, { useEffect, useState } from "react";
import axios from "axios";
import MenuCard from "../layouts/MenuCard";

// Search keywords for each service category
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
  { id: 1, name: "E-Commerce Website", tag: "Popular", price: "From R1499" },
  { id: 2, name: "HTML & CSS Website", tag: "New", price: "From R899" },
  { id: 3, name: "React Website", tag: "Hot", price: "From R1999" },
  { id: 4, name: "Next.js Website", tag: "", price: "From R2499" },
  { id: 5, name: "Portfolio Website", tag: "Popular", price: "From R799" },
  { id: 6, name: "Business Website", tag: "New", price: "From R1299" },
  { id: 7, name: "Landing Page Design", tag: "", price: "From R499" },
  { id: 8, name: "Custom Web Application", tag: "Hot", price: "From R2999" },
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

        setImages(imgList);
      } catch (error) {
        console.error("Error fetching Unsplash images:", error);
      }
    };

    fetchImages();
  }, []);

  return (
    <section className="dark:bg-white text-gray dark:text-black py-16 px-5 lg:px-14 transition-colors duration-200 rounded">
      <div className="text-center mb-12">
        <p className="text-gray-500 font-medium uppercase tracking-wider mb-2">
          Our Services
        </p>
        <h2 className="text-3xl md:text-4xl font-bold">Websites We Build</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 text-center">
        {services.map((service, index) => (
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
