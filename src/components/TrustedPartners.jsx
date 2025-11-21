// src/pages/TrustedPartners.jsx
import React, { useRef } from "react";

const partners = [
  {
    name: "Cloudinary",
    href: "https://cloudinary.com",
    logo: "https://res.cloudinary.com/cloudinary/image/upload/c_limit,w_256,h_256/v1/logo/cloudinary_logo_blue.png",
  },
  {
    name: "MongoDB",
    href: "https://www.mongodb.com",
    logo: "https://webassets.mongodb.com/_com_assets/cms/mongodb_logo1-76twgcu2dm.png",
  },
  {
    name: "Gemini AI",
    href: "https://gemini.google.com",
    logo: "https://upload.wikimedia.org/wikipedia/commons/9/98/Google_Gemini_logo.svg",
  },
  {
    name: "Render",
    href: "https://render.com",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Render_logo.svg/512px-Render_logo.svg.png",
  },
  {
    name: "Node.js",
    href: "https://nodejs.org",
    logo: "https://nodejs.org/static/images/logo.svg",
  },
  {
    name: "GitHub",
    href: "https://github.com",
    logo: "https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png",
  },
  {
    name: "Vercel",
    href: "https://vercel.com",
    logo: "https://assets.vercel.com/image/upload/front/assets/design/vercel-triangle-black.svg",
  },
  {
    name: "Supabase",
    href: "https://supabase.com",
    logo: "https://supabase.com/brand-assets/supabase-logo-icon.png",
  },
  {
    name: "React",
    href: "https://reactjs.org",
    logo: "https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg",
  },
  {
    name: "TailwindCSS",
    href: "https://tailwindcss.com",
    logo: "https://upload.wikimedia.org/wikipedia/commons/d/d5/Tailwind_CSS_Logo.svg",
  },
];


const TrustedPartners = ({ pauseOnHover = true, speed = 20 }) => {
  const tickerRef = useRef(null);

  return (
    <section className="py-12 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl md:text-2xl font-semibold text-gray-900 dark:text-white">
              Trusted by Top Tech Companies
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Powered by leading platforms and tools.
            </p>
          </div>
        </div>

        <div className="overflow-hidden relative group rounded-lg" aria-label="Trusted partners carousel">
          <div
            ref={tickerRef}
            className={`partner-ticker ${pauseOnHover ? "pause-on-interact" : ""}`}
            style={{ "--ticker-speed": `${speed}s` }}
          >
            {[0, 1].map((copy) => (
              <ul key={copy} className="flex items-center gap-12 whitespace-nowrap px-6 py-4">
                {partners.map((p, idx) => (
                  <li key={`${p.name}-${idx}`} className="flex items-center">
                    <a
                      href={p.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 focus:outline-none focus:ring-2 focus:ring-blue-400 rounded px-2 py-1 transition-transform hover:-translate-y-0.5"
                      aria-label={`Visit ${p.name}`}
                    >
                      <img
                        src={p.logo}
                        alt={`${p.name} logo`}
                        loading="lazy"
                        className="h-10 md:h-12 lg:h-14 object-contain filter grayscale opacity-80 hover:filter-none hover:opacity-100 transition-all"
                        onError={(e) => {
                          e.currentTarget.src = "data:image/svg+xml;utf8," + encodeURIComponent(
                            `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="60"><rect width="100%" height="100%" fill="#E5E7EB"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#6B7280" font-size="16">${p.name}</text></svg>`
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
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          @media (max-width: 640px) {
            .partner-ticker > ul { gap: 2rem; }
          }
        `}</style>
      </div>
    </section>
  );
};

export default TrustedPartners;
