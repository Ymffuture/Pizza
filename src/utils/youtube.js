export const toYouTubeEmbed = (url) => {
  if (!url) return "";

  const match = url.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&?/]+)/ 
  );

  return match
    ? `https://www.youtube.com/embed/${match[1]}`
    : url;
};
