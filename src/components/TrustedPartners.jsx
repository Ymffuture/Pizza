import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// === IMPORT IMAGES FROM ASSETS ===
import Cloudinary from "../assets/partners/Cloudinary.png";
import MongoDB from "../assets/partners/MongoDB.png";
import Gemini from "../assets/partners/Gemini.png";
import RenderLogo from "../assets/partners/umuzi.png";
import NodeLogo from "../assets/partners/wethinkcode.png";
import GitHubLogo from "../assets/partners/GitHub.png";
import VercelLogo from "../assets/partners/Vercel.png";
import SupabaseLogo from "../assets/partners/supabase.png";
import NetlifyLogo from "../assets/partners/Netlify.png";
import TailwindLogo from "../assets/partners/Tailwindcss.png";

// === PARTNER DATA ===
const partners = [
  { name: "Cloudinary", href: "https://cloudinary.com", logo: Cloudinary },
  { name: "MongoDB", href: "https://mongodb.com", logo: MongoDB },
  { name: "Gemini AI", href: "https://gemini.google.com", logo: Gemini },
  { name: "Render", href: "https://render.com", logo: RenderLogo },
  { name: "Node.js", href: "https://nodejs.org", logo: NodeLogo },
  { name: "GitHub", href: "https://github.com", logo: GitHubLogo },
  { name: "Vercel", href: "https://vercel.com", logo: VercelLogo },
  { name: "Supabase", href: "https://supabase.com", logo: SupabaseLogo },
  { name: "Netlify", href: "https://netlify.com", logo: NetlifyLogo },
  { name: "TailwindCSS", href: "https://tailwindcss.com", logo: TailwindLogo },
];

const TrustedPartners = () => {
  // === SLIDER SETTINGS (SMOOTH APPLE STYLE) ===
  const settings = {
    infinite: true,
    speed: 4000,
    autoplay: true,
    autoplaySpeed: 0,
    cssEase: "linear",
    slidesToShow: 4,
    slidesToScroll: 1,
    arrows: false,
    pauseOnHover: true,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 3 } },
      { breakpoint: 640, settings: { slidesToShow: 2 } },
    ],
  };

  return (
    <section className="py-20 bg-white dark:bg-black relative overflow-hidden">
      {/* Apple Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-b
        from-white via-gray-100/80 to-white
        dark:from-[#0A0A0A] dark:via-black/40 dark:to-black" />

      {/* Left & Right Fade Edges */}
      <div className="absolute left-0 top-0 w-32 h-full 
        bg-gradient-to-r from-white dark:from-black to-transparent z-20 pointer-events-none" />
      <div className="absolute right-0 top-0 w-32 h-full 
        bg-gradient-to-l from-white dark:from-black to-transparent z-20 pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">

        {/* Title */}
        <div className="text-center mb-12">
          <h3 className="text-4xl font-semibold text-gray-900 dark:text-white">
            Trusted by Leading Innovators
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mt-3">
            Empowering our ecosystem through world-class partners
          </p>
        </div>

        {/* Slider */}
        <div className="px-4">
          <Slider {...settings}>
            {partners.map((p, idx) => (
              <div key={idx} className="flex justify-center">
                <a
                  href={p.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-center p-6 
                  rounded-2xl transition-all duration-300 hover:-translate-y-1
                  hover:scale-[1.05] bg-white/60 dark:bg-white/5 backdrop-blur-xl 
                  shadow-lg border border-gray-200/40 dark:border-white/10"
                >
                  <img
                    src={p.logo}
                    alt={p.name}
                    className="h-20 md:h-24 object-contain opacity-80 grayscale 
                    group-hover:opacity-100 group-hover:grayscale-0 transition-all duration-300"
                  />
                </a>
              </div>
            ))}
          </Slider>
        </div>

      </div>
    </section>
  );
};

export default TrustedPartners;
