import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiPlay, FiBook } from "react-icons/fi";

import { SUBJECT_VIDEOS } from "../data/subjectVideos";
import VideoPlayer from "../components/VideoPlayer";

export default function SubjectVideosPage() {
  const [activeSubject, setActiveSubject] = useState("mathematics");
  const [activeTopicIndex, setActiveTopicIndex] = useState(0);

  const subject = useMemo(
    () => SUBJECT_VIDEOS[activeSubject],
    [activeSubject]
  );

  const activeTopic = useMemo(
    () => subject.topics[activeTopicIndex],
    [subject, activeTopicIndex]
  );

  return (
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
              }}
              className={`px-4 py-2 rounded-lg border whitespace-nowrap ${
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
          {/* TOPIC LIST */}
          <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-xl">
            <h2 className="font-semibold mb-3">
              Topics — {subject.label}
            </h2>

            <div className="space-y-2">
              {subject.topics.map((topic, i) => (
                <button
                  key={topic.id}
                  onClick={() => setActiveTopicIndex(i)}
                  className={`w-full text-left px-3 py-2 rounded-lg flex items-center gap-2 ${
                    i === activeTopicIndex
                      ? "bg-blue-600 text-white"
                      : "bg-white dark:bg-gray-700"
                  }`}
                >
                  <FiPlay />
                  {topic.title}
                </button>
              ))}
            </div>
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
                <h2 className="text-xl font-semibold mb-3">
                  {activeTopic.title}
                </h2>

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
  );
}
