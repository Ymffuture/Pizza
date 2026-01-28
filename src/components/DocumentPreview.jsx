import { useState } from "react";

export default function DocumentPreview({ url, name }) {
  const [showModal, setShowModal] = useState(false);

  if (!url) return null;

  return (
    <div className="bg-white border rounded-2xl p-4 shadow-sm">
      {/* Document header */}
      <div className="flex justify-between items-center mb-2">
        <p className="text-sm font-medium truncate">{name || "Document"}</p>
        <button
          onClick={() => setShowModal(true)}
          className="text-blue-600 text-xs font-semibold hover:underline"
        >
          View Online
        </button>
      </div>

      {/* Optional small preview for images */}
      {url.match(/\.(jpeg|jpg|png|gif)$/i) && (
        <img
          src={url}
          alt={name}
          className="w-full h-auto rounded-lg object-contain border"
        />
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl w-[90%] max-w-3xl h-[90%] p-4 flex flex-col">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-medium">{name || "Document"}</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700 font-bold"
              >
                ✕
              </button>
            </div>

            {/* iframe for online view */}
            <iframe
              src={url}
              className="flex-1 w-full border rounded-lg"
              title={name || "Document"}
            />
          </div>
        </div>
      )}
    </div>
  );
}
