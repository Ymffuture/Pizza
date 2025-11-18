import React from "react";
import MenuCard from "../layouts/MenuCard";

// Generate random Unsplash images per service type
const unsplash = (keyword) =>
  `https://source.unsplash.com/random/600x400/?${keyword},website,design,ui`;

const services = [
  {
    id: 1,
    name: "E-Commerce Website",
    tag: "Popular",
    price: "From R1499",
    image: unsplash("ecommerce"),
  },
  {
    id: 2,
    name: "HTML & CSS Website",
    tag: "New",
    price: "From R899",
    image: unsplash("html css"),
  },
  {
    id: 3,
    name: "React Website",
    tag: "Hot",
    price: "From R1999",
    image: unsplash("reactjs"),
  },
  {
    id: 4,
    name: "Next.js Website",
    tag: "",
    price: "From R2499",
    image: unsplash("nextjs"),
  },
  {
    id: 5,
    name: "Portfolio Website",
    tag: "Popular",
    price: "From R799",
    image: unsplash("portfolio website"),
  },
  {
    id: 6,
    name: "Business Website",
    tag: "New",
    price: "From R1299",
    image: unsplash("business website"),
  },
  {
    id: 7,
    name: "Landing Page Design",
    tag: "",
    price: "From R499",
    image: unsplash("landing page design"),
  },
  {
    id: 8,
    name: "Custom Web Application",
    tag: "Hot",
    price: "From R2999",
    image: unsplash("web application"),
  },
];

const Menu = () => {
  return (
    <section className="bg-white dark:bg-black text-black dark:text-white py-16 px-5 lg:px-14 transition-colors duration-300">
      <div className="text-center mb-12">
        <p className="text-orange-500 font-medium uppercase tracking-wider mb-2">
          Our Services
        </p>
        <h2 className="text-3xl md:text-4xl font-bold">Websites We Build</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 text-center">
        {services.map((service) => (
          <MenuCard key={service.id} {...service} />
        ))}
      </div>
    </section>
  );
};

export default Menu;
