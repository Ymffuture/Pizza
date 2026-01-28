import { Viewer, Worker } from "@vvelediaz/react-pdf-viewer";
import "pdfjs-dist/build/pdf.worker.entry";

export default function DocumentPreview({ url, name }) {
  const isPDF = url?.toLowerCase().endsWith(".pdf");

  return (
    <div className="bg-white border rounded-2xl p-4 shadow-sm">
      <p className="text-sm font-medium mb-2 truncate">{name || "Document"}</p>

      {isPDF ? (
        <div className="w-full h-[400px] border rounded-lg overflow-auto">
          <Worker workerUrl="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.10.111/pdf.worker.min.js">
            <Viewer fileUrl={url} />
          </Worker>
        </div>
      ) : (
        <img
          src={url}
          alt={name}
          className="w-full h-auto rounded-lg object-contain border"
        />
      )}
    </div>
  );
}
