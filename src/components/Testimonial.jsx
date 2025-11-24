import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FaStar, FaRegStar } from "react-icons/fa";
import axios from "axios";

// Random names list
const names_randomly = [
  "Thabo Mokoena",
  "Amina Adebayo",
  "Kwame Osei",
  "Zuri Ndlovu",
  "Chidi Okonkwo",
  "Liam Chen",
  "Sofia Ramirez",
  "Noah Patel",
  "Isabella Müller",
  "Mateo Ivanov",
  "Aria Singh",
  "Lucas Dubois",
  "Simphiwe Nkosi",
  "Karabo Thwala",
];

// Example testimonial texts
const texts = [
  "SwiftMeta helped me design a modern, responsive website that looks stunning on all devices!",
  "The customization tools are clean and intuitive. I created a full website without touching a single line of code.",
  "I love how smooth the editor is — fast, minimal, and beautifully designed. It feels like using Apple-level software.",
  "My site was live in minutes. The templates, animations, and layout options are extremely high-quality!",
  "Building pages feels natural. Drag, drop, and everything aligns perfectly without breaking the layout.",
  "The design system is elegant and consistent. Every component feels premium and well-crafted.",
  "I migrated my old site in a day. SwiftMeta’s editor made everything easier and far more professional.",
  "Animations, colors, and typography look incredible — my website finally feels like a real brand."
];

const Testimonial = () => {
  const [testimonials, setTestimonials] = useState([]);

  useEffect(() => {
    const fetchAvatars = async () => {
      try {
        const shuffled = names_randomly.sort(() => 0.5 - Math.random()).slice(0, 4);

        const avatarRequests = shuffled.map(() =>
          axios.get(
            "https://api.unsplash.com/photos/random?query=person&client_id=vKvUZ1Wv3ez0cdcjK-d9KMB8_wPVRLNQaC2P8FVssaw"
          )
        );

        const responses = await Promise.all(avatarRequests);
        const avatars = responses.map((res) => res.data.urls.small);

        const temp = shuffled.map((name, i) => ({
          id: i + 1,
          name,
          text: texts[Math.floor(Math.random() * texts.length)],
          rating: Math.floor(Math.random() * 2) + 4,
          avatar: avatars[i],
        }));

        setTestimonials(temp);
      } catch (error) {
        console.error("Error fetching avatars:", error);
      }
    };

    fetchAvatars();
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 900,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    fade: true, // 🍎 Apple-style fade transition
    autoplaySpeed: 5000,
    cssEase: "ease-in-out",
    arrows: false,
  };

  return (
    <section className="relative py-20 px-4 sm:px-6 lg:px-16 bg-white dark:bg-black transition-all duration-300">
      {/* Apple-style soft gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-gray-50 to-white dark:from-[#0A0A0A] dark:via-black dark:to-[#0A0A0A] pointer-events-none" />

      <div className="relative text-center mb-16 z-10">
        <h2 className="text-4xl md:text-5xl font-semibold text-gray-900 dark:text-white mb-3 tracking-tight">
          What They Say
        </h2>
        <p className="text-gray-500 dark:text-gray-400 text-lg">
          Real experiences from real users
        </p>
      </div>

      <div className="relative max-w-3xl mx-auto z-10">
        <Slider {...settings}>
          {testimonials.map((review) => (
            <div key={review.id} className="px-4">
              <div
                className="
                  bg-white/80 dark:bg-white/5 
                  backdrop-blur-xl 
                  border border-white/30 dark:border-white/10
                  shadow-[0_12px_40px_rgba(0,0,0,0.08)] dark:shadow-[0_12px_50px_rgba(0,0,0,0.6)]
                  px-8 py-10 rounded-3xl 
                  transform transition-all duration-700
                  fade-slide
                "
              >
                <p className="text-lg md:text-xl italic text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                  “{review.text}”
                </p>

                <div className="flex items-center gap-4">
                  <img
                    src={review.avatar}
                    alt={review.name}
                    className="
                      w-14 h-14 rounded-full object-cover
                      border-2 border-white dark:border-blue-500
                      shadow-md
                    "
                  />
                  <div className="text-left">
                    <h4 className="font-semibold text-gray-900 dark:text-blue-400 text-lg">
                      {review.name}
                    </h4>
                    <div className="flex text-yellow-400 text-sm">
                      {[...Array(5)].map((_, i) =>
                        i < review.rating ? (
                          <FaStar key={i} />
                        ) : (
                          <FaRegStar key={i} />
                        )
                      )}
                    </div>
                  </div>
                </div>

              </div>
            </div>
          ))}
        </Slider>
      </div>

      {/* Fade-slide animation style */}
      <style>{`
        .fade-slide {
          opacity: 0;
          transform: translateY(20px);
          animation: fadeSlideUp 0.9s ease forwards;
        }

        @keyframes fadeSlideUp {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
};

export default Testimonial;
