import { useEffect, useRef, useState, useCallback } from "react";
import { toast } from "react-hot-toast";

export function useSpeechRecognition({
  lang = "en-US",
  continuous = true,
} = {}) {
  const recognitionRef = useRef(null);
  const isManuallyStoppedRef = useRef(false);

  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [interim, setInterim] = useState("");

  const isSupported =
    typeof window !== "undefined" &&
    (window.SpeechRecognition || window.webkitSpeechRecognition);

  const createRecognition = useCallback(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    const recognition = new SpeechRecognition();
    recognition.lang = lang;
    recognition.continuous = continuous;
    recognition.interimResults = true;

    recognition.onresult = (event) => {
      let finalText = "";
      let interimText = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const text = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalText += text;
        } else {
          interimText += text;
        }
      }

      if (finalText) {
        setTranscript((prev) => prev + finalText + " ");
      }

      setInterim(interimText);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);

      switch (event.error) {
        case "not-allowed":
          toast.error("Microphone permission denied");
          break;
        case "no-speech":
          toast("No speech detected");
          break;
        case "audio-capture":
          toast.error("No microphone found");
          break;
        default:
          toast.error("Speech recognition error");
      }

      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
      setInterim("");

      // Auto-restart if continuous and not manually stopped
      if (continuous && !isManuallyStoppedRef.current) {
        try {
          recognition.start();
          setIsListening(true);
        } catch {
          // Chrome can throw if restarting too fast
        }
      }
    };

    return recognition;
  }, [lang, continuous]);

  const start = useCallback(() => {
    if (!isSupported) {
      toast.error("Speech recognition not supported");
      return;
    }

    if (!window.isSecureContext && location.hostname !== "localhost") {
      toast.error("Speech recognition requires HTTPS");
      return;
    }

    if (isListening) return;

    isManuallyStoppedRef.current = false;

    const recognition = createRecognition();
    recognitionRef.current = recognition;

    try {
      recognition.start();
      setIsListening(true);
    } catch (err) {
      console.error("Failed to start recognition:", err);
      toast.error("Failed to start voice recognition");
    }
  }, [isSupported, isListening, createRecognition]);

  const stop = useCallback(() => {
    isManuallyStoppedRef.current = true;
    recognitionRef.current?.stop();
    setIsListening(false);
    setInterim("");
  }, []);

  const toggle = () => {
    isListening ? stop() : start();
  };

  useEffect(() => {
    return () => {
      isManuallyStoppedRef.current = true;
      recognitionRef.current?.stop();
    };
  }, []);

  return {
    transcript,
    interim, // 🔥 live text while speaking
    isListening,
    isSupported,
    start,
    stop,
    toggle,
    reset: () => {
      setTranscript("");
      setInterim("");
    },
  };
}
