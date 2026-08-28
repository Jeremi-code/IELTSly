import type { Essay } from "@/types/essay";
import type { Question } from "@/types/question";
import type { AnalyticsPayload, ActivitySummary } from "@/types/analytics";
import type { AICredentialStatus, AIProvider } from "@/types/ai";
import type { UserTarget } from "@/types/target";
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

// ── Target Exam & Goal Management ───────────────────────────────────

export function getUserTarget(): Promise<UserTarget> {
  return api<UserTarget>("/api/user/target");
}

export function saveUserTarget(data: Partial<UserTarget>): Promise<UserTarget> {
  return api<UserTarget>("/api/user/target", {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export function deleteUserTarget(): Promise<{ success: boolean; message: string }> {
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
  return api("/api/essays", { method: "POST", body: JSON.stringify(body) });
}

export function evaluateEssay(id: string): Promise<Essay> {
  return api(`/api/essays/${id}/evaluate`, {
    method: "POST",
  });
}

export function reworkEssay(
  id: string,
  body: { response: string; durationSec: number },
): Promise<Essay> {
  return api(`/api/essays/${id}/rework`, {
    method: "POST",
    body: JSON.stringify(body),
  });
}

// ── Question Bank Endpoints ─────────────────────────────────────────

/**
 * Fetch paginated questions matching task type, category, and search query.
 *
 * @param params Filter criteria including taskType, category, search term, page number, and limit.
 * @returns Object containing the questions list, current page, limit, and total count in DB.
 */
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

/**
 * Fetch distinct category/topic tags from the database, optionally filtered by taskType.
 *
 * @param taskType Optional task filter ('task1' or 'task2')
 * @returns Array of unique category names
 */
export function getQuestionCategories(taskType?: string): Promise<string[]> {
  const qs = new URLSearchParams();
  if (taskType && taskType !== "all") qs.set("taskType", taskType);
  return api<string[]>(`/api/questions/categories?${qs.toString()}`);
}

/**
 * Fetch a single random question from the entire database matching current filter criteria.
 *
 * @param params Optional filters (taskType, category, search) to constrain the random pool
 * @returns A single random Question document
 */
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

/**
 * Retrieve a specific question document by its MongoDB ObjectId.
 *
 * @param id MongoDB ObjectId string of the question
 * @returns The Question document
 */
export function getQuestion(id: string): Promise<Question> {
  return api<Question>(`/api/questions/${id}`);
}

export function getAnalytics(): Promise<AnalyticsPayload> {
  return api("/api/analytics");
}

export function getActivitySummary(): Promise<ActivitySummary> {
  return api("/api/analytics/activity");
}

// ── Mock Scores API ──────────────────────────────────────────────
import type { MockScore, MockScoreSummary } from "@/types/mock-score";

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
  return api("/api/mock-scores", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function deleteMockScore(id: string): Promise<{ message: string }> {
  return api(`/api/mock-scores/${id}`, {
    method: "DELETE",
  });
}

export function getMockSummary(): Promise<MockScoreSummary> {
  return api("/api/mock-scores/summary");
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
