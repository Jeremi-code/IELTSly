export type ExamType = "academic" | "general";

export interface UserTarget {
  examDate: string | null;
  targetBand: number;
  examType: ExamType;
  updatedAt?: string;
}
