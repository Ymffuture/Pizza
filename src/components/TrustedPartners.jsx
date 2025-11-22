// src/pages/TrustedPartners.jsx
import React, { useRef } from "react";

const partners = [
  { name: "Cloudinary", href: "https://cloudinary.com", logo: "/partners/Cloudinary.png" },
  { name: "MongoDB", href: "https://mongodb.com", logo: "/partners/MongoDB.png" },
  { name: "Gemini AI", href: "https://gemini.google.com", logo: "/partners/Gemini.png" },
  { name: "Render", href: "https://render.com", logo: "/partners/render.png" },
  { name: "Node.js", href: "https://nodejs.org", logo: "/partners/Node.png" },
  { name: "GitHub", href: "https://github.com", logo: "/partners/Github.png" },
  { name: "Vercel", href: "https://vercel.com", logo: "/partners/Vercel.png" },
  { name: "Supabase", href: "https://supabase.com", logo: "/partners/supabase.png" },
  { name: "React", href: "https://netlify.com", logo: "/partners/Netlify.png" },
  { name: "TailwindCSS", href: "https://tailwindcss.com", logo: "/partners/Tailwindcss.png" },
];

const TrustedPartners = ({ pauseOnHover = true, speed = 20 }) => {
  const tickerRef = useRef(null);

  return (
    <section className="py-16 bg-white dark:bg-black overflow-hidden relative">
      {/* Apple subtle gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/70 via-gray-50 to-white dark:from-[#0A0A0A] dark:via-black dark:to-[#0A0A0A]" />

      <div className="relative max-w-7xl mx-auto px-6">

        {/* Title */}
        <div className="text-center mb-12">
          <h3 className="text-3xl md:text-4xl font-semibold text-gray-900 dark:text-white tracking-tight">
            Trusted by Industry Leaders
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            Powered by cutting-edge technology partners
          </p>
        </div>

        {/* Infinite Auto Slider */}
        <div className="overflow-hidden relative rounded-xl shadow-[inset_0_0_20px_rgba(0,0,0,0.06)] dark:shadow-[inset_0_0_30px_rgba(255,255,255,0.05)] backdrop-blur-md">
          <div
            ref={tickerRef}
            className={`partner-ticker ${pauseOnHover ? "pause-on-interact" : ""}`}
            style={{ "--ticker-speed": `${speed}s` }}
          >
            {[0, 1].map((copy) => (
              <ul key={copy} className="flex items-center gap-16 whitespace-nowrap px-6 py-6">
                {partners.map((p, idx) => (
                  <li key={`${p.name}-${idx}`} className="flex items-center">
                    <a
                      href={p.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 px-3 py-2 rounded-lg transition-all hover:scale-[1.02]"
                      aria-label={`Visit ${p.name}`}
                    >
                      <img
                        src={p.logo}
                        alt={`${p.name} logo`}
                        className="h-12 md:h-14 object-contain opacity-70 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-300"
                        loading="lazy"
                        onError={(e) => {
                          e.currentTarget.src =
                            "data:image/svg+xml;utf8," +
                            encodeURIComponent(
                              `<svg xmlns='http://www.w3.org/2000/svg' width='160' height='60'><rect width='100%' height='100%' fill='#E5E7EB'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='#6B7280' font-size='16'>${p.name}</text></svg>`
                            );
                        }}
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
