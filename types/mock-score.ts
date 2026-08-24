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
  resultUrl?: string;
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

export { rawToBandScore } from "@/lib/utils";
