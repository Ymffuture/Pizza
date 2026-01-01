import React from "react";
import Lottie from "lottie-react";
import appAnimation from "../assets/app.json";


const googlePlayIcon =
  "https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg";

const GetApp = () => {
  return (
    <section className="py-20 bg-[#FAFAFA] dark:bg-black transition-all duration-300">
      {/* Apple-style container */}
      <div className="max-w-6xl mx-auto px-6">
        <div
          className="
            rounded-[40px] 
            bg-white dark:bg-[#111111]
            shadow-[0_20px_60px_rgba(0,0,0,0.08)]
            dark:shadow-[0_20px_60px_rgba(0,0,0,0.45)]
            p-12 md:p-16
            grid md:grid-cols-2 gap-16
            relative overflow-hidden
          "
        >

          {/* Soft gradient like Apple */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent dark:from-white/5 pointer-events-none" />

          {/* LEFT SIDE TEXT */}
          <div className="relative flex flex-col justify-center z-10">
            <h4 className="uppercase tracking-wide text-gray-500 dark:text-gray-400 font-semibold mb-3">
              Our Application
            </h4>

            <h2 className="text-4xl md:text-5xl font-semibold text-gray-900 dark:text-white leading-tight mb-6">
              A Smarter Way to Connect  
            </h2>

            <p className="text-lg text-gray-600 dark:text-gray-300 mb-10 max-w-md">
              Stay close to the developer — explore ideas, updates, and insights in one elegant experience.
            </p>

            {/* GOOGLE PLAY BUTTON */}
            <div className="flex items-center">
              <button
                disabled
                className="
                  opacity-90 dark:opacity-80 cursor-not-allowed
                  hover:opacity-100 transition
                "
              >
                <img
                  src={googlePlayIcon}
                  alt="Google Play Store"
                  className="h-14 md:h-12 object-contain drop-shadow-sm"
                />
              </button>
            </div>
          </div>

          {/* RIGHT IMAGE — Apple-style floating device */}
          <div className="relative flex justify-center items-center z-10">
  <div
    className="
      w-[260px] md:w-[340px] lg:w-[420px]
      rounded-3xl
      backdrop-blur-xl
      drop-shadow-[0_25px_60px_rgba(0,0,0,0.15)]
      dark:drop-shadow-[0_25px_80px_rgba(0,0,0,0.8)]
      hover:scale-[1.02]
      transition-all duration-500
      p-6 scale-110
    "
  >
    <Lottie
  animationData={appAnimation}
  loop
  autoplay
  speed={0.5}
  rendererSettings={{
    preserveAspectRatio: "xMidYMid meet",
    progressiveLoad: true
  }}
  className="w-full h-full scale-180"
/>

  </div>
</div>


        </div>
      </div>
    </section>
  );
};

export default GetApp;
