import { useState, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiPlay, FiBook, FiChevronDown } from "react-icons/fi";
import { Helmet } from "react-helmet";
import { SUBJECT_VIDEOS } from "../data/subjectVideos";
import VideoPlayer from "../components/VideoPlayer";

export default function SubjectVideosPage() {
  const [activeSubject, setActiveSubject] = useState("mathematics");
  const [activeTopicIndex, setActiveTopicIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(6);

  const scrollRef = useRef(null);

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

  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;

    if (scrollTop + clientHeight >= scrollHeight - 40 && hasMore) {
      setVisibleCount((prev) => prev + 6);
    }
  };

  return (
    <>
      <Helmet>
        <title>Lessons</title>
      </Helmet>

      <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 pt-20">
        <div className="max-w-6xl mx-auto p-6 space-y-6">
          <h1 className="text-2xl font-semibold">
            🎓 Study Videos by Subject
          </h1>

          {/* SUBJECT TABS */}
          <div className="flex gap-3 overflow-x-auto pb-2">
            {Object.entries(SUBJECT_VIDEOS).map(([key, data]) => (
              <button
                key={key}
                onClick={() => {
                  setActiveSubject(key);
                  setActiveTopicIndex(0);
                  setVisibleCount(6);
                  scrollRef.current?.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className={`px-4 py-2 rounded-lg border whitespace-nowrap transition ${
                  activeSubject === key
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 dark:bg-gray-800"
                }`}
              >
                <FiBook className="inline mr-2" />
                {data.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* SCROLLABLE TOPIC PANEL */}
            <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-xl">
              <h2 className="font-semibold mb-3">
                Topics — {subject.label}
              </h2>

              <div
                ref={scrollRef}
                onScroll={handleScroll}
                className="h-[520px] overflow-y-auto pr-2 space-y-2 custom-scrollbar"
              >
                {visibleTopics.map((topic, i) => (
                  <motion.button
                    key={topic.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    onClick={() => setActiveTopicIndex(i)}
                    className={`w-full text-left px-3 py-2 rounded-lg flex items-center gap-2 transition ${
                      i === activeTopicIndex
                        ? "bg-blue-600 text-white"
                        : "bg-white dark:bg-gray-700"
                    }`}
                  >
                    <FiPlay />
                    {topic.title}
                  </motion.button>
                ))}
              </div>

              {/* Fallback Load More Button */}
              {hasMore && (
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setVisibleCount((prev) => prev + 6)}
                  className="mt-4 w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-sm"
                >
                  Load more <FiChevronDown />
                </motion.button>
              )}
            </div>

            {/* VIDEO PLAYER */}
            <div className="md:col-span-2 space-y-4">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTopic.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <h2 className="text-xl font-semibold mb-2">
                    {activeTopic.title}
                  </h2>

                  {activeTopic.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      {activeTopic.description}
                    </p>
                  )}

                  <VideoPlayer
                    url={activeTopic.video}
                    title={activeTopic.title}
                  />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
