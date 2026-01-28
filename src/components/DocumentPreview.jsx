import { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';

// Set the PDF.js worker source (use a compatible version)
pdfjs.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.10.111/pdf.worker.min.js';

export default function DocumentPreview({ url, name }) {
  const [numPages, setNumPages] = useState(null);
  const isPDF = url?.toLowerCase().endsWith('.pdf');

  function onDocumentLoadSuccess({ numPages: pdfNumPages }) {
    setNumPages(pdfNumPages);
  }

  return (
    <div className="bg-white border rounded-2xl p-4 shadow-sm">
      <p className="text-sm font-medium mb-2 truncate">{name || 'Document'}</p>

      {isPDF ? (
        <div className="w-full h-[400px] border rounded-lg overflow-auto">
          <Document file={url} onLoadSuccess={onDocumentLoadSuccess}>
            {Array.from(new Array(numPages), (el, index) => (
              <Page key={`page_${index + 1}`} pageNumber={index + 1} />
            ))}
          </Document>
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
