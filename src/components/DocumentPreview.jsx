export default function DocumentPreview({ url, name }) {
  const [showModal, setShowModal] = useState(false);

  if (!url) return null;

  const isImage = url.match(/\.(jpeg|jpg|png|gif)$/i);
  const isPDF = url.match(/\.pdf$/i);
  const isDoc = url.match(/\.(doc|docx)$/i);

  return (
    <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-2xl shadow-md mb-4">
      <div className="flex justify-between items-center">
        <p className="text-sm font-medium text-gray-800 dark:text-white truncate">
          {name || "Document"}
        </p>

        <button
          onClick={() => setShowModal(true)}
          className="text-blue-600 dark:text-blue-400 text-xs font-semibold hover:underline"
        >
          View
        </button>
      </div>

      {isImage && (
        <img
          src={url}
          alt={name}
          className="w-full h-auto mt-3 rounded-xl object-contain"
        />
      )}

      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-gray-50 dark:bg-gray-900 w-[90%] max-w-3xl h-[90%] p-6 rounded-3xl shadow-lg flex flex-col"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white truncate">
                  {name || "Document"}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 font-bold text-xl"
                >
                  ✕
                </button>
              </div>

              {isImage || isPDF ? (
                <iframe
                  src={url}
                  title={name || "Document"}
                  className="flex-1 w-full rounded-xl"
                />
              ) : isDoc ? (
                <div className="flex-1 flex items-center justify-center">
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 dark:text-blue-400 underline"
                  >
                    Download {name}
                  </a>
                </div>
              ) : (
                <p>Cannot preview this file type</p>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
