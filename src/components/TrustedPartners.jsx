import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Logos
import Cloudinary from "../assets/partners/Cloudinary.png";
import MongoDB from "../assets/partners/MongoDB.png";
import Gemini from "../assets/partners/Gemini.png";
import RenderLogo from "../assets/partners/emailjs_logo.png";
import NodeLogo from "../assets/partners/wethinkcode.png";
import GitHubLogo from "../assets/partners/github-logo-vector.png";
import VercelLogo from "../assets/partners/Vercel.png";
import SupabaseLogo from "../assets/partners/Supabase_Logo.png";
import NetlifyLogo from "../assets/partners/Netlify.png";
import TailwindLogo from "../assets/partners/Tailwindcss.png";

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
      { breakpoint: 1024, settings: { slidesToShow: 4 } },
      { breakpoint: 640, settings: { slidesToShow: 2 } },
    ],
  };

  return (
    <section className="relative py-20 bg-white dark:bg-black overflow-hidden">
      {/* Edge fades */}
      <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-white dark:from-black to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-white dark:from-black to-transparent z-10 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6">
        {/* Heading */}
        <div className="text-center mb-14">
          <h3 className="text-4xl font-semibold text-gray-900 dark:text-white">
            Trusted by Modern Platforms
          </h3>
          <p className="mt-3 text-gray-500 dark:text-gray-400">
            Technologies powering our ecosystem
          </p>
        </div>

        {/* Logos */}
        <Slider {...settings}>
          {partners.map((p, idx) => (
            <a
              key={idx}
              href={p.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center px-8"
            >
              <img
                src={p.logo}
                alt={p.name}
                className="
                  h-16 md:h-20 object-contain
                  opacity-60 grayscale
                  transition-all duration-300
                  hover:opacity-100 hover:grayscale-0 hover:scale-110
                  dark:opacity-70 dark:invert hover:invert-0
                "
              />
            </a>
          ))}
        </Slider>
      </div>
    </section>
  );
};

export default TrustedPartners;
