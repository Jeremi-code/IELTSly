"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Sparkles,
  Zap,
  ShieldCheck,
  ArrowRight,
  Clock,
  BookOpen,
  Filter,
  Loader2,
  ChevronLeft,
  ChevronRight,
  X,
  RotateCcw,
} from "lucide-react";
import {
  getQuestions,
  getQuestionCategories,
  getRandomQuestion,
} from "@/lib/api";
import type { Question } from "@/types/question";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface QuestionSelectorModalProps {
  /** Whether the modal dialog is open */
  open: boolean;
  /** State change handler for opening/closing the modal */
  onOpenChange: (open: boolean) => void;
  /** Practice mode ("practice" or "exam") determining UI badge style */
  mode?: "practice" | "exam";
  /** Default task type filter preset ("all", "task1", or "task2") */
  defaultTaskType?: "all" | "task1" | "task2";
  /** Default question category filter preset */
  defaultCategory?: string;
  /** Optional callback invoked when a question is chosen */
  onSelectQuestion?: (question: Question) => void;
  /** When true, automatically navigates to /writingbox with question query params */
  directNavigate?: boolean;
}

/** Number of prompt items loaded per page */
const ITEMS_PER_PAGE = 6;

/**
 * QuestionSelectorModal
 *
 * A dialog allowing users to browse, search, filter, and randomly select
 * IELTS Task 1 (Academic/General report) and Task 2 (Essay) prompts from
 * the backend database.
 *
 * Key Features:
 * - Server-side pagination for infinite scalability (>1,000+ prompts)
 * - 300ms debounced search on prompt text and topics
 * - Dynamic category fetching filtered by active task type
 * - Server-driven random question selector ("Surprise Me")
 */
export default function QuestionSelectorModal({
  open,
  onOpenChange,
  mode = "practice",
  defaultTaskType = "all",
  defaultCategory = "all",
  onSelectQuestion,
  directNavigate = true,
}: QuestionSelectorModalProps) {
  const router = useRouter();

  // ── Filter & Search State ──────────────────────────────────────────
  const [taskFilter, setTaskFilter] = useState<"all" | "task1" | "task2">(
    defaultTaskType,
  );
  const [selectedCategory, setSelectedCategory] = useState<string>(
    defaultCategory || "all",
  );
  const [categories, setCategories] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // ── Pagination & Data State ────────────────────────────────────────
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(false);
  const [randomLoading, setRandomLoading] = useState(false);

  // Synchronize task filter & category if default props update when modal opens
  useEffect(() => {
    if (open) {
      if (defaultTaskType) {
        setTaskFilter(defaultTaskType);
      }
      setSelectedCategory(defaultCategory || "all");
      setSearchQuery("");
      setDebouncedSearch("");
      setPage(1);
    }
  }, [open, defaultTaskType, defaultCategory]);

  // Debounce search input by 300ms to minimize unnecessary backend requests
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setPage(1); // Reset to first page upon new search query
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch available categories dynamically from backend whenever task filter changes
  useEffect(() => {
    if (!open) return;
    getQuestionCategories(taskFilter === "all" ? undefined : taskFilter)
      .then((cats) => {
        setCategories(["all", ...cats]);
      })
      .catch((err) => {
        console.error("Failed to load categories:", err);
        setCategories(["all"]);
      });
  }, [open, taskFilter]);

  // Fetch paginated questions from the server whenever filters, search, or page changes
  useEffect(() => {
    if (!open) return;
    let isCancelled = false;
    setLoading(true);

    getQuestions({
      taskType: taskFilter === "all" ? undefined : taskFilter,
      category: selectedCategory === "all" ? undefined : selectedCategory,
      search: debouncedSearch.trim() || undefined,
      page,
      limit: ITEMS_PER_PAGE,
    })
      .then((res) => {
        if (!isCancelled) {
          setQuestions(res.questions);
          setTotal(res.total);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch questions:", err);
        if (!isCancelled) {
          setQuestions([]);
          setTotal(0);
        }
      })
      .finally(() => {
        if (!isCancelled) setLoading(false);
      });

    return () => {
      isCancelled = true;
    };
  }, [open, taskFilter, selectedCategory, debouncedSearch, page]);

  // Calculate total pages based on current item count
  const totalPages = Math.max(1, Math.ceil(total / ITEMS_PER_PAGE));

  /**
   * Handle question selection and optional routing
   */
  const handleSelect = (question: Question) => {
    if (onSelectQuestion) {
      onSelectQuestion(question);
    }
    if (directNavigate) {
      router.push(`/writingbox?questionId=${question._id}&mode=${mode}`);
    }
    onOpenChange(false);
  };

  /**
   * Fetch a random question from the entire database matching current filters
   */
  const handleRandomSelect = async () => {
    setRandomLoading(true);
    try {
      const randomQ = await getRandomQuestion({
        taskType: taskFilter === "all" ? undefined : taskFilter,
        category: selectedCategory === "all" ? undefined : selectedCategory,
        search: debouncedSearch.trim() || undefined,
      });
      if (randomQ && randomQ._id) {
        handleSelect(randomQ);
      }
    } catch (err) {
      console.error("Failed to fetch random question:", err);
      // Fallback: pick a random item from the currently displayed batch
      if (questions.length > 0) {
        const fallback =
          questions[Math.floor(Math.random() * questions.length)];
        handleSelect(fallback);
      }
    } finally {
      setRandomLoading(false);
    }
  };

  /**
   * Reset all search queries and filters back to initial defaults
   */
  const resetFilters = () => {
    setTaskFilter("all");
    setSelectedCategory("all");
    setSearchQuery("");
    setDebouncedSearch("");
    setPage(1);
  };

  // Compute pagination range bounds for UI display
  const startRange = total === 0 ? 0 : (page - 1) * ITEMS_PER_PAGE + 1;
  const endRange = Math.min(page * ITEMS_PER_PAGE, total);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[92vh] flex flex-col p-0 overflow-hidden bg-white/95 dark:bg-zinc-950/95 backdrop-blur-2xl border-border/60 dark:border-zinc-800 shadow-2xl rounded-3xl">
        {/* Header */}
        <div className="p-6 pb-4 border-b border-border/50 dark:border-zinc-800/80 bg-gradient-to-b from-primary/5 via-transparent to-transparent">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span
                  className={cn(
                    "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider",
                    mode === "exam"
                      ? "bg-red-500/10 text-red-500 border border-red-500/20"
                      : "bg-primary/10 text-primary border border-primary/20",
                  )}
                >
                  {mode === "exam" ? (
                    <>
                      <ShieldCheck className="h-3 w-3" /> Exam Simulation
                    </>
                  ) : (
                    <>
                      <Zap className="h-3 w-3" /> Practice Mode
                    </>
                  )}
                </span>
                <span className="text-xs text-muted-foreground font-medium">
                  {total > 0
                    ? `${total.toLocaleString()} prompts in database`
                    : "Loading question bank..."}
                </span>
              </div>
              <DialogTitle className="text-2xl font-black tracking-tight">
                Select Your Writing Prompt
              </DialogTitle>
              <DialogDescription className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                Filter by task type, question format (e.g. Pie Chart, Table,
                Map, Opinion, Advantages & Disadvantages), or choose a random
                prompt.
              </DialogDescription>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={handleRandomSelect}
              disabled={randomLoading || loading || total === 0}
              className="gap-2 shrink-0 border-primary/30 text-primary hover:bg-primary/10 rounded-xl font-bold cursor-pointer self-start sm:self-center"
            >
              {randomLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="h-4 w-4" />
              )}
              Surprise Me (Random)
            </Button>
          </div>

          {/* Search & Task Filters */}
          <div className="mt-5 space-y-3">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              {/* Task Filter Tabs */}
              <div className="flex items-center p-1 bg-zinc-100 dark:bg-zinc-900 rounded-xl border border-border/50 dark:border-zinc-800 shrink-0">
                {(
                  [
                    { id: "all", label: "All Tasks" },
                    { id: "task1", label: "Task 1 (Report)" },
                    { id: "task2", label: "Task 2 (Essay)" },
                  ] as const
                ).map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setTaskFilter(tab.id);
                      setSelectedCategory("all");
                      setPage(1);
                    }}
                    className={cn(
                      "px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer",
                      taskFilter === tab.id
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Backend Search Bar */}
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search prompts or question types..."
                  className="pl-9 pr-8 h-9 bg-zinc-50 dark:bg-zinc-900/80 border-border/50 dark:border-zinc-800 rounded-xl text-xs"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-0.5 rounded cursor-pointer"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Categories Strip */}
            {categories.length > 1 && (
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
                <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/70 shrink-0 mr-1 flex items-center gap-1">
                  <Filter className="h-3 w-3" /> Category:
                </span>
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      setSelectedCategory(cat);
                      setPage(1);
                    }}
                    className={cn(
                      "px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer border",
                      selectedCategory === cat
                        ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 border-transparent shadow-sm"
                        : "bg-zinc-100/70 dark:bg-zinc-900/60 text-muted-foreground border-transparent hover:border-border",
                    )}
                  >
                    {cat === "all" ? "All Categories" : cat}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Questions List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3 min-h-[320px] max-h-[48vh]">
          {loading ? (
            <div className="py-16 flex flex-col items-center justify-center gap-3 text-muted-foreground">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-xs font-semibold">
                Searching IELTS question bank...
              </p>
            </div>
          ) : questions.length === 0 ? (
            <div className="py-16 text-center space-y-3">
              <BookOpen className="h-10 w-10 text-muted-foreground/40 mx-auto" />
              <p className="text-sm font-bold text-muted-foreground">
                No questions found
              </p>
              <p className="text-xs text-muted-foreground/70 max-w-sm mx-auto">
                No prompts match your current filters. Try changing the keywords
                or resetting filters.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={resetFilters}
                className="rounded-xl font-bold text-xs gap-1.5 mt-2"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Reset Filters
              </Button>
            </div>
          ) : (
            questions.map((q) => (
              <div
                key={q._id}
                onClick={() => handleSelect(q)}
                className="group relative p-4 rounded-2xl border border-border/50 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/40 hover:bg-zinc-50/80 dark:hover:bg-zinc-900/80 hover:border-primary/40 dark:hover:border-primary/40 transition-all duration-200 cursor-pointer shadow-xs hover:shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2">
                    <Badge
                      className={cn(
                        "text-[10px] font-black uppercase tracking-wider px-2 py-0.5 border-none",
                        q.taskType === "task1"
                          ? "bg-purple-500/10 text-purple-600 dark:text-purple-400"
                          : "bg-blue-500/10 text-blue-600 dark:text-blue-400",
                      )}
                    >
                      {q.taskType === "task1"
                        ? "Task 1 (150 words)"
                        : "Task 2 (250 words)"}
                    </Badge>
                    {q.category && (
                      <Badge
                        variant="outline"
                        className="text-[10px] font-semibold text-muted-foreground border-border/60"
                      >
                        {q.category}
                      </Badge>
                    )}
                    {q.source && (
                      <span className="text-[10px] text-muted-foreground/60 hidden md:inline">
                        Source: {q.source}
                      </span>
                    )}
                  </div>

                  <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100 leading-relaxed group-hover:text-primary transition-colors">
                    {q.text}
                  </p>
                </div>

                <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                  <Button
                    size="sm"
                    variant="blue"
                    className="font-bold text-xs rounded-xl shadow-xs group-hover:scale-105 transition-transform cursor-pointer gap-1.5"
                  >
                    Start Writing
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer with Pagination Controls */}
        <div className="p-4 border-t border-border/50 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-900/30 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <Clock className="h-3.5 w-3.5 text-primary" />
            <span>
              {total > 0
                ? `Showing ${startRange}–${endRange} of ${total.toLocaleString()} prompts`
                : "0 prompts"}
            </span>
          </div>

          {/* Pagination buttons */}
          {totalPages > 1 && (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1 || loading}
                className="h-8 px-2.5 text-xs rounded-xl font-bold border-border/60 cursor-pointer disabled:opacity-40"
              >
                <ChevronLeft className="h-3.5 w-3.5 mr-1" />
                Prev
              </Button>

              <span className="text-xs font-mono font-semibold px-2">
                Page <span className="text-foreground font-bold">{page}</span>{" "}
                of{" "}
                <span className="text-foreground font-bold">{totalPages}</span>
              </span>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages || loading}
                className="h-8 px-2.5 text-xs rounded-xl font-bold border-border/60 cursor-pointer disabled:opacity-40"
              >
                Next
                <ChevronRight className="h-3.5 w-3.5 ml-1" />
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
