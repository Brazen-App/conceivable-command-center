// Quick Capture — Type definitions
// Data is now stored in PostgreSQL via Prisma

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
  content: string;
  summary?: string;
  department: CaptureDepartment;
  createdAt: string;
  fileName?: string;
  fileSize?: number;
}
