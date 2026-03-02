"use client";

import { useState, useRef } from "react";
import { Mic, Square, Play, RotateCcw, Check } from "lucide-react";

interface Props {
  onTranscriptReady: (transcript: string) => void;
  onClose: () => void;
}

export default function POVRecorder({ onTranscriptReady, onClose }: Props) {
  const [state, setState] = useState<"idle" | "recording" | "recorded" | "transcribing">("idle");
  const [seconds, setSeconds] = useState(0);
  const [transcript, setTranscript] = useState("");
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = () => {
        // In production: send chunks to Whisper API for transcription
      };

      recorder.onstop = () => {
        stream.getTracks().forEach((t) => t.stop());
        setState("transcribing");
        // Mock transcription delay
        setTimeout(() => {
          const mockTranscript =
            "This is really interesting because it validates exactly what we've been building. The key insight here is that most people are looking at this the wrong way — they're treating individual signals in isolation when the real value is in the connections between them. Our system does exactly this. I think we should cover this with a 'here's what everyone is missing' angle, leading with empathy and then showing the science.";
          setTranscript(mockTranscript);
          setState("recorded");
        }, 1500);
      };

      recorder.start();
      setState("recording");
      setSeconds(0);
      timerRef.current = setInterval(() => setSeconds((s) => s + 1), 1000);
    } catch {
      alert("Microphone access required for voice recording.");
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const reset = () => {
    setTranscript("");
    setSeconds(0);
    setState("idle");
  };

  const confirm = () => {
    onTranscriptReady(transcript);
  };

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;

  return (
    <div
      className="rounded-xl border p-5"
      style={{
        borderColor: "#F1C02840",
        backgroundColor: "#F1C02808",
      }}
    >
      <div className="flex items-center gap-2 mb-3">
        <Mic size={14} style={{ color: "#F1C028" }} />
        <h4 className="text-xs font-semibold" style={{ color: "var(--foreground)" }}>
          Your POV — Voice Recording
        </h4>
        <button
          onClick={onClose}
          className="ml-auto text-[10px] px-2 py-0.5 rounded"
          style={{ color: "var(--muted)" }}
        >
          Cancel
        </button>
      </div>

      {state === "idle" && (
        <div className="text-center py-4">
          <button
            onClick={startRecording}
            className="w-14 h-14 rounded-full flex items-center justify-center mx-auto transition-transform hover:scale-105"
            style={{ backgroundColor: "#F1C028" }}
          >
            <Mic size={24} className="text-white" />
          </button>
          <p className="text-xs mt-3" style={{ color: "var(--muted)" }}>
            Tap to record your take (30-60 seconds)
          </p>
        </div>
      )}

      {state === "recording" && (
        <div className="text-center py-4">
          <button
            onClick={stopRecording}
            className="w-14 h-14 rounded-full flex items-center justify-center mx-auto animate-pulse"
            style={{ backgroundColor: "#E24D47" }}
          >
            <Square size={20} className="text-white" />
          </button>
          <p className="text-lg font-bold mt-3" style={{ color: "var(--foreground)" }}>
            {formatTime(seconds)}
          </p>
          <p className="text-xs" style={{ color: "#E24D47" }}>
            Recording... tap to stop
          </p>
        </div>
      )}

      {state === "transcribing" && (
        <div className="text-center py-6">
          <div
            className="w-6 h-6 border-2 border-t-transparent rounded-full animate-spin mx-auto mb-3"
            style={{ borderColor: "#F1C028", borderTopColor: "transparent" }}
          />
          <p className="text-xs" style={{ color: "var(--muted)" }}>Transcribing your POV...</p>
        </div>
      )}

      {state === "recorded" && (
        <div>
          <div
            className="rounded-lg p-3 text-xs leading-relaxed mb-3"
            style={{ backgroundColor: "var(--surface)", color: "var(--foreground)" }}
          >
            <p className="text-[10px] font-medium mb-1" style={{ color: "var(--muted)" }}>
              Transcript ({formatTime(seconds)}):
            </p>
            &ldquo;{transcript}&rdquo;
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={reset}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs"
              style={{ color: "var(--muted)", backgroundColor: "var(--background)" }}
            >
              <RotateCcw size={12} /> Re-record
            </button>
            <button
              onClick={confirm}
              className="flex items-center gap-1 px-4 py-1.5 rounded-lg text-xs font-medium text-white"
              style={{ backgroundColor: "#F1C028" }}
            >
              <Check size={12} /> Create Content
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
