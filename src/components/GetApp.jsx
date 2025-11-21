import React from "react";
import img from "../assets/img/order.png";

// Official app store icons URLs
const googlePlayIcon =
  "https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg";

const appStoreIcon =
  "https://upload.wikimedia.org/wikipedia/commons/6/67/App_Store_%28iOS%29.svg";

const huaweiAppGalleryIcon =
  "https://upload.wikimedia.org/wikipedia/commons/2/2d/Huawei_AppGallery_badge_EN.svg";

const samsungGalaxyStoreIcon =
  "https://upload.wikimedia.org/wikipedia/commons/4/4e/Samsung_Galaxy_Store_badge_EN.svg";

const amazonAppstoreIcon =
  "https://upload.wikimedia.org/wikipedia/commons/3/3f/Amazon_Appstore_badge.svg";

const GetApp = () => {
  return (
    <section className="dark:bg-black py-10 transition-colors duration-300">
      <div className="dark:bg-[#1F1D2B] py-16 px-6 lg:px-20 rounded-3xl mx-4 lg:mx-16">
        <div className="grid md:grid-cols-2 items-center gap-10">
          {/* Left Text */}
          <div>
            <h4 className="text-gray-500 font-semibold uppercase mb-2">
              Our Application
            </h4>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Simple Way To get in touch with the developer. 
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              Discover more ideas in one chat. 
            </p>

            {/* App Store Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Google Play */}
              <div className="relative w-full sm:w-auto">
                <button
                  disabled
                  className="flex items-center justify-center gap-2 w-full sm:w-auto text-white font-medium px-2 py-3 rounded-full shadow opacity-80 cursor-not-allowed"
                >
                  <img src={googlePlayIcon} alt="Google Play" className="h-12 sm:h-10 object-contain" />
                  
                </button>
                
              </div>

              {/* App Store */}
              <div className="relative w-full sm:w-auto">
                <button
                  disabled
                  className="flex items-center justify-center gap-2 w-full sm:w-auto text-white font-medium px-2 py-3 rounded-full shadow opacity-80 cursor-not-allowed"
                >
                  <img src={huaweiAppGalleryIcon} alt="App Store" className="h-12 sm:h-10 object-contain" />
                  
                </button>
                
              </div>
            </div>
          </div>

          {/* Right Image */}
          <div className="flex justify-center">
            <img
              src={img}
              alt="App Preview"
              className="w-[280px] sm:w-[320px] md:w-[400px] lg:w-[480px] drop-shadow-2xl rounded-xl dark:grayscale"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default GetApp;
