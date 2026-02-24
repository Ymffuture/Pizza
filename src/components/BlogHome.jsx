import React, { useEffect, useState, useCallback, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  Heart, 
  Trash2, 
  Pencil, 
  MoreHorizontal, 
  Send, 
  MessageCircle, 
  Share2, 
  Bookmark, 
  Globe, 
  Users, 
  Lock,
  Image as ImageIcon,
  Smile,
  X,
  ChevronDown,
  Flag,
  Link2,
  Eye
} from "lucide-react";
import { 
  Tooltip, 
  Dropdown, 
  Menu, 
  Avatar, 
  Badge, 
  Modal, 
  Input,
  Button,
  Popover,
  Skeleton,
  Empty
} from "antd";
import { 
  LikeFilled, 
  LikeOutlined, 
  CommentOutlined, 
  ShareAltOutlined,
  SendOutlined,
  MoreOutlined
} from "@ant-design/icons";
import InfiniteScroll from "react-infinite-scroll-component";
import { api } from "../api";
import toast from "react-hot-toast";
import EditPostModal from "../pages/EditPost";
import ViewPostModal from "../pages/ViewPost";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { BsPatchCheckFill, BsThreeDots } from "react-icons/bs";
import { Helmet } from "react-helmet";
import { motion, AnimatePresence } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import EmojiPicker from "emoji-picker-react";

// Loading skeleton for posts
const PostSkeleton = () => (
  <div className="bg-white dark:bg-[#242526] rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 mb-4 p-4">
    <div className="flex items-center gap-3 mb-4">
      <Skeleton.Avatar active size={40} />
      <div className="flex-1">
        <Skeleton.Input active size="small" style={{ width: 120 }} />
        <Skeleton.Input active size="small" style={{ width: 80, marginTop: 4 }} />
      </div>
    </div>
    <Skeleton active paragraph={{ rows: 3 }} />
    <div className="mt-4 grid grid-cols-2 gap-2">
      <Skeleton.Image active style={{ height: 200 }} />
      <Skeleton.Image active style={{ height: 200 }} />
    </div>
  </div>
);

// Privacy badge component
const PrivacyBadge = ({ privacy }) => {
  const config = {
    public: { icon: Globe, text: "Public", color: "text-gray-500" },
    friends: { icon: Users, text: "Friends", color: "text-blue-500" },
    private: { icon: Lock, text: "Only me", color: "text-gray-500" }
  };
  
  const { icon: Icon, text, color } = config[privacy] || config.public;
  
  return (
    <div className={`flex items-center gap-1 text-xs ${color}`}>
      <Icon size={12} />
      <span>{text}</span>
    </div>
  );
};

// Reaction button component
const ReactionButton = ({ icon: Icon, count, active, onClick, label, color }) => (
  <Tooltip title={label}>
    <motion.button
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all flex-1 justify-center ${active ? color : 'text-gray-600 dark:text-gray-400'}`}
    >
      <Icon size={20} className={active ? "fill-current" : ""} />
      <span className="text-sm font-medium">{count > 0 && count}</span>
    </motion.button>
  </Tooltip>
);

// Image grid component for multiple images
const ImageGrid = ({ images, onImageClick }) => {
  if (!images || images.length === 0) return null;
  
  const getGridClass = (count) => {
    if (count === 1) return "grid-cols-1";
    if (count === 2) return "grid-cols-2";
    if (count === 3) return "grid-cols-2";
    return "grid-cols-2";
  };
  
  return (
    <div className={`grid ${getGridClass(images.length)} gap-1 mt-3 rounded-xl overflow-hidden`}>
      {images.slice(0, 4).map((img, i) => (
        <motion.div
          key={i}
          whileHover={{ scale: 1.02 }}
          className={`relative ${images.length === 3 && i === 0 ? "row-span-2" : "aspect-square"} bg-gray-100 dark:bg-gray-800 cursor-pointer`}
          onClick={() => onImageClick(i)}
        >
          <img
            src={img}
            alt={`Post image ${i + 1}`}
            className="w-full h-full object-cover"
            loading="lazy"
            onError={(e) => {
              e.target.src = "https://swiftmeta.vercel.app/pp.jpeg";
            }}
          />
          {images.length > 4 && i === 3 && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white text-2xl font-bold">
              +{images.length - 4}
            </div>
          )}
        </motion.div>
      ))}
    </div>
  );
};

// Share menu component
const ShareMenu = ({ postUrl, title }) => {
  const handleCopyLink = () => {
    navigator.clipboard.writeText(postUrl);
    toast.success("Link copied to clipboard!");
  };

  const handleShare = (platform) => {
    const urls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(postUrl)}`,
      twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(postUrl)}&text=${encodeURIComponent(title)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(title + " " + postUrl)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(postUrl)}`
    };
    window.open(urls[platform], "_blank");
  };

  return (
    <Menu className="w-48">
      <Menu.Item key="copy" onClick={handleCopyLink} icon={<Link2 size={16} />}>
        Copy link
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="facebook" onClick={() => handleShare("facebook")}>
        Share to Facebook
      </Menu.Item>
      <Menu.Item key="twitter" onClick={() => handleShare("twitter")}>
        Share to Twitter
      </Menu.Item>
      <Menu.Item key="whatsapp" onClick={() => handleShare("whatsapp")}>
        Share to WhatsApp
      </Menu.Item>
      <Menu.Item key="linkedin" onClick={() => handleShare("linkedin")}>
        Share to LinkedIn
      </Menu.Item>
    </Menu>
  );
};

export default function BlogHome() {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [editingPostId, setEditingPostId] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [viewPostId, setViewPostId] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [activeCommentPost, setActiveCommentPost] = useState(null);
  const [shareModalVisible, setShareModalVisible] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const nav = useNavigate();

  const fetchPosts = useCallback(async () => {
    try {
      setIsLoading(true);
      const r = await api.get(`/posts?page=${page}`);
      if (r.data.length === 0) {
        setHasMore(false);
        return;
      }
      setPosts(prev => [...prev, ...r.data]);
    } catch (err) {
      toast.error("Failed to load posts");
    } finally {
      setIsLoading(false);
    }
  }, [page]);

  useEffect(() => { 
    fetchPosts(); 
  }, [fetchPosts]);

  const updatePostComments = (postId, newComments) => {
    setPosts(prev =>
      prev.map(p => (p._id === postId ? { ...p, comments: newComments } : p))
    );
  };

  const handleLike = async (post) => {
    try {
      const r = await api.post(`/posts/${post._id}/toggle-like`);
      const isLiked = r.data.liked;
      
      setPosts(prev =>
        prev.map(p => {
          if (p._id === post._id) {
            const newLikes = isLiked 
              ? [...(p.likes || []), { userId: "current" }]
              : (p.likes || []).filter(l => l.userId !== "current");
            return { ...p, likes: newLikes, isLiked };
          }
          return p;
        })
      );
      
      toast.success(isLiked ? "Liked!" : "Unliked");
    } catch {
      toast.error("Failed to like post");
    }
  };

  const handleShare = (post) => {
    setSelectedPost(post);
    setShareModalVisible(true);
  };

  const handleSave = async (postId) => {
    try {
      // API call to save post
      toast.success("Post saved!");
    } catch {
      toast.error("Failed to save post");
    }
  };

  const postMenu = (post) => (
    <Menu className="w-48 dark:bg-[#242526] dark:border-gray-700">
      <Menu.Item 
        key="edit" 
        icon={<Pencil size={16} />}
        onClick={() => {
          setEditingPostId(post._id);
          setShowEditModal(true);
        }}
      >
        Edit post
      </Menu.Item>
      <Menu.Item 
        key="save" 
        icon={<Bookmark size={16} />}
        onClick={() => handleSave(post._id)}
      >
        Save post
      </Menu.Item>
      <Menu.Divider className="dark:border-gray-700" />
      <Menu.Item 
        key="delete" 
        danger
        icon={<Trash2 size={16} />}
        onClick={async () => {
          Modal.confirm({
            title: "Delete post?",
            content: "Are you sure you want to delete this post? This action cannot be undone.",
            okText: "Delete",
            okType: "danger",
            cancelText: "Cancel",
            onOk: async () => {
              try {
                await api.delete(`/posts/${post._id}`);
                setPosts(posts.filter(p => p._id !== post._id));
                toast.success("Post deleted");
              } catch {
                toast.error("Failed to delete post");
              }
            }
          });
        }}
      >
        Delete post
      </Menu.Item>
      <Menu.Item key="report" icon={<Flag size={16} />}>
        Report post
      </Menu.Item>
    </Menu>
  );

  return (
    <>
      <Helmet>
        <title>Blog | SwiftMeta</title>
        <meta name="description" content="Explore free HTML, CSS, JavaScript, React, and Next.js projects to practice web development skills." />
        <link rel="canonical" href="https://swiftmeta.vercel.app/dashboard/blog" />
      </Helmet>

      <main className="min-h-screen bg-[#f0f2f5] dark:bg-[#18191a] pt-20 pb-28">
        <div className="max-w-[680px] mx-auto px-4">
          
          {/* Create Post Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-[#242526] rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-4"
          >
            <div className="flex items-center gap-3">
              <Avatar 
                size={40} 
                src="https://swiftmeta.vercel.app/pp.jpeg"
                className="cursor-pointer"
              />
              <div 
                className="flex-1 bg-gray-100 dark:bg-[#3a3b3c] hover:bg-gray-200 dark:hover:bg-[#4e4f50] rounded-full px-4 py-2.5 cursor-pointer transition-colors"
                onClick={() => nav("/dashboard/blog/new")}
              >
                <span className="text-gray-500 dark:text-gray-400 text-sm">What's on your mind?</span>
              </div>
            </div>
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-[#3a3b3c] transition-colors text-gray-600 dark:text-gray-400">
                <ImageIcon size={20} className="text-green-500" />
                <span className="text-sm font-medium">Photo/Video</span>
              </button>
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-[#3a3b3c] transition-colors text-gray-600 dark:text-gray-400">
                <Smile size={20} className="text-yellow-500" />
                <span className="text-sm font-medium">Feeling/Activity</span>
              </button>
            </div>
          </motion.div>

          {/* Posts Feed */}
          <InfiniteScroll
            dataLength={posts.length}
            next={() => setPage(prev => prev + 1)}
            hasMore={hasMore}
            loader={<PostSkeleton />}
            endMessage={
              <div className="text-center py-8 text-gray-500 text-sm">
                No more posts to show
              </div>
            }
          >
            <AnimatePresence>
              {posts.map((post, index) => (
                <motion.article
                  key={post._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white dark:bg-[#242526] rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 mb-4 overflow-hidden"
                >
                  {/* Post Header */}
                  <div className="p-4 flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <Tooltip title="View profile">
                        <Avatar
                          size={40}
                          src={post.author?.avatar || "https://swiftmeta.vercel.app/pp.jpeg"}
                          className="cursor-pointer border-2 border-transparent hover:border-blue-500 transition-all"
                          onClick={() => nav(`/posts/${post.author?._id}`)}
                        />
                      </Tooltip>
                      
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h3 
                            className="font-semibold text-[15px] text-gray-900 dark:text-white hover:underline cursor-pointer"
                            onClick={() => nav(`/posts/${post.author?._id}`)}
                          >
                            {post.author?.name || "Anonymous"}
                          </h3>
                          {post.author?.verified && (
                            <BsPatchCheckFill className="text-blue-500 text-sm" />
                          )}
                        </div>
                        
                        <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                          <Tooltip title={new Date(post.createdAt).toLocaleString()}>
                            <span className="hover:underline cursor-pointer">
                              {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                            </span>
                          </Tooltip>
                          <span>·</span>
                          <PrivacyBadge privacy={post.privacy || "public"} />
                        </div>
                      </div>
                    </div>

                    <Dropdown overlay={postMenu(post)} placement="bottomRight" trigger={["click"]}>
                      <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-[#3a3b3c] transition-colors text-gray-500">
                        <MoreHorizontal size={20} />
                      </button>
                    </Dropdown>
                  </div>

                  {/* Post Content */}
                  <div className="px-4 pb-3">
                    <h2 
                      className="text-[17px] font-semibold text-gray-900 dark:text-white mb-2 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                      onClick={() => {
                        setViewPostId(post._id);
                        setShowViewModal(true);
                      }}
                    >
                      {post.title}
                    </h2>
                    
                    <div className="text-[15px] text-gray-700 dark:text-gray-300 leading-relaxed">
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                          p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                          code: ({ node, inline, className, children, ...props }) => {
                            const match = /language-(\w+)/.exec(className || '');
                            return !inline && match ? (
                              <div className="rounded-lg overflow-hidden my-2 bg-[#1e1e1e]">
                                <div className="flex items-center justify-between px-3 py-2 bg-[#2d2d2d] text-xs text-gray-400">
                                  <span>{match[1]}</span>
                                  <button 
                                    onClick={() => {
                                      navigator.clipboard.writeText(String(children));
                                      toast.success("Copied!");
                                    }}
                                    className="hover:text-white"
                                  >
                                    Copy
                                  </button>
                                </div>
                                <pre className="p-3 overflow-x-auto text-sm text-gray-300">
                                  <code {...props}>{children}</code>
                                </pre>
                              </div>
                            ) : (
                              <code className="bg-gray-200 dark:bg-[#3a3b3c] px-1.5 py-0.5 rounded text-sm font-mono" {...props}>
                                {children}
                              </code>
                            );
                          }
                        }}
                      >
                        {post.body}
                      </ReactMarkdown>
                    </div>
                  </div>

                  {/* Images */}
                  {post.images?.length > 0 && (
                    <ImageGrid 
                      images={post.images} 
                      onImageClick={(idx) => {
                        setViewPostId(post._id);
                        setShowViewModal(true);
                      }}
                    />
                  )}

                  {/* Engagement Stats */}
                  <div className="px-4 py-2 flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-1">
                      {post.likes?.length > 0 && (
                        <>
                          <div className="flex -space-x-1">
                            <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center">
                              <LikeFilled className="text-white text-xs" />
                            </div>
                          </div>
                          <span>{post.likes.length}</span>
                        </>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      {post.comments?.length > 0 && (
                        <span className="hover:underline cursor-pointer">
                          {post.comments.length} comments
                        </span>
                      )}
                      {post.shares?.length > 0 && (
                        <span>{post.shares.length} shares</span>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="px-2 py-1 flex items-center justify-between">
                    <ReactionButton
                      icon={post.isLiked ? LikeFilled : LikeOutlined}
                      count={post.likes?.length || 0}
                      active={post.isLiked}
                      onClick={() => handleLike(post)}
                      label="Like"
                      color="text-blue-600"
                    />
                    <ReactionButton
                      icon={CommentOutlined}
                      count={post.comments?.length || 0}
                      active={activeCommentPost === post._id}
                      onClick={() => setActiveCommentPost(activeCommentPost === post._id ? null : post._id)}
                      label="Comment"
                      color="text-green-600"
                    />
                    <Dropdown overlay={<ShareMenu postUrl={`${window.location.origin}/dashboard/blog/posts/${post._id}`} title={post.title} />} placement="topCenter">
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-[#3a3b3c] transition-all flex-1 justify-center text-gray-600 dark:text-gray-400"
                      >
                        <ShareAltOutlined size={20} />
                      </motion.button>
                    </Dropdown>
                  </div>

                  {/* Comments Section */}
                  <AnimatePresence>
                    {activeCommentPost === post._id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#18191a] px-4 py-3"
                      >
                        <CommentBox 
                          postId={post._id} 
                          onCommentUpdate={updatePostComments}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.article>
              ))}
            </AnimatePresence>
          </InfiniteScroll>
        </div>

        {/* Modals */}
        <EditPostModal
          postId={editingPostId}
          visible={showEditModal}
          onClose={() => setShowEditModal(false)}
          onUpdated={() => {
            setPosts([]);
            setPage(1);
            setHasMore(true);
            fetchPosts();
          }}
        />
        
        <ViewPostModal
          postId={viewPostId}
          visible={showViewModal}
          onClose={() => setShowViewModal(false)}
        />

        {/* Share Modal */}
        <Modal
          title="Share"
          visible={shareModalVisible}
          onCancel={() => setShareModalVisible(false)}
          footer={null}
          centered
        >
          {selectedPost && (
            <ShareMenu 
              postUrl={`${window.location.origin}/dashboard/blog/posts/${selectedPost._id}`}
              title={selectedPost.title}
            />
          )}
        </Modal>
      </main>
    </>
  );
}

// Enhanced Comment Box Component
function CommentBox({ postId, onCommentUpdate }) {
  const [text, setText] = useState("");
  const [comments, setComments] = useState([]);
  const [replyText, setReplyText] = useState({});
  const [replyingTo, setReplyingTo] = useState(null);
  const [showAll, setShowAll] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const fetchComments = async () => {
    try {
      const r = await api.get(`/posts/${postId}`);
      const data = r.data.comments || [];
      setComments(data);
      onCommentUpdate(postId, data);
    } catch {
      toast.error("Failed to load comments");
    }
  };

  const sendComment = async () => {
    if (!text.trim()) return;
    try {
      const r = await api.post(`/posts/${postId}/comments`, { text });
      const newComments = [...comments, r.data];
      setComments(newComments);
      onCommentUpdate(postId, newComments);
      setText("");
      toast.success("Comment posted!");
    } catch {
      toast.error("Failed to post comment");
    }
  };

  const onEmojiClick = (emojiData) => {
    setText(prev => prev + emojiData.emoji);
    setShowEmoji(false);
    inputRef.current?.focus();
  };

  return (
    <div className="space-y-3">
      {/* Comment Input */}
      <div className="flex gap-2">
        <Avatar size={32} src="https://swiftmeta.vercel.app/pp.jpeg" />
        <div className="flex-1 relative">
          <div className="flex items-center bg-white dark:bg-[#242526] rounded-full border border-gray-200 dark:border-gray-600 px-3 py-2 focus-within:border-blue-500 transition-colors">
            <input
              ref={inputRef}
              value={text}
              onChange={e => setText(e.target.value)}
              onKeyPress={e => e.key === "Enter" && sendComment()}
              placeholder="Write a comment..."
              className="flex-1 bg-transparent outline-none text-sm dark:text-white"
            />
            <Popover
              content={<EmojiPicker onEmojiClick={onEmojiClick} width={300} height={400} />}
              trigger="click"
              open={showEmoji}
              onOpenChange={setShowEmoji}
              placement="topRight"
            >
              <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full text-gray-500">
                <Smile size={18} />
              </button>
            </Popover>
            <button
              onClick={sendComment}
              disabled={!text.trim()}
              className="ml-2 p-1.5 bg-blue-500 text-white rounded-full disabled:opacity-50 hover:bg-blue-600 transition-colors"
            >
              <Send size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Comments List */}
      <div className="space-y-3">
        {(showAll ? comments : comments.slice(0, 2)).map(comment => (
          <CommentItem
            key={comment._id}
            comment={comment}
            postId={postId}
            onUpdate={fetchComments}
          />
        ))}
      </div>

      {comments.length > 2 && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 font-medium"
        >
          {showAll ? "Show less" : `View ${comments.length - 2} more comments`}
        </button>
      )}
    </div>
  );
}

// Individual Comment Component
function CommentItem({ comment, postId, onUpdate }) {
  const [isLiked, setIsLiked] = useState(false);
  const [showReply, setShowReply] = useState(false);
  const [replyText, setReplyText] = useState("");

  const handleLike = async () => {
    try {
      await api.post(`/posts/${postId}/comments/${comment._id}/toggle-like`);
      setIsLiked(!isLiked);
      onUpdate();
    } catch {
      toast.error("Failed to like");
    }
  };

  const handleReply = async () => {
    if (!replyText.trim()) return;
    try {
      await api.post(`/posts/${postId}/comments/${comment._id}/replies`, { text: replyText });
      setReplyText("");
      setShowReply(false);
      onUpdate();
      toast.success("Reply posted!");
    } catch {
      toast.error("Failed to reply");
    }
  };

  const handleDelete = async () => {
    Modal.confirm({
      title: "Delete comment?",
      content: "This action cannot be undone.",
      okText: "Delete",
      okType: "danger",
      onOk: async () => {
        try {
          await api.delete(`/posts/${postId}/comments/${comment._id}`);
          onUpdate();
          toast.success("Comment deleted");
        } catch {
          toast.error("Failed to delete");
        }
      }
    });
  };

  return (
    <div className="flex gap-2">
      <Avatar size={32} src={comment.author?.avatar || "https://swiftmeta.vercel.app/pp.jpeg"} />
      <div className="flex-1">
        <div className="bg-gray-100 dark:bg-[#3a3b3c] rounded-2xl px-3 py-2 inline-block max-w-full">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm text-gray-900 dark:text-white">
              {comment.author?.name}
            </span>
            {comment.author?.verified && <BsPatchCheckFill className="text-blue-500 text-xs" />}
          </div>
          <p className="text-sm text-gray-700 dark:text-gray-300 mt-0.5">{comment.text}</p>
        </div>
        
        {/* Comment Actions */}
        <div className="flex items-center gap-3 mt-1 ml-2 text-xs text-gray-500 dark:text-gray-400">
          <button 
            onClick={handleLike}
            className={`font-semibold hover:underline ${isLiked ? "text-blue-500" : ""}`}
          >
            Like {comment.likes?.length > 0 && `(${comment.likes.length})`}
          </button>
          <button 
            onClick={() => setShowReply(!showReply)}
            className="font-semibold hover:underline"
          >
            Reply
          </button>
          <span>{formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}</span>
          <button onClick={handleDelete} className="hover:underline text-red-500">
            Delete
          </button>
        </div>

        {/* Replies */}
        {comment.replies?.length > 0 && (
          <div className="mt-2 ml-4 space-y-2">
            {comment.replies.map(reply => (
              <div key={reply._id} className="flex gap-2">
                <Avatar size={24} src={reply.author?.avatar} />
                <div className="bg-gray-100 dark:bg-[#3a3b3c] rounded-2xl px-3 py-2 inline-block">
                  <span className="font-semibold text-xs text-gray-900 dark:text-white block">
                    {reply.author?.name}
                  </span>
                  <p className="text-xs text-gray-700 dark:text-gray-300">{reply.text}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Reply Input */}
        {showReply && (
          <div className="mt-2 flex gap-2">
            <Avatar size={24} src="https://swiftmeta.vercel.app/pp.jpeg" />
            <div className="flex-1 flex gap-2">
              <input
                value={replyText}
                onChange={e => setReplyText(e.target.value)}
                onKeyPress={e => e.key === "Enter" && handleReply()}
                placeholder="Write a reply..."
                className="flex-1 bg-white dark:bg-[#242526] border border-gray-200 dark:border-gray-600 rounded-full px-3 py-1.5 text-sm outline-none focus:border-blue-500 dark:text-white"
                autoFocus
              />
              <button
                onClick={handleReply}
                disabled={!replyText.trim()}
                className="p-1.5 bg-blue-500 text-white rounded-full disabled:opacity-50"
              >
                <Send size={12} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
