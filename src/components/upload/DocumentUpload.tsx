"use client";

import { useState, useCallback } from "react";
import {
  Upload,
  FileText,
  Video,
  BookOpen,
  Palette,
  File,
  CheckCircle,
  Loader2,
  Trash2,
  X,
} from "lucide-react";
import { DocumentType } from "@/types";

interface UploadedDoc {
  id: string;
  name: string;
  type: DocumentType;
  size: number;
  status: "uploading" | "processing" | "indexed" | "error";
  chunkCount?: number;
}

const DOC_TYPE_OPTIONS: { value: DocumentType; label: string; icon: typeof FileText }[] = [
  { value: "book", label: "Book", icon: BookOpen },
  { value: "video-transcript", label: "Video Transcript", icon: Video },
  { value: "brand-guidelines", label: "Brand Guidelines", icon: Palette },
  { value: "script", label: "Script", icon: FileText },
  { value: "article", label: "Article", icon: File },
  { value: "other", label: "Other", icon: File },
];

const STATUS_CONFIG = {
  uploading: { label: "Uploading", color: "var(--status-info)", icon: Loader2 },
  processing: { label: "Processing", color: "var(--status-warning)", icon: Loader2 },
  indexed: { label: "Indexed", color: "var(--status-success)", icon: CheckCircle },
  error: { label: "Error", color: "var(--status-error)", icon: X },
};

export default function DocumentUpload() {
  const [documents, setDocuments] = useState<UploadedDoc[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [selectedType, setSelectedType] = useState<DocumentType>("other");

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const processFiles = async (files: FileList) => {
    const newDocs: UploadedDoc[] = Array.from(files).map((file) => ({
      id: Math.random().toString(36).slice(2),
      name: file.name,
      type: selectedType,
      size: file.size,
      status: "uploading" as const,
    }));

    setDocuments((prev) => [...prev, ...newDocs]);

    for (const file of Array.from(files)) {
      const doc = newDocs.find((d) => d.name === file.name);
      if (!doc) continue;

      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", selectedType);

      try {
        const res = await fetch("/api/documents/upload", {
          method: "POST",
          body: formData,
        });

        if (res.ok) {
          const data = await res.json();
          setDocuments((prev) =>
            prev.map((d) =>
              d.id === doc.id
                ? { ...d, status: "indexed" as const, chunkCount: data.chunkCount }
                : d
            )
          );
        } else {
          setDocuments((prev) =>
            prev.map((d) => (d.id === doc.id ? { ...d, status: "error" as const } : d))
          );
        }
      } catch {
        setDocuments((prev) =>
          prev.map((d) => (d.id === doc.id ? { ...d, status: "error" as const } : d))
        );
      }
    }
  };

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);

      if (e.dataTransfer.files?.length) {
        processFiles(e.dataTransfer.files);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selectedType]
  );

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      processFiles(e.target.files);
    }
  };

  const removeDocument = (id: string) => {
    setDocuments((prev) => prev.filter((d) => d.id !== id));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="p-8 max-w-4xl">
      {/* Document Type Selector */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-3" style={{ color: "var(--foreground)" }}>
          Document Type
        </label>
        <div className="flex flex-wrap gap-2">
          {DOC_TYPE_OPTIONS.map((opt) => {
            const Icon = opt.icon;
            const isSelected = selectedType === opt.value;
            return (
              <button
                key={opt.value}
                onClick={() => setSelectedType(opt.value)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm border ${
                  isSelected ? "font-medium" : ""
                }`}
                style={{
                  borderColor: isSelected ? "var(--brand-primary)" : "var(--border)",
                  backgroundColor: isSelected ? "var(--brand-primary)" : "var(--surface)",
                  color: isSelected ? "white" : "var(--foreground)",
                }}
              >
                <Icon size={14} />
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Drop Zone */}
      <div
        className={`rounded-xl border-2 border-dashed p-12 text-center ${
          dragActive ? "ring-2" : ""
        }`}
        style={{
          borderColor: dragActive ? "var(--brand-primary)" : "var(--border)",
          backgroundColor: dragActive ? "#EDE9FE" : "var(--surface)",
        }}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <Upload
          size={40}
          className="mx-auto mb-4"
          style={{ color: dragActive ? "var(--brand-primary)" : "var(--muted-light)" }}
        />
        <p className="font-medium mb-1" style={{ color: "var(--foreground)" }}>
          Drop files here to upload
        </p>
        <p className="text-sm mb-4" style={{ color: "var(--muted)" }}>
          PDFs, text files, video transcripts, brand documents
        </p>
        <label
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium text-white cursor-pointer"
          style={{ backgroundColor: "var(--brand-primary)" }}
        >
          <Upload size={16} />
          Choose Files
          <input
            type="file"
            multiple
            accept=".pdf,.txt,.doc,.docx,.md,.rtf"
            onChange={handleFileInput}
            className="hidden"
          />
        </label>
      </div>

      {/* Uploaded Documents List */}
      {documents.length > 0 && (
        <div className="mt-8">
          <h3 className="text-sm font-semibold uppercase tracking-wider mb-4" style={{ color: "var(--muted)" }}>
            Uploaded Documents ({documents.length})
          </h3>
          <div className="space-y-3">
            {documents.map((doc) => {
              const statusConfig = STATUS_CONFIG[doc.status];
              const StatusIcon = statusConfig.icon;

              return (
                <div
                  key={doc.id}
                  className="rounded-lg border p-4 flex items-center gap-4"
                  style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
                >
                  <FileText size={20} style={{ color: "var(--muted)" }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate" style={{ color: "var(--foreground)" }}>
                      {doc.name}
                    </p>
                    <p className="text-xs" style={{ color: "var(--muted)" }}>
                      {formatFileSize(doc.size)} &middot; {doc.type}
                      {doc.chunkCount ? ` · ${doc.chunkCount} chunks` : ""}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusIcon
                      size={16}
                      className={doc.status === "uploading" || doc.status === "processing" ? "animate-spin" : ""}
                      style={{ color: statusConfig.color }}
                    />
                    <span className="text-xs font-medium" style={{ color: statusConfig.color }}>
                      {statusConfig.label}
                    </span>
                  </div>
                  <button
                    onClick={() => removeDocument(doc.id)}
                    className="p-1.5 rounded hover:bg-gray-100"
                    aria-label="Remove document"
                  >
                    <Trash2 size={14} style={{ color: "var(--muted)" }} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Voice Profile Status */}
      <div
        className="mt-8 rounded-xl border p-6"
        style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
      >
        <h3 className="font-medium mb-2" style={{ color: "var(--foreground)" }}>
          Voice Profile
        </h3>
        <p className="text-sm mb-4" style={{ color: "var(--muted)" }}>
          Upload the founder&apos;s books, video transcripts, brand book, and other content to build a
          persistent voice profile that all agents write from.
        </p>
        <div className="flex gap-4">
          <div
            className="flex-1 rounded-lg p-3 text-center"
            style={{ backgroundColor: "var(--background)" }}
          >
            <p className="text-2xl font-semibold" style={{ color: "var(--brand-primary)" }}>
              {documents.filter((d) => d.status === "indexed").length}
            </p>
            <p className="text-xs" style={{ color: "var(--muted)" }}>
              Documents Indexed
            </p>
          </div>
          <div
            className="flex-1 rounded-lg p-3 text-center"
            style={{ backgroundColor: "var(--background)" }}
          >
            <p className="text-2xl font-semibold" style={{ color: "var(--brand-primary)" }}>
              {documents.reduce((sum, d) => sum + (d.chunkCount ?? 0), 0)}
            </p>
            <p className="text-xs" style={{ color: "var(--muted)" }}>
              Total Chunks
            </p>
          </div>
          <div
            className="flex-1 rounded-lg p-3 text-center"
            style={{ backgroundColor: "var(--background)" }}
          >
            <p className="text-2xl font-semibold" style={{ color: "var(--brand-primary)" }}>
              {documents.length > 0 ? "Active" : "—"}
            </p>
            <p className="text-xs" style={{ color: "var(--muted)" }}>
              Profile Status
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
