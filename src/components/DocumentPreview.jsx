// components/DocumentPreview.jsx
export default function DocumentPreview({ url }) {
return (
<iframe
src={url}
className="w-full h-96 border"
sandbox="allow-same-origin allow-scripts"
/>
);
}
