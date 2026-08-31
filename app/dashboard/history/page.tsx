"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import DashboardShell from "../../components/DashboardShell";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Search,
  Clock,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  FileText,
  CheckCircle2,
  HelpCircle,
  ArrowUpDown,
  Award,
  RotateCcw,
  Target,
  LayoutGrid,
  List as ListIcon,
  X,
  Loader2,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { getEssays, formatDate, timeAgo } from "@/lib/api";
import type { Essay } from "@/types/essay";

type SortOption = "newest" | "oldest" | "highest" | "lowest" | "words";
type ScoreFilter = "all" | "band7_plus" | "band6_to_7" | "under_6";

export default function HistoryPage() {
  const [essays, setEssays] = useState<Essay[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [loading, setLoading] = useState(true);
  const [fetching, setFetching] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Filters & Controls State
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [taskFilter, setTaskFilter] = useState<"all" | "task1" | "task2">(
    "all",
  );
  const [scoreFilter, setScoreFilter] = useState<ScoreFilter>("all");
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [viewMode, setViewMode] = useState<"cards" | "compact">("cards");

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState<number>(6);

  // Selected Essay for Detail Modal Inspector
  const [selectedEssay, setSelectedEssay] = useState<Essay | null>(null);
  const [detailTab, setDetailTab] = useState<"essay" | "feedback">("essay");

  // Debounce search query
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Fetch essays from Backend with active filters & pagination
  const fetchEssays = useCallback(
    async (isInitial = false) => {
      if (isInitial) setLoading(true);
      else setFetching(true);

      setLoadError(null);

      try {
        const res = await getEssays({
          type: taskFilter === "all" ? undefined : taskFilter,
          scoreFilter: scoreFilter === "all" ? undefined : scoreFilter,
          search: debouncedSearch.trim() || undefined,
          sortBy: sortBy,
          page: currentPage,
          limit: pageSize,
        });

        setEssays(res.essays || []);
        setTotalCount(res.total || 0);
        setTotalPages(
          res.totalPages || Math.max(1, Math.ceil((res.total || 0) / pageSize)),
        );

        if (typeof window !== "undefined") {
          const inspectId = new URLSearchParams(window.location.search).get(
            "inspect",
          );
          if (inspectId && res.essays) {
            const match = res.essays.find((e) => e._id === inspectId);
            if (match) setSelectedEssay(match);
          }
        }
      } catch (err: unknown) {
        setLoadError(
          err instanceof Error
            ? err.message
            : "Could not load essays from server.",
        );
      } finally {
        setLoading(false);
        setFetching(false);
      }
    },
    [taskFilter, scoreFilter, debouncedSearch, sortBy, currentPage, pageSize],
  );

  useEffect(() => {
    fetchEssays();
  }, [fetchEssays]);

  // Reset to page 1 whenever any filter or search changes
  const handleTaskFilterChange = (tab: "all" | "task1" | "task2") => {
    setTaskFilter(tab);
    setCurrentPage(1);
  };

  const handleScoreFilterChange = (f: ScoreFilter) => {
    setScoreFilter(f);
    setCurrentPage(1);
  };

  const handleSortChange = (sort: SortOption) => {
    setSortBy(sort);
    setCurrentPage(1);
  };

  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    setCurrentPage(1);
  };

  const hasActiveFilters =
    searchQuery.trim() !== "" ||
    taskFilter !== "all" ||
    scoreFilter !== "all" ||
    sortBy !== "newest";

  const resetFilters = () => {
    setSearchQuery("");
    setDebouncedSearch("");
    setTaskFilter("all");
    setScoreFilter("all");
    setSortBy("newest");
    setCurrentPage(1);
  };

  const startRecord = totalCount === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endRecord = Math.min(currentPage * pageSize, totalCount);

  return (
    <DashboardShell className="max-w-[1400px] p-4 sm:p-6 lg:p-8 space-y-5">
      {/* ── Page Header ────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
              Essay history & evaluations
            </h1>
            <Badge
              variant="secondary"
              className="text-xs font-mono font-bold py-0.5 px-2.5 h-6"
            >
              {totalCount} {totalCount === 1 ? "essay" : "essays"}
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Audit previous essays, inspect 4-pillar band breakdowns, and review
            examiner suggestions.
          </p>
        </div>

        <Link href="/dashboard/practice">
          <Button
            variant="blue"
            size="sm"
            className="rounded-xl shadow-xs font-semibold hover:shadow-primary/20 transition-all cursor-pointer h-9 px-4"
          >
            <Sparkles className="h-4 w-4 mr-1.5" />
            Write new essay
          </Button>
        </Link>
      </div>

      {/* ── Search & Filter Controls Bar ────────────────────────────── */}
      <Card className="border border-border/60 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/50 backdrop-blur-md rounded-2xl p-3.5 shadow-2xs">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          {/* Left: Task Tabs + Score Pills */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Task Type Switcher */}
            <div className="flex items-center p-0.5 bg-zinc-100 dark:bg-zinc-800/70 rounded-xl border border-border/40">
              {(
                [
                  { id: "all", label: "All Tasks" },
                  { id: "task1", label: "Task 1 (Visual)" },
                  { id: "task2", label: "Task 2 (Essay)" },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => handleTaskFilterChange(tab.id)}
                  className={cn(
                    "px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer whitespace-nowrap",
                    taskFilter === tab.id
                      ? "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 shadow-2xs"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Score Filters */}
            <div className="flex items-center gap-1 overflow-x-auto">
              {(
                [
                  { id: "all", label: "All Bands" },
                  { id: "band7_plus", label: "Band 7.0+" },
                  { id: "band6_to_7", label: "Band 6.0 – 6.5" },
                  { id: "under_6", label: "< Band 6.0" },
                ] as const
              ).map((f) => (
                <Button
                  key={f.id}
                  variant={scoreFilter === f.id ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => handleScoreFilterChange(f.id)}
                  className={cn(
                    "h-7 text-xs font-semibold rounded-lg px-2.5 cursor-pointer",
                    scoreFilter === f.id &&
                      "bg-primary/10 text-primary hover:bg-primary/15",
                  )}
                >
                  {f.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Right: Search + Sort + View Toggle */}
          <div className="flex items-center gap-2">
            {/* Search Input */}
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                placeholder="Search prompt, topic, ID..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-8 h-8 text-xs bg-zinc-50 dark:bg-zinc-900/60 border-border/50 rounded-xl"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    setDebouncedSearch("");
                    setCurrentPage(1);
                  }}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>

            {/* Sort Select */}
            <div className="flex items-center border border-border/50 rounded-xl bg-zinc-50 dark:bg-zinc-900/60 px-2 h-8">
              <ArrowUpDown className="h-3 w-3 text-muted-foreground mr-1" />
              <select
                value={sortBy}
                onChange={(e) => handleSortChange(e.target.value as SortOption)}
                aria-label="Sort essays by"
                className="bg-transparent text-xs font-medium text-zinc-900 dark:text-zinc-100 focus:outline-none cursor-pointer pr-1"
              >
                <option value="newest">Newest first</option>
                <option value="oldest">Oldest first</option>
                <option value="highest">Highest band</option>
                <option value="lowest">Lowest band</option>
                <option value="words">Word count</option>
              </select>
            </div>

            {/* View Mode Toggle */}
            <div className="hidden sm:flex items-center p-0.5 bg-zinc-100 dark:bg-zinc-800/70 rounded-xl border border-border/40">
              <button
                type="button"
                onClick={() => setViewMode("cards")}
                title="Card View"
                className={cn(
                  "p-1 rounded-lg transition-all cursor-pointer",
                  viewMode === "cards"
                    ? "bg-white dark:bg-zinc-900 text-primary shadow-2xs"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                <LayoutGrid className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode("compact")}
                title="Compact Table View"
                className={cn(
                  "p-1 rounded-lg transition-all cursor-pointer",
                  viewMode === "compact"
                    ? "bg-white dark:bg-zinc-900 text-primary shadow-2xs"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                <ListIcon className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Reset Filter Button */}
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={resetFilters}
                className="h-8 px-2 text-xs text-muted-foreground hover:text-primary cursor-pointer"
                title="Reset all filters"
              >
                <RotateCcw className="h-3.5 w-3.5" />
              </Button>
            )}
          </div>
        </div>
      </Card>

      {/* ── Essay Results Section ───────────────────────────────────── */}
      {loading ? (
        viewMode === "cards" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card
                key={i}
                className="border border-border/60 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/50 backdrop-blur-md rounded-2xl p-4 space-y-3.5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Skeleton className="h-5 w-24 rounded-md" />
                    <Skeleton className="h-5 w-16 rounded-md" />
                  </div>
                  <Skeleton className="h-4 w-16 rounded" />
                </div>
                <div className="space-y-1.5">
                  <Skeleton className="h-4 w-full rounded" />
                  <Skeleton className="h-4 w-3/4 rounded" />
                  <Skeleton className="h-3 w-1/3 rounded" />
                </div>
                <div className="grid grid-cols-4 gap-1.5 pt-2 border-t border-border/30">
                  {Array.from({ length: 4 }).map((_, j) => (
                    <div
                      key={j}
                      className="bg-zinc-50 dark:bg-zinc-800/40 p-2 rounded-lg space-y-1"
                    >
                      <Skeleton className="h-2.5 w-6 mx-auto rounded" />
                      <Skeleton className="h-3.5 w-8 mx-auto rounded" />
                    </div>
                  ))}
                </div>
                <Skeleton className="h-10 w-full rounded-xl" />
                <div className="flex items-center justify-between pt-2 border-t border-border/40">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-9 w-20 rounded-xl" />
                    <div className="space-y-1">
                      <Skeleton className="h-2.5 w-12 rounded" />
                      <Skeleton className="h-2.5 w-10 rounded" />
                    </div>
                  </div>
                  <Skeleton className="h-8 w-20 rounded-xl" />
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="border border-border/60 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/50 backdrop-blur-md rounded-2xl overflow-hidden shadow-2xs">
            <div className="p-4 space-y-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between gap-4 py-2 border-b border-border/30 last:border-0"
                >
                  <div className="space-y-1.5 flex-1">
                    <Skeleton className="h-4 w-2/3 rounded" />
                    <Skeleton className="h-3 w-1/4 rounded" />
                  </div>
                  <Skeleton className="h-5 w-16 rounded-md hidden sm:block" />
                  <Skeleton className="h-6 w-12 rounded-md" />
                  <Skeleton className="h-4 w-20 rounded hidden md:block" />
                  <Skeleton className="h-8 w-20 rounded-xl shrink-0" />
                </div>
              ))}
            </div>
          </Card>
        )
      ) : loadError ? (
        <Card className="border border-rose-500/20 bg-rose-500/5 backdrop-blur-md rounded-2xl p-8 text-center space-y-2">
          <HelpCircle className="h-8 w-8 text-rose-500 mx-auto" />
          <p className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
            Connection error
          </p>
          <p className="text-xs text-muted-foreground">{loadError}</p>
        </Card>
      ) : essays.length > 0 ? (
        <div className="relative">
          {fetching && (
            <div className="absolute inset-0 bg-white/40 dark:bg-zinc-950/40 backdrop-blur-[1px] z-10 rounded-2xl flex items-center justify-center pointer-events-none">
              <Loader2 className="h-6 w-6 text-primary animate-spin" />
            </div>
          )}

          {viewMode === "cards" ? (
            /* ── CARDS VIEW ───────────────────────────────────────────── */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {essays.map((essay) => {
                const band = essay.evaluation?.overallBand;
                const hasBand = typeof band === "number" && band > 0;
                const isTask1 = essay.type === "task1";
                const criteria = essay.evaluation?.criteria;

                return (
                  <Card
                    key={essay._id}
                    className="group border border-border/60 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/50 backdrop-blur-md rounded-2xl shadow-2xs hover:shadow-sm hover:border-primary/40 transition-all duration-200 flex flex-col justify-between overflow-hidden"
                  >
                    <CardHeader className="p-4 pb-2.5 space-y-2">
                      {/* Header Row: Task Type + Mode + Time */}
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5">
                          <Badge
                            variant="outline"
                            className={cn(
                              "text-[10px] font-bold uppercase tracking-wider py-0 px-2 h-5",
                              isTask1
                                ? "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20"
                                : "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
                            )}
                          >
                            {isTask1 ? "Task 1 (Visual)" : "Task 2 (Essay)"}
                          </Badge>
                          {essay.mode === "exam" && (
                            <Badge
                              variant="secondary"
                              className="text-[9px] font-semibold py-0 px-1.5 h-5 bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
                            >
                              Exam Mode
                            </Badge>
                          )}
                        </div>

                        <span className="text-[11px] text-muted-foreground font-medium flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {timeAgo(essay.createdAt)}
                        </span>
                      </div>

                      {/* Question Prompt Title */}
                      <CardTitle className="text-xs sm:text-sm font-bold line-clamp-2 leading-snug text-zinc-900 dark:text-zinc-100">
                        {essay.question?.text || "IELTS Writing Prompt"}
                      </CardTitle>

                      {/* Category Tag */}
                      {essay.question?.category && (
                        <span className="text-[10px] font-semibold text-muted-foreground block truncate">
                          Topic: {essay.question.category}
                        </span>
                      )}
                    </CardHeader>

                    <CardContent className="p-4 pt-1 space-y-3">
                      {/* 4-Pillar Score Badges */}
                      {criteria && (
                        <div className="grid grid-cols-4 gap-1.5 pt-1.5 border-t border-border/30 text-center">
                          <div className="bg-zinc-50 dark:bg-zinc-800/40 p-1.5 rounded-lg border border-border/30">
                            <span className="text-[9px] text-muted-foreground block font-bold">
                              {isTask1 ? "TA" : "TR"}
                            </span>
                            <span className="text-xs font-black text-zinc-900 dark:text-zinc-100">
                              {criteria.ta?.toFixed(1) || "—"}
                            </span>
                          </div>
                          <div className="bg-zinc-50 dark:bg-zinc-800/40 p-1.5 rounded-lg border border-border/30">
                            <span className="text-[9px] text-muted-foreground block font-bold">
                              CC
                            </span>
                            <span className="text-xs font-black text-zinc-900 dark:text-zinc-100">
                              {criteria.cc?.toFixed(1) || "—"}
                            </span>
                          </div>
                          <div className="bg-zinc-50 dark:bg-zinc-800/40 p-1.5 rounded-lg border border-border/30">
                            <span className="text-[9px] text-muted-foreground block font-bold">
                              LR
                            </span>
                            <span className="text-xs font-black text-zinc-900 dark:text-zinc-100">
                              {criteria.lr?.toFixed(1) || "—"}
                            </span>
                          </div>
                          <div className="bg-zinc-50 dark:bg-zinc-800/40 p-1.5 rounded-lg border border-border/30">
                            <span className="text-[9px] text-muted-foreground block font-bold">
                              GRA
                            </span>
                            <span className="text-xs font-black text-zinc-900 dark:text-zinc-100">
                              {criteria.gra?.toFixed(1) || "—"}
                            </span>
                          </div>
                        </div>
                      )}

                      {/* AI Feedback Snippet */}
                      {essay.evaluation?.feedback && (
                        <div className="p-2.5 rounded-xl bg-primary/5 border border-primary/10 flex items-start gap-1.5">
                          <Sparkles className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                          <p className="text-[11px] text-zinc-700 dark:text-zinc-300 font-medium italic line-clamp-2 leading-relaxed">
                            "{essay.evaluation.feedback}"
                          </p>
                        </div>
                      )}

                      {/* Bottom Action Strip: Band Pill + Review Button */}
                      <div className="flex items-center justify-between pt-2 border-t border-border/40">
                        <div className="flex items-center gap-2">
                          <div
                            className={cn(
                              "h-9 px-2.5 rounded-xl font-black text-xs flex items-center justify-center gap-1 shadow-2xs",
                              hasBand
                                ? band >= 7.5
                                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                                  : band >= 6.5
                                    ? "bg-primary/10 text-primary border border-primary/20"
                                    : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                                : "bg-zinc-100 dark:bg-zinc-800 text-muted-foreground",
                            )}
                          >
                            <Award className="h-3.5 w-3.5" />
                            <span>
                              {hasBand ? `Band ${band.toFixed(1)}` : "Pending"}
                            </span>
                          </div>

                          <div className="text-[10px] text-muted-foreground font-medium leading-tight">
                            <span>{essay.wordCount || 0} words</span>
                            <span className="block">
                              {essay.durationSec >= 60
                                ? `${Math.round(essay.durationSec / 60)} mins`
                                : `${essay.durationSec || 0}s`}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedEssay(essay);
                              setDetailTab("essay");
                            }}
                            className="h-8 px-2.5 rounded-xl text-xs font-semibold border-border/60 hover:border-primary/40 hover:bg-primary/5 cursor-pointer"
                          >
                            Inspect <ChevronRight className="h-3 w-3 ml-0.5" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            /* ── COMPACT TABLE VIEW ─────────────────────────────────────── */
            <Card className="border border-border/60 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/50 backdrop-blur-md rounded-2xl shadow-2xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-zinc-50 dark:bg-zinc-900/80 border-b border-border/50 text-muted-foreground font-semibold">
                    <tr>
                      <th className="p-3.5 pl-4">Prompt & Topic</th>
                      <th className="p-3.5">Task</th>
                      <th className="p-3.5 text-center">Band</th>
                      <th className="p-3.5 text-center hidden md:table-cell">
                        TA / CC / LR / GRA
                      </th>
                      <th className="p-3.5 text-right hidden sm:table-cell">
                        Volume & Pacing
                      </th>
                      <th className="p-3.5 text-right">Date</th>
                      <th className="p-3.5 pr-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/30">
                    {essays.map((essay) => {
                      const band = essay.evaluation?.overallBand;
                      const hasBand = typeof band === "number" && band > 0;
                      const criteria = essay.evaluation?.criteria;

                      return (
                        <tr
                          key={essay._id}
                          onClick={() => {
                            setSelectedEssay(essay);
                            setDetailTab("essay");
                          }}
                          className="hover:bg-zinc-50/70 dark:hover:bg-zinc-900/40 transition-colors cursor-pointer"
                        >
                          <td className="p-3.5 pl-4 max-w-xs sm:max-w-md">
                            <p className="font-bold text-zinc-900 dark:text-zinc-100 truncate">
                              {essay.question?.text || "IELTS Writing Prompt"}
                            </p>
                            {essay.question?.category && (
                              <span className="text-[10px] text-muted-foreground">
                                {essay.question.category}
                              </span>
                            )}
                          </td>

                          <td className="p-3.5 whitespace-nowrap">
                            <Badge
                              variant="outline"
                              className={cn(
                                "text-[10px] font-bold py-0 h-5",
                                essay.type === "task1"
                                  ? "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20"
                                  : "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
                              )}
                            >
                              {essay.type === "task1" ? "Task 1" : "Task 2"}
                            </Badge>
                          </td>

                          <td className="p-3.5 text-center whitespace-nowrap">
                            <span
                              className={cn(
                                "inline-flex items-center px-2 py-0.5 rounded-md font-mono font-bold text-xs",
                                hasBand
                                  ? band >= 7.5
                                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                                    : band >= 6.5
                                      ? "bg-primary/10 text-primary"
                                      : "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                                  : "text-muted-foreground",
                              )}
                            >
                              {hasBand ? band.toFixed(1) : "—"}
                            </span>
                          </td>

                          <td className="p-3.5 text-center hidden md:table-cell font-mono text-[11px] text-muted-foreground whitespace-nowrap">
                            {criteria
                              ? `${criteria.ta?.toFixed(1) || "—"} / ${criteria.cc?.toFixed(1) || "—"} / ${criteria.lr?.toFixed(1) || "—"} / ${criteria.gra?.toFixed(1) || "—"}`
                              : "—"}
                          </td>

                          <td className="p-3.5 text-right hidden sm:table-cell whitespace-nowrap text-muted-foreground font-medium">
                            <span>{essay.wordCount || 0}w</span> •{" "}
                            <span>
                              {essay.durationSec >= 60
                                ? `${Math.round(essay.durationSec / 60)}m`
                                : `${essay.durationSec || 0}s`}
                            </span>
                          </td>

                          <td className="p-3.5 text-right whitespace-nowrap text-[11px] text-muted-foreground">
                            {formatDate(essay.createdAt)}
                          </td>

                          <td className="p-3.5 pr-4 text-right whitespace-nowrap">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 px-2 text-xs font-semibold text-primary hover:bg-primary/10"
                            >
                              Inspect
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </Card>
          )}

          {/* ── PAGINATION CONTROLS ───────────────────────────────────── */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4">
            <div className="flex items-center gap-3 text-xs text-muted-foreground font-medium">
              <span>
                Showing {startRecord}–{endRecord} of {totalCount} essays
              </span>

              <div className="flex items-center gap-1.5">
                <span>Per page:</span>
                <select
                  value={pageSize}
                  onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                  aria-label="Items per page"
                  className="bg-white dark:bg-zinc-900 border border-border/60 rounded-lg px-2 py-1 text-xs font-semibold text-zinc-900 dark:text-zinc-100 cursor-pointer focus:outline-none"
                >
                  <option value={6}>6</option>
                  <option value={9}>9</option>
                  <option value={12}>12</option>
                  <option value={24}>24</option>
                </select>
              </div>
            </div>

            {/* Page Buttons */}
            {totalPages > 1 && (
              <div className="flex items-center gap-1.5">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage <= 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className="h-8 px-2.5 rounded-xl text-xs font-semibold cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="h-3.5 w-3.5 mr-0.5" /> Previous
                </Button>

                <div className="flex items-center gap-1 px-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter((page) => {
                      return (
                        page === 1 ||
                        page === totalPages ||
                        Math.abs(page - currentPage) <= 1
                      );
                    })
                    .map((page, idx, arr) => {
                      const prev = arr[idx - 1];
                      const showEllipsis = prev && page - prev > 1;

                      return (
                        <React.Fragment key={page}>
                          {showEllipsis && (
                            <span className="text-xs text-muted-foreground px-1">
                              …
                            </span>
                          )}
                          <Button
                            variant={
                              currentPage === page ? "default" : "outline"
                            }
                            size="sm"
                            onClick={() => setCurrentPage(page)}
                            className={cn(
                              "h-8 w-8 p-0 text-xs font-bold rounded-xl cursor-pointer",
                              currentPage === page
                                ? "bg-primary text-primary-foreground shadow-xs"
                                : "hover:bg-zinc-100 dark:hover:bg-zinc-800",
                            )}
                          >
                            {page}
                          </Button>
                        </React.Fragment>
                      );
                    })}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage >= totalPages}
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  className="h-8 px-2.5 rounded-xl text-xs font-semibold cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Next <ChevronRight className="h-3.5 w-3.5 ml-0.5" />
                </Button>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* ── EMPTY SEARCH / FILTER STATE ─────────────────────────────── */
        <Card className="border border-dashed border-border/80 dark:border-zinc-800 bg-white/40 dark:bg-zinc-950/20 backdrop-blur-xl rounded-2xl p-10 text-center">
          <div className="max-w-md mx-auto space-y-4">
            <div className="h-12 w-12 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-muted-foreground flex items-center justify-center mx-auto">
              <Search className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-50">
                No matching essays found
              </h3>
              <p className="text-xs text-muted-foreground">
                {hasActiveFilters
                  ? "Try loosening your search keywords or switching filter parameters."
                  : "Write your first IELTS practice essay to build your performance archive."}
              </p>
            </div>

            {hasActiveFilters ? (
              <Button
                variant="outline"
                size="sm"
                onClick={resetFilters}
                className="rounded-xl cursor-pointer text-xs"
              >
                Clear all filters
              </Button>
            ) : (
              <Link href="/dashboard/practice">
                <Button
                  variant="blue"
                  size="sm"
                  className="rounded-xl cursor-pointer text-xs"
                >
                  Start writing now
                </Button>
              </Link>
            )}
          </div>
        </Card>
      )}

      {/* ── DETAIL ESSAY INSPECTOR MODAL ────────────────────────────── */}
      <Dialog
        open={Boolean(selectedEssay)}
        onOpenChange={(open) => {
          if (!open) setSelectedEssay(null);
        }}
      >
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto p-0 rounded-2xl border-border/60 bg-white dark:bg-zinc-900 shadow-2xl">
          <DialogTitle className="sr-only">Essay Inspection & Details</DialogTitle>
          {selectedEssay && (
            <div className="space-y-0">
              {/* Modal Header */}
              <div className="p-5 pr-14 border-b border-border/40 bg-zinc-50/70 dark:bg-zinc-900/90 space-y-3">
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className={cn(
                        "text-xs font-bold uppercase tracking-wider",
                        selectedEssay.type === "task1"
                          ? "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20"
                          : "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
                      )}
                    >
                      {selectedEssay.type === "task1"
                        ? "Task 1 (Visual / Report)"
                        : "Task 2 (Academic Essay)"}
                    </Badge>
                    <span className="text-xs text-muted-foreground font-mono">
                      {formatDate(selectedEssay.createdAt)}
                    </span>
                  </div>

                  {/* Overall Band Pill */}
                  <div className="flex items-center gap-2">
                    <div className="h-8 px-3 rounded-xl bg-primary/10 border border-primary/20 text-primary font-black text-sm flex items-center gap-1.5">
                      <Award className="h-4 w-4" />
                      <span>
                        {selectedEssay.evaluation?.overallBand
                          ? `Band ${selectedEssay.evaluation.overallBand.toFixed(1)}`
                          : "In Progress"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Prompt Question */}
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                    Question Prompt
                  </span>
                  <DialogTitle className="text-sm font-bold text-zinc-900 dark:text-zinc-100 leading-snug">
                    {selectedEssay.question?.text || "IELTS Writing Prompt"}
                  </DialogTitle>
                  <DialogDescription className="sr-only">
                    Inspection modal for IELTS essay response, score breakdown,
                    and examiner feedback.
                  </DialogDescription>
                  {selectedEssay.question?.category && (
                    <span className="inline-block text-[10px] font-semibold text-primary bg-primary/5 px-2 py-0.5 rounded-md border border-primary/10 mt-1">
                      Topic: {selectedEssay.question.category}
                    </span>
                  )}
                </div>

                {/* 4 Pillars Breakdown Grid */}
                {selectedEssay.evaluation?.criteria && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
                    <div className="p-2 rounded-xl bg-white dark:bg-zinc-800/60 border border-border/40 text-center">
                      <span className="text-[10px] text-muted-foreground font-semibold block">
                        Task{" "}
                        {selectedEssay.type === "task1"
                          ? "Achievement"
                          : "Response"}
                      </span>
                      <span className="text-sm font-black text-zinc-900 dark:text-zinc-100">
                        {selectedEssay.evaluation.criteria.ta?.toFixed(1) ||
                          "—"}
                      </span>
                    </div>
                    <div className="p-2 rounded-xl bg-white dark:bg-zinc-800/60 border border-border/40 text-center">
                      <span className="text-[10px] text-muted-foreground font-semibold block">
                        Coherence & Cohesion
                      </span>
                      <span className="text-sm font-black text-zinc-900 dark:text-zinc-100">
                        {selectedEssay.evaluation.criteria.cc?.toFixed(1) ||
                          "—"}
                      </span>
                    </div>
                    <div className="p-2 rounded-xl bg-white dark:bg-zinc-800/60 border border-border/40 text-center">
                      <span className="text-[10px] text-muted-foreground font-semibold block">
                        Lexical Resource
                      </span>
                      <span className="text-sm font-black text-zinc-900 dark:text-zinc-100">
                        {selectedEssay.evaluation.criteria.lr?.toFixed(1) ||
                          "—"}
                      </span>
                    </div>
                    <div className="p-2 rounded-xl bg-white dark:bg-zinc-800/60 border border-border/40 text-center">
                      <span className="text-[10px] text-muted-foreground font-semibold block">
                        Grammatical Accuracy
                      </span>
                      <span className="text-sm font-black text-zinc-900 dark:text-zinc-100">
                        {selectedEssay.evaluation.criteria.gra?.toFixed(1) ||
                          "—"}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Body: Tabs */}
              <div className="p-5">
                <Tabs
                  value={detailTab}
                  onValueChange={(val) =>
                    setDetailTab(val as "essay" | "feedback")
                  }
                  className="space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <TabsList className="bg-zinc-100 dark:bg-zinc-800/70 p-1 rounded-xl">
                      <TabsTrigger
                        value="essay"
                        className="text-xs font-bold rounded-lg cursor-pointer data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-900"
                      >
                        Submitted Essay ({selectedEssay.wordCount || 0} words)
                      </TabsTrigger>
                      <TabsTrigger
                        value="feedback"
                        className="text-xs font-bold rounded-lg cursor-pointer data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-900"
                      >
                        Examiner Diagnostic & Tips
                      </TabsTrigger>
                    </TabsList>

                    <span className="text-xs text-muted-foreground">
                      Time spent:{" "}
                      {selectedEssay.durationSec >= 60
                        ? `${Math.round(selectedEssay.durationSec / 60)} mins`
                        : `${selectedEssay.durationSec || 0}s`}
                    </span>
                  </div>

                  {/* Tab 1: Essay Text */}
                  <TabsContent value="essay" className="space-y-3 mt-0">
                    <div className="p-4 rounded-xl bg-zinc-50/70 dark:bg-zinc-950/40 border border-border/50 text-xs sm:text-sm text-zinc-800 dark:text-zinc-200 whitespace-pre-wrap leading-relaxed max-h-[350px] overflow-y-auto font-sans selection:bg-primary/20">
                      {selectedEssay.response || "No text available."}
                    </div>
                  </TabsContent>

                  {/* Tab 2: Examiner Feedback */}
                  <TabsContent value="feedback" className="space-y-4 mt-0">
                    {/* General Feedback Comment */}
                    <div className="p-3.5 rounded-xl bg-primary/5 border border-primary/20 space-y-1.5">
                      <span className="text-xs font-bold text-primary flex items-center gap-1.5">
                        <Sparkles className="h-4 w-4" /> Comprehensive Examiner
                        Evaluation
                      </span>
                      <p className="text-xs sm:text-sm text-zinc-800 dark:text-zinc-200 leading-relaxed font-medium">
                        {selectedEssay.evaluation?.feedback ||
                          "Evaluation commentary is being processed."}
                      </p>
                    </div>

                    {/* Actionable Tips List */}
                    {selectedEssay.evaluation?.tips &&
                      selectedEssay.evaluation.tips.length > 0 && (
                        <div className="space-y-2">
                          <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
                            <Target className="h-4 w-4 text-emerald-500" />
                            Actionable Improvement Tips
                          </span>
                          <div className="space-y-1.5">
                            {selectedEssay.evaluation.tips.map((tip, idx) => (
                              <div
                                key={idx}
                                className="p-2.5 rounded-xl border border-border/40 bg-zinc-50/60 dark:bg-zinc-900/40 flex items-start gap-2 text-xs"
                              >
                                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" />
                                <span className="text-zinc-800 dark:text-zinc-200 font-medium">
                                  {tip}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                  </TabsContent>
                </Tabs>
              </div>

              {/* Modal Footer */}
              <div className="p-4 border-t border-border/40 bg-zinc-50/70 dark:bg-zinc-900/90 flex items-center justify-between">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedEssay(null)}
                  className="rounded-xl text-xs cursor-pointer"
                >
                  Close
                </Button>

                {selectedEssay.questionId && (
                  <Link
                    href={`/dashboard/practice/writingbox?questionId=${selectedEssay.questionId}&mode=${selectedEssay.mode || "practice"}`}
                  >
                    <Button
                      variant="blue"
                      size="sm"
                      className="rounded-xl text-xs font-semibold cursor-pointer"
                    >
                      <RotateCcw className="h-3.5 w-3.5 mr-1.5" />
                      Rework this prompt
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </DashboardShell>
  );
}
