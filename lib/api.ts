const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    credentials: "include",
    headers: { "Content-Type": "application/json", ...init?.headers },
  });
  if (!res.ok) {
    throw new Error(`API ${res.status} on ${path}`);
  }
  return res.json() as Promise<T>;
}

// ── AI key storage (localStorage — never sent to our server as stored data) ──

export type AIProvider = "gemini" | "openai";

const KEY_STORAGE = "ai_api_key";
const PROVIDER_STORAGE = "ai_provider";

export function getStoredAIKey(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(KEY_STORAGE);
}

export function getStoredAIProvider(): AIProvider {
  if (typeof window === "undefined") return "gemini";
  const stored = window.localStorage.getItem(PROVIDER_STORAGE);
  return stored === "openai" ? "openai" : "gemini";
}

export function saveAICredentials(provider: AIProvider, apiKey: string): void {
  window.localStorage.setItem(PROVIDER_STORAGE, provider);
  window.localStorage.setItem(KEY_STORAGE, apiKey);
}

export function aiHeaders(): Record<string, string> {
  const apiKey = getStoredAIKey();
  if (!apiKey) return {};
  return { "x-api-key": apiKey, "x-ai-provider": getStoredAIProvider() };
}

// ── Types (mirror the IELTSly-API responses) ──

export type EssayStatus = "in_progress" | "submitted" | "evaluated";

export interface Evaluation {
  overallBand: number;
  criteria: { ta: number; cc: number; lr: number; gra: number };
  feedback: string;
  tips: string[];
  evaluatedAt: string;
}

export interface Essay {
  _id: string;
  user: string;
  type: "task1" | "task2";
  mode: "practice" | "exam";
  questionId?: string;
  question: { text: string; category?: string; imageUrl?: string };
  response: string;
  wordCount: number;
  durationSec: number;
  status: EssayStatus;
  reworkOf?: string;
  evaluation?: Evaluation;
  createdAt: string;
  updatedAt: string;
}

export interface Question {
  _id: string;
  taskType: "task1" | "task2";
  category?: string;
  text: string;
  imageUrl?: string;
  source: "official" | "scraped";
  sourceUrl?: string;
  timesUsed: number;
  createdAt: string;
}

export interface AnalyticsPayload {
  stats: {
    totalAttempts: number;
    evaluatedCount: number;
    averageBand: number;
    bestBand: number;
    task1Average: number;
    task2Average: number;
    inProgressCount: number;
  };
  criteriaAverages: { ta: number; cc: number; lr: number; gra: number };
  trend: { id: string; date: string; band: number; type: string }[];
  improvements: {
    originalId: string;
    reworkId: string;
    fromBand: number;
    toBand: number;
    delta: number;
    date: string;
  }[];
  dailyComment: { text: string; tone: "positive" | "neutral" | "push" };
}

// ── Endpoints ──

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
    headers: aiHeaders(),
    body: "{}",
  });
}

export function reworkEssay(
  id: string,
  body: { response: string; durationSec: number }
): Promise<Essay> {
  return api(`/api/essays/${id}/rework`, {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export function getQuestions(params?: {
  taskType?: string;
  category?: string;
  page?: number;
  limit?: number;
}): Promise<{ questions: Question[]; page: number; limit: number; total: number }> {
  const qs = new URLSearchParams();
  if (params?.taskType) qs.set("taskType", params.taskType);
  if (params?.category) qs.set("category", params.category);
  qs.set("page", String(params?.page ?? 1));
  qs.set("limit", String(params?.limit ?? 10));
  return api(`/api/questions?${qs.toString()}`);
}

export function getAnalytics(): Promise<AnalyticsPayload> {
  return api("/api/analytics", { headers: aiHeaders() });
}

// ── Formatting helpers ──

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
