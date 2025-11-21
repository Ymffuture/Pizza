// src/pages/TrustedPartners.jsx
import React, { useRef } from "react";

/**
 * TrustedPartners.jsx
 *
 * - Infinite auto-scrolling carousel for partner logos.
 * - Pauses on hover and focus (accessibility).
 * - Duplicate list technique for perfect seamless looping.
 * - Lazy-loaded images, keyboard-focusable links, alt text.
 * - Minimal dependencies (Tailwind CSS classes used).
 *
 * Usage: <TrustedPartners /> -- replace the `partners` array with your real partner data.
 */

const partners = [
  {
    name: "Google",
    href: "https://about.google",
    logo:
      "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg",
  },
  {
    name: "Microsoft",
    href: "https://www.microsoft.com",
    logo:
      "https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg",
  },
  {
    name: "Amazon",
    href: "https://www.amazon.com",
    logo:
      "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg",
  },
  {
    name: "Huawei",
    href: "https://www.huawei.com",
    logo:
      "https://upload.wikimedia.org/wikipedia/commons/6/6b/Huawei_Standard_Logo.svg",
  },
  {
    name: "Samsung",
    href: "https://www.samsung.com",
    logo:
      "https://upload.wikimedia.org/wikipedia/commons/2/24/Samsung_Logo.svg",
  },
  {
    name: "Cloudinary",
    href: "https://cloudinary.com",
    logo:
      "https://res.cloudinary.com/demo/image/upload/cloudinary_icon.png",
  },
  // add more partner entries here...
];

const TrustedPartners = ({ pauseOnHover = true, speed = 18 /* seconds for one full loop */ }) => {
  const tickerRef = useRef(null);

  // CSS keyframe defined inline below duplicates the list to create seamless loop.
  // pauseOnHover will add a class to pause animation on hover/focus via CSS.

  return (
    <section className="py-12 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl md:text-2xl font-semibold text-gray-900 dark:text-white">
              Trusted by
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Companies and partners who trust SwiftMeta.
            </p>
          </div>
          <div className="hidden md:flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <span>Auto-play</span>
            <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-800 rounded-full">∞</span>
          </div>
        </div>

        <div
          className={`overflow-hidden relative group rounded-lg`}
          aria-label="Trusted company logos carousel"
        >
          {/* Accessible pause note for keyboard users */}
          <div className="sr-only" aria-hidden>
            Carousel will autoplay; it pauses when you hover or focus inside.
          </div>

          {/* Ticker wrapper */}
          <div
            ref={tickerRef}
            // pause on hover/focus if requested
            className={`partner-ticker ${pauseOnHover ? "pause-on-interact" : ""}`}
            style={{
              // expose CSS variable for speed in seconds
              // keyframes use --ticker-speed variable to control animation duration
              // leaving inline style for easy override per instance
              ["--ticker-speed"]: `${speed}s`,
            }}
          >
            {/* We render the list twice to create an infinite seamless loop */}
            {[0, 1].map((copy) => (
              <ul
                key={copy}
                className="flex items-center gap-8 whitespace-nowrap px-6 py-4"
                // each item has role/presentation; links have semantic roles
              >
                {partners.map((p, idx) => (
                  <li key={`${p.name}-${idx}`} className="flex items-center">
                    <a
                      href={p.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 focus:outline-none focus:ring-2 focus:ring-blue-400 rounded px-2 py-1 transition-transform transform hover:-translate-y-0.5"
                      aria-label={`Visit ${p.name}`}
                    >
                      <img
                        src={p.logo}
                        alt={`${p.name} logo`}
                        loading="lazy"
                        className="h-8 md:h-10 lg:h-12 object-contain filter grayscale opacity-90 hover:filter-none hover:opacity-100 transition-all"
                        onError={(e) => {
                          // fallback to simple SVG "no-logo" if image fails
                          e.currentTarget.onerror = null;
                          e.currentTarget.src =
                            "data:image/svg+xml;utf8," +
                            encodeURIComponent(
                              `<svg xmlns='http://www.w3.org/2000/svg' width='200' height='60'><rect width='100%' height='100%' fill='#E5E7EB' /><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='#6B7280' font-size='14'>${p.name}</text></svg>`
                            );
                        }}
                      />
                    </a>
                  </li>
                ))}
              </ul>
            ))}
          </div>

          {/* controls (optional) — small previous/next for manual interaction */}
          <div className="absolute inset-y-0 right-3 flex items-center gap-2 pointer-events-none md:pointer-events-auto">
            <button
              type="button"
              onClick={() => {
                // quick manual "nudge" by CSS: pause briefly then resume
                if (!tickerRef.current) return;
                tickerRef.current.classList.add("ticker-manual-pause");
                setTimeout(() => {
                  tickerRef.current && tickerRef.current.classList.remove("ticker-manual-pause");
                }, 1200);
              }}
              className="bg-white/90 dark:bg-gray-800/90 pointer-events-auto p-1 rounded-full shadow-sm hover:scale-105 transform transition"
              aria-label="Temporarily pause animation"
              title="Pause briefly"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M6 19V5h3v14H6zM15 19V5h3v14h-3z" fill="#111827" />
              </svg>
            </button>
          </div>
        </div>

        <style jsx>{`
          /* CSS for the ticker animation: duplicates content scroll left */
          .partner-ticker {
            display: flex;
            gap: 0;
            /* animation uses CSS variable --ticker-speed (in seconds) */
            animation: scroll-left var(--ticker-speed) linear infinite;
            will-change: transform;
            align-items: center;
          }

          /* duplicate content layout: two UL children will sit inline */
          .partner-ticker > ul {
            display: flex;
            align-items: center;
          }

          /* pause on hover/focus within the container */
          .pause-on-interact:hover,
          .pause-on-interact:focus-within {
            animation-play-state: paused;
          }

          /* small manual pause helper */
          .ticker-manual-pause {
            animation-play-state: paused !important;
          }

          /* keyframes: move entire track to left by 50% (because we duplicate list) */
          @keyframes scroll-left {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(-50%);
            }
          }

          /* Responsive tweaks: reduce gap on small screens */
          @media (max-width: 640px) {
            .partner-ticker > ul {
              gap: 1.25rem;
            }
          }
        `}</style>
      </div>
    </section>
  );
};

export default TrustedPartners;
