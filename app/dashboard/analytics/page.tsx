"use client";

import React, { useState, useEffect, useMemo } from "react";
import DashboardShell from "../../components/DashboardShell";
import {
  TrendingUp,
  Award,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  Sparkles,
  Clock,
  FileText,
  RefreshCw,
  Target,
  BarChart3,
  Flame,
  MessageSquareQuote,
  ShieldCheck,
  Zap,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { getAnalytics } from "@/lib/api";
import type { AnalyticsPayload } from "@/types/analytics";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.07 },
  },
};

const itemVariants = {
  hidden: { y: 16, opacity: 0 },
  show: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 120, damping: 15 } as const,
  },
};

// Official IELTS Descriptor Guide per criterion
interface CriterionGuide {
  name: string;
  short: "ta" | "cc" | "lr" | "gra";
  code: string;
  weight: string;
  description: string;
  targetTip: string;
  commonWeakness: string;
}

const CRITERIA_GUIDE: Record<string, CriterionGuide> = {
  ta: {
    name: "Task Achievement / Response",
    short: "ta",
    code: "TA / TR",
    weight: "25% weight",
    description:
      "Measures how fully, appropriately, and relevantly you address all parts of the prompt with a clear position throughout.",
    targetTip:
      "To reach Band 7+, present a clear position in the introduction, develop all bullet points evenly, and support each main argument with 2 specific examples.",
    commonWeakness:
      "Underdeveloped main points, missing overviews in Task 1, or taking a vague/inconsistent stance in Task 2.",
  },
  cc: {
    name: "Coherence & Cohesion",
    short: "cc",
    code: "CC",
    weight: "25% weight",
    description:
      "Evaluates the logical structure, flow of ideas, paragraphing discipline, and skillful use of cohesive devices without mechanical overuse.",
    targetTip:
      "Use clear topic sentences for every body paragraph. Prefer referencing (this trend, these factors) over repeating mechanical linkers (Furthermore, Moreover).",
    commonWeakness:
      "Overusing transition words at the start of every sentence, or grouping unrelated ideas in a single giant paragraph.",
  },
  lr: {
    name: "Lexical Resource",
    short: "lr",
    code: "LR",
    weight: "25% weight",
    description:
      "Assesses the range, precision, natural collocation, and academic register of vocabulary, alongside spelling accuracy.",
    targetTip:
      "Focus on precise topic-specific collocations (e.g. 'foster sustainable growth', 'mitigate the impact') rather than obscure or misused archaic words.",
    commonWeakness:
      "Repetitive word choices, inappropriate informal register, or forced idioms that sound unnatural to native examiners.",
  },
  gra: {
    name: "Grammatical Range & Accuracy",
    short: "gra",
    code: "GRA",
    weight: "25% weight",
    description:
      "Examines the variety of sentence structures (complex, compound, conditional) and the proportion of completely error-free sentences.",
    targetTip:
      "Combine simple sentences using relative clauses (which, where), conditionals (if, unless), and participial phrases while ensuring subject-verb agreement.",
    commonWeakness:
      "Punctuation splices, inconsistent verb tenses when transitioning between past data and present hypotheses, and article omissions.",
  },
};

function getBandLabel(band: number): { label: string; color: string } {
  if (band >= 8.5)
    return {
      label: "Expert / Near Native",
      color:
        "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    };
  if (band >= 7.5)
    return {
      label: "Very Good User",
      color:
        "text-blue-600 dark:text-blue-400 bg-blue-500/10 border-blue-500/20",
    };
  if (band >= 6.5)
    return {
      label: "Competent User",
      color:
        "text-purple-600 dark:text-purple-400 bg-purple-500/10 border-purple-500/20",
    };
  if (band >= 5.5)
    return {
      label: "Modest User",
      color:
        "text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/20",
    };
  if (band > 0)
    return {
      label: "Developing User",
      color:
        "text-rose-600 dark:text-rose-400 bg-rose-500/10 border-rose-500/20",
    };
  return {
    label: "No Submissions Yet",
    color: "text-muted-foreground bg-zinc-500/10 border-zinc-500/20",
  };
}

const AnalyticsPage = () => {
  const [data, setData] = useState<AnalyticsPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCriterion, setSelectedCriterion] = useState<
    "ta" | "cc" | "lr" | "gra"
  >("ta");

  const loadData = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    try {
      const payload = await getAnalytics();
      setData(payload);
    } catch {
      setData(null);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const stats = data?.stats;
  const criteria = data?.criteriaAverages;
  const trend = data?.trend ?? [];
  const improvements = data?.improvements ?? [];
  const recentTips = data?.recentTips ?? [];
  const dailyComment = data?.dailyComment;

  // Criteria array with computed ranking
  const criteriaList = useMemo(() => {
    if (!criteria) return [];
    const raw = [
      { key: "ta" as const, score: criteria.ta, guide: CRITERIA_GUIDE.ta },
      { key: "cc" as const, score: criteria.cc, guide: CRITERIA_GUIDE.cc },
      { key: "lr" as const, score: criteria.lr, guide: CRITERIA_GUIDE.lr },
      { key: "gra" as const, score: criteria.gra, guide: CRITERIA_GUIDE.gra },
    ];

    const validScores = raw.filter((c) => c.score > 0);
    const minScore =
      validScores.length > 0 ? Math.min(...validScores.map((c) => c.score)) : 0;
    const maxScore =
      validScores.length > 0 ? Math.max(...validScores.map((c) => c.score)) : 0;

    return raw.map((c) => ({
      ...c,
      isLowest: validScores.length > 1 && c.score > 0 && c.score === minScore,
      isHighest: validScores.length > 1 && c.score > 0 && c.score === maxScore,
    }));
  }, [criteria]);

  // SVG Trend Chart Dimensions
  const chartHeight = 135;
  const chartWidth = 520;
  const paddingX = 28;
  const paddingY = 18;
  const maxScore = 9;
  const minScore = 4;

  const points = useMemo(() => {
    if (trend.length < 2) return "";
    return trend
      .map((item, i) => {
        const x =
          paddingX + (i * (chartWidth - paddingX * 2)) / (trend.length - 1);
        const y =
          chartHeight -
          paddingY -
          ((Math.max(minScore, Math.min(maxScore, item.band)) - minScore) /
            (maxScore - minScore)) *
            (chartHeight - paddingY * 2);
        return `${x},${y}`;
      })
      .join(" ");
  }, [trend]);

  const hasEvaluations = (stats?.evaluatedCount ?? 0) > 0;

  return (
    <DashboardShell className="max-w-[1360px] p-4 sm:p-6 lg:p-7 space-y-5">
      {/* ── Page Header ─────────────────────────────────────────────── */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
              Writing{" "}
              <span className="text-primary italic">
                Analytics & Diagnostics
              </span>
            </h1>
          </div>
          <p className="text-muted-foreground text-xs sm:text-sm max-w-2xl leading-relaxed">
            Real-time evaluation data, official 4-pillar band breakdowns, and
            actionable examiner diagnostics.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={() => loadData(true)}
            disabled={refreshing || loading}
            className="h-8 px-3 rounded-lg text-xs font-semibold gap-1.5 border-border/70 hover:bg-zinc-100 dark:hover:bg-zinc-850 cursor-pointer"
          >
            <RefreshCw
              className={cn("h-3.5 w-3.5", refreshing && "animate-spin")}
            />
            <span>Refresh</span>
          </Button>

          <Button
            asChild
            variant="blue"
            size="sm"
            className="h-8 px-3.5 rounded-lg text-xs font-bold shadow-sm shadow-primary/20 hover:scale-[1.01] transition-all cursor-pointer"
          >
            <Link href="/dashboard/practice">
              <Sparkles className="h-3.5 w-3.5 mr-1.5" />
              Start Practice
            </Link>
          </Button>
        </div>
      </header>

      {/* ── Loading Skeleton State ───────────────────────────────── */}
      {loading ? (
        <div className="space-y-5">
          {/* Diagnostic Metrics Strip Skeleton */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <Card
                key={i}
                className="border border-border/60 dark:border-zinc-800/80 bg-white/60 dark:bg-zinc-900/40 backdrop-blur-md rounded-xl p-3 sm:p-3.5 space-y-2.5 py-4"
              >
                <div className="flex items-center justify-between">
                  <Skeleton className="h-3.5 w-24 rounded" />
                  <Skeleton className="h-4 w-4 rounded-full" />
                </div>
                <div className="flex items-baseline gap-2">
                  <Skeleton className="h-7 w-16 rounded" />
                  <Skeleton className="h-3 w-8 rounded" />
                </div>
                <Skeleton className="h-4 w-28 rounded" />
              </Card>
            ))}
          </div>

          {/* Main 2-Column Balanced Layout Skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            {/* Left Column Skeleton */}
            <div className="lg:col-span-7 space-y-5">
              {/* Trajectory Chart Card Skeleton */}
              <Card className="border border-border/60 dark:border-zinc-800/80 bg-white/60 dark:bg-zinc-900/40 rounded-2xl p-4 space-y-4 py-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Skeleton className="h-4 w-36 rounded" />
                    <Skeleton className="h-3 w-64 rounded" />
                  </div>
                  <Skeleton className="h-5 w-20 rounded-md" />
                </div>
                <Skeleton className="h-[130px] w-full rounded-xl" />
              </Card>

              {/* 4-Pillar Matrix Skeleton */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-4 w-48 rounded" />
                  <Skeleton className="h-3 w-20 rounded" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-xl border border-border/60 dark:border-zinc-800/80 bg-white/60 dark:bg-zinc-900/40 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <Skeleton className="h-4 w-28 rounded" />
                        <Skeleton className="h-5 w-12 rounded" />
                      </div>
                      <Skeleton className="h-2 w-full rounded-full" />
                      <div className="flex items-center justify-between">
                        <Skeleton className="h-4 w-20 rounded" />
                        <Skeleton className="h-3 w-16 rounded" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actionable Recommendations Skeleton */}
              <Card className="border border-border/60 dark:border-zinc-800/80 bg-white/60 dark:bg-zinc-900/40 rounded-2xl p-4 space-y-3 py-4">
                <Skeleton className="h-4 w-52 rounded" />
                <div className="space-y-2">
                  <Skeleton className="h-10 w-full rounded-xl" />
                  <Skeleton className="h-10 w-full rounded-xl" />
                </div>
              </Card>
            </div>

            {/* Right Column Skeleton */}
            <div className="lg:col-span-5 space-y-5">
              {/* AI Coach Feedback Skeleton */}
              <Card className="border border-border/60 dark:border-zinc-800/80 bg-white/60 dark:bg-zinc-900/40 rounded-2xl p-4 space-y-3 py-4">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-4 w-40 rounded" />
                  <Skeleton className="h-5 w-24 rounded" />
                </div>
                <Skeleton className="h-12 w-full rounded-lg" />
                <Skeleton className="h-16 w-full rounded-xl" />
              </Card>

              {/* Diagnostic Spotlight Skeleton */}
              <Card className="border border-border/60 dark:border-zinc-800/80 bg-white/60 dark:bg-zinc-900/40 rounded-2xl p-4 space-y-3.5 py-4">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-4 w-32 rounded" />
                  <Skeleton className="h-5 w-16 rounded" />
                </div>
                <Skeleton className="h-14 w-full rounded-xl" />
                <Skeleton className="h-14 w-full rounded-xl" />
                <Skeleton className="h-14 w-full rounded-xl" />
              </Card>
            </div>
          </div>
        </div>
      ) : !hasEvaluations ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="border border-dashed border-border/80 dark:border-zinc-800 bg-white/50 dark:bg-zinc-950/30 backdrop-blur-md rounded-2xl p-8 sm:p-12 text-center shadow-xs py-4">
            <div className="max-w-md mx-auto space-y-4">
              <div className="h-12 w-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mx-auto shadow-inner">
                <BarChart3 className="h-6 w-6" />
              </div>
              <div className="space-y-1.5">
                <h2 className="text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                  No Evaluation Data Yet
                </h2>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Complete your first practice essay or submit an exam attempt. As
                  soon as your writing is evaluated, this dashboard will visualize
                  your 4-pillar performance, score progression, and personalized
                  examiner tips.
                </p>
              </div>
              <div className="pt-1">
                <Button
                  asChild
                  variant="blue"
                  className="h-9 px-4 rounded-xl font-bold shadow-md shadow-primary/20 cursor-pointer"
                >
                  <Link href="/dashboard/practice">
                    <Sparkles className="h-4 w-4 mr-1.5" />
                    Launch First Practice Session
                  </Link>
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>
      ) : (
        /* ── Main Data View ─────────────────────────────────────────── */
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="space-y-5"
        >
          {/* ── Compact Diagnostic Metrics Strip ───────────────────────── */}
          <motion.div
            variants={containerVariants}
            className="grid grid-cols-2 lg:grid-cols-4 gap-3"
          >
            {/* Overall Average Band */}
            <motion.div variants={itemVariants}>
              <Card className="border border-border/60 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/50 backdrop-blur-md rounded-xl p-3 sm:p-3.5 shadow-2xs hover:shadow-md transition-all duration-300 py-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-muted-foreground">
                    Overall average
                  </span>
                  <Target className="h-3.5 w-3.5 text-primary" />
                </div>
                <div className="mt-1.5 flex items-baseline gap-1.5">
                  <span className="text-xl sm:text-2xl font-black tracking-tight text-zinc-900 dark:text-zinc-50">
                    {stats?.averageBand ? stats.averageBand.toFixed(1) : "—"}
                  </span>
                  <span className="text-[11px] font-semibold text-muted-foreground">
                    / 9.0
                  </span>
                </div>
                <div className="mt-1.5">
                  <Badge
                    variant="outline"
                    className={cn(
                      "text-[9px] font-bold px-1.5 py-0 rounded border",
                      getBandLabel(stats?.averageBand ?? 0).color,
                    )}
                  >
                    {getBandLabel(stats?.averageBand ?? 0).label}
                  </Badge>
                </div>
              </Card>
            </motion.div>

            {/* Personal Best Band */}
            <motion.div variants={itemVariants}>
              <Card className="border border-border/60 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/50 backdrop-blur-md rounded-xl p-3 sm:p-3.5 shadow-2xs hover:shadow-md transition-all duration-300 py-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-muted-foreground">
                    Personal best
                  </span>
                  <Award className="h-3.5 w-3.5 text-amber-500" />
                </div>
                <div className="mt-1.5 flex items-baseline gap-1.5">
                  <span className="text-xl sm:text-2xl font-black tracking-tight text-amber-500">
                    {stats?.bestBand ? stats.bestBand.toFixed(1) : "—"}
                  </span>
                  <span className="text-[11px] font-semibold text-muted-foreground">
                    / 9.0
                  </span>
                </div>
                <div className="mt-1.5 text-[11px] text-muted-foreground flex items-center gap-1">
                  <Flame className="h-3 w-3 text-amber-500 shrink-0" />
                  <span>Peak score</span>
                </div>
              </Card>
            </motion.div>

            {/* Task 1 vs Task 2 Average */}
            <motion.div variants={itemVariants}>
              <Card className="border border-border/60 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/50 backdrop-blur-md rounded-xl p-3 sm:p-3.5 shadow-2xs hover:shadow-md transition-all duration-300 py-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-muted-foreground">
                    Task averages
                  </span>
                  <BarChart3 className="h-3.5 w-3.5 text-purple-500" />
                </div>
                <div className="mt-1.5 grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-[10px] font-medium text-muted-foreground">
                      Task 1
                    </span>
                    <div className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                      {stats?.task1Average ? stats.task1Average.toFixed(1) : "—"}
                    </div>
                  </div>
                  <div>
                    <span className="text-[10px] font-medium text-muted-foreground">
                      Task 2
                    </span>
                    <div className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                      {stats?.task2Average ? stats.task2Average.toFixed(1) : "—"}
                    </div>
                  </div>
                </div>
                <div className="mt-1 text-[10px] text-muted-foreground truncate">
                  {stats?.evaluatedCount ?? 0} evaluations
                </div>
              </Card>
            </motion.div>

            {/* Output & Pacing Efficiency */}
            <motion.div variants={itemVariants}>
              <Card className="border border-border/60 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/50 backdrop-blur-md rounded-xl p-3 sm:p-3.5 shadow-2xs hover:shadow-md transition-all duration-300 py-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-muted-foreground">
                    Writing output
                  </span>
                  <FileText className="h-3.5 w-3.5 text-emerald-500" />
                </div>
                <div className="mt-1.5 flex items-baseline gap-1">
                  <span className="text-xl sm:text-2xl font-black tracking-tight text-zinc-900 dark:text-zinc-50">
                    {stats?.avgWordCount ? stats.avgWordCount : "—"}
                  </span>
                  <span className="text-[11px] font-medium text-muted-foreground">
                    words avg
                  </span>
                </div>
                <div className="mt-1.5 text-[11px] text-muted-foreground flex items-center gap-1">
                  <Clock className="h-3 w-3 text-emerald-500 shrink-0" />
                  <span>
                    {stats?.avgDurationSec
                      ? `${Math.round(stats.avgDurationSec / 60)} mins active writing`
                      : "Pacing active"}
                  </span>
                </div>
              </Card>
            </motion.div>
          </motion.div>

          {/* ── Main 2-Column Balanced Dashboard Layout ───────────────── */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            {/* ── Left Column (7 cols): Trajectory -> 4-Pillars -> Recommendations ── */}
            <div className="lg:col-span-7 space-y-5">
              {/* Score Progression Trend Chart */}
              <motion.div variants={itemVariants}>
                <Card className="border border-border/60 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/50 backdrop-blur-md rounded-2xl shadow-2xs hover:shadow-md transition-all duration-300 overflow-hidden py-4">
                  <CardHeader className="p-3.5 sm:p-4 pb-2 border-b border-border/40 flex flex-row items-center justify-between">
                    <div className="space-y-0.5">
                      <CardTitle className="text-xs sm:text-sm font-bold flex items-center gap-1.5">
                        <TrendingUp className="h-4 w-4 text-primary" />
                        Band score trajectory
                      </CardTitle>
                      <CardDescription className="text-[11px]">
                        Chronological progression across your latest evaluated attempts
                      </CardDescription>
                    </div>
                    {trend.length > 0 && (
                      <Badge
                        variant="secondary"
                        className="text-[10px] font-mono py-0 h-5"
                      >
                        {trend.length} sessions
                      </Badge>
                    )}
                  </CardHeader>
                  <CardContent className="p-3.5 sm:p-4 pt-3 space-y-2">
                    {trend.length >= 2 ? (
                      <div className="w-full relative h-[130px] flex items-end">
                        <svg
                          className="w-full h-full overflow-visible"
                          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                          preserveAspectRatio="none"
                        >
                          <defs>
                            <linearGradient
                              id="scoreAreaGrad"
                              x1="0"
                              y1="0"
                              x2="0"
                              y2="1"
                            >
                              <stop
                                offset="0%"
                                stopColor="var(--color-primary, #2563eb)"
                                stopOpacity="0.25"
                              />
                              <stop
                                offset="100%"
                                stopColor="var(--color-primary, #2563eb)"
                                stopOpacity="0.0"
                              />
                            </linearGradient>
                          </defs>

                          {/* Band Score Horizontal Reference Lines */}
                          {[5, 6, 7, 8].map((score) => {
                            const y =
                              chartHeight -
                              paddingY -
                              ((score - minScore) / (maxScore - minScore)) *
                                (chartHeight - paddingY * 2);
                            return (
                              <g key={score}>
                                <line
                                  x1={paddingX}
                                  y1={y}
                                  x2={chartWidth - paddingX}
                                  y2={y}
                                  stroke="currentColor"
                                  className="text-border/40"
                                  strokeWidth="1"
                                  strokeDasharray="3 3"
                                />
                                <text
                                  x={paddingX - 6}
                                  y={y + 3.5}
                                  fontSize="9"
                                  textAnchor="end"
                                  className="fill-muted-foreground/70 font-mono font-semibold"
                                >
                                  {score}.0
                                </text>
                              </g>
                            );
                          })}

                          {/* Area fill */}
                          <path
                            d={`M ${paddingX},${chartHeight - paddingY} L ${points} L ${chartWidth - paddingX},${chartHeight - paddingY} Z`}
                            fill="url(#scoreAreaGrad)"
                          />

                          {/* Trend line */}
                          <polyline
                            fill="none"
                            stroke="var(--color-primary, #2563eb)"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            points={points}
                          />

                          {/* Plot markers */}
                          {trend.map((item, i) => {
                            const x =
                              paddingX +
                              (i * (chartWidth - paddingX * 2)) /
                                (trend.length - 1);
                            const y =
                              chartHeight -
                              paddingY -
                              ((Math.max(minScore, Math.min(maxScore, item.band)) -
                                minScore) /
                                (maxScore - minScore)) *
                                (chartHeight - paddingY * 2);
                            return (
                              <g key={item.id ? String(item.id) : i}>
                                <circle
                                  cx={x}
                                  cy={y}
                                  r="4"
                                  className="fill-white dark:fill-zinc-950 stroke-primary transition-all"
                                  strokeWidth="2"
                                />
                              </g>
                            );
                          })}
                        </svg>
                      </div>
                    ) : (
                      <div className="h-[110px] flex items-center justify-center text-xs text-muted-foreground border border-dashed rounded-xl">
                        Complete at least 2 evaluated essays to plot your trajectory curve.
                      </div>
                    )}

                    <div className="flex items-center justify-between text-[10px] font-medium text-muted-foreground/70 px-1 border-t border-border/30 pt-1.5">
                      <span>First attempt</span>
                      <span>Latest attempt</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* 4-Pillar Examiner Performance Matrix */}
              <motion.div variants={itemVariants} className="space-y-2">
                <div className="flex items-center justify-between">
                  <h2 className="text-xs sm:text-sm font-bold text-zinc-900 dark:text-zinc-50 flex items-center gap-1.5">
                    <ShieldCheck className="h-4 w-4 text-primary" />
                    4-Pillar examiner performance matrix
                  </h2>
                  <span className="text-[11px] text-muted-foreground">
                    25% weight each
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {criteriaList.map((item) => {
                    const isSelected = selectedCriterion === item.key;
                    const percent = Math.min(
                      100,
                      Math.max(0, (item.score / 9) * 100),
                    );

                    return (
                      <button
                        key={item.key}
                        type="button"
                        onClick={() => setSelectedCriterion(item.key)}
                        className={cn(
                          "w-full text-left p-3 rounded-xl border transition-all duration-200 cursor-pointer relative overflow-hidden flex flex-col justify-between space-y-2.5 hover:scale-[1.01]",
                          isSelected
                            ? "bg-primary/5 border-primary/50 shadow-2xs ring-1 ring-primary/20"
                            : "bg-white dark:bg-zinc-900/50 border-border/60 dark:border-zinc-800/80 hover:border-border hover:bg-zinc-50/50 dark:hover:bg-zinc-900/80",
                        )}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="flex items-center gap-1">
                              <span className="font-bold text-xs text-primary">
                                {item.guide.code}
                              </span>
                              <span className="text-[10px] text-muted-foreground">
                                • {item.guide.weight}
                              </span>
                            </div>
                            <h3 className="font-semibold text-xs text-zinc-900 dark:text-zinc-100 mt-0.5">
                              {item.guide.name}
                            </h3>
                          </div>

                          <div className="text-right shrink-0">
                            <span className="text-base font-black text-zinc-900 dark:text-zinc-50">
                              {item.score > 0 ? item.score.toFixed(1) : "—"}
                            </span>
                            <span className="text-[10px] text-muted-foreground font-semibold">
                              {" "}
                              / 9.0
                            </span>
                          </div>
                        </div>

                        <div className="space-y-1">
                          <div className="flex justify-between text-[10px] text-muted-foreground font-medium">
                            <span>Proficiency</span>
                            <span>
                              {item.score > 0
                                ? `${Math.round(percent)}%`
                                : "Pending"}
                            </span>
                          </div>
                          <Progress
                            value={percent}
                            className="h-1.5 bg-zinc-100 dark:bg-zinc-800"
                          />
                        </div>

                        <div className="flex items-center justify-between pt-0.5 text-[10px]">
                          {item.isLowest ? (
                            <Badge
                              variant="outline"
                              className="text-[9px] bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20 py-0 font-semibold"
                            >
                              ⚠️ Priority focus
                            </Badge>
                          ) : item.isHighest ? (
                            <Badge
                              variant="outline"
                              className="text-[9px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 py-0 font-semibold"
                            >
                              🌟 Highest pillar
                            </Badge>
                          ) : (
                            <span className="text-muted-foreground text-[10px]">
                              Standard pillar
                            </span>
                          )}

                          <span className="font-semibold text-primary flex items-center gap-0.5">
                            View details <ChevronRight className="h-3 w-3" />
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </motion.div>

              {/* Actionable Examiner Recommendations Card (Placed below 4-Pillar Matrix) */}
              <motion.div variants={itemVariants}>
                <Card className="border border-border/60 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/50 backdrop-blur-md rounded-2xl shadow-2xs hover:shadow-md transition-all duration-300 overflow-hidden py-4">
                  <CardHeader className="p-3.5 sm:p-4 pb-2 border-b border-border/40 flex flex-row items-center justify-between">
                    <div className="space-y-0.5">
                      <CardTitle className="text-xs sm:text-sm font-bold flex items-center gap-1.5">
                        <Target className="h-4 w-4 text-emerald-500" />
                        Actionable examiner recommendations
                      </CardTitle>
                      <CardDescription className="text-[11px]">
                        Aggregated directly from your recent essay evaluation feedback
                      </CardDescription>
                    </div>
                    {recentTips.length > 0 && (
                      <Badge
                        variant="secondary"
                        className="text-[10px] font-mono py-0 h-5"
                      >
                        {recentTips.length} tips
                      </Badge>
                    )}
                  </CardHeader>
                  <CardContent className="p-3.5 sm:p-4 pt-2.5">
                    {recentTips.length > 0 ? (
                      <div className="space-y-2">
                        {recentTips.map((tip, idx) => (
                          <div
                            key={idx}
                            className="p-2.5 rounded-xl border border-border/40 bg-zinc-50/50 dark:bg-zinc-900/30 flex items-start gap-2 text-xs"
                          >
                            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" />
                            <p className="text-zinc-800 dark:text-zinc-200 leading-relaxed font-medium text-[11px]">
                              {tip}
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-4 rounded-xl border border-dashed text-center text-xs text-muted-foreground space-y-2">
                        <p>
                          Submit essays with feedback enabled to collect examiner
                          correction tips.
                        </p>
                        <Button
                          asChild
                          variant="outline"
                          size="sm"
                          className="h-7 text-xs rounded-lg cursor-pointer"
                        >
                          <Link href="/dashboard/practice">Start Practice</Link>
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* ── Right Column (5 cols): AI Coach Analysis -> Diagnostic Spotlight ── */}
            <div className="lg:col-span-5 space-y-5">
              {/* Daily AI Coach Feedback */}
              <motion.div variants={itemVariants}>
                <Card className="border border-border/60 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/50 backdrop-blur-md rounded-2xl shadow-2xs hover:shadow-md transition-all duration-300 overflow-hidden py-4">
                  <CardHeader className="p-3.5 sm:p-4 pb-2 border-b border-border/40 flex flex-row items-center justify-between">
                    <CardTitle className="text-xs sm:text-sm font-bold flex items-center gap-1.5">
                      <MessageSquareQuote className="h-4 w-4 text-primary" />
                      Examiner coach analysis
                    </CardTitle>
                    {dailyComment && (
                      <Badge
                        className={cn(
                          "text-[10px] font-semibold py-0 px-2 h-5",
                          dailyComment.tone === "positive"
                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                            : dailyComment.tone === "push"
                              ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
                              : "bg-primary/10 text-primary border-primary/20",
                        )}
                      >
                        {dailyComment.tone === "positive"
                          ? "Upward trend"
                          : dailyComment.tone === "push"
                            ? "Needs focus"
                            : "Steady progress"}
                      </Badge>
                    )}
                  </CardHeader>
                  <CardContent className="p-3.5 sm:p-4 pt-2.5 space-y-3">
                    <p className="text-xs text-zinc-800 dark:text-zinc-200 leading-relaxed font-medium italic">
                      "{dailyComment?.text || "Submit more essays to unlock personalized AI diagnostic comments based on your performance."}"
                    </p>

                    {/* Rework Wins Delta */}
                    {improvements.length > 0 && (
                      <div className="p-2.5 rounded-xl bg-emerald-500/5 border border-emerald-500/20 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                            <Zap className="h-3 w-3" /> Rework mastery gains
                          </span>
                          <span className="text-[10px] font-medium text-emerald-600 dark:text-emerald-400">
                            {improvements.length} draft
                            {improvements.length > 1 ? "s" : ""}
                          </span>
                        </div>
                        <div className="space-y-0.5">
                          {improvements.slice(0, 3).map((imp, idx) => (
                            <div
                              key={idx}
                              className="flex items-center justify-between text-[11px] font-medium"
                            >
                              <span className="text-muted-foreground">
                                Draft Rework #{idx + 1}
                              </span>
                              <span className="text-zinc-900 dark:text-zinc-100 font-mono">
                                {imp.fromBand.toFixed(1)} → {imp.toBand.toFixed(1)}{" "}
                                <span className="text-emerald-500 font-bold ml-1">
                                  (+{imp.delta.toFixed(1)})
                                </span>
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>

              {/* Selected Criterion Deep Dive (Diagnostic Spotlight) */}
              <motion.div variants={itemVariants}>
                <Card className="border border-border/60 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/50 backdrop-blur-md rounded-2xl shadow-2xs hover:shadow-md transition-all duration-300 overflow-hidden py-4">
                  <CardHeader className="p-3.5 sm:p-4 pb-2 border-b border-border/40 flex flex-row items-center justify-between">
                    <div>
                      <span className="text-[10px] font-semibold text-primary block">
                        Diagnostic spotlight
                      </span>
                      <CardTitle className="text-xs sm:text-sm font-bold mt-0.5">
                        {CRITERIA_GUIDE[selectedCriterion].name}
                      </CardTitle>
                    </div>
                    <Badge
                      variant="outline"
                      className="font-mono text-xs font-bold py-0 h-5"
                    >
                      {criteria?.[selectedCriterion]
                        ? `${criteria[selectedCriterion].toFixed(1)} Band`
                        : "—"}
                    </Badge>
                  </CardHeader>
                  <CardContent className="p-3.5 sm:p-4 pt-2.5 space-y-3 text-xs">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={selectedCriterion}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.15 }}
                        className="space-y-3"
                      >
                        <div className="space-y-1">
                          <span className="text-[10px] font-semibold text-muted-foreground block">
                            What examiners look for
                          </span>
                          <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed text-[11px]">
                            {CRITERIA_GUIDE[selectedCriterion].description}
                          </p>
                        </div>

                        <div className="p-2.5 rounded-xl bg-amber-500/5 border border-amber-500/20 space-y-0.5">
                          <span className="text-[10px] font-semibold text-amber-600 dark:text-amber-400 flex items-center gap-1">
                            <AlertTriangle className="h-3 w-3" /> Common candidate pitfall
                          </span>
                          <p className="text-muted-foreground leading-relaxed text-[11px]">
                            {CRITERIA_GUIDE[selectedCriterion].commonWeakness}
                          </p>
                        </div>

                        <div className="p-2.5 rounded-xl bg-primary/5 border border-primary/20 space-y-0.5">
                          <span className="text-[10px] font-semibold text-primary flex items-center gap-1">
                            <Sparkles className="h-3 w-3" /> Band 7+ strategy
                          </span>
                          <p className="text-zinc-800 dark:text-zinc-200 leading-relaxed text-[11px] font-medium">
                            {CRITERIA_GUIDE[selectedCriterion].targetTip}
                          </p>
                        </div>
                      </motion.div>
                    </AnimatePresence>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </motion.div>
      )}
    </DashboardShell>
  );
};

export default AnalyticsPage;
