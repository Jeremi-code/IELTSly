"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
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
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import QuestionSelectorModal from "../components/QuestionSelectorModal";
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
import { cn } from "@/lib/utils";

// ── TaskFigure ─────────────────────────────────────────────────────
function TaskFigure({ imageUrl }: { imageUrl: string }) {
  const [zoomed, setZoomed] = React.useState(false);
  return (
    <div className="rounded-xl overflow-hidden border border-border/50 dark:border-zinc-700/60 bg-white dark:bg-zinc-900 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-border/40 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/80">
        <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
          <ImageIcon className="h-3 w-3" /> Figure / Diagram
        </span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setZoomed((z) => !z)}
            className="flex items-center gap-1 text-[10px] font-semibold text-muted-foreground hover:text-primary transition-colors"
            title={zoomed ? "Collapse" : "Zoom in"}
          >
            <ZoomIn className="h-3 w-3" />
            {zoomed ? "Collapse" : "Zoom"}
          </button>
          <a
            href={imageUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-[10px] font-semibold text-muted-foreground hover:text-primary transition-colors"
            title="Open image in new tab"
          >
            <ExternalLink className="h-3 w-3" />
            Full size
          </a>
        </div>
      </div>
      {/* Image */}
      <div
        className={cn(
          "transition-all duration-300 overflow-auto",
          zoomed ? "max-h-[600px]" : "max-h-64",
        )}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageUrl}
          alt="IELTS Task 1 figure — graph, chart, table, or diagram for this prompt"
          referrerPolicy="no-referrer"
          loading="lazy"
          className={cn(
            "w-full object-contain transition-transform duration-300",
            zoomed ? "cursor-zoom-out" : "cursor-zoom-in",
          )}
          onClick={() => setZoomed((z) => !z)}
        />
      </div>
    </div>
  );
}

function WritingBoxInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuestionId = searchParams.get("questionId");
  const initialMode =
    (searchParams.get("mode") as "practice" | "exam") || "practice";

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

  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const startedAt = useRef(Date.now());

  const examTotalSeconds = (question?.taskType === "task1" ? 20 : 40) * 60;
  const examRemainingSeconds = Math.max(0, examTotalSeconds - elapsedSeconds);

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
    const interval = setInterval(() => {
      setElapsedSeconds(Math.floor((Date.now() - startedAt.current) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleSelectNewQuestion = (newQuestion: Question) => {
    setQuestion(newQuestion);
    setEssayText("");
    setWordCount(0);
    setError(null);
    setResult(null);
    startedAt.current = Date.now();
    setElapsedSeconds(0);
    router.replace(`/writingbox?questionId=${newQuestion._id}&mode=${mode}`, {
      scroll: false,
    });
  };

  const changeHandler = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setEssayText(text);
    setWordCount(text.trim().split(/\s+/).filter(Boolean).length);
  };

  const handleSubmit = async () => {
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
      if (!evaluated.evaluation) {
        setError(
          "Evaluation did not return a result. Please verify your AI API key in Settings.",
        );
      }
    } catch (err: any) {
      setError(
        err.message ||
          "Evaluation failed. Please check your AI API key in Settings and try again.",
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
    <div className="min-h-screen flex flex-col justify-between bg-zinc-50/50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
      <Navbar />

      <QuestionSelectorModal
        open={selectorModalOpen}
        onOpenChange={setSelectorModalOpen}
        mode={mode}
        directNavigate={false}
        onSelectQuestion={handleSelectNewQuestion}
      />

      <main className="flex-1 w-full max-w-6xl mx-auto pt-28 pb-12 px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
        <div className="w-full font-sans space-y-6">
          <Card className="shadow-2xl border border-border/50 dark:border-zinc-800/80 bg-white/90 dark:bg-zinc-950/80 backdrop-blur-xl overflow-hidden rounded-3xl flex flex-col transition-colors duration-300">
            <CardContent className="p-6 lg:p-8 space-y-6 flex-1 flex flex-col justify-between">
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

                <div className="flex flex-wrap items-center gap-3">
                  {aiStatus?.isConnected ? (
                    <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/20">
                      <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span>
                        {aiStatus.provider === "gemini"
                          ? "Gemini AI"
                          : "OpenAI"}{" "}
                        Ready
                      </span>
                    </div>
                  ) : (
                    <Link
                      href="/dashboard/settings"
                      className="flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-400 font-semibold bg-amber-500/10 hover:bg-amber-500/20 px-3 py-1.5 rounded-xl border border-amber-500/20 transition-colors"
                    >
                      <Key className="h-3 w-3" />
                      <span>Connect AI Key</span>
                    </Link>
                  )}

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
                    <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground/80">
                      Official Prompt
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
                        <p className="text-zinc-800 dark:text-zinc-200 text-sm sm:text-base leading-relaxed font-medium">
                          {question ? (
                            question.text
                          ) : questionLoading ? (
                            <span className="space-y-2 py-4 block">
                              <span className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse w-full block" />
                              <span className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse w-5/6 block" />
                              <span className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse w-2/3 block" />
                            </span>
                          ) : (
                            "Please click 'Change Question' above to choose an essay prompt."
                          )}
                        </p>

                        {/* Task 1 Figure: graph / chart / table / diagram */}
                        {question?.taskType === "task1" &&
                          question.imageUrl && (
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
                      Exam conditions active: strict timing and simulated
                      scoring.
                    </span>
                  ) : (
                    <span>
                      Self-paced practice: write at your own pace and submit
                      when ready for instant AI evaluation.
                    </span>
                  )}
                </div>

                <div>
                  <Button
                    variant="blue"
                    onClick={handleSubmit}
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
                        Evaluated across the 4 official IELTS assessment
                        criteria.
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

                {result.tips.length > 0 && (
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
                          <span className="text-primary font-bold shrink-0">
                            •
                          </span>
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
      </main>

      <Footer />
    </div>
  );
}

export default function WritingBox() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      }
    >
      <WritingBoxInner />
    </Suspense>
  );
}
