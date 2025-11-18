import React from "react";
import img1 from "../assets/img/process1.png";
import img2 from "../assets/img/process2.png";
import img3 from "../assets/img/process3.png";
import ProcessCard from "../layouts/ProcessCard";

// Updated steps for a Website Design / Web Development service
const processSteps = [
  {
    img: img1,
    title: "Planning & Strategy",
    desc: "We analyze your goals, audience, and brand to craft a strong project roadmap.",
  },
  {
    img: img2,
    title: "Design & Development",
    desc: "We design modern, responsive, high-converting websites built with the latest technologies.",
  },
  {
    img: img3,
    title: "Launch & Support",
    desc: "After deployment, we provide updates, maintenance, and continuous improvements.",
  },
];

const Process = () => {
  return (
    <section className="bg-white dark:bg-black text-black dark:text-white py-16 px-5 lg:px-14 transition-colors duration-300">
      <div className="text-center mb-14">
        <p className="text-orange-500 font-semibold uppercase tracking-wider mb-2">
          Our Process
        </p>
        <h2 className="text-3xl md:text-4xl font-bold leading-tight">
          How We Build Your Website
        </h2>
        <p className="mt-3 text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          A simple, transparent workflow that ensures quality, speed, and
          professional results for every project.
        </p>
      </div>

      <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 text-center">
        {processSteps.map((step, index) => (
          <ProcessCard key={index} {...step} />
        ))}
      </div>
    </section>
  );
};

export default Process;
