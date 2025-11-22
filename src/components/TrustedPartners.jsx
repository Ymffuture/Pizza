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
  { name: "Netlify", href: "https://netlify.com", logo: "/partners/Netlify.png" },
  { name: "TailwindCSS", href: "https://tailwindcss.com", logo: "/partners/Tailwindcss.png" },
];

const TrustedPartners = ({ pauseOnHover = true, speed = 22 }) => {
  const tickerRef = useRef(null);

  return (
    <section className="py-20 bg-white dark:bg-black relative overflow-hidden">
      {/* Soft Apple Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-gray-50/90 to-white dark:from-[#0A0A0A] dark:via-black/50 dark:to-black" />

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

        {/* Infinite Slider */}
        <div className="overflow-hidden relative rounded-2xl shadow-lg shadow-black/[0.03] dark:shadow-white/[0.02] backdrop-blur-xl border border-gray-200/40 dark:border-white/10">
          <div
            ref={tickerRef}
            className={`partner-ticker ${pauseOnHover ? "pause-on-interact" : ""}`}
            style={{ "--ticker-speed": `${speed}s` }}
          >
            {[0, 1].map((copy) => (
              <ul
                key={copy}
                className="flex items-center gap-20 whitespace-nowrap px-8 py-10"
              >
                {partners.map((p, idx) => (
                  <li key={`${p.name}-${idx}`}>
                    <a
                      href={p.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center p-4 rounded-xl transition-all duration-300 hover:-translate-y-1 hover:scale-[1.05]"
                      aria-label={`Visit ${p.name}`}
                    >
                      <img
                        src={p.logo}
                        alt={`${p.name} logo`}
                        className="h-16 md:h-20 lg:h-20 object-contain opacity-80 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-300 drop-shadow-xl"
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

        {/* Styles */}
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
            from { transform: translateX(0); }
            to { transform: translateX(-50%); }
          }
        `}</style>
      </div>
    </section>
  );
};

export default TrustedPartners;
