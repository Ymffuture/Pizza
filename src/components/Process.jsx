import React from "react";
import { Lightbulb, Code2, Rocket } from "lucide-react";
import ProcessCard from "../layouts/ProcessCard";

const processSteps = [
  {
    icon: <Lightbulb size={70} strokeWidth={1.5} className="text-blue-600 dark:text-blue-400 mx-auto" />,
    title: "Planning & Strategy",
    desc: "We analyze your goals, audience, and brand to craft a strong project roadmap.",
  },
  {
    icon: <Code2 size={70} strokeWidth={1.5} className="text-green-600 dark:text-green-400 mx-auto" />,
    title: "Design & Development",
    desc: "We design modern, responsive, high-converting websites using the latest technologies.",
  },
  {
    icon: <Rocket size={70} strokeWidth={1.5} className="text-purple-600 dark:text-purple-400 mx-auto" />,
    title: "Launch & Support",
    desc: "After deployment, we provide updates, maintenance, and continuous improvements.",
  },
];

const Process = () => {
  return (
    <section className="bg-white dark:bg-black text-black dark:text-white py-16 px-5 lg:px-14 transition-colors duration-300">
      <div className="text-center mb-14">
        <p className="text-gray-500 dark:text-gray-400 font-semibold uppercase tracking-wider mb-2">
          Our Process
        </p>

        <h2 className="text-3xl md:text-4xl font-bold">How We Build Your Website</h2>

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
