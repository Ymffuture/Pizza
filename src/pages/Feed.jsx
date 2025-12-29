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
            <svg
  width="300"
  height="20"
  viewBox="0 0 300 20"
  xmlns="http://www.w3.org/2000/svg"
  role="progressbar"
  aria-busy="true"
>
  
  <rect
    x="0"
    y="9"
    width="300"
    height="2"
    fill="#e0e0e0"
  />

  
  <rect y="9" height="2" fill="#1a73e8">
    <animate
      attributeName="x"
      values="-150;300"
      dur="2s"
      repeatCount="indefinite"
      keyTimes="0;1"
      keySplines="0.4 0 0.2 1"
      calcMode="spline"
    />
    <animate
      attributeName="width"
      values="30;180;30"
      dur="2s"
      repeatCount="indefinite"
      keyTimes="0;0.5;1"
      keySplines="0.4 0 0.2 1;0.4 0 0.2 1"
      calcMode="spline"
    />
  </rect>

  
  <rect y="9" height="2" fill="#1a73e8" opacity="0.6">
    <animate
      attributeName="x"
      values="-200;300"
      dur="2s"
      begin="0.9s"
      repeatCount="indefinite"
      keyTimes="0;1"
      keySplines="0.4 0 0.2 1"
      calcMode="spline"
    />
    <animate
      attributeName="width"
      values="20;120;20"
      dur="2s"
      begin="0.9s"
      repeatCount="indefinite"
      keyTimes="0;0.5;1"
      keySplines="0.4 0 0.2 1;0.4 0 0.2 1"
      calcMode="spline"
    />
  </rect>
</svg>

            Loading posts...
          </div>
        )}

        {!loading && posts.length > 0 && (
          <Slider {...sliderSettings}>
            {posts.map((post) => (
  <div key={post._id} className="px-2">
    <div className="feed-3d-card">
      <PostCard
        post={post}
        onLike={() => handleLikePost(post._id)}
        commentsCount={post.comments?.length || 0}
        api={api}
        updatePostComments={updatePostComments}
      />
    </div>
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
