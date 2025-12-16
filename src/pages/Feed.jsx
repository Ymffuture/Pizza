import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { api } from "../api";
import PostCard from "../components/PostCard";
import { CircleDashed } from "lucide-react";
import toast from "react-hot-toast";
import likeSound from "../assets/noty.mp3"; // short like sound

const likeAudio = new Audio(likeSound);

export default function Feed() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load posts
  useEffect(() => {
    const loadPosts = async () => {
      try {
        const res = await api.get("/posts"); // fetch first page or all
        setPosts(res.data);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load posts");
      } finally {
        setLoading(false);
      }
    };
    loadPosts();
  }, []);

  // Update post comments in state
  const updatePostComments = (postId, newComments) => {
    setPosts((prev) =>
      prev.map((p) => (p._id === postId ? { ...p, comments: newComments } : p))
    );
  };

  // Like a post
  const handleLikePost = async (postId) => {
    const isLoggedIn = !!localStorage.getItem("token");
    if (!isLoggedIn) {
      toast((t) => (
        <div className="flex flex-col gap-3">
          <span>You need to login to like posts</span>
          <button
            onClick={() => {
              toast.dismiss(t.id);
              window.location.href = "/login";
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium"
          >
            Login Now
          </button>
        </div>
      ));
      return;
    }

    likeAudio.currentTime = 0;
    likeAudio.play().catch(() => {});

    try {
      const r = await api.post(`/posts/${postId}/toggle-like`);
      setPosts((prev) =>
        prev.map((p) =>
          p._id === postId
            ? { ...p, likes: Array(r.data.likesCount).fill(1) }
            : p
        )
      );
      toast(r.data.liked ? "Liked post" : "Unliked post");
    } catch {
      toast.error("Failed to like post");
    }
  };

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 1000,
    autoplay: true,
    autoplaySpeed: 6000,
    fade: true,
    cssEase: "linear",
    pauseOnHover: true,
    arrows: false,
  };

  return (
    <div className="bg-white dark:bg-black transition-colors duration-300">
      <div className="mx-auto max-w-[490px] px-4 pt-6 pb-4">
        <h2 className="text-[26px] font-semibold text-gray-900 dark:text-white mb-6">
          Feed
        </h2>

        {loading && (
          <div className="text-center gap-3 text-gray-500 dark:text-gray-400 animate-pulse">
            <CircleDashed
              size={30}
              className="animate-spin text-gray-500 dark:text-gray-400 mx-auto"
            />
            Loading posts...
          </div>
        )}

        {!loading && posts.length > 0 && (
          <Slider {...sliderSettings}>
            {posts.map((post) => (
              <div key={post._id} className="px-2">
                <PostCard
                  post={post}
                  onLike={() => handleLikePost(post._id)}
                  commentsCount={post.comments?.length || 0}
                  api={api}
                  updatePostComments={updatePostComments}
                />
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
