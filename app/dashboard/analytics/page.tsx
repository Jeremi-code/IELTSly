"use client";

import React, { useState, useEffect, useMemo } from "react";
import DashboardShell from "../../components/DashboardShell";
import { motion } from "framer-motion";
import {
  TrendingUp,
  Award,
  BookOpen,
  CheckCircle,
  AlertTriangle,
  ChevronRight,
  Sparkles,
  Search,
  ArrowUpRight,
  ThumbsUp,
  Brain,
  ListRestart,
  MessageSquareQuote,
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

const criteriaMeta = [
  {
    name: "Task Achievement",
    target: 8.0,
    description:
      "Addresses all parts of the task, though some points could be more fully developed.",
    tip: "Provide 2-3 specific supporting details for each main argument to raise this score.",
    color: "from-emerald-500 to-teal-500",
    bg: "bg-emerald-500/10",
  },
  {
    name: "Coherence & Cohesion",
    target: 8.0,
    description:
      "Information and ideas are logically organized with clear overall progression.",
    tip: "Use a wider range of cohesive devices and ensure clear paragraphing structure.",
    color: "from-emerald-500 to-teal-500",
    bg: "bg-emerald-500/10",
  },
  {
    name: "Lexical Resource",
    target: 7.5,
    description:
      "Uses a sufficient range of vocabulary to allow some flexibility and precision.",
    tip: "Integrate more academic collocations and avoid repeating basic synonyms.",
    color: "from-purple-500 to-pink-500",
    bg: "bg-purple-500/10",
  },
  {
    name: "Grammatical Range & Accuracy",
    target: 8.0,
    description:
      "Uses a wide mix of structures with frequent error-free sentences.",
    tip: "Maintain tense consistency when switching between hypothetical and factual clauses.",
    color: "from-amber-500 to-orange-500",
    bg: "bg-amber-500/10",
  },
];

// Mock common mistakes
const commonMistakes = [
  {
    id: 1,
    category: "Grammar",
    title: "Subject-Verb Agreement",
    frequency: 8,
    severity: "High",
    example: "The research show that...",
    correction: "The research shows that...",
  },
  {
    id: 2,
    category: "Vocabulary",
    title: "Vague Synonyms",
    frequency: 6,
    severity: "Medium",
    example: "Things like climate change...",
    correction: "Phenomena such as climate change...",
  },
  {
    id: 3,
    category: "Cohesion",
    title: "Overusing basic transitionals",
    frequency: 5,
    severity: "Low",
    example: "And then, the graph rises...",
    correction: "Subsequently, the graph registers an upward trend...",
  },
  {
    id: 4,
    category: "Punctuation",
    title: "Comma Splice in complex sentences",
    frequency: 4,
    severity: "Medium",
    example: "The rate increased, this led to...",
    correction: "The rate increased, which led to...",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1 },
};

const AnalyticsPage = () => {
  const [selectedCriteria, setSelectedCriteria] = useState(0);
  const [data, setData] = useState<AnalyticsPayload | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAnalytics()
      .then(setData)
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, []);

  const criteriaScores = useMemo(
    () =>
      criteriaMeta.map((meta, idx) => ({
        ...meta,
        score: data?.criteriaAverages
          ? ([
              data.criteriaAverages.ta,
              data.criteriaAverages.cc,
              data.criteriaAverages.lr,
              data.criteriaAverages.gra,
            ][idx] ?? 0)
          : 0,
      })),
    [data],
  );

  const chartData = useMemo(() => data?.trend.map((t) => t.band) ?? [], [data]);

  // SVG Chart path calculation
  const chartHeight = 120;
  const chartWidth = 500;
  const padding = 20;
  const maxScore = 9;
  const minScore = 4;

  const points =
    chartData.length >= 2
      ? chartData
          .map((val, i) => {
            const x =
              padding +
              (i * (chartWidth - padding * 2)) / (chartData.length - 1);
            const y =
              chartHeight -
              padding -
              ((val - minScore) / (maxScore - minScore)) *
                (chartHeight - padding * 2);
            return `${x},${y}`;
          })
          .join(" ")
      : "";

  return (
    <DashboardShell className="max-w-[1400px] p-6 lg:p-10 space-y-8">
      {/* Header section */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="space-y-1"
        >
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
            Writing <span className="text-primary italic">Analytics</span>
          </h1>
          <p className="text-muted-foreground text-lg">
            Track your progress across all four IELTS criteria.
          </p>
        </motion.div>

        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="flex items-center gap-2"
        >
          <Button
            variant="outline"
            size="sm"
            className="rounded-full gap-2 hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            <ListRestart className="h-4 w-4" />
            Reset Data
          </Button>
          <Button
            variant="blue"
            size="sm"
            className="rounded-full shadow-lg shadow-primary/20 hover:scale-105 transition-transform cursor-pointer"
          >
            <Sparkles className="h-4 w-4 mr-2" />
            AI Recommendations
          </Button>
        </motion.div>
      </header>

      {/* Main Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 xl:grid-cols-3 gap-8"
      >
        {/* Left column: Score Progression & Criteria Breakdown */}
        <div className="xl:col-span-2 space-y-8">
          {/* Chart Card */}
          <motion.div variants={itemVariants}>
            <Card className="border-border/50 dark:border-zinc-800/80 bg-white/70 dark:bg-zinc-950/40 backdrop-blur-xl shadow-sm overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Band Score Progression
                </CardTitle>
                <CardDescription>
                  Visualizing your scores over the last 10 attempts.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                {loading ? (
                  <div className="w-full h-[160px] flex items-center justify-center text-sm text-muted-foreground">
                    Loading your score progression...
                  </div>
                ) : chartData.length >= 2 ? (
                  <div className="w-full relative h-[160px] flex items-end">
                    <svg
                      className="w-full h-full overflow-visible"
                      viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                      preserveAspectRatio="none"
                    >
                      {/* SVG Gradients */}
                      <defs>
                        <linearGradient
                          id="chartGradient"
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
                            stopOpacity="0"
                          />
                        </linearGradient>
                      </defs>

                      {/* Chart Grid Lines */}
                      {[5, 6, 7, 8].map((scoreGrid) => {
                        const y =
                          chartHeight -
                          padding -
                          ((scoreGrid - minScore) / (maxScore - minScore)) *
                            (chartHeight - padding * 2);
                        return (
                          <g key={scoreGrid}>
                            <line
                              x1={padding}
                              y1={y}
                              x2={chartWidth - padding}
                              y2={y}
                              stroke="rgba(120, 120, 120, 0.1)"
                              strokeWidth="1"
                              strokeDasharray="4 4"
                            />
                            <text
                              x={padding - 10}
                              y={y + 4}
                              fontSize="9"
                              className="fill-muted-foreground/60 text-right font-semibold"
                            >
                              {scoreGrid}
                            </text>
                          </g>
                        );
                      })}

                      {/* Area under the line */}
                      <path
                        d={`M ${padding},${chartHeight - padding} L ${points} L ${chartWidth - padding},${chartHeight - padding} Z`}
                        fill="url(#chartGradient)"
                      />

                      {/* Line Chart */}
                      <polyline
                        fill="none"
                        stroke="var(--primary)"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        points={points}
                      />

                      {/* Plot Points */}
                      {chartData.map((val, i) => {
                        const x =
                          padding +
                          (i * (chartWidth - padding * 2)) /
                            (chartData.length - 1);
                        const y =
                          chartHeight -
                          padding -
                          ((val - minScore) / (maxScore - minScore)) *
                            (chartHeight - padding * 2);
                        return (
                          <circle
                            key={i}
                            cx={x}
                            cy={y}
                            r="5"
                            className="fill-white dark:fill-zinc-950 stroke-primary hover:r-7 transition-all duration-150 cursor-pointer"
                            strokeWidth="2.5"
                          />
                        );
                      })}
                    </svg>
                  </div>
                ) : (
                  <div className="w-full h-[160px] flex items-center justify-center text-sm text-muted-foreground">
                    Complete at least two evaluated essays to see your
                    progression.
                  </div>
                )}
                <div className="flex justify-between text-[10px] uppercase font-bold tracking-widest text-muted-foreground/60 mt-4 px-4">
                  <span>First Attempt</span>
                  <span>Latest Attempt</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Criteria Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {criteriaScores.map((criteria, idx) => {
              const percent = (criteria.score / 9) * 100;
              const targetPercent = (criteria.target / 9) * 100;
              const isSelected = selectedCriteria === idx;

              return (
                <motion.div
                  key={criteria.name}
                  variants={itemVariants}
                  onClick={() => setSelectedCriteria(idx)}
                  className="cursor-pointer"
                >
                  <Card
                    className={`group border-border/50 dark:border-zinc-800/80 transition-all duration-300 relative overflow-hidden backdrop-blur-xl ${
                      isSelected
                        ? "ring-2 ring-primary bg-primary/[0.03] dark:bg-primary/[0.01]"
                        : "bg-white/70 dark:bg-zinc-950/40 hover:bg-zinc-100/50 dark:hover:bg-zinc-900/30"
                    }`}
                  >
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-base font-bold">
                          {criteria.name}
                        </CardTitle>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xl font-black text-zinc-900 dark:text-zinc-100">
                            {criteria.score}
                          </span>
                          <span className="text-[10px] text-muted-foreground font-semibold">
                            / 9.0
                          </span>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-1.5 relative">
                        <div className="flex justify-between text-[10px] uppercase font-bold tracking-widest text-muted-foreground/70">
                          <span>Progress</span>
                          <span>Target: {criteria.target}</span>
                        </div>
                        <div className="h-2 w-full rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden relative">
                          <div
                            className={`h-full bg-gradient-to-r ${criteria.color} rounded-full transition-all duration-500`}
                            style={{ width: `${percent}%` }}
                          />
                          <div
                            className="absolute h-full w-[2px] bg-red-500/80 top-0"
                            style={{ left: `${targetPercent}%` }}
                            title="Target Score mark"
                          />
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {criteria.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Right column: Selected Criteria Detail & Common Mistakes */}
        <div className="space-y-8">
          {/* Daily Coach Comment */}
          <motion.div variants={itemVariants}>
            <Card className="border-border/50 dark:border-zinc-800/80 bg-white/70 dark:bg-zinc-950/40 backdrop-blur-xl shadow-sm overflow-hidden group">
              <div className="h-1 bg-gradient-to-r from-primary to-emerald-500" />
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <MessageSquareQuote className="h-5 w-5 text-primary" />
                    Coach&apos;s Comment
                  </CardTitle>
                  {data?.dailyComment && (
                    <Badge
                      className={
                        data.dailyComment.tone === "positive"
                          ? "bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20"
                          : data.dailyComment.tone === "push"
                            ? "bg-amber-500/10 text-amber-500 hover:bg-amber-500/20"
                            : "bg-primary/10 text-primary hover:bg-primary/20"
                      }
                    >
                      {data.dailyComment.tone === "positive"
                        ? "Improving"
                        : data.dailyComment.tone === "push"
                          ? "Keep Pushing"
                          : "Steady"}
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {loading ? (
                  <p className="text-sm text-muted-foreground">
                    Generating today&apos;s comment...
                  </p>
                ) : data?.dailyComment ? (
                  <>
                    <p className="text-sm font-medium leading-relaxed italic">{`\u201C${data.dailyComment.text}\u201D`}</p>
                    {data.improvements.length > 0 && (
                      <div className="p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/10 space-y-1.5">
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
                          Rework Wins
                        </h4>
                        {data.improvements.map((imp, i) => (
                          <p
                            key={i}
                            className="text-xs text-muted-foreground font-semibold"
                          >
                            {imp.fromBand.toFixed(1)} → {imp.toBand.toFixed(1)}{" "}
                            on a reworked essay
                            <span className="text-emerald-500 font-bold ml-1">
                              (+{imp.delta.toFixed(1)})
                            </span>
                          </p>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Submit an essay to get your first coach comment.
                  </p>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Selected Criteria Deep Dive */}
          <motion.div variants={itemVariants}>
            <Card className="border-border/50 dark:border-zinc-800/80 bg-white/70 dark:bg-zinc-950/40 backdrop-blur-xl shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 -mr-6 -mt-6 p-4 opacity-5">
                <Brain className="h-24 w-24" />
              </div>
              <CardHeader className="pb-3 border-b border-border/20 dark:border-zinc-800/50">
                <Badge className="bg-primary/10 text-primary hover:bg-primary/20 w-fit mb-2">
                  Criteria Analysis
                </Badge>
                <CardTitle className="text-lg flex items-center gap-2">
                  {criteriaScores[selectedCriteria].name}
                </CardTitle>
                <CardDescription>
                  Detailed guidelines and tips to raise your score.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-4 space-y-4">
                <div className="space-y-2">
                  <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground/75">
                    Current Performance
                  </h4>
                  <p className="text-sm font-medium leading-relaxed">
                    "{criteriaScores[selectedCriteria].description}"
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-primary/5 border border-primary/10 space-y-2">
                  <h4 className="text-xs font-black uppercase tracking-widest text-primary flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5 fill-current" />
                    AI Action Tip
                  </h4>
                  <p className="text-xs leading-relaxed font-semibold italic text-muted-foreground">
                    "{criteriaScores[selectedCriteria].tip}"
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Common Mistakes Card */}
          <motion.div variants={itemVariants}>
            <Card className="border-border/50 dark:border-zinc-800/80 bg-white/70 dark:bg-zinc-950/40 backdrop-blur-xl shadow-sm overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-amber-500" />
                  Mistake Heatmap
                </CardTitle>
                <CardDescription>
                  Recurring issues flagged during review.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-border/20 dark:divide-zinc-800/50">
                  {commonMistakes.map((mistake) => (
                    <div
                      key={mistake.id}
                      className="p-4 space-y-2.5 hover:bg-zinc-100/30 dark:hover:bg-zinc-900/20 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                            {mistake.title}
                          </span>
                          <Badge
                            variant="outline"
                            className="text-[9px] px-1.5 py-0 leading-none h-4"
                          >
                            {mistake.category}
                          </Badge>
                        </div>
                        <Badge
                          className={
                            mistake.severity === "High"
                              ? "bg-red-500/10 text-red-500 border-red-500/20 hover:bg-red-500/20"
                              : mistake.severity === "Medium"
                                ? "bg-amber-500/10 text-amber-500 border-amber-500/20 hover:bg-amber-500/20"
                                : "bg-primary/10 text-primary border-primary/20 hover:bg-primary/20"
                          }
                        >
                          {mistake.frequency}x Flagged
                        </Badge>
                      </div>

                      {/* Examples */}
                      <div className="grid grid-cols-2 gap-2 text-[11px] p-2 rounded-lg bg-zinc-50/50 dark:bg-zinc-900/50 border border-border/10 dark:border-zinc-800/10 font-mono">
                        <div>
                          <span className="text-red-500 font-bold">
                            Incorrect:
                          </span>
                          <p className="text-muted-foreground truncate">
                            {mistake.example}
                          </p>
                        </div>
                        <div>
                          <span className="text-emerald-500 font-bold">
                            Corrected:
                          </span>
                          <p className="text-muted-foreground truncate">
                            {mistake.correction}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.div>
    </DashboardShell>
  );
};

export default AnalyticsPage;
