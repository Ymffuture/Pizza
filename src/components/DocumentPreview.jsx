import { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";

// Required for worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

export default function DocumentPreview({ url, name }) {
  const [numPages, setNumPages] = useState(null);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  return (
    <div className="p-4 border rounded-2xl bg-white shadow-sm">
      <p className="text-sm font-medium mb-2">{name || "Document"}</p>
      
      <div className="border rounded-lg overflow-hidden">
        <Document
          file={url}
          onLoadSuccess={onDocumentLoadSuccess}
          className="w-full"
        >
          {Array.from(new Array(numPages), (el, index) => (
            <Page
              key={`page_${index + 1}`}
              pageNumber={index + 1}
              width={400} // adjust width to fit card
              className="border-b"
            />
          ))}
        </Document>
      </div>

      <p className="text-xs text-gray-500 mt-2">
        Pages: {numPages || 0}
      </p>
    </div>
  );
}
