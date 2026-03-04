"use client";

import { useState } from "react";
import { X, Loader2 } from "lucide-react";

const REJECTION_REASONS = [
  { id: "not_priority", label: "Not a priority right now" },
  { id: "wrong_timing", label: "Wrong timing" },
  { id: "disagree_approach", label: "Don't agree with approach" },
  { id: "needs_modification", label: "Needs modification" },
  { id: "other", label: "Other" },
];

interface RejectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (reasonCategory: string, reasonText: string) => Promise<void>;
  itemTitle: string;
  itemType: string;
}

export default function RejectionModal({
  isOpen,
  onClose,
  onSubmit,
  itemTitle,
  itemType,
}: RejectionModalProps) {
  const [selectedReason, setSelectedReason] = useState<string>("");
  const [reasonText, setReasonText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!selectedReason) return;
    setSubmitting(true);
    try {
      await onSubmit(selectedReason, reasonText);
      setSelectedReason("");
      setReasonText("");
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className="relative w-full max-w-md mx-4 rounded-2xl border shadow-xl"
        style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b" style={{ borderColor: "var(--border)" }}>
          <div>
            <h3 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>
              Why are you rejecting this?
            </h3>
            <p className="text-xs mt-0.5" style={{ color: "var(--muted)" }}>
              {itemType}: {itemTitle.length > 60 ? itemTitle.slice(0, 60) + "..." : itemTitle}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-black/5"
          >
            <X size={16} style={{ color: "var(--muted)" }} />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4">
          {/* Quick reasons */}
          <div className="space-y-2">
            {REJECTION_REASONS.map((reason) => (
              <label
                key={reason.id}
                className="flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors"
                style={{
                  borderColor: selectedReason === reason.id ? "#5A6FFF" : "var(--border)",
                  backgroundColor: selectedReason === reason.id ? "#5A6FFF08" : "transparent",
                }}
              >
                <input
                  type="radio"
                  name="rejection-reason"
                  value={reason.id}
                  checked={selectedReason === reason.id}
                  onChange={() => setSelectedReason(reason.id)}
                  className="sr-only"
                />
                <div
                  className="w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0"
                  style={{
                    borderColor: selectedReason === reason.id ? "#5A6FFF" : "var(--border)",
                  }}
                >
                  {selectedReason === reason.id && (
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: "#5A6FFF" }} />
                  )}
                </div>
                <span className="text-sm" style={{ color: "var(--foreground)" }}>
                  {reason.label}
                </span>
              </label>
            ))}
          </div>

          {/* Additional context */}
          <div>
            <label className="text-xs font-medium mb-1.5 block" style={{ color: "var(--muted)" }}>
              Additional context (optional)
            </label>
            <textarea
              value={reasonText}
              onChange={(e) => setReasonText(e.target.value)}
              placeholder="Tell Joy why so she can learn from this..."
              className="w-full px-4 py-3 rounded-xl border text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#5A6FFF]/30"
              style={{ borderColor: "var(--border)", backgroundColor: "var(--background)" }}
              rows={3}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-5 border-t" style={{ borderColor: "var(--border)" }}>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-sm font-medium"
            style={{ color: "var(--muted)" }}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!selectedReason || submitting}
            className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-medium text-white disabled:opacity-50"
            style={{ backgroundColor: "#E24D47" }}
          >
            {submitting ? <Loader2 size={14} className="animate-spin" /> : null}
            Submit Rejection
          </button>
        </div>
      </div>
    </div>
  );
}
