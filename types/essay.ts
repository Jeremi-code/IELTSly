// ── Essay domain types ──────────────────────────────────────────────

export type EssayType = "task1" | "task2";
export type EssayMode = "practice" | "exam";
export type EssayStatus = "in_progress" | "submitted" | "evaluated";

export interface Evaluation {
  overallBand: number;
  criteria: { ta: number; cc: number; lr: number; gra: number };
  feedback: string;
  tips: string[];
  evaluatedAt: string;
}

export interface QuestionSnapshot {
  text: string;
  category?: string;
  imageUrl?: string;
}

export interface Essay {
  _id: string;
  user: string;
  type: EssayType;
  mode: EssayMode;
  questionId?: string;
  question: QuestionSnapshot;
  response: string;
  wordCount: number;
  durationSec: number;
  status: EssayStatus;
  reworkOf?: string;
  evaluation?: Evaluation;
  createdAt: string;
  updatedAt: string;
}
