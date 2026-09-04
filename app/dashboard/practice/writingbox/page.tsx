"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import { createPortal } from "react-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Clock,
  Sparkles,
  Loader2,
  BookOpen,
  ShieldCheck,
  Zap,
  ArrowRight,
  RefreshCcw,
  CheckCircle2,
  AlertCircle,
  Key,
  ImageIcon,
  ExternalLink,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  Eye,
  EyeOff,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import QuestionSelectorModal from "@/app/components/QuestionSelectorModal";
import {
  getQuestions,
  getQuestion,
  createEssay,
  evaluateEssay,
  getAICredentials,
} from "@/lib/api";
import type { Question } from "@/types/question";
import type { Evaluation } from "@/types/essay";
import type { AICredentialStatus } from "@/types/ai";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

// ── TaskFigure: Displays IELTS Task 1 figure with on-page full-size view ──
function TaskFigure({
  imageUrl,
  maxHeightClass = "max-h-[460px]",
}: {
  imageUrl: string;
  maxHeightClass?: string;
}) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && lightboxOpen) {
        e.stopPropagation();
        setLightboxOpen(false);
      }
    };
    if (lightboxOpen) {
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }
  }, [lightboxOpen]);

  return (
    <>
      <div className="rounded-2xl overflow-hidden border border-border/60 dark:border-zinc-700/70 bg-white dark:bg-zinc-900/90 shadow-sm space-y-0">
        {/* Header */}
        <div className="flex items-center justify-between px-3.5 py-2 border-b border-border/40 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/90">
          <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            <ImageIcon className="h-3.5 w-3.5 text-primary" /> Visual Figure / Diagram
          </span>
          <div className="flex items-center gap-2">
            {/* Full-size On-Page Zoom Button */}
            <button
              type="button"
              onClick={() => setLightboxOpen(true)}
              className="flex items-center gap-1.5 text-[11px] font-bold text-zinc-700 dark:text-zinc-200 hover:text-primary transition-colors cursor-pointer bg-zinc-200/80 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 px-2.5 py-1 rounded-lg"
              title="Open full size image on this page"
            >
              <ZoomIn className="h-3.5 w-3.5 text-primary" />
              <span>Full Size (Zoom)</span>
            </button>

            <a
              href={imageUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-[11px] font-semibold text-muted-foreground hover:text-primary transition-colors ml-1"
              title="Open original image in new tab"
            >
              <ExternalLink className="h-3 w-3" />
              New Tab
            </a>
          </div>
        </div>

        {/* Inline image display */}
        <div
          className={cn(
            "p-2 sm:p-3 flex items-center justify-center bg-zinc-50/40 dark:bg-zinc-950/40 overflow-y-auto cursor-pointer group relative",
            maxHeightClass,
          )}
          onClick={() => setLightboxOpen(true)}
          title="Click to view full size on this page"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageUrl}
            alt="IELTS Task 1 prompt diagram or data visual"
            referrerPolicy="no-referrer"
            loading="eager"
            className="w-full object-contain rounded-xl drop-shadow-xs group-hover:opacity-95 transition-opacity"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 dark:group-hover:bg-white/5 transition-colors rounded-xl flex items-center justify-center pointer-events-none">
            <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-zinc-900/80 text-white text-xs font-semibold px-3 py-1.5 rounded-xl backdrop-blur-md flex items-center gap-1.5 shadow-lg">
              <ZoomIn className="h-3.5 w-3.5" /> View Full Size
            </span>
          </div>
        </div>
      </div>

      {/* On-Page Full-Size Lightbox Modal */}
      {mounted &&
        createPortal(
          <AnimatePresence>
            {lightboxOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="fixed inset-0 z-[100000] bg-black/85 backdrop-blur-md flex flex-col items-center justify-between p-4 sm:p-6"
                onClick={() => setLightboxOpen(false)}
              >
                {/* Top Control Bar */}
                <div
                  className="w-full max-w-5xl flex items-center justify-between text-white pb-3 shrink-0"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center gap-2">
                    <ImageIcon className="h-4 w-4 text-primary" />
                    <span className="text-sm font-bold tracking-tight">
                      Task 1 Visual Diagram (Full Size)
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <a
                      href={imageUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-xs font-medium text-zinc-300 hover:text-white bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-xl transition-colors"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                      Open New Tab
                    </a>
                    <button
                      type="button"
                      onClick={() => setLightboxOpen(false)}
                      className="flex items-center gap-1 text-xs font-bold text-white bg-white/20 hover:bg-white/30 px-3.5 py-1.5 rounded-xl transition-colors cursor-pointer"
                    >
                      <X className="h-4 w-4 mr-0.5" />
                      Close (Esc)
                    </button>
                  </div>
                </div>

                {/* Full-size Image Display */}
                <div
                  className="flex-1 w-full max-w-5xl flex items-center justify-center p-2 min-h-0 overflow-auto"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={imageUrl}
                    alt="IELTS Task 1 prompt diagram full size view"
                    referrerPolicy="no-referrer"
                    className="max-h-[82vh] max-w-full object-contain rounded-2xl shadow-2xl bg-white dark:bg-zinc-900 p-2"
                  />
                </div>

                {/* Bottom hint */}
                <div className="text-zinc-400 text-xs text-center pt-2 shrink-0">
                  Click anywhere outside or press{" "}
                  <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-200 font-mono text-[10px]">
                    Esc
                  </kbd>{" "}
                  to return to writing
                </div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </>
  );
}

function WritingBoxInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuestionId = searchParams.get("questionId");
  const initialMode =
    (searchParams.get("mode") as "practice" | "exam") || "practice";

  const [mounted, setMounted] = useState(false);
  const [mode, setMode] = useState<"practice" | "exam">(initialMode);
  const [question, setQuestion] = useState<Question | null>(null);
  const [questionLoading, setQuestionLoading] = useState(true);
  const [selectorModalOpen, setSelectorModalOpen] = useState(false);
  const [aiStatus, setAiStatus] = useState<AICredentialStatus | null>(null);
  const [essayText, setEssayText] = useState("");
  const [wordCount, setWordCount] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<Evaluation | null>(null);

  // Zen Mode states
  const [zenMode, setZenMode] = useState(false);
  const [zenShowPrompt, setZenShowPrompt] = useState(true);

  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const startedAt = useRef(Date.now());

  const examTotalSeconds = (question?.taskType === "task1" ? 20 : 40) * 60;
  const examRemainingSeconds = Math.max(0, examTotalSeconds - elapsedSeconds);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Keyboard shortcut: Esc to exit Zen Mode
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && zenMode) {
        setZenMode(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [zenMode]);

  useEffect(() => {
    setQuestionLoading(true);
    if (initialQuestionId) {
      getQuestion(initialQuestionId)
        .then((q) => setQuestion(q))
        .catch(() => loadFallbackQuestion())
        .finally(() => setQuestionLoading(false));
    } else {
      loadFallbackQuestion();
    }

    getAICredentials()
      .then(setAiStatus)
      .catch(() => setAiStatus(null));
  }, [initialQuestionId]);

  const loadFallbackQuestion = () => {
    getQuestions({ limit: 30 })
      .then((res) => {
        const pool = res.questions;
        const task2 = pool.filter((q) => q.taskType === "task2");
        const picked = (task2.length ? task2 : pool)[
          Math.floor(Math.random() * (task2.length || pool.length))
        ];
        setQuestion(picked ?? null);
      })
      .catch(() => setQuestion(null))
      .finally(() => setQuestionLoading(false));
  };

  useEffect(() => {
    if (submitting || result !== null) return;
    const interval = setInterval(() => {
      setElapsedSeconds(Math.floor((Date.now() - startedAt.current) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [submitting, result]);

  const handleSelectNewQuestion = (newQuestion: Question) => {
    setQuestion(newQuestion);
    setEssayText("");
    setWordCount(0);
    setError(null);
    setResult(null);
    startedAt.current = Date.now();
    setElapsedSeconds(0);
    router.replace(
      `/dashboard/practice/writingbox?questionId=${newQuestion._id}&mode=${mode}`,
      { scroll: false },
    );
  };

  const [confirmModalOpen, setConfirmModalOpen] = useState(false);

  const changeHandler = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setEssayText(text);
    setWordCount(text.trim().split(/\s+/).filter(Boolean).length);
  };

  const handleRequestSubmit = () => {
    setError(null);
    setResult(null);

    if (!question) {
      setError("No question loaded yet. Please pick a question to begin.");
      return;
    }
    if (wordCount < 10) {
      setError(
        "Please write at least 10 words before submitting for evaluation.",
      );
      return;
    }

    setConfirmModalOpen(true);
  };

  const handleConfirmSubmit = async () => {
    setConfirmModalOpen(false);
    if (!question) return;

    setSubmitting(true);
    try {
      const essay = await createEssay({
        type: question.taskType,
        mode: mode,
        questionId: question._id,
        question: { text: question.text, category: question.category },
        response: essayText,
        durationSec: elapsedSeconds,
      });
      const evaluated = await evaluateEssay(essay._id);
      setResult(evaluated.evaluation ?? null);
      if (zenMode) setZenMode(false);
      if (!evaluated.evaluation) {
        setError(
          "Evaluation did not return a result. Please verify your AI API key in Settings.",
        );
      }
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "Evaluation failed. Please check your AI API key in Settings and try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const formatTimer = () => {
    if (mode === "exam") {
      const mins = Math.floor(examRemainingSeconds / 60);
      const secs = examRemainingSeconds % 60;
      return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
    }
    const mins = Math.floor(elapsedSeconds / 60);
    const secs = elapsedSeconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  const targetWords = question?.taskType === "task1" ? 150 : 250;

  return (
    <div className="min-h-full flex flex-col justify-center max-w-6xl mx-auto w-full py-4 space-y-6">
      <QuestionSelectorModal
        open={selectorModalOpen}
        onOpenChange={setSelectorModalOpen}
        mode={mode}
        directNavigate={false}
        onSelectQuestion={handleSelectNewQuestion}
      />

      {/* ── ZEN MODE FULLSCREEN OVERLAY (PORTAL TO BODY) ─────────────────── */}
      {mounted &&
        createPortal(
          <AnimatePresence>
            {zenMode && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="fixed inset-0 z-[99999] w-screen h-screen bg-white dark:bg-zinc-950 text-foreground flex flex-col p-4 sm:p-6 overflow-hidden"
              >
                {/* Zen Minimal Header */}
                <div className="max-w-4xl mx-auto w-full shrink-0 flex items-center justify-between pb-3 border-b border-border/40 gap-3">
                  <div className="flex items-center gap-2.5">
                    <Badge
                      variant="outline"
                      className={cn(
                        "text-[10px] font-bold uppercase tracking-wider py-0.5",
                        mode === "exam"
                          ? "bg-red-500/10 text-red-600 border-red-500/20"
                          : "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
                      )}
                    >
                      {mode === "exam" ? "Exam Mode" : "Practice Mode"}
                    </Badge>
                    <span className="text-xs font-semibold text-muted-foreground hidden sm:inline">
                      {question?.taskType === "task1" ? "Task 1" : "Task 2"}
                    </span>
                  </div>

                  <div className="flex items-center gap-2.5 sm:gap-3">
                    {/* Timer */}
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-border/40 text-xs font-mono font-bold">
                      <Clock
                        className={cn(
                          "h-3.5 w-3.5",
                          mode === "exam" && examRemainingSeconds <= 300
                            ? "text-red-500 animate-pulse"
                            : "text-primary",
                        )}
                      />
                      <span>{formatTimer()}</span>
                    </div>

                    {/* Live Word Count */}
                    <div className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-border/40">
                      <span>
                        <strong
                          className={
                            wordCount >= targetWords
                              ? "text-emerald-500"
                              : "text-primary"
                          }
                        >
                          {wordCount}
                        </strong>{" "}
                        / {targetWords}w
                      </span>
                    </div>

                    {/* Peek Prompt Toggle */}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setZenShowPrompt((v) => !v)}
                      className="h-8 px-2.5 rounded-xl text-xs font-semibold cursor-pointer text-muted-foreground hover:text-foreground"
                      title={zenShowPrompt ? "Hide prompt" : "Show prompt"}
                    >
                      {zenShowPrompt ? (
                        <EyeOff className="h-3.5 w-3.5 mr-1" />
                      ) : (
                        <Eye className="h-3.5 w-3.5 mr-1" />
                      )}
                      <span className="hidden sm:inline">
                        {zenShowPrompt ? "Hide Prompt" : "Show Prompt"}
                      </span>
                    </Button>

                    {/* Exit Zen Button */}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setZenMode(false)}
                      className="h-8 px-2.5 rounded-xl text-xs font-bold border-border/60 hover:border-primary/40 cursor-pointer"
                    >
                      <Minimize2 className="h-3.5 w-3.5 mr-1 text-primary" />
                      Exit Zen{" "}
                      <span className="text-[10px] text-muted-foreground ml-1">
                        (Esc)
                      </span>
                    </Button>
                  </div>
                </div>

                {/* Collapsible Zen Prompt (Scrollable container & scrollable image) */}
                <AnimatePresence>
                  {zenShowPrompt && question && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="max-w-4xl mx-auto w-full my-3 p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900/70 border border-border/50 text-xs sm:text-sm space-y-2 shrink-0 max-h-[42vh] overflow-y-auto shadow-xs"
                    >
                      <div className="flex items-center justify-between text-muted-foreground font-bold uppercase tracking-wider text-[10px]">
                        <span>Prompt Question</span>
                        {question.category && <span>#{question.category}</span>}
                      </div>
                      <p className="font-medium text-zinc-900 dark:text-zinc-100 leading-relaxed">
                        {question.text}
                      </p>
                      {question.taskType === "task1" && question.imageUrl && (
                        <div className="pt-2">
                          <TaskFigure
                            imageUrl={question.imageUrl}
                            maxHeightClass="max-h-[260px]"
                          />
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Zen Writing Textarea (Takes remaining space and scrolls smoothly) */}
                <div className="max-w-4xl mx-auto w-full flex-1 min-h-0 flex flex-col py-2">
                  <textarea
                    placeholder="Focus and write your IELTS essay response here... (Press Esc to exit Zen Mode)"
                    value={essayText}
                    onChange={changeHandler}
                    spellCheck="false"
                    autoFocus
                    className="w-full flex-1 min-h-0 bg-transparent focus:outline-none text-zinc-900 dark:text-zinc-50 text-base sm:text-lg leading-relaxed resize-none placeholder:text-muted-foreground/30 overflow-y-auto"
                  />

                  {/* Zen Bottom Bar */}
                  <div className="shrink-0 flex items-center justify-between pt-3 border-t border-border/40 gap-3">
                    <span className="text-xs text-muted-foreground">
                      {wordCount >= targetWords ? (
                        <span className="text-emerald-500 font-bold flex items-center gap-1">
                          <CheckCircle2 className="h-3.5 w-3.5" /> Target word
                          count achieved!
                        </span>
                      ) : (
                        <span>
                          {targetWords - wordCount} more words to reach target
                        </span>
                      )}
                    </span>

                    <Button
                      variant="blue"
                      size="sm"
                      onClick={handleRequestSubmit}
                      disabled={submitting}
                      className="rounded-xl px-5 font-bold text-xs cursor-pointer gap-1.5 shadow-md shadow-primary/20"
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />{" "}
                          Evaluating...
                        </>
                      ) : (
                        <>
                          Submit Essay <ArrowRight className="h-3.5 w-3.5" />
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body,
        )}

      {/* ── WRITING BOX CARD (CENTERED VIEW) ────────────────────────────── */}
      <Card className="shadow-xl border border-border/60 dark:border-zinc-800/80 bg-white/90 dark:bg-zinc-950/80 backdrop-blur-xl overflow-hidden rounded-3xl flex flex-col transition-colors duration-300">
        <CardContent className="p-5 sm:p-6 lg:p-8 space-y-6 flex-1 flex flex-col justify-between">
          {/* Header Toolbar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between pb-5 border-b border-border/50 dark:border-zinc-800/80 gap-4">
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <Badge
                  className={cn(
                    "font-bold text-[10px] px-2.5 py-0.5 uppercase tracking-wider rounded-full border",
                    mode === "exam"
                      ? "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20"
                      : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
                  )}
                >
                  {mode === "exam" ? (
                    <span className="flex items-center gap-1">
                      <ShieldCheck className="h-3 w-3" /> Exam Mode
                    </span>
                  ) : (
                    <span className="flex items-center gap-1">
                      <Zap className="h-3 w-3" /> Practice Mode
                    </span>
                  )}
                </Badge>

                <Badge
                  className={cn(
                    "text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 border-none",
                    question?.taskType === "task1"
                      ? "bg-purple-500/10 text-purple-600 dark:text-purple-400"
                      : "bg-blue-500/10 text-blue-600 dark:text-blue-400",
                  )}
                >
                  {question?.taskType === "task1"
                    ? "IELTS Task 1"
                    : "IELTS Task 2"}
                </Badge>

                {question?.category && (
                  <span className="text-xs font-semibold text-muted-foreground">
                    • {question.category}
                  </span>
                )}
              </div>

              <h1 className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-zinc-50 tracking-tight">
                {question
                  ? question.taskType === "task1"
                    ? "Visual Report / Data Summary"
                    : "Academic Essay Response"
                  : questionLoading
                    ? "Loading IELTS prompt..."
                    : "No question selected"}
              </h1>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              {aiStatus?.isConnected ? (
                <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/20">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>
                    {aiStatus.provider === "gemini" ? "Gemini AI" : "OpenAI"}{" "}
                    Ready
                  </span>
                </div>
              ) : (
                <Link
                  href="/dashboard/settings?tab=api"
                  className="flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-400 font-semibold bg-amber-500/10 hover:bg-amber-500/20 px-3 py-1.5 rounded-xl border border-amber-500/20 transition-colors"
                >
                  <Key className="h-3 w-3" />
                  <span>Connect AI Key</span>
                </Link>
              )}

              {/* Timer Pill */}
              <div className="flex items-center gap-2 bg-zinc-100 dark:bg-zinc-900/80 border border-border/40 px-3.5 py-1.5 rounded-xl">
                <Clock
                  className={cn(
                    "w-4 h-4",
                    mode === "exam" && examRemainingSeconds <= 300
                      ? "text-red-500 animate-pulse"
                      : "text-primary",
                  )}
                />
                <span
                  className={cn(
                    "font-mono font-bold text-xs sm:text-sm tracking-tight",
                    mode === "exam" && examRemainingSeconds <= 300
                      ? "text-red-500 font-black"
                      : "text-zinc-800 dark:text-zinc-200",
                  )}
                >
                  {formatTimer()} {mode === "exam" ? "left" : "elapsed"}
                </span>
              </div>

              {/* Zen Mode Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setZenMode(true)}
                className="gap-1.5 rounded-xl font-bold text-xs border-border/60 hover:border-primary/40 hover:bg-primary/5 cursor-pointer"
              >
                <Maximize2 className="h-3.5 w-3.5 text-primary" />
                Zen Mode
              </Button>

              {/* Change Question Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectorModalOpen(true)}
                className="gap-1.5 rounded-xl font-bold text-xs border-border/60 hover:border-primary/40 hover:bg-primary/5 cursor-pointer"
              >
                <BookOpen className="h-3.5 w-3.5 text-primary" />
                Change Question
              </Button>
            </div>
          </div>

          {/* Two-Column Editor Layout */}
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-[380px]">
            {/* Prompt Box */}
            <div className="bg-zinc-50/80 dark:bg-zinc-900/40 rounded-2xl p-5 sm:p-6 border border-border/40 dark:border-zinc-800/80 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground/80 flex items-center justify-between">
                  <span>Official Prompt</span>
                  {question?.category && (
                    <span className="text-[10px] lowercase font-semibold text-primary">
                      #{question.category}
                    </span>
                  )}
                </div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={question?._id || "loading"}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="space-y-4"
                  >
                    {/* Question text */}
                    <div className="text-zinc-800 dark:text-zinc-200 text-sm sm:text-base leading-relaxed font-medium">
                      {question ? (
                        question.text
                      ) : questionLoading ? (
                        <div className="space-y-2.5 py-2">
                          <Skeleton className="h-4 w-full rounded" />
                          <Skeleton className="h-4 w-11/12 rounded" />
                          <Skeleton className="h-4 w-4/5 rounded" />
                          <Skeleton className="h-4 w-2/3 rounded" />
                        </div>
                      ) : (
                        "Please click 'Change Question' above to choose an essay prompt."
                      )}
                    </div>

                    {/* Task 1 Figure: full-size image */}
                    {question?.taskType === "task1" && question.imageUrl && (
                      <TaskFigure imageUrl={question.imageUrl} />
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Prompt Guidelines Footer */}
              <div className="pt-3 border-t border-border/30 dark:border-zinc-800/60 text-xs text-muted-foreground flex items-center justify-between">
                <span>
                  Target: <strong>{targetWords}+ words</strong>
                </span>
                <span>
                  Suggested Time:{" "}
                  <strong>
                    {question?.taskType === "task1" ? "20" : "40"} mins
                  </strong>
                </span>
              </div>
            </div>

            {/* Essay Writing Textarea */}
            <div className="relative rounded-2xl border border-border/60 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-4 sm:p-5 flex flex-col justify-between shadow-inner focus-within:ring-2 focus-within:ring-primary/20 transition-all">
              <textarea
                placeholder="Type your IELTS response here... (Aim for well-developed paragraphs, academic vocabulary, and clear cohesive devices)"
                value={essayText}
                onChange={changeHandler}
                spellCheck="false"
                className="w-full flex-1 focus:outline-none text-zinc-800 dark:text-zinc-100 text-sm sm:text-base leading-relaxed bg-transparent resize-none font-normal placeholder:text-muted-foreground/40 min-h-[280px]"
              />

              {/* Word count progress meter inside textarea bottom */}
              <div className="pt-3 border-t border-border/30 dark:border-zinc-800 flex items-center justify-between text-xs font-semibold">
                <span className="text-muted-foreground">
                  Word Count:{" "}
                  <span
                    className={cn(
                      "font-bold font-mono",
                      wordCount >= targetWords
                        ? "text-emerald-500"
                        : "text-primary",
                    )}
                  >
                    {wordCount}
                  </span>{" "}
                  / {targetWords}
                </span>

                {wordCount >= targetWords && (
                  <span className="text-[11px] text-emerald-500 font-bold flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3" /> Target Met
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Bottom Actions Bar: Single primary submit button */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-4 border-t border-border/50 dark:border-zinc-800/80 gap-4">
            <div className="text-xs text-muted-foreground">
              {mode === "exam" ? (
                <span className="font-semibold text-red-500">
                  Exam conditions active: strict timing and simulated scoring.
                </span>
              ) : (
                <span>
                  Self-paced practice: write at your own pace and submit when
                  ready for instant AI evaluation.
                </span>
              )}
            </div>

            <div>
              <Button
                variant="blue"
                onClick={handleRequestSubmit}
                disabled={submitting}
                className="w-full sm:w-auto rounded-xl px-6 h-11 font-bold text-xs shadow-lg shadow-primary/20 hover:shadow-primary/30 hover:scale-[1.02] transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    Evaluating Essay...
                  </>
                ) : (
                  <>
                    Submit for AI Evaluation
                    <ArrowRight className="h-3.5 w-3.5" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ── SUBMIT CONFIRMATION MODAL ───────────────────────────────────── */}
      <Dialog open={confirmModalOpen} onOpenChange={setConfirmModalOpen}>
        <DialogContent className="sm:max-w-md rounded-3xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 shadow-2xl">
          <DialogHeader className="space-y-3 text-center sm:text-left">
            <div className="mx-auto sm:mx-0 h-12 w-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
              <Sparkles className="h-6 w-6" />
            </div>
            <DialogTitle className="text-xl font-black tracking-tight text-zinc-900 dark:text-zinc-50">
              Do you want to submit it?
            </DialogTitle>
            <DialogDescription className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Once submitted, your response will be evaluated against official IELTS criteria (Task Achievement, Coherence, Vocabulary & Grammar) by AI.
            </DialogDescription>
          </DialogHeader>

          {/* Quick Stats Preview */}
          <div className="my-2 p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-900/80 border border-zinc-200/60 dark:border-zinc-800 flex items-center justify-around text-center">
            <div>
              <span className="text-[10px] uppercase font-bold text-muted-foreground block">Word Count</span>
              <span className="text-sm font-black text-zinc-900 dark:text-zinc-100">{wordCount} / {targetWords}</span>
            </div>
            <div className="h-8 w-px bg-border/60" />
            <div>
              <span className="text-[10px] uppercase font-bold text-muted-foreground block">Time Spent</span>
              <span className="text-sm font-black text-zinc-900 dark:text-zinc-100">{formatTimer()}</span>
            </div>
            <div className="h-8 w-px bg-border/60" />
            <div>
              <span className="text-[10px] uppercase font-bold text-muted-foreground block">Mode</span>
              <span className="text-sm font-black capitalize text-primary">{mode}</span>
            </div>
          </div>

          <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2.5 mt-4">
            <Button
              variant="outline"
              type="button"
              onClick={() => setConfirmModalOpen(false)}
              className="w-full sm:w-auto rounded-xl px-5 h-11 text-xs font-bold border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-900 cursor-pointer"
            >
              No, Keep Writing
            </Button>
            <Button
              variant="blue"
              type="button"
              onClick={handleConfirmSubmit}
              className="w-full sm:w-auto rounded-xl px-6 h-11 text-xs font-bold cursor-pointer shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform flex items-center justify-center gap-1.5"
            >
              <span>Yes, Submit Now</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Feedback & Result Panel */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-semibold flex items-center justify-between gap-3"
          >
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
            {!aiStatus?.isConnected && (
              <Link
                href="/dashboard/settings?tab=api"
                className="underline font-bold text-xs shrink-0"
              >
                Connect API Key in Settings
              </Link>
            )}
          </motion.div>
        )}

        {result && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 lg:p-8 rounded-3xl bg-white dark:bg-zinc-900 border border-primary/20 shadow-2xl space-y-6"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/50">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-2xl bg-gradient-to-tr from-primary to-emerald-400 p-[3px] flex items-center justify-center shadow-lg shrink-0">
                  <div className="h-full w-full rounded-2xl bg-white dark:bg-zinc-950 flex flex-col items-center justify-center">
                    <span className="text-2xl font-black leading-none text-primary">
                      {result.overallBand.toFixed(1)}
                    </span>
                    <span className="text-[9px] text-muted-foreground font-black uppercase tracking-widest mt-0.5">
                      Band
                    </span>
                  </div>
                </div>

                <div>
                  <h3 className="font-black text-xl flex items-center gap-2 text-zinc-900 dark:text-zinc-50">
                    <Sparkles className="h-5 w-5 text-primary" />
                    AI Band Evaluation
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Evaluated across the 4 official IELTS assessment criteria.
                  </p>
                </div>
              </div>

              <Button
                variant="outline"
                onClick={() => {
                  setResult(null);
                  setEssayText("");
                  setWordCount(0);
                  setSelectorModalOpen(true);
                }}
                className="font-bold text-xs rounded-xl cursor-pointer gap-2"
              >
                <RefreshCcw className="h-3.5 w-3.5" />
                Practice Another Prompt
              </Button>
            </div>

            {/* 4 Criteria Scores */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                {
                  label: "Task Achievement (TA)",
                  score: result.criteria.ta,
                },
                {
                  label: "Coherence & Cohesion (CC)",
                  score: result.criteria.cc,
                },
                {
                  label: "Lexical Resource (LR)",
                  score: result.criteria.lr,
                },
                {
                  label: "Grammar & Accuracy (GRA)",
                  score: result.criteria.gra,
                },
              ].map((c) => (
                <div
                  key={c.label}
                  className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-900/60 border border-border/40 text-center"
                >
                  <div className="text-xl font-black text-zinc-900 dark:text-zinc-50">
                    {c.score.toFixed(1)}
                  </div>
                  <div className="text-[10px] uppercase font-bold text-muted-foreground mt-0.5">
                    {c.label}
                  </div>
                </div>
              ))}
            </div>

            {/* Feedback Text */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Examiner Feedback
              </h4>
              <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed italic bg-zinc-50/50 dark:bg-zinc-900/30 p-4 rounded-2xl border border-border/40">
                "{result.feedback}"
              </p>
            </div>

            {result.tips && result.tips.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Actionable Tips for Higher Band
                </h4>
                <div className="space-y-2">
                  {result.tips.map((tip, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-2.5 text-xs font-medium text-zinc-700 dark:text-zinc-300 p-2.5 rounded-xl bg-primary/5 border border-primary/10"
                    >
                      <span className="text-primary font-bold shrink-0">•</span>
                      <span>{tip}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function WritingBoxPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[400px] flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      }
    >
      <WritingBoxInner />
    </Suspense>
  );
}
