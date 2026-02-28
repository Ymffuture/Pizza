import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";

export function usePuterSpeechRecognition({
  language = "en-US",          // BCP-47 language code, e.g. "en-US", "zh-CN", "es-ES"
  autoStopMs = 15000,          // auto-stop after silence/inactivity
  continuous = true,           // keep listening until manual stop
  interimResults = true,       // show partial transcripts in real-time (browser only)
} = {}) {
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const timeoutRef = useRef(null);
  const audioContextRef = useRef(null);

  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [interimTranscript, setInterimTranscript] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeProvider, setActiveProvider] = useState(null);

  // ────────────────────────────────────────────────
  // Browser SpeechRecognition fallback (most reliable & free)
  // ────────────────────────────────────────────────
  const SpeechRecognition =
    window.SpeechRecognition ||
    window.webkitSpeechRecognition;

  const hasBrowserSupport = !!SpeechRecognition;

  const [isSupported, setIsSupported] = useState(
    hasBrowserSupport || !!window.puter?.ai?.transcribe
  );

  // Browser-based recognition
  const recognitionRef = useRef(null);

  const startBrowserRecognition = useCallback(() => {
    if (!hasBrowserSupport) return false;

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;

    recognition.continuous = continuous;
    recognition.interimResults = interimResults;
    recognition.lang = language;

    recognition.onresult = (event) => {
      let final = "";
      let interim = "";

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const transcriptPart = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          final += transcriptPart + " ";
        } else {
          interim += transcriptPart;
        }
      }

      setTranscript((prev) => (prev + " " + final).trim());
      setInterimTranscript(interim.trim());
    };

    recognition.onerror = (event) => {
      console.error("Browser STT error:", event.error);
      if (event.error === "no-speech" || event.error === "aborted") {
        // Ignore silent / aborted errors
      } else {
        toast.error(`Speech recognition error: ${event.error}`);
      }
      stop();
    };

    recognition.onend = () => {
      if (isRecording) {
        // Auto-restart if continuous mode
        recognition.start();
      } else {
        setIsRecording(false);
      }
    };

    try {
      recognition.start();
      setActiveProvider("browser");
      toast.success("Listening via browser…", { icon: "🎤", duration: 2000 });
      return true;
    } catch (err) {
      console.error("Browser recognition start failed:", err);
      return false;
    }
  }, [language, continuous, interimResults, isRecording]);

  // ────────────────────────────────────────────────
  // Puter.ai fallback (when browser not available or user prefers cloud)
  // ────────────────────────────────────────────────
  const blobToBase64 = useCallback((blob) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result?.split(",")[1]);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }, []);

  const transcribeWithPuter = useCallback(async (audioBlob) => {
    if (!window.puter?.ai?.transcribe) {
      throw new Error("Puter.ai not available in this browser/environment");
    }

    setIsProcessing(true);
    try {
      const result = await window.puter.ai.transcribe(audioBlob, {
        language: language.split("-")[0], // e.g. "en", "zh"
      });
      return result?.text?.trim() || "";
    } finally {
      setIsProcessing(false);
    }
  }, [language]);

  // ────────────────────────────────────────────────
  // Start recording (MediaRecorder → Puter or fallback)
  // ────────────────────────────────────────────────
  const startMediaRecorder = useCallback(async () => {
    try {
      chunksRef.current = [];
      setTranscript("");
      setInterimTranscript("");
      setActiveProvider(null);

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 16000,
        },
      });

      const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
        ? "audio/webm;codecs=opus"
        : "audio/webm";

      const recorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = async () => {
        try {
          const blob = new Blob(chunksRef.current, { type: mimeType });
          if (blob.size < 1500) {
            toast.error("Audio too short — try speaking louder/longer");
            return;
          }

          toast.loading("Transcribing...", { id: "transcribe" });

          const text = await transcribeWithPuter(blob);

          toast.dismiss("transcribe");

          if (text) {
            setTranscript((prev) => (prev ? prev + " " + text : text).trim());
            toast.success("Transcribed with Puter.ai", { icon: "🎤" });
          } else {
            toast.error("No speech detected");
          }
        } catch (err) {
          toast.dismiss("transcribe");
          toast.error(err.message || "Transcription failed");
          console.error("Puter transcription error:", err);
        } finally {
          setIsProcessing(false);
          stream.getTracks().forEach((t) => t.stop());
        }
      };

      recorder.start(250); // chunks every 250ms
      setIsRecording(true);
      setActiveProvider("puter");
      toast.success("Recording… speak now", { icon: "🎤", duration: 2200 });

      timeoutRef.current = setTimeout(() => {
        if (recorder.state === "recording") stop();
      }, autoStopMs);
    } catch (err) {
      console.error("Start failed:", err);
      if (err.name === "NotAllowedError") {
        toast.error("Microphone permission denied");
      } else if (err.name === "NotFoundError") {
        toast.error("No microphone detected");
      } else {
        toast.error("Failed to start: " + err.message);
      }
    }
  }, [autoStopMs, transcribeWithPuter]);

  const start = useCallback(async () => {
    if (!isSupported) {
      toast.error("Speech recognition not supported in this browser");
      return;
    }

    // Prefer browser (faster, free, real-time)
    if (hasBrowserSupport && startBrowserRecognition()) {
      return;
    }

    // Fallback to Puter + MediaRecorder
    if (window.puter?.ai?.transcribe) {
      await startMediaRecorder();
    } else {
      toast.error("No speech provider available (browser or Puter)");
    }
  }, [isSupported, hasBrowserSupport, startBrowserRecognition, startMediaRecorder]);

  const stop = useCallback(() => {
    // Browser
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }

    // MediaRecorder
    if (mediaRecorderRef.current?.state === "recording") {
      mediaRecorderRef.current.stop();
    }

    if (mediaRecorderRef.current?.stream) {
      mediaRecorderRef.current.stream.getTracks().forEach((t) => t.stop());
    }

    clearTimeout(timeoutRef.current);
    setIsRecording(false);
    setInterimTranscript("");
  }, []);

  const toggle = useCallback(() => {
    if (isRecording) stop();
    else start();
  }, [isRecording, start, stop]);

  // Cleanup
  useEffect(() => {
    return () => {
      stop();
      if (audioContextRef.current) {
        audioContextRef.current.close().catch(() => {});
      }
    };
  }, [stop]);

  return {
    transcript,             // final text
    interimTranscript,      // real-time partial (browser only)
    isRecording,
    isProcessing,
    isSupported,
    activeProvider,         // "browser" | "puter"
    start,
    stop,
    toggle,
    reset: useCallback(() => {
      setTranscript("");
      setInterimTranscript("");
    }, []),
  };
}
