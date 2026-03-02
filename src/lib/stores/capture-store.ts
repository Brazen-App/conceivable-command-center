// Quick Capture — Shared mutable store
// Used by /api/capture route

export type CaptureType = "voice" | "text" | "file" | "link";

export type CaptureDepartment =
  | "content-engine"
  | "research"
  | "ideas-parking-lot"
  | "legal-review"
  | "email-inspiration"
  | "fundraising-intel";

export interface CaptureEntry {
  id: string;
  type: CaptureType;
  content: string; // transcript, text, filename, or URL
  summary?: string; // AI-generated summary for links
  department: CaptureDepartment;
  createdAt: string;
  fileName?: string;
  fileSize?: number;
}

let captures: CaptureEntry[] = [];

export function addCapture(entry: CaptureEntry): CaptureEntry {
  captures = [entry, ...captures];
  return entry;
}

export function getAllCaptures(): CaptureEntry[] {
  return [...captures].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export function getCapturesByDepartment(
  department: CaptureDepartment
): CaptureEntry[] {
  return captures
    .filter((c) => c.department === department)
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
}
