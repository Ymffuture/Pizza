export default function DocumentPreview({ url, name }) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="
        flex items-center gap-3
        p-4 rounded-xl border
        hover:bg-gray-50 transition
      "
    >
      <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-blue-100 text-blue-600">
        📄
      </div>

      <div className="flex-1">
        <p className="text-sm font-medium truncate">
          {name || "Document"}
        </p>
        <p className="text-xs text-gray-500">
          Click to view
        </p>
      </div>
    </a>
  );
}
