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
  "Lucas Dubois"
];

// Example testimonial texts
const texts = [
  "Foody is the best. Besides the many and delicious meals, it always delivers super fast and fresh!",
  "The meals are absolutely delicious and always arrive hot and on time. Highly recommend Foody!",
  "Great service, fantastic food. Love the design and ease of the app too!",
  "I always order from here. The food quality and delivery are perfect every time!",
];

// Component
const Testimonial = () => {
  const [testimonials, setTestimonials] = useState([]);

  useEffect(() => {
    const fetchAvatars = async () => {
      try {
        // Pick 4 random names
        const shuffledNames = names_randomly.sort(() => 0.5 - Math.random()).slice(0, 4);

        // Fetch random avatars from Unsplash
        const avatarRequests = shuffledNames.map(() =>
          axios.get(
            "https://api.unsplash.com/photos/random?query=person&client_id=vKvUZ1Wv3ez0cdcjK-d9KMB8_wPVRLNQaC2P8FVssaw"
          )
        );

        const responses = await Promise.all(avatarRequests);
        const avatars = responses.map((res) => res.data.urls.small);

        // Build testimonial array
        const temp = shuffledNames.map((name, i) => ({
          id: i + 1,
          name,
          text: texts[Math.floor(Math.random() * texts.length)],
          rating: Math.floor(Math.random() * 2) + 4, // 4 or 5 stars
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
    speed: 600,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    arrows: false,
  };

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-14 bg-white dark:bg-black text-gray-500 dark:text-gray-400 transition-colors duration-300">
      <div className="text-center mb-12">
        <h2 className="text-blue-500 font-bold text-3xl md:text-4xl mb-2">What They Say?</h2>
        <p className="text-gray-400">Real reviews from our happy customers</p>
      </div>

      <Slider {...settings}>
        {testimonials.map((review) => (
          <div key={review.id} className="px-2 sm:px-6">
            <div className="bg-gray-100 dark:bg-[#1F1D2B] p-6 sm:p-8 rounded-2xl shadow-md">
              <p className="mb-4 italic text-base sm:text-lg">{`"${review.text}"`}</p>
              <div className="flex items-center gap-4">
                <img
                  src={review.avatar}
                  alt={review.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-gray-300 dark:border-blue-500"
                />
                <div>
                  <h4 className="font-semibold text-gray-700 dark:text-blue-500">{review.name}</h4>
                  <div className="flex text-yellow-400 text-sm">
                    {[...Array(5)].map((_, i) =>
                      i < review.rating ? <FaStar key={i} /> : <FaRegStar key={i} />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </section>
  );
};

export default Testimonial;
