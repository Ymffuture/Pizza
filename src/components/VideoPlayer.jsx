import { toYouTubeEmbed } from "../utils/youtube";

export default function VideoPlayer({ url, title }) {
  const embedUrl = toYouTubeEmbed(url);

  return (
    <div className="w-full aspect-video bg-black rounded-xl overflow-hidden shadow-lg">
      <iframe
        src={embedUrl}
        title={title}
        className="w-full h-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        loading="lazy"
      />
    </div>
  );
}
