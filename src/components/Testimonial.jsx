import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import img from "../assets/img/review.jpg";
import { FaStar, FaRegStar } from "react-icons/fa";

const testimonials = [
  {
    id: 1,
    name: "Guy Hawkins",
    text: "Foody is the best. Besides the many and delicious meals, it always delivers super fast and always fresh. I love it!",
    rating: 5,
    avatar: "src/assets/img/review1.jpg",
  },
  {
    id: 2,
    name: "Jane Doe",
    text: "The meals are absolutely delicious and always arrive hot and on time. Highly recommend Foody!",
    rating: 4,
    avatar: "src/assets/img/review2.jpg",
  },
  {
    id: 3,
    name: "Mark Smith",
    text: "Great service, fantastic food. Love the design and ease of the app too!",
    rating: 5,
    avatar: "src/assets/img/review3.jpg",
  },
];

const Testimonial = () => {
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
    <section className="py-16 px-4 sm:px-6 lg:px-14 bg-white dark:bg-black text-black dark:text-white transition-colors duration-300">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        {/* Left Image */}
        <div className="flex justify-center">
          <img
            src={img}
            alt="Delivery Guy"
            className="w-3/4 sm:w-2/3 md:w-full max-w-sm rounded-2xl"
          />
        </div>

        {/* Right Testimonial Slider */}
        <div className="text-center md:text-start">
          <h2 className="text-orange-500 font-medium uppercase mb-2 text-sm sm:text-base pl-3">
            Our Reviews
          </h2>
          <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 pl-3">
            What They Say?
          </h3>

          <Slider {...settings}>
            {testimonials.map((review) => (
              <div key={review.id} className="px-2 sm:px-3">
                <div className="bg-gray-100 dark:bg-[#1F1D2B] p-5 sm:p-6 rounded-xl shadow-md h-full">
                  <p className="mb-4 italic text-base sm:text-lg">
                    "{review.text}"
                  </p>
                  <div className="flex items-center gap-4">
                    <img
                      src={review.avatar}
                      alt={review.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <h4 className="font-semibold">{review.name}</h4>
                      <div className="flex text-yellow-400 text-sm">
                        {[...Array(5)].map((_, i) =>   // Create an array with 5 elements
                          i < review.rating ? (        // If the index is less than the rating,
                            <FaStar key={i} />         // show a filled star
                          ) : (
                            <FaRegStar key={i} />      // otherwise, show an empty star
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
      </div>
    </section>
  );
};

export default Testimonial;
