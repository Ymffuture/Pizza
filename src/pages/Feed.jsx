import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { api } from "../api";
import PostCard from "../components/PostCard";
import { CircleDashed } from "lucide-react";
import toast from "react-hot-toast";
import likeSound from "../assets/like-sound.mp3"; // Add a short like sound file

const likeAudio = new Audio(likeSound);

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

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 2000,
    autoplay: true,
    autoplaySpeed: 60000,
    fade: true,
    cssEase: "linear",
    pauseOnHover: true,
    arrows: false,
  };

  const handleLike = (postId) => {
    const isLoggedIn = !!localStorage.getItem("token"); // Adjust based on your auth

    if (!isLoggedIn) {
      toast(
        (t) => (
          <div className="flex flex-col gap-3">
            <span>You need to login to like posts</span>
            <button
              onClick={() => {
                toast.dismiss(t.id);
                window.location.href = "/login"; // Adjust route
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium"
            >
              Login Now
            </button>
          </div>
        ),
        { duration: 5000 }
      );
      return;
    }

    likeAudio.currentTime = 0;
    likeAudio.play();
    // Your existing like API call here
  };

  return (
    <div className="bg-white dark:bg-black transition-colors duration-300">
      <div className="mx-auto max-w-[470px] px-4 pt-6 pb-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-[26px] font-semibold text-gray-900 dark:text-white tracking-tight">
            Feed
          </h2>
          <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-800"></div>
        </div>

        {loading && (
          <div className="text-center gap-3 text-gray-500 dark:text-gray-400 animate-pulse">
            <CircleDashed size={30} className="animate-spin text-gray-500 dark:text-gray-400 mx-auto" />
            Loading posts...
          </div>
        )}

        {!loading && posts.length > 0 && (
          <Slider {...sliderSettings} className="space-y-5">
            {posts.map((p) => (
              <div key={p._id}>
                <PostCard post={p} onLike={() => handleLike(p._id)} commentsCount={p.comments?.length || 0} />
              </div>
            ))}
          </Slider>
        )}

        {!loading && posts.length === 0 && (
          <div className="text-center text-gray-500 dark:text-gray-400 pt-10">
            No posts yet.
          </div>
        )}
      </div>
    </div>
  );
    }
