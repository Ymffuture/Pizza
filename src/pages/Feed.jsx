import React, { useEffect, useState, useMemo } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import { api } from "../api";
import PostCard from "../components/PostCard";
import { CircleDashed, MessageCircle, Heart } from "lucide-react";
import toast from "react-hot-toast";
import likeSound from "../assets/noty.mp3";

const likeAudio = new Audio(likeSound);

/**
 * ======================================================
 * FEED COMPONENT
 * ======================================================
 * - Responsive (1 on mobile, 2 on desktop)
 * - 3D glow cards
 * - Animated comments count
 * - Optimized rendering
 */
export default function Feed() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ======================================================
     LOAD POSTS
  ====================================================== */
  useEffect(() => {
    let mounted = true;

    const loadPosts = async () => {
      try {
        const res = await api.get("/posts");
        if (mounted) setPosts(res.data || []);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load posts");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadPosts();
    return () => (mounted = false);
  }, []);

  /* ======================================================
     UPDATE COMMENTS COUNT
  ====================================================== */
  const updatePostComments = (postId, newComments) => {
    setPosts((prev) =>
      prev.map((p) =>
        p._id === postId ? { ...p, comments: newComments } : p
      )
    );
  };

  /* ======================================================
     LIKE HANDLER
  ====================================================== */
  const handleLikePost = async (postId) => {
    const token = localStorage.getItem("token");

    if (!token) {
      toast((t) => (
        <div className="flex flex-col gap-3">
          <span className="font-medium">
            You need to login to like posts
          </span>
          <button
            onClick={() => {
              toast.dismiss(t.id);
              window.location.href = "/login";
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold"
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
      const res = await api.post(`/posts/${postId}/toggle-like`);

      setPosts((prev) =>
        prev.map((p) =>
          p._id === postId
            ? { ...p, likes: Array(res.data.likesCount).fill(1) }
            : p
        )
      );

      toast.success(res.data.liked ? "Liked" : "Unliked");
    } catch {
      toast.error("Failed to like post");
    }
  };

  /* ======================================================
     SLIDER SETTINGS (RESPONSIVE)
  ====================================================== */
  const sliderSettings = useMemo(
    () => ({
      dots: true,
      infinite: true,
      speed: 800,
      autoplay: true,
      autoplaySpeed: 5500,
      pauseOnHover: true,
      arrows: false,
      slidesToShow: 1,
      slidesToScroll: 1,
      responsive: [
        {
          breakpoint: 1024,
          settings: {
            slidesToShow: 1,
          },
        },
        {
          breakpoint: 1280,
          settings: {
            slidesToShow: 2,
          },
        },
      ],
    }),
    []
  );

  /* ======================================================
     RENDER
  ====================================================== */
  return (
    <div className="bg-white dark:bg-black transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-4 py-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            🔹Feeds
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Latest posts from the community
          </p>
        </header>

        {/* ===================== LOADING ===================== */}
        {loading && (
          <div className="flex flex-col items-center gap-4 py-20">
            <CircleDashed className="w-10 h-10 animate-spin text-blue-500" />
            <span className="text-gray-500">Loading posts…</span>
          </div>
        )}

        {/* ===================== POSTS ===================== */}
        {!loading && posts.length > 0 && (
          <Slider {...sliderSettings}>
            {posts.map((post) => (
              <div key={post._id} className="px-3 py-4">
                <div className="feed-3d-card relative rounded-2xl p-[1px]">
                  {/* Glow Border */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500/40 via-purple-500/30 to-pink-500/40 blur-md opacity-70" />

                  {/* Card Content */}
                  <div className="relative rounded-2xl bg-white dark:bg-zinc-900 p-4">
                    {/* Comment Count */}
                    <div className="flex items-center justify-between mb-3">
                      <h2 className="comment-glow text-xl font-bold flex items-center gap-2">
                        <MessageCircle size={20} />
                        {post.comments?.length || "Log in to see"} Comments
                      </h2>

                      <div className="flex items-center gap-2 text-pink-500">
                        <Heart size={18} />
                        <span className="font-medium">
                          {post.likes?.length || 0}
                        </span>
                      </div>
                    </div>

                    <PostCard
                      post={post}
                      onLike={() => handleLikePost(post._id)}
                      commentsCount={post.comments?.length || 0}
                      api={api}
                      updatePostComments={updatePostComments}
                    />
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        )}

        {/* ===================== EMPTY ===================== */}
        {!loading && posts.length === 0 && (
          <div className="text-center text-gray-500 dark:text-gray-400 py-20">
            No posts yet.
          </div>
        )}
      </div>

      {/* ===================== STYLES ===================== */}
      <style>{`
        .feed-3d-card {
          perspective: 1200px;
        }

        .feed-3d-card > div {
          transform-style: preserve-3d;
          transition: transform 0.6s ease, box-shadow 0.6s ease;
          will-change: transform;
        }

        .feed-3d-card:hover > div {
          transform: rotateX(6deg) rotateY(-6deg) translateZ(18px);
          box-shadow: 0 30px 80px rgba(0,0,0,0.35);
        }

        .comment-glow {
          color: #60a5fa;
          text-shadow:
            0 0 8px rgba(96,165,250,0.8),
            0 0 16px rgba(96,165,250,0.6),
            0 0 32px rgba(96,165,250,0.4);
          animation: pulseGlow 3s ease-in-out infinite;
        }

        @keyframes pulseGlow {
          0%, 100% {
            text-shadow:
              0 0 6px rgba(96,165,250,0.6),
              0 0 14px rgba(96,165,250,0.4);
          }
          50% {
            text-shadow:
              0 0 14px rgba(96,165,250,0.9),
              0 0 28px rgba(96,165,250,0.6);
          }
        }
      `}</style>
    </div>
  );
}
