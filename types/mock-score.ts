export type IELTSModule = "listening" | "reading" | "writing" | "speaking";

export interface MockScore {
  _id: string;
  userId: string;
  module: IELTSModule;
  score: number;
  rawCount?: number;
  totalQuestions?: number;
  source: string;
  testDate: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ModuleSummaryItem {
  latest: number | null;
  average: number | null;
  count: number;
  history: MockScore[];
}

export interface MockScoreSummary {
  summary: Record<IELTSModule, ModuleSummaryItem>;
  overallLatest: number | null;
  overallAverage: number | null;
  totalLogs: number;
}

// Convert raw score out of 40 to IELTS Band score
export function rawToBandScore(raw: number): number {
  if (raw >= 39) return 9.0;
  if (raw >= 37) return 8.5;
  if (raw >= 35) return 8.0;
  if (raw >= 32) return 7.5;
  if (raw >= 30) return 7.0;
  if (raw >= 26) return 6.5;
  if (raw >= 23) return 6.0;
  if (raw >= 18) return 5.5;
  if (raw >= 16) return 5.0;
  if (raw >= 13) return 4.5;
  if (raw >= 10) return 4.0;
  if (raw >= 7) return 3.5;
  if (raw >= 5) return 3.0;
  return 2.0;
}
