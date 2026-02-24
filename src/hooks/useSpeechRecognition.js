import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";

// Kimi API Configuration
const KIMI_API_CONFIG = {
  baseURL: "https://api.moonshot.cn/v1",
  apiKey: process.env.REACT_APP_KIMI_API_KEY || "",
  model: "whisper-1", // Kimi's speech recognition model
};

export function usePuterSpeechRecognition({
  language = "en",
  autoStopMs = 15000,
  preferKimi = true, // Prefer Kimi API over Puter when available
} = {}) {
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const timeoutRef = useRef(null);
  const audioContextRef = useRef(null);

  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Check support for both Puter and Kimi
  const [isSupported, setIsSupported] = useState(() => {
    if (typeof window === "undefined") return false;
    
    const hasMediaDevices = !!navigator.mediaDevices?.getUserMedia;
    const hasPuter = !!window.puter?.ai?.transcribe;
    const hasKimi = !!KIMI_API_CONFIG.apiKey;
    
    return hasMediaDevices && (hasPuter || hasKimi);
  });

  const [activeProvider, setActiveProvider] = useState(null);

  // Convert audio blob to base64 for Kimi API
  const blobToBase64 = (blob) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result?.split(",")[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  // Convert WebM to WAV for better compatibility (Kimi prefers WAV)
  const convertToWav = async (audioBlob) => {
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      audioContextRef.current = audioContext;
      
      const arrayBuffer = await audioBlob.arrayBuffer();
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
      
      // Create WAV buffer
      const numberOfChannels = audioBuffer.numberOfChannels;
      const sampleRate = audioBuffer.sampleRate;
      const format = 1; // PCM
      const bitDepth = 16;
      
      const bytesPerSample = bitDepth / 8;
      const blockAlign = numberOfChannels * bytesPerSample;
      
      const dataLength = audioBuffer.length * numberOfChannels * bytesPerSample;
      const buffer = new ArrayBuffer(44 + dataLength);
      const view = new DataView(buffer);
      
      // WAV Header
      const writeString = (offset, string) => {
        for (let i = 0; i < string.length; i++) {
          view.setUint8(offset + i, string.charCodeAt(i));
        }
      };
      
      writeString(0, "RIFF");
      view.setUint32(4, 36 + dataLength, true);
      writeString(8, "WAVE");
      writeString(12, "fmt ");
      view.setUint32(16, 16, true);
      view.setUint16(20, format, true);
      view.setUint16(22, numberOfChannels, true);
      view.setUint32(24, sampleRate, true);
      view.setUint32(28, sampleRate * blockAlign, true);
      view.setUint16(32, blockAlign, true);
      view.setUint16(34, bitDepth, true);
      writeString(36, "data");
      view.setUint32(40, dataLength, true);
      
      // Write audio data
      const offset = 44;
      const channels = [];
      for (let i = 0; i < numberOfChannels; i++) {
        channels.push(audioBuffer.getChannelData(i));
      }
      
      let index = 0;
      for (let i = 0; i < audioBuffer.length; i++) {
        for (let channel = 0; channel < numberOfChannels; channel++) {
          const sample = Math.max(-1, Math.min(1, channels[channel][i]));
          const intSample = sample < 0 ? sample * 0x8000 : sample * 0x7FFF;
          view.setInt16(offset + index, intSample, true);
          index += 2;
        }
      }
      
      return new Blob([buffer], { type: "audio/wav" });
    } catch (err) {
      console.error("WAV conversion failed:", err);
      return audioBlob; // Fallback to original
    }
  };

  // Kimi API Transcription
  const transcribeWithKimi = async (audioBlob) => {
    try {
      setIsProcessing(true);
      
      // Convert to WAV for better accuracy
      const wavBlob = await convertToWav(audioBlob);
      const base64Audio = await blobToBase64(wavBlob);
      
      const response = await fetch(`${KIMI_API_CONFIG.baseURL}/audio/transcriptions`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${KIMI_API_CONFIG.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: KIMI_API_CONFIG.model,
          file: base64Audio,
          language: language,
          response_format: "text",
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || "Kimi API error");
      }

      const result = await response.json();
      return result.text || "";
    } catch (err) {
      console.error("Kimi transcription error:", err);
      throw err;
    } finally {
      setIsProcessing(false);
    }
  };

  // Puter API Transcription
  const transcribeWithPuter = async (audioBlob) => {
    if (!window.puter?.ai?.transcribe) {
      throw new Error("Puter AI not available");
    }
    
    const result = await window.puter.ai.transcribe(audioBlob, { language });
    return result?.text || "";
  };

  // Smart transcription with fallback
  const transcribeAudio = async (audioBlob) => {
    const errors = [];
    
    // Try preferred provider first
    if (preferKimi && KIMI_API_CONFIG.apiKey) {
      try {
        const text = await transcribeWithKimi(audioBlob);
        setActiveProvider("kimi");
        return text;
      } catch (err) {
        errors.push(`Kimi: ${err.message}`);
        toast.error("Kimi API failed, trying Puter...");
      }
    }
    
    // Fallback to Puter
    if (window.puter?.ai?.transcribe) {
      try {
        const text = await transcribeWithPuter(audioBlob);
        setActiveProvider("puter");
        return text;
      } catch (err) {
        errors.push(`Puter: ${err.message}`);
      }
    }
    
    // If Kimi wasn't preferred, try it as fallback
    if (!preferKimi && KIMI_API_CONFIG.apiKey) {
      try {
        const text = await transcribeWithKimi(audioBlob);
        setActiveProvider("kimi");
        return text;
      } catch (err) {
        errors.push(`Kimi: ${err.message}`);
      }
    }
    
    throw new Error(`All providers failed: ${errors.join(", ")}`);
  };

  const start = useCallback(async () => {
    if (!isSupported) {
      toast.error("Speech recognition not supported. Please use a modern browser.");
      return;
    }

    try {
      // Reset state
      chunksRef.current = [];
      setTranscript("");
      setActiveProvider(null);
      
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 16000, // Optimal for speech recognition
        } 
      });

      const recorder = new MediaRecorder(stream, {
        mimeType: MediaRecorder.isTypeSupported("audio/webm") 
          ? "audio/webm" 
          : "audio/mp4",
      });
      
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = async () => {
        try {
          const audioType = recorder.mimeType || "audio/webm";
          const audioBlob = new Blob(chunksRef.current, { type: audioType });
          
          // Validate audio size
          if (audioBlob.size < 1000) {
            toast.error("Audio too short. Please speak longer.");
            return;
          }

          toast.loading("Transcribing...", { id: "transcribe" });
          
          const text = await transcribeAudio(audioBlob);
          
          toast.dismiss("transcribe");
          
          if (!text || !text.trim()) {
            toast.error("No speech detected. Please try again.");
            return;
          }

          setTranscript((prev) => {
            const newText = prev ? `${prev} ${text.trim()}` : text.trim();
            return newText;
          });
          
          // Show success with provider info
          if (activeProvider) {
            toast.success(`Transcribed with ${activeProvider === "kimi" ? "Kimi AI" : "Puter"}`, {
              icon: "🎤",
            });
          }

        } catch (err) {
          toast.dismiss("transcribe");
          console.error("Transcription error:", err);
          toast.error(err.message || "Transcription failed. Please try again.");
        } finally {
          setIsProcessing(false);
          // Cleanup audio context
          if (audioContextRef.current) {
            audioContextRef.current.close();
            audioContextRef.current = null;
          }
        }
      };

      recorder.onerror = (e) => {
        console.error("Recorder error:", e);
        toast.error("Recording error occurred");
        stop();
      };

      // Start recording
      recorder.start(100); // Collect data every 100ms for smoother streaming
      setIsRecording(true);
      
      // Visual feedback
      toast.success("Listening... Speak now", { icon: "🎤", duration: 2000 });

      // Auto-stop timeout
      timeoutRef.current = setTimeout(() => {
        if (mediaRecorderRef.current?.state === "recording") {
          toast("Auto-stopping recording...", { icon: "⏱️" });
          stop();
        }
      }, autoStopMs);

    } catch (err) {
      console.error("Start recording error:", err);
      if (err.name === "NotAllowedError") {
        toast.error("Microphone permission denied. Please allow access.");
      } else if (err.name === "NotFoundError") {
        toast.error("No microphone found. Please connect a microphone.");
      } else {
        toast.error("Failed to start recording: " + err.message);
      }
    }
  }, [isSupported, language, autoStopMs, preferKimi, activeProvider]);

  const stop = useCallback(() => {
    if (!mediaRecorderRef.current) return;

    try {
      if (mediaRecorderRef.current.state === "recording") {
        mediaRecorderRef.current.stop();
      }
      
      // Stop all tracks to release microphone
      mediaRecorderRef.current.stream?.getTracks().forEach((track) => {
        track.stop();
        track.enabled = false;
      });
    } catch (err) {
      console.error("Stop error:", err);
    } finally {
      clearTimeout(timeoutRef.current);
      setIsRecording(false);
    }
  }, []);

  const toggle = useCallback(() => {
    if (isRecording) {
      stop();
    } else {
      start();
    }
  }, [isRecording, start, stop]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearTimeout(timeoutRef.current);
      if (mediaRecorderRef.current) {
        try {
          mediaRecorderRef.current.stop();
          mediaRecorderRef.current.stream?.getTracks().forEach(t => t.stop());
        } catch (e) {
          // Ignore cleanup errors
        }
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  // Check API availability on mount
  useEffect(() => {
    const checkAvailability = () => {
      const hasPuter = typeof window !== "undefined" && !!window.puter?.ai?.transcribe;
      const hasKimi = !!KIMI_API_CONFIG.apiKey;
      
      if (hasKimi) {
        console.log("✅ Kimi API available");
      }
      if (hasPuter) {
        console.log("✅ Puter API available");
      }
      
      setIsSupported(hasPuter || hasKimi);
    };
    
    checkAvailability();
  }, []);

  return {
    transcript,
    isRecording,
    isProcessing,
    isSupported,
    activeProvider,
    start,
    stop,
    toggle,
    reset: useCallback(() => setTranscript(""), []),
    clearTranscript: useCallback(() => setTranscript(""), []),
  };
}
