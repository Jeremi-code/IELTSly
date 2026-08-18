// ── Analytics API response types ─────────────────────────────────────

export interface AnalyticsStats {
  totalAttempts: number;
  evaluatedCount: number;
  averageBand: number;
  bestBand: number;
  task1Average: number;
  task2Average: number;
  inProgressCount: number;
  avgWordCount?: number;
  avgDurationSec?: number;
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

export interface DailyActivity {
  date: string; // YYYY-MM-DD
  count: number;
  durationSec: number;
  wordCount: number;
  avgBand: number | null;
}

export interface ActivitySummary {
  activities: DailyActivity[];
  currentStreak: number;
  longestStreak: number;
  totalActiveDays: number;
  totalDurationSec: number;
  totalEssays: number;
}

export interface AnalyticsPayload {
  stats: AnalyticsStats;
  criteriaAverages: CriteriaAverages;
  trend: TrendPoint[];
  improvements: Improvement[];
  dailyComment: DailyComment;
  recentTips?: string[];
  activitySummary?: ActivitySummary;
}
