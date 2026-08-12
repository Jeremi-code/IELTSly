// ── Question bank types ──────────────────────────────────────────────

export type QuestionSource = "official" | "scraped";
export type TaskType = "task1" | "task2";

export interface Question {
  _id: string;
  taskType: TaskType;
  category?: string;
  text: string;
  imageUrl?: string;
  source: QuestionSource;
  sourceUrl?: string;
  timesUsed: number;
  createdAt: string;
}
