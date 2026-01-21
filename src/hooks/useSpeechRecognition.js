import { useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";

export function useSpeechRecognition({ lang = "en-US" } = {}) {
  const recognitionRef = useRef(null);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");

  const isSupported =
    typeof window !== "undefined" &&
    (window.SpeechRecognition || window.webkitSpeechRecognition);

  const start = () => {
    if (!isSupported) {
      toast.error("Speech recognition not supported in this browser");
      return;
    }

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    const recognition = new SpeechRecognition();
    recognition.lang = lang;
    recognition.continuous = false;
    recognition.interimResults = true;

    recognition.onresult = (event) => {
      const text = Array.from(event.results)
        .map((r) => r[0].transcript)
        .join("");
      setTranscript(text);
    };

    recognition.onerror = () => {
      toast.error("Voice recognition failed");
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
    recognitionRef.current = recognition;
    setIsListening(true);
  };

  const stop = () => {
    recognitionRef.current?.stop();
    setIsListening(false);
  };

  const toggle = () => {
    isListening ? stop() : start();
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => recognitionRef.current?.stop();
  }, []);

  return {
    transcript,
    isListening,
    isSupported,
    start,
    stop,
    toggle,
    reset: () => setTranscript(""),
  };
}
