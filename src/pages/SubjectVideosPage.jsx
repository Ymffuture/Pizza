import { useState, useMemo, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FiPlay, 
  FiBook, 
  FiChevronDown, 
  FiShare2, 
  FiCheck,
  FiClock,
  FiBarChart2,
  FiBookmark,
  FiMoreVertical
} from "react-icons/fi";
import { Helmet } from "react-helmet";
import { Tooltip, Badge, Skeleton, message, Dropdown } from "antd";
import { SUBJECT_VIDEOS } from "../data/subjectVideos";
import VideoPlayer from "../components/VideoPlayer";

// Custom hook for clipboard copying
const useClipboard = () => {
  const [copied, setCopied] = useState(false);
  
  const copy = useCallback(async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      return true;
    } catch (err) {
      return false;
    }
  }, []);
  
  return { copy, copied };
};

export default function SubjectVideosPage() {
  const [activeSubject, setActiveSubject] = useState("mathematics");
  const [activeTopicIndex, setActiveTopicIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(6);
  const [isLoading, setIsLoading] = useState(false);
  const [bookmarkedTopics, setBookmarkedTopics] = useState(new Set());
  const [completedTopics, setCompletedTopics] = useState(new Set());

  const scrollRef = useRef(null);
  const { copy, copied } = useClipboard();

  const subject = useMemo(
    () => SUBJECT_VIDEOS[activeSubject],
    [activeSubject]
  );

  const visibleTopics = useMemo(
    () => subject.topics.slice(0, visibleCount),
    [subject, visibleCount]
  );

  const activeTopic = useMemo(
    () => subject.topics[activeTopicIndex],
    [subject, activeTopicIndex]
  );

  const hasMore = visibleCount < subject.topics.length;
  const progress = Math.round((completedTopics.size / subject.topics.length) * 100);

  const handleSubjectChange = (key) => {
    setIsLoading(true);
    setActiveSubject(key);
    setActiveTopicIndex(0);
    setVisibleCount(6);
    scrollRef.current?.scrollTo({ top: 0, behavior: "smooth" });
    setTimeout(() => setIsLoading(false), 300);
  };

  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    if (scrollTop + clientHeight >= scrollHeight - 40 && hasMore) {
      setVisibleCount((prev) => prev + 6);
    }
  };

  const handleShare = async (platform = 'copy') => {
    const shareUrl = `${window.location.origin}/subjects/${activeSubject}/${activeTopic.id}`;
    const shareData = {
      title: activeTopic.title,
      text: `Check out this lesson: ${activeTopic.title}`,
      url: shareUrl,
    };

    if (platform === 'native' && navigator.share) {
      try {
        await navigator.share(shareData);
        message.success('Shared successfully!');
      } catch (err) {
        if (err.name !== 'AbortError') {
          message.error('Failed to share');
        }
      }
    } else {
      const success = await copy(shareUrl);
      if (success) {
        message.success('Link copied to clipboard!');
      } else {
        message.error('Failed to copy link');
      }
    }
  };

  const toggleBookmark = (topicId) => {
    setBookmarkedTopics(prev => {
      const next = new Set(prev);
      if (next.has(topicId)) {
        next.delete(topicId);
        message.success('Removed from bookmarks');
      } else {
        next.add(topicId);
        message.success('Added to bookmarks');
      }
      return next;
    });
  };

  const markAsComplete = (topicId) => {
    setCompletedTopics(prev => {
      const next = new Set(prev);
      if (next.has(topicId)) {
        next.delete(topicId);
      } else {
        next.add(topicId);
        message.success('Lesson marked as complete!');
      }
      return next;
    });
  };

  const shareMenuItems = [
    {
      key: 'copy',
      label: 'Copy Link',
      icon: copied ? <FiCheck className="text-green-500" /> : <FiShare2 />,
      onClick: () => handleShare('copy'),
    },
    ...(navigator.share ? [{
      key: 'native',
      label: 'Share via...',
      icon: <FiShare2 />,
      onClick: () => handleShare('native'),
    }] : []),
  ];

  return (
    <>
      <Helmet>
        <title>{`${activeTopic.title} | ${subject.label} Lessons`}</title>
        <meta name="description" content={activeTopic.description || `Learn ${subject.label} with video lessons`} />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-gray-100 pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          {/* Header Section */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
          >
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                🎓 Study Videos
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Master {subject.label} with curated video lessons
              </p>
            </div>
            
            {/* Progress Indicator */}
            <Tooltip title={`${completedTopics.size} of ${subject.topics.length} lessons completed`}>
              <div className="flex items-center gap-3 bg-white dark:bg-gray-800 px-4 py-2 rounded-full shadow-sm border border-gray-200 dark:border-gray-700">
                <FiBarChart2 className="text-blue-500" />
                <div className="flex items-center gap-2">
                  <div className="w-32 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                  <span className="text-sm font-medium">{progress}%</span>
                </div>
              </div>
            </Tooltip>
          </motion.div>

          {/* Subject Tabs */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide"
          >
            {Object.entries(SUBJECT_VIDEOS).map(([key, data]) => (
              <Tooltip 
                key={key} 
                title={`${data.topics.length} lessons available`}
                placement="top"
              >
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleSubjectChange(key)}
                  className={`px-5 py-2.5 rounded-xl border-2 whitespace-nowrap transition-all duration-200 flex items-center gap-2 ${
                    activeSubject === key
                      ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-500/25"
                      : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700"
                  }`}
                >
                  <FiBook className={activeSubject === key ? "text-white" : "text-blue-500"} />
                  <span className="font-medium">{data.label}</span>
                  <Badge 
                    count={data.topics.length} 
                    className="ml-1"
                    style={{ 
                      backgroundColor: activeSubject === key ? 'rgba(255,255,255,0.3)' : '#3b82f6',
                      color: activeSubject === key ? '#fff' : '#fff',
                      fontSize: '10px'
                    }}
                  />
                </motion.button>
              </Tooltip>
            ))}
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Topics Sidebar */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
            >
              <div className="p-5 border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
                <div className="flex items-center justify-between">
                  <h2 className="font-bold text-lg flex items-center gap-2">
                    <FiBook className="text-blue-500" />
                    {subject.label} Topics
                  </h2>
                  <Tooltip title="Your progress is automatically saved">
                    <FiClock className="text-gray-400 cursor-help" />
                  </Tooltip>
                </div>
              </div>

              <div
                ref={scrollRef}
                onScroll={handleScroll}
                className="h-[600px] overflow-y-auto custom-scrollbar"
              >
                {isLoading ? (
                  <div className="p-4 space-y-3">
                    {[...Array(5)].map((_, i) => (
                      <Skeleton key={i} active avatar paragraph={{ rows: 1 }} />
                    ))}
                  </div>
                ) : (
                  <div className="p-3 space-y-2">
                    <AnimatePresence>
                      {visibleTopics.map((topic, i) => {
                        const isActive = i === activeTopicIndex;
                        const isBookmarked = bookmarkedTopics.has(topic.id);
                        const isCompleted = completedTopics.has(topic.id);
                        
                        return (
                          <motion.div
                            key={topic.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ delay: i * 0.05 }}
                          >
                            <Tooltip 
                              title={topic.description || "Click to watch lesson"}
                              placement="right"
                              mouseEnterDelay={0.5}
                            >
                              <button
                                onClick={() => setActiveTopicIndex(i)}
                                className={`w-full text-left px-4 py-3 rounded-xl flex items-center gap-3 transition-all duration-200 group ${
                                  isActive
                                    ? "bg-blue-600 text-white shadow-lg shadow-blue-500/25 scale-[1.02]"
                                    : "bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700"
                                }`}
                              >
                                <div className={`p-2 rounded-lg ${
                                  isActive ? "bg-white/20" : "bg-white dark:bg-gray-600"
                                }`}>
                                  {isCompleted ? (
                                    <FiCheck className={isActive ? "text-white" : "text-green-500"} />
                                  ) : (
                                    <FiPlay className={isActive ? "text-white" : "text-blue-500"} />
                                  )}
                                </div>
                                
                                <div className="flex-1 min-w-0">
                                  <p className={`font-medium truncate ${
                                    isCompleted && !isActive ? "line-through opacity-60" : ""
                                  }`}>
                                    {topic.title}
                                  </p>
                                  {topic.duration && (
                                    <p className={`text-xs ${isActive ? "text-blue-100" : "text-gray-500"}`}>
                                      {topic.duration}
                                    </p>
                                  )}
                                </div>

                                {isBookmarked && (
                                  <FiBookmark className={`flex-shrink-0 ${isActive ? "text-white" : "text-yellow-500"}`} />
                                )}
                              </button>
                            </Tooltip>
                          </motion.div>
                        );
                      })}
                    </AnimatePresence>
                  </div>
                )}

                {hasMore && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setVisibleCount((prev) => prev + 6)}
                    className="m-4 w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm font-medium"
                  >
                    Load more lessons <FiChevronDown />
                  </motion.button>
                )}
              </div>
            </motion.div>

            {/* Video Player Area */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="lg:col-span-2 space-y-6"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTopic.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
                >
                  {/* Video Header */}
                  <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <motion.h2 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="text-2xl font-bold mb-2"
                        >
                          {activeTopic.title}
                        </motion.h2>
                        {activeTopic.description && (
                          <motion.p 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.1 }}
                            className="text-gray-600 dark:text-gray-400 leading-relaxed"
                          >
                            {activeTopic.description}
                          </motion.p>
                        )}
                      </div>
                      
                      {/* Action Buttons */}
                      <div className="flex items-center gap-2">
                        <Tooltip title={bookmarkedTopics.has(activeTopic.id) ? "Remove bookmark" : "Bookmark this lesson"}>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => toggleBookmark(activeTopic.id)}
                            className={`p-2.5 rounded-xl transition-colors ${
                              bookmarkedTopics.has(activeTopic.id)
                                ? "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400"
                                : "bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
                            }`}
                          >
                            <FiBookmark className={bookmarkedTopics.has(activeTopic.id) ? "fill-current" : ""} />
                          </motion.button>
                        </Tooltip>

                        <Tooltip title={completedTopics.has(activeTopic.id) ? "Mark as incomplete" : "Mark as complete"}>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => markAsComplete(activeTopic.id)}
                            className={`p-2.5 rounded-xl transition-colors ${
                              completedTopics.has(activeTopic.id)
                                ? "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
                                : "bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
                            }`}
                          >
                            <FiCheck />
                          </motion.button>
                        </Tooltip>

                        <Dropdown menu={{ items: shareMenuItems }} placement="bottomRight" arrow>
                          <Tooltip title="Share lesson">
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              className="p-2.5 rounded-xl bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                            >
                              <FiShare2 />
                            </motion.button>
                          </Tooltip>
                        </Dropdown>
                      </div>
                    </div>

                    {/* Topic Meta */}
                    <div className="flex items-center gap-4 mt-4 text-sm text-gray-500 dark:text-gray-400">
                      <span className="flex items-center gap-1">
                        <FiPlay className="text-blue-500" />
                        Lesson {activeTopicIndex + 1} of {subject.topics.length}
                      </span>
                      {activeTopic.duration && (
                        <span className="flex items-center gap-1">
                          <FiClock className="text-blue-500" />
                          {activeTopic.duration}
                        </span>
                      )}
                      {completedTopics.has(activeTopic.id) && (
                        <span className="flex items-center gap-1 text-green-600 dark:text-green-400">
                          <FiCheck /> Completed
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Video Player */}
                  <div className="aspect-video bg-black">
                    <VideoPlayer
                      url={activeTopic.video}
                      title={activeTopic.title}
                    />
                  </div>

                  {/* Navigation Footer */}
                  <div className="p-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700 flex justify-between">
                    <Tooltip title={activeTopicIndex > 0 ? "Previous lesson" : "No previous lesson"}>
                      <button
                        disabled={activeTopicIndex === 0}
                        onClick={() => setActiveTopicIndex(prev => prev - 1)}
                        className="px-4 py-2 rounded-lg bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                      >
                        ← Previous
                      </button>
                    </Tooltip>
                    
                    <Tooltip title={activeTopicIndex < subject.topics.length - 1 ? "Next lesson" : "Course completed!"}>
                      <button
                        disabled={activeTopicIndex === subject.topics.length - 1}
                        onClick={() => setActiveTopicIndex(prev => prev + 1)}
                        className="px-4 py-2 rounded-lg bg-blue-600 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors"
                      >
                        Next →
                      </button>
                    </Tooltip>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Additional Info Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-6 text-white shadow-xl"
              >
                <h3 className="font-bold text-lg mb-2">💡 Study Tip</h3>
                <p className="text-blue-100">
                  Take notes while watching and try to summarize the key points after each lesson. 
                  Practice makes perfect!
                </p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(156, 163, 175, 0.5);
          border-radius: 20px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: rgba(156, 163, 175, 0.8);
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </>
  );
}
