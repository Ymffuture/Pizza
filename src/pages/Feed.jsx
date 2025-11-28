import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { api } from "../api";
import PostCard from "../components/PostCard";
import { CircleDashed } from "lucide-react";
export default function Feed() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    try {
      const res = await api.get("/posts");
      setPosts(res.data);
    } catch (err) {
      console.error("Failed to load posts", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  // Slider settings for slow fade
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 2000,       // transition speed 2s
    autoplay: true,
    autoplaySpeed: 60000, // 60 seconds per slide (1 min)
    fade: true,        // fade transition
    cssEase: "linear",
    pauseOnHover: true,
    arrows: false,
  };

  return (
    <div className="bg-white dark:bg-black transition-colors duration-300">
      <div className="mx-auto max-w-[470px] px-4 pt-6 pb-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-[26px] font-semibold text-gray-900 dark:text-white tracking-tight">
            Feed
          </h2>
          <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-800"></div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="text-center gap-3 text-gray-500 dark:text-gray-400 animate-pulse duration-100">
            

<CircleDashed size={30} className="animate-spin text-gray-500 dark:text-gray-400 mx-auto" />

            Loading posts...
          </div>
        )}

        {/* Posts Slider */}
        {!loading && posts.length > 0 && (
          <Slider {...sliderSettings} className="space-y-5">
            {posts.map((p) => (
              <div key={p._id}>
                <PostCard post={p} />
              </div>
            ))}
          </Slider>
        )}

        {/* Empty Feed */}
        {!loading && posts.length === 0 && (
          <div className="text-center text-gray-500 dark:text-gray-400 pt-10">
            No posts yet.
          </div>
        )}
      </div>
    </div>
  );
}
