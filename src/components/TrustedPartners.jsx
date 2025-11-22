// src/pages/TrustedPartners.jsx
import React, { useRef } from "react";

// Import logos from assets
import CloudinaryLogo from "../assets/partners/Cloudinary.png";
import MongoDBLogo from "../assets/partners/MongoDB.png";
import GeminiLogo from "../assets/partners/Gemini.png";
import RenderLogo from "../assets/partners/wethinkcode.png";
import NodeLogo from "../assets/partners/umuzi.png";
import GitHubLogo from "../assets/partners/GitHub.png";
import VercelLogo from "../assets/partners/Vercel.png";
import SupabaseLogo from "../assets/partners/supabase.png";
import NetlifyLogo from "../assets/partners/Netlify.png";
import TailwindLogo from "../assets/partners/Tailwindcss.png";

// Partner definitions
const partners = [
  { name: "Cloudinary", href: "https://cloudinary.com", logo: CloudinaryLogo },
  { name: "MongoDB", href: "https://mongodb.com", logo: MongoDBLogo },
  { name: "Gemini AI", href: "https://gemini.google.com", logo: GeminiLogo },
  { name: "Render", href: "https://render.com", logo: RenderLogo },
  { name: "Node.js", href: "https://nodejs.org", logo: NodeLogo },
  { name: "GitHub", href: "https://github.com", logo: GitHubLogo },
  { name: "Vercel", href: "https://vercel.com", logo: VercelLogo },
  { name: "Supabase", href: "https://supabase.com", logo: SupabaseLogo },
  { name: "Netlify", href: "https://netlify.com", logo: NetlifyLogo },
  { name: "TailwindCSS", href: "https://tailwindcss.com", logo: TailwindLogo },
];

const TrustedPartners = ({ pauseOnHover = true, speed = 22 }) => {
  const tickerRef = useRef(null);

  return (
    <section className="py-20 bg-white dark:bg-black relative overflow-hidden">
      {/* Soft Apple Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-gray-50/90 to-white dark:from-[#0A0A0A] dark:via-black/40 dark:to-black" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">

        {/* Title */}
        <div className="text-center mb-14">
          <h3 className="text-4xl font-semibold text-gray-900 dark:text-white tracking-tight">
            Trusted by Leading Innovators
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mt-3 text-lg">
            We collaborate with cutting-edge technology partners
          </p>
        </div>

        {/* Apple-styled container */}
        <div className="overflow-hidden relative rounded-2xl shadow-xl shadow-black/[0.04] dark:shadow-white/[0.02] backdrop-blur-2xl border border-gray-200/40 dark:border-white/10">
          <div
            ref={tickerRef}
            className={`partner-ticker ${pauseOnHover ? "pause-on-interact" : ""}`}
            style={{ "--ticker-speed": `${speed}s` }}
          >
            {[0, 1].map((copy) => (
              <ul key={copy} className="flex items-center gap-20 whitespace-nowrap px-8 py-10">
                {partners.map((p, idx) => (
                  <li key={`${p.name}-${idx}`}>
                    <a
                      href={p.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Visit ${p.name}`}
                      className="flex items-center p-4 rounded-xl transition-all duration-300 hover:-translate-y-1 hover:scale-105"
                    >
                      <img
                        src={p.logo}
                        alt={`${p.name} logo`}
                        className="h-16 md:h-20 lg:h-20 object-contain opacity-80 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-300 drop-shadow-xl"
                        loading="lazy"
                      />
                    </a>
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </div>

        {/* Animation Styles */}
        <style jsx>{`
          .partner-ticker {
            display: flex;
            animation: scroll-left var(--ticker-speed) linear infinite;
            will-change: transform;
          }

          .pause-on-interact:hover,
          .pause-on-interact:focus-within {
            animation-play-state: paused;
          }

          @keyframes scroll-left {
            from {
              transform: translateX(0);
            }
            to {
              transform: translateX(-50%);
            }
          }
        `}</style>
      </div>
    </section>
  );
};

export default TrustedPartners;
