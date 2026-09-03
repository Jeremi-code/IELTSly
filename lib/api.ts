import type { Essay } from "@/types/essay";
import type { Question } from "@/types/question";
import type { AnalyticsPayload, ActivitySummary } from "@/types/analytics";
import type { AICredentialStatus, AIProvider } from "@/types/ai";
import type { UserTarget } from "@/types/target";
import type { MockScore, MockScoreSummary } from "@/types/mock-score";
import type { DashboardBundle } from "@/types/dashboard";
import { format, formatDistanceToNow, parseISO } from "date-fns";

const API_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    credentials: "include",
    headers: { "Content-Type": "application/json", ...init?.headers },
  });
  if (!res.ok) {
    let errorMessage = `API ${res.status} on ${path}`;
    try {
      const data = await res.json();
      if (data?.message) errorMessage = data.message;
    } catch {
      // ignore json parse error
    }
    throw new Error(errorMessage);
  }
  return res.json() as Promise<T>;
}

// ── AI Credential Management (Server-Encrypted BYOK) ───────────────

export function getAICredentials(): Promise<AICredentialStatus> {
  return api<AICredentialStatus>("/api/user/ai-credentials");
}

export function saveAICredentials(data: {
  provider: AIProvider;
  apiKey: string;
  model?: string;
}): Promise<AICredentialStatus> {
  return api<AICredentialStatus>("/api/user/ai-credentials", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function deleteAICredentials(): Promise<{ isConnected: false }> {
  return api<{ isConnected: false }>("/api/user/ai-credentials", {
    method: "DELETE",
  });
}

// ── Target Exam & Goal Management (Cached & Deduplicated) ──────────

let userTargetCache: { data: UserTarget; timestamp: number } | null = null;
let userTargetPendingPromise: Promise<UserTarget> | null = null;
const TARGET_CACHE_TTL_MS = 60000; // 60 seconds

export function getUserTarget(forceRefresh = false): Promise<UserTarget> {
  const now = Date.now();
  if (
    !forceRefresh &&
    userTargetCache &&
    now - userTargetCache.timestamp < TARGET_CACHE_TTL_MS
  ) {
    return Promise.resolve(userTargetCache.data);
  }
  if (!forceRefresh && userTargetPendingPromise) {
    return userTargetPendingPromise;
  }

  userTargetPendingPromise = api<UserTarget>("/api/user/target")
    .then((data) => {
      userTargetCache = { data, timestamp: Date.now() };
      userTargetPendingPromise = null;
      return data;
    })
    .catch((err) => {
      userTargetPendingPromise = null;
      throw err;
    });

  return userTargetPendingPromise;
}

export function saveUserTarget(
  data: Partial<UserTarget>,
): Promise<UserTarget> {
  userTargetCache = null;
  userTargetPendingPromise = null;
  dashboardCache = null;
  dashboardPendingPromise = null;
  return api<UserTarget>("/api/user/target", {
    method: "PUT",
    body: JSON.stringify(data),
  }).then((saved) => {
    userTargetCache = { data: saved, timestamp: Date.now() };
    return saved;
  });
}

export function deleteUserTarget(): Promise<{
  success: boolean;
  message: string;
}> {
  userTargetCache = null;
  userTargetPendingPromise = null;
  dashboardCache = null;
  dashboardPendingPromise = null;
  return api<{ success: boolean; message: string }>("/api/user/target", {
    method: "DELETE",
  });
}

// ── Essay Endpoints ─────────────────────────────────────────────────

export function getEssays(params?: {
  type?: string;
  status?: string;
  mode?: string;
  search?: string;
  scoreFilter?: string;
  minBand?: number;
  maxBand?: number;
  sortBy?: string;
  page?: number;
  limit?: number;
}): Promise<{
  essays: Essay[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}> {
  const qs = new URLSearchParams();
  if (params?.type && params.type !== "all") qs.set("type", params.type);
  if (params?.status && params.status !== "all")
    qs.set("status", params.status);
  if (params?.mode && params.mode !== "all") qs.set("mode", params.mode);
  if (params?.search && params.search.trim())
    qs.set("search", params.search.trim());
  if (params?.scoreFilter && params.scoreFilter !== "all")
    qs.set("scoreFilter", params.scoreFilter);
  if (params?.minBand !== undefined) qs.set("minBand", String(params.minBand));
  if (params?.maxBand !== undefined) qs.set("maxBand", String(params.maxBand));
  if (params?.sortBy) qs.set("sortBy", params.sortBy);
  qs.set("page", String(params?.page ?? 1));
  qs.set("limit", String(params?.limit ?? 10));
  return api(`/api/essays?${qs.toString()}`);
}

export function getEssay(id: string): Promise<Essay> {
  return api(`/api/essays/${id}`);
}

export function createEssay(body: {
  type: "task1" | "task2";
  mode: "practice" | "exam";
  questionId?: string;
  question?: { text: string; category?: string };
  response: string;
  durationSec: number;
}): Promise<Essay> {
  invalidateAnalyticsCache();
  dashboardCache = null;
  dashboardPendingPromise = null;
  return api("/api/essays", { method: "POST", body: JSON.stringify(body) });
}

export function evaluateEssay(id: string): Promise<Essay> {
  invalidateAnalyticsCache();
  dashboardCache = null;
  dashboardPendingPromise = null;
  return api(`/api/essays/${id}/evaluate`, {
    method: "POST",
  });
}

export function reworkEssay(
  id: string,
  body: { response: string; durationSec: number },
): Promise<Essay> {
  invalidateAnalyticsCache();
  dashboardCache = null;
  dashboardPendingPromise = null;
  return api(`/api/essays/${id}/rework`, {
    method: "POST",
    body: JSON.stringify(body),
  });
}

// ── Question Bank Endpoints ─────────────────────────────────────────

export function getQuestions(params?: {
  taskType?: string;
  category?: string;
  search?: string;
  page?: number;
  limit?: number;
}): Promise<{
  questions: Question[];
  page: number;
  limit: number;
  total: number;
}> {
  const qs = new URLSearchParams();
  if (params?.taskType && params.taskType !== "all")
    qs.set("taskType", params.taskType);
  if (params?.category && params.category !== "all")
    qs.set("category", params.category);
  if (params?.search?.trim()) qs.set("search", params.search.trim());
  qs.set("page", String(params?.page ?? 1));
  qs.set("limit", String(params?.limit ?? 10));
  return api(`/api/questions?${qs.toString()}`);
}

export function getQuestionCategories(taskType?: string): Promise<string[]> {
  const qs = new URLSearchParams();
  if (taskType && taskType !== "all") qs.set("taskType", taskType);
  return api<string[]>(`/api/questions/categories?${qs.toString()}`);
}

export function getRandomQuestion(params?: {
  taskType?: string;
  category?: string;
  search?: string;
}): Promise<Question> {
  const qs = new URLSearchParams();
  if (params?.taskType && params.taskType !== "all")
    qs.set("taskType", params.taskType);
  if (params?.category && params.category !== "all")
    qs.set("category", params.category);
  if (params?.search?.trim()) qs.set("search", params.search.trim());
  return api<Question>(`/api/questions/random?${qs.toString()}`);
}

export function getQuestion(id: string): Promise<Question> {
  return api<Question>(`/api/questions/${id}`);
}

// ── Analytics API (Cached & Deduplicated) ──────────────────────────

let analyticsCache: { data: AnalyticsPayload; timestamp: number } | null = null;
let analyticsPendingPromise: Promise<AnalyticsPayload> | null = null;
const ANALYTICS_CACHE_TTL_MS = 30000; // 30 seconds

export function invalidateAnalyticsCache(): void {
  analyticsCache = null;
  analyticsPendingPromise = null;
}

export function getAnalytics(forceRefresh = false): Promise<AnalyticsPayload> {
  const now = Date.now();
  if (
    !forceRefresh &&
    analyticsCache &&
    now - analyticsCache.timestamp < ANALYTICS_CACHE_TTL_MS
  ) {
    return Promise.resolve(analyticsCache.data);
  }
  if (!forceRefresh && analyticsPendingPromise) {
    return analyticsPendingPromise;
  }

  analyticsPendingPromise = api<AnalyticsPayload>("/api/analytics")
    .then((data) => {
      analyticsCache = { data, timestamp: Date.now() };
      analyticsPendingPromise = null;
      return data;
    })
    .catch((err) => {
      analyticsPendingPromise = null;
      throw err;
    });

  return analyticsPendingPromise;
}

export function getActivitySummary(): Promise<ActivitySummary> {
  return api("/api/analytics/activity");
}

// ── Mock Scores API (Cached & Deduplicated) ───────────────────────

let mockSummaryCache: { data: MockScoreSummary; timestamp: number } | null = null;
let mockSummaryPendingPromise: Promise<MockScoreSummary> | null = null;
const MOCK_CACHE_TTL_MS = 30000; // 30 seconds

export function invalidateMockCache(): void {
  mockSummaryCache = null;
  mockSummaryPendingPromise = null;
}

export function getMockScores(module?: string): Promise<{ scores: MockScore[] }> {
  const query = module ? `?module=${encodeURIComponent(module)}` : "";
  return api(`/api/mock-scores${query}`);
}

export function saveMockScore(payload: {
  id?: string;
  module: string;
  score?: number;
  rawCount?: number;
  totalQuestions?: number;
  source: string;
  testDate: string;
  notes?: string;
  resultUrl?: string;
}): Promise<{ score: MockScore; message: string }> {
  invalidateMockCache();
  dashboardCache = null;
  dashboardPendingPromise = null;
  return api("/api/mock-scores", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function deleteMockScore(id: string): Promise<{ message: string }> {
  invalidateMockCache();
  dashboardCache = null;
  dashboardPendingPromise = null;
  return api(`/api/mock-scores/${id}`, {
    method: "DELETE",
  });
}

export function getMockSummary(forceRefresh = false): Promise<MockScoreSummary> {
  const now = Date.now();
  if (
    !forceRefresh &&
    mockSummaryCache &&
    now - mockSummaryCache.timestamp < MOCK_CACHE_TTL_MS
  ) {
    return Promise.resolve(mockSummaryCache.data);
  }
  if (!forceRefresh && mockSummaryPendingPromise) {
    return mockSummaryPendingPromise;
  }

  mockSummaryPendingPromise = api<MockScoreSummary>("/api/mock-scores/summary")
    .then((data) => {
      mockSummaryCache = { data, timestamp: Date.now() };
      mockSummaryPendingPromise = null;
      return data;
    })
    .catch((err) => {
      mockSummaryPendingPromise = null;
      throw err;
    });

  return mockSummaryPendingPromise;
}

// ── Combined Dashboard Bundle (Single Round Trip) ────────────────

let dashboardCache: { data: DashboardBundle; timestamp: number } | null = null;
let dashboardPendingPromise: Promise<DashboardBundle> | null = null;
const DASHBOARD_CACHE_TTL_MS = 30000; // 30 seconds

export function invalidateDashboardCache(): void {
  dashboardCache = null;
  dashboardPendingPromise = null;
  // Also invalidate individual caches that overlap
  invalidateAnalyticsCache();
  invalidateMockCache();
  userTargetCache = null;
  userTargetPendingPromise = null;
}

export function getDashboardBundle(
  forceRefresh = false,
): Promise<DashboardBundle> {
  const now = Date.now();
  if (
    !forceRefresh &&
    dashboardCache &&
    now - dashboardCache.timestamp < DASHBOARD_CACHE_TTL_MS
  ) {
    return Promise.resolve(dashboardCache.data);
  }
  if (!forceRefresh && dashboardPendingPromise) {
    return dashboardPendingPromise;
  }

  dashboardPendingPromise = api<DashboardBundle>("/api/dashboard")
    .then((data) => {
      dashboardCache = { data, timestamp: Date.now() };
      dashboardPendingPromise = null;
      // Populate individual caches so navigating to sub-pages is instant
      analyticsCache = { data: data.analytics, timestamp: Date.now() };
      userTargetCache = { data: data.userTarget, timestamp: Date.now() };
      mockSummaryCache = { data: data.mockSummary, timestamp: Date.now() };
      return data;
    })
    .catch((err) => {
      dashboardPendingPromise = null;
      throw err;
    });

  return dashboardPendingPromise;
}

export function formatDate(iso: string): string {
  if (!iso) return "";
  try {
    const d = typeof iso === "string" ? parseISO(iso) : iso;
    return format(d, "MMM dd, yyyy");
  } catch {
    return iso;
  }
}

export function timeAgo(iso: string): string {
  if (!iso) return "";
  try {
    const d = typeof iso === "string" ? parseISO(iso) : iso;
    return formatDistanceToNow(d, { addSuffix: true });
  } catch {
    return iso;
  }
}
