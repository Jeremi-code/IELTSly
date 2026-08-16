"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Award,
  BookOpen,
  CircleAlert,
  TrendingUp,
  Clock,
  ChevronRight,
  Zap,
  CheckCircle2,
  PenTool,
  ArrowRight,
  Flame,
  BarChart3,
  Bot,
  Brain,
  Layers,
  ShieldCheck,
  Timer,
} from "lucide-react";
import { motion } from "framer-motion";
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
import DashboardShell from "../components/DashboardShell";
import QuestionSelectorModal from "../components/QuestionSelectorModal";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useSession } from "@/lib/auth-client";
import { getAnalytics, getEssays, getAICredentials, timeAgo } from "@/lib/api";
import type { Essay } from "@/types/essay";
import type {
  AnalyticsStats,
  CriteriaAverages,
  DailyComment,
} from "@/types/analytics";
import type { AICredentialStatus } from "@/types/ai";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
    },
  },
};

const itemVariants = {
  hidden: { y: 12, opacity: 0 },
  show: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 140, damping: 16 } as const,
  },
};

export default function DashboardPage() {
  const { data: session } = useSession();
  const user = session?.user;
  const displayName = user?.name || user?.email?.split("@")[0] || "Scholar";

  const [stats, setStats] = useState<AnalyticsStats | null>(null);
  const [criteriaAverages, setCriteriaAverages] =
    useState<CriteriaAverages | null>(null);
  const [dailyComment, setDailyComment] = useState<DailyComment | null>(null);
  const [recent, setRecent] = useState<Essay[]>([]);
  const [loading, setLoading] = useState(true);
  const [aiStatus, setAiStatus] = useState<AICredentialStatus>({
    isConnected: false,
  });

  // Prompt Selector Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedMode, setSelectedMode] = useState<"practice" | "exam">(
    "practice",
  );
  const [defaultTaskFilter, setDefaultTaskFilter] = useState<
    "all" | "task1" | "task2"
  >("all");

  const openPromptModal = (
    mode: "practice" | "exam",
    taskType: "all" | "task1" | "task2" = "all",
  ) => {
    setSelectedMode(mode);
    setDefaultTaskFilter(taskType);
    setModalOpen(true);
  };

  useEffect(() => {
    let mounted = true;
    setLoading(true);

    Promise.allSettled([
      getAnalytics(),
      getEssays({ limit: 6 }),
      getAICredentials(),
    ]).then(([analyticsRes, essaysRes, aiRes]) => {
      if (!mounted) return;

      if (analyticsRes.status === "fulfilled") {
        setStats(analyticsRes.value.stats);
        setCriteriaAverages(analyticsRes.value.criteriaAverages);
        setDailyComment(analyticsRes.value.dailyComment);
      }

      if (essaysRes.status === "fulfilled") {
        setRecent(essaysRes.value.essays || []);
      }

      if (aiRes.status === "fulfilled") {
        setAiStatus(aiRes.value);
      }

      setLoading(false);
    });

    return () => {
      mounted = false;
    };
  }, []);

  const isConnected = aiStatus.isConnected;
  const isGemini = aiStatus.provider === "gemini";
  const isOpenAI = aiStatus.provider === "openai";
  const providerLabel = isGemini
    ? "Google Gemini"
    : isOpenAI
      ? "OpenAI GPT-4o"
      : "AI Engine";

  // Dynamic header subtitle based on real performance
  const dynamicSubtitle = useMemo(() => {
    if (!stats || stats.totalAttempts === 0) {
      return `Welcome to IELTSly. Select a practice mode or prompt to start writing and unlock AI-powered band scoring.`;
    }
    if (stats.evaluatedCount === 0) {
      return `You have ${stats.totalAttempts} practice attempt${stats.totalAttempts > 1 ? "s" : ""} in progress. Submit for evaluation to see your official IELTS band score.`;
    }
    return `Welcome back, ${displayName}! You've completed ${stats.evaluatedCount} evaluated essay${stats.evaluatedCount > 1 ? "s" : ""} with a personal best of Band ${stats.bestBand.toFixed(1)}.`;
  }, [stats, displayName]);

  // Executive Metric Cards with clean casing and refined aesthetics
  const metricCards = useMemo(
    () => [
      {
        title: "Total essays",
        value: stats ? String(stats.totalAttempts) : "0",
        detail: stats
          ? `${stats.evaluatedCount} evaluated • ${stats.inProgressCount} in progress`
          : "0 essays written",
        icon: BookOpen,
        color: "text-blue-600 dark:text-blue-400",
        bg: "bg-blue-50 dark:bg-blue-950/40",
        border: "border-blue-100 dark:border-blue-900/40",
      },
      {
        title: "Average band",
        value:
          stats && stats.averageBand > 0 ? stats.averageBand.toFixed(1) : "—",
        detail:
          stats && stats.bestBand > 0
            ? `Personal best: Band ${stats.bestBand.toFixed(1)}`
            : "Target: Band 7.5+",
        icon: TrendingUp,
        color: "text-emerald-600 dark:text-emerald-400",
        bg: "bg-emerald-50 dark:bg-emerald-950/40",
        border: "border-emerald-100 dark:border-emerald-900/40",
      },
      {
        title: "Task 1 average",
        value:
          stats && stats.task1Average > 0 ? stats.task1Average.toFixed(1) : "—",
        detail: "Charts, maps & diagrams",
        icon: BarChart3,
        color: "text-violet-600 dark:text-violet-400",
        bg: "bg-violet-50 dark:bg-violet-950/40",
        border: "border-violet-100 dark:border-violet-900/40",
      },
      {
        title: "Task 2 average",
        value:
          stats && stats.task2Average > 0 ? stats.task2Average.toFixed(1) : "—",
        detail: "Discursive academic essays",
        icon: Award,
        color: "text-amber-600 dark:text-amber-400",
        bg: "bg-amber-50 dark:bg-amber-950/40",
        border: "border-amber-100 dark:border-amber-900/40",
      },
    ],
    [stats],
  );

  // Criteria progress indicators
  const criteriaList = useMemo(() => {
    const defaultVal = 0;
    return [
      {
        code: "TA",
        name: "Task Achievement",
        score: criteriaAverages?.ta || defaultVal,
        color: "bg-blue-500",
        textColor: "text-blue-600 dark:text-blue-400",
        desc: "Addresses all parts with well-developed ideas",
      },
      {
        code: "CC",
        name: "Coherence & Cohesion",
        score: criteriaAverages?.cc || defaultVal,
        color: "bg-emerald-500",
        textColor: "text-emerald-600 dark:text-emerald-400",
        desc: "Logical progression & cohesive links",
      },
      {
        code: "LR",
        name: "Lexical Resource",
        score: criteriaAverages?.lr || defaultVal,
        color: "bg-violet-500",
        textColor: "text-violet-600 dark:text-violet-400",
        desc: "Academic vocabulary & precision",
      },
      {
        code: "GRA",
        name: "Grammar & Accuracy",
        score: criteriaAverages?.gra || defaultVal,
        color: "bg-amber-500",
        textColor: "text-amber-600 dark:text-amber-400",
        desc: "Sentence complexity & punctuation",
      },
    ];
  }, [criteriaAverages]);

  // Weekly Goal Calculation (dynamic from real attempts, target = 5 essays)
  const weeklyTarget = 5;
  const weeklyCompleted = Math.min(stats?.totalAttempts || 0, weeklyTarget);
  const weeklyPercent = Math.round((weeklyCompleted / weeklyTarget) * 100);

  return (
    <DashboardShell className="max-w-[1400px] p-4 sm:p-6 lg:p-8 space-y-6">
      {/* ── QUESTION SELECTOR MODAL ──────────────────────────────────── */}
      <QuestionSelectorModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        mode={selectedMode}
        defaultTaskType={defaultTaskFilter}
      />

      {/* ── HERO HEADER ──────────────────────────────────────────────── */}
      <motion.header
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-zinc-900 dark:text-zinc-50">
            Welcome back,{" "}
            <span className="text-primary italic">{displayName}</span>
          </h1>
          <p className="text-muted-foreground text-xs sm:text-sm max-w-2xl leading-relaxed">
            {dynamicSubtitle}
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Button
            variant="blue"
            size="default"
            onClick={() => openPromptModal("practice")}
            className="h-10 px-5 rounded-xl font-bold shadow-xs hover:scale-[1.02] active:scale-95 transition-all cursor-pointer flex items-center gap-2 text-xs sm:text-sm"
          >
            <Zap className="h-4 w-4 fill-current" />
            Start Practice Session
            <ArrowRight className="h-4 w-4 ml-0.5" />
          </Button>
        </div>
      </motion.header>

      {/* ── AI STATUS BANNER ─────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08 }}
      >
        {!isConnected ? (
          <Card className="border border-amber-200 dark:border-amber-900/40 bg-amber-50/50 dark:bg-amber-950/20 rounded-2xl shadow-xs overflow-hidden">
            <CardContent className="p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-xl bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                  <CircleAlert className="h-4 w-4" />
                </div>
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-xs sm:text-sm text-zinc-900 dark:text-zinc-100">
                      AI Examiner Offline
                    </h3>
                    <Badge
                      variant="outline"
                      className="text-[10px] font-medium border-amber-300 dark:border-amber-800 text-amber-700 dark:text-amber-400"
                    >
                      Setup required
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground max-w-2xl">
                    Connect your free <strong>Google Gemini</strong> or{" "}
                    <strong>OpenAI</strong> API key to unlock instant band
                    scoring, criteria breakdown, and examiner feedback.
                  </p>
                </div>
              </div>
              <Link
                href="/dashboard/settings?tab=api"
                className="shrink-0 w-full md:w-auto"
              >
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full md:w-auto rounded-xl text-xs font-bold border-amber-300 dark:border-amber-800 text-amber-800 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/40 transition-all cursor-pointer"
                >
                  <Bot className="h-3.5 w-3.5 mr-1.5" />
                  Connect API Key
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <Card
            className={cn(
              "rounded-2xl shadow-xs border transition-all",
              isGemini
                ? "border-blue-200 dark:border-blue-900/40 bg-blue-50/40 dark:bg-blue-950/20"
                : "border-emerald-200 dark:border-emerald-900/40 bg-emerald-50/40 dark:bg-emerald-950/20",
            )}
          >
            <CardContent className="p-3.5 sm:p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "h-9 w-9 rounded-xl flex items-center justify-center shrink-0",
                    isGemini
                      ? "bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400"
                      : "bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400",
                  )}
                >
                  <CheckCircle2 className="h-4 w-4" />
                </div>
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-xs sm:text-sm text-zinc-900 dark:text-zinc-100">
                      {providerLabel}
                    </h3>
                    <Badge
                      className={cn(
                        "text-[10px] font-medium tracking-wide",
                        isGemini
                          ? "bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 border-blue-200"
                          : "bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 border-emerald-200",
                      )}
                    >
                      Connected
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Band evaluations and examiner insights are active using your
                    connected API key.
                  </p>
                </div>
              </div>
              <Link
                href="/dashboard/settings?tab=api"
                className="shrink-0 w-full md:w-auto"
              >
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full md:w-auto rounded-xl text-xs font-semibold cursor-pointer border-border/60 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                >
                  Configure Key
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </motion.div>

      {/* ── METRICS GRID (COMPACT, CRISP DESIGN) ──────────────────────── */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5"
      >
        {metricCards.map((metric) => (
          <motion.div key={metric.title} variants={itemVariants}>
            <Card className="border border-border/60 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/50 backdrop-blur-md rounded-2xl shadow-2xs hover:shadow-sm hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-200">
              <CardContent className="p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-muted-foreground">
                    {metric.title}
                  </span>
                  <div
                    className={cn(
                      "h-7 w-7 rounded-lg flex items-center justify-center shrink-0 border",
                      metric.bg,
                      metric.border,
                    )}
                  >
                    <metric.icon className={cn("h-3.5 w-3.5", metric.color)} />
                  </div>
                </div>

                <div className="space-y-0.5">
                  <div className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                    {metric.value}
                  </div>
                  <p className="text-[11px] text-muted-foreground font-medium">
                    {metric.detail}
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* ── EXAMINER DAILY COACHING & WEEKLY TARGET ───────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Examiner Daily Advice (Dynamic from backend, compact & seamless) */}
        <Card className="lg:col-span-2 border border-border/60 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/50 backdrop-blur-md rounded-2xl shadow-2xs flex flex-col justify-between overflow-hidden">
          <CardHeader className="p-4 pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-7 w-7 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-primary">
                  <Brain className="h-3.5 w-3.5" />
                </div>
                <div>
                  <CardTitle className="text-sm font-bold">
                    Examiner insight & focus
                  </CardTitle>
                </div>
              </div>
              <Badge
                variant="outline"
                className={cn(
                  "text-[10px] font-semibold tracking-wider",
                  dailyComment?.tone === "positive"
                    ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border-emerald-200"
                    : dailyComment?.tone === "push"
                      ? "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border-amber-200"
                      : "bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400 border-blue-200",
                )}
              >
                {dailyComment?.tone === "positive"
                  ? "Strong momentum"
                  : dailyComment?.tone === "push"
                    ? "Focus area"
                    : "Daily guidance"}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-1 space-y-3">
            <div className="p-3 rounded-xl bg-zinc-50/80 dark:bg-zinc-900/50 border border-border/50">
              <p className="text-xs sm:text-sm leading-relaxed text-zinc-700 dark:text-zinc-300 font-medium">
                {dailyComment?.text ||
                  "Welcome to IELTSly! Submit your first essay to unlock personalised examiner feedback and criteria scoring."}
              </p>
            </div>

            {/* Criteria breakdown gauges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-0.5">
              {criteriaList.map((c) => (
                <div
                  key={c.code}
                  className="p-2.5 rounded-xl bg-zinc-50/60 dark:bg-zinc-900/30 border border-border/40 space-y-1"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-muted-foreground text-[11px]">
                      {c.code}
                    </span>
                    <span className={cn("font-bold text-xs", c.textColor)}>
                      {c.score > 0 ? c.score.toFixed(1) : "—"}
                    </span>
                  </div>
                  <Progress
                    value={c.score > 0 ? (c.score / 9) * 100 : 0}
                    className="h-1"
                  />
                  <span className="text-[10px] text-muted-foreground block truncate">
                    {c.name}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Weekly Milestone & Streak Goal */}
        <Card className="border border-border/60 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/50 backdrop-blur-md rounded-2xl shadow-2xs flex flex-col justify-between overflow-hidden">
          <CardHeader className="p-4 pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-7 w-7 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-500">
                  <Flame className="h-3.5 w-3.5 fill-current" />
                </div>
                <div>
                  <CardTitle className="text-sm font-bold">
                    Weekly target
                  </CardTitle>
                </div>
              </div>
              <span className="text-xs font-mono font-bold text-primary">
                {weeklyCompleted}/{weeklyTarget} essays
              </span>
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-1 space-y-3.5">
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-muted-foreground text-[11px]">
                  Progress to goal
                </span>
                <span className="text-zinc-900 dark:text-zinc-100">
                  {weeklyPercent}%
                </span>
              </div>
              <Progress value={weeklyPercent} className="h-1.5 rounded-full" />
            </div>

            <div className="p-2.5 rounded-xl bg-zinc-50/80 dark:bg-zinc-900/50 border border-border/40 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                <span className="font-semibold text-xs text-zinc-900 dark:text-zinc-100">
                  Band 7.5 Consistency
                </span>
              </div>
              <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 text-[10px] py-0">
                +50 XP
              </Badge>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => openPromptModal("practice")}
              className="w-full text-xs font-bold rounded-xl border-primary/20 text-primary hover:bg-primary hover:text-white transition-all cursor-pointer h-8"
            >
              Practice Today's Task
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* ── RECENT ACTIVITY & SUBMISSIONS SECTION ─────────────────────── */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              Recent writing activity
            </h2>
            <p className="text-xs text-muted-foreground">
              Review recent attempts, band evaluations, and revision history
            </p>
          </div>
          <Link href="/dashboard/history">
            <Button
              variant="ghost"
              size="sm"
              className="text-xs font-semibold hover:text-primary transition-colors cursor-pointer"
            >
              View full history <ChevronRight className="h-3.5 w-3.5 ml-1" />
            </Button>
          </Link>
        </div>

        {recent.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recent.map((essay) => {
              const band = essay.evaluation?.overallBand;
              const hasScore = typeof band === "number" && band > 0;
              const isTask1 = essay.type === "task1";

              return (
                <Card
                  key={essay._id}
                  className="group border border-border/60 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/50 backdrop-blur-md rounded-2xl shadow-2xs hover:shadow-sm hover:border-primary/30 transition-all duration-200 flex flex-col justify-between overflow-hidden"
                >
                  <CardHeader className="p-4 pb-2 space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <Badge
                        variant="outline"
                        className={cn(
                          "text-[10px] font-semibold uppercase tracking-wider py-0.5",
                          isTask1
                            ? "bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-400 border-purple-200"
                            : "bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400 border-blue-200",
                        )}
                      >
                        {isTask1 ? "Task 1 (Visual)" : "Task 2 (Essay)"}
                      </Badge>
                      <span className="text-[11px] text-muted-foreground font-medium flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {timeAgo(essay.createdAt)}
                      </span>
                    </div>

                    <CardTitle className="text-sm font-bold line-clamp-2 leading-snug group-hover:text-primary transition-colors">
                      {essay.question?.text || "IELTS Practice Question"}
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="p-4 pt-2 space-y-3">
                    <div className="flex items-center justify-between pt-2 border-t border-border/40 text-xs">
                      <div className="flex items-center gap-2">
                        <div
                          className={cn(
                            "h-9 w-9 rounded-xl font-black text-sm flex items-center justify-center",
                            hasScore
                              ? band >= 7.5
                                ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400"
                                : band >= 6.5
                                  ? "bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400"
                                  : "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400"
                              : "bg-zinc-100 dark:bg-zinc-800 text-muted-foreground",
                          )}
                        >
                          {hasScore ? band.toFixed(1) : "—"}
                        </div>
                        <div>
                          <span className="font-bold text-xs block leading-none">
                            {hasScore
                              ? `Band ${band.toFixed(1)}`
                              : "In Progress"}
                          </span>
                          <span className="text-[10px] text-muted-foreground">
                            {essay.wordCount || 0} words •{" "}
                            {essay.durationSec >= 60
                              ? `${Math.round(essay.durationSec / 60)}m`
                              : `${essay.durationSec}s`}
                          </span>
                        </div>
                      </div>

                      <Link href={`/writingbox?essayId=${essay._id}`}>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 px-2.5 rounded-lg text-xs font-semibold group-hover:bg-primary group-hover:text-white transition-all cursor-pointer"
                        >
                          Review
                          <ChevronRight className="h-3.5 w-3.5 ml-0.5" />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          /* ── NO RECENT ACTIVITY (EMPTY STATE WITH CLEAR MODES) ─────── */
          <Card className="border border-dashed border-border/80 dark:border-zinc-800 bg-white/40 dark:bg-zinc-950/20 backdrop-blur-xl rounded-3xl overflow-hidden p-8 sm:p-12 text-center">
            <div className="max-w-md mx-auto space-y-6">
              <div className="h-16 w-16 rounded-2xl bg-zinc-100 dark:bg-zinc-800 text-primary flex items-center justify-center mx-auto">
                <PenTool className="h-8 w-8" />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-xl sm:text-2xl font-black tracking-tight text-zinc-900 dark:text-zinc-50">
                  No recent activity yet
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  You haven't submitted any essays recently. Start a practice
                  task at your own pace or enter exam simulation mode to track
                  your band score progress.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <Button
                  variant="blue"
                  onClick={() => openPromptModal("practice")}
                  className="w-full sm:w-auto font-bold rounded-xl px-5 shadow-sm cursor-pointer flex items-center gap-2"
                >
                  <Zap className="h-4 w-4 fill-current" />
                  Launch Practice Mode
                </Button>

                <Button
                  variant="outline"
                  onClick={() => openPromptModal("exam")}
                  className="w-full sm:w-auto font-bold rounded-xl px-5 border-border/80 cursor-pointer flex items-center gap-2"
                >
                  <Timer className="h-4 w-4 text-primary" />
                  Start Exam Mode (20/40m Timer)
                </Button>
              </div>
            </div>
          </Card>
        )}
      </div>

      {/* ── QUICK START PROMPT TOPICS ─────────────────────────────────── */}
      <div className="space-y-4 pt-4 border-t border-border/40">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
            <Layers className="h-4 w-4 text-primary" />
            Quick practice categories
          </h2>
          <span className="text-xs text-muted-foreground">
            Authentic Cambridge & Liz question taxonomy
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            {
              label: "Agree / Disagree",
              type: "task2" as const,
              count: "Task 2",
            },
            {
              label: "Discuss Both Views",
              type: "task2" as const,
              count: "Task 2",
            },
            {
              label: "Advantages & Dis.",
              type: "task2" as const,
              count: "Task 2",
            },
            { label: "Bar Charts", type: "task1" as const, count: "Task 1" },
            { label: "Line Graphs", type: "task1" as const, count: "Task 1" },
            {
              label: "Pie Charts & Tables",
              type: "task1" as const,
              count: "Task 1",
            },
          ].map((cat) => (
            <button
              key={cat.label}
              onClick={() => openPromptModal("practice", cat.type)}
              className="p-3.5 rounded-xl border border-border/50 dark:border-zinc-800/80 bg-white/60 dark:bg-zinc-950/40 hover:border-primary/40 hover:bg-primary/5 transition-all text-left group block shadow-2xs cursor-pointer"
            >
              <span className="text-[10px] font-mono uppercase font-bold text-muted-foreground/70 block">
                {cat.count}
              </span>
              <span className="font-bold text-xs text-zinc-900 dark:text-zinc-100 group-hover:text-primary transition-colors block mt-0.5 truncate">
                {cat.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </DashboardShell>
  );
}
