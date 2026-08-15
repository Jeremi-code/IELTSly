import type { Essay } from "@/types/essay";
import type { Question } from "@/types/question";
import type { AnalyticsPayload } from "@/types/analytics";
import type { AICredentialStatus, AIProvider } from "@/types/ai";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

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

// ── Essay Endpoints ─────────────────────────────────────────────────

export function getEssays(params?: {
  type?: string;
  status?: string;
  mode?: string;
  page?: number;
  limit?: number;
}): Promise<{ essays: Essay[]; page: number; limit: number; total: number }> {
  const qs = new URLSearchParams();
  if (params?.type) qs.set("type", params.type);
  if (params?.status) qs.set("status", params.status);
  if (params?.mode) qs.set("mode", params.mode);
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

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
}

export function timeAgo(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days > 1 ? "s" : ""} ago`;
}
