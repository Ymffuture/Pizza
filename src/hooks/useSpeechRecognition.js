import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";

export function usePuterSpeechRecognition({
  language = "en",
  autoStopMs = 15000,
} = {}) {
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const timeoutRef = useRef(null);

  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [isSupported, setIsSupported] = useState(
    typeof window !== "undefined" &&
      navigator.mediaDevices &&
      window.puter
  );

  const start = useCallback(async () => {
    if (!isSupported) {
      toast.error("Speech recognition not supported");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      chunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size) chunksRef.current.push(e.data);
      };

      recorder.onstop = async () => {
        try {
          const audioBlob = new Blob(chunksRef.current, {
            type: "audio/webm",
          });

          const result = await window.puter.ai.transcribe(audioBlob, {
            language,
          });

          if (!result?.text) {
            toast.error("No speech detected");
            return;
          }

          setTranscript((prev) => prev + result.text + " ");
        } catch (err) {
          console.error(err);
          toast.error("Transcription failed");
        }
      };

      recorder.start();
      setIsRecording(true);

      timeoutRef.current = setTimeout(stop, autoStopMs);
    } catch (err) {
      console.error(err);
      toast.error("Microphone access denied");
    }
  }, [isSupported, language, autoStopMs]);

  const stop = useCallback(() => {
    if (!mediaRecorderRef.current) return;

    mediaRecorderRef.current.stop();
    mediaRecorderRef.current.stream
      .getTracks()
      .forEach((track) => track.stop());

    clearTimeout(timeoutRef.current);
    setIsRecording(false);
  }, []);

  const toggle = () => {
    isRecording ? stop() : start();
  };

  useEffect(() => {
    return () => {
      clearTimeout(timeoutRef.current);
      mediaRecorderRef.current?.stop();
    };
  }, []);

  return {
    transcript,
    isRecording,
    isSupported,
    start,
    stop,
    toggle,
    reset: () => setTranscript(""),
  };
}
