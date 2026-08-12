// ── Analytics API response types ─────────────────────────────────────

export interface AnalyticsStats {
  totalAttempts: number;
  evaluatedCount: number;
  averageBand: number;
  bestBand: number;
  task1Average: number;
  task2Average: number;
  inProgressCount: number;
}

export interface CriteriaAverages {
  ta: number;
  cc: number;
  lr: number;
  gra: number;
}

export interface TrendPoint {
  id: string;
  date: string;
  band: number;
  type: string;
}

export interface Improvement {
  originalId: string;
  reworkId: string;
  fromBand: number;
  toBand: number;
  delta: number;
  date: string;
}

export interface DailyComment {
  text: string;
  tone: "positive" | "neutral" | "push";
}

export interface AnalyticsPayload {
  stats: AnalyticsStats;
  criteriaAverages: CriteriaAverages;
  trend: TrendPoint[];
  improvements: Improvement[];
  dailyComment: DailyComment;
}
