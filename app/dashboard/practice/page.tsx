"use client";

import React, { useState } from "react";
import DashboardShell from "../../components/DashboardShell";
import QuestionSelectorModal from "../../components/QuestionSelectorModal";
import {
  Zap,
  ShieldCheck,
  Clock,
  Target,
  Sparkles,
  Award,
  PenTool,
  Lock,
  ArrowRight,
  Shuffle,
  Layers,
  FileText,
  BarChart2,
  CheckCircle2,
  BookOpen,
  ChevronRight,
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
import { getRandomQuestion } from "@/lib/api";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

const modes = [
  {
    id: "practice" as const,
    title: "Practice Mode",
    description:
      "Build specific IELTS writing skills at your own pace with untimed drafting, instant AI band scoring, and criteria feedback.",
    icon: Zap,
    color: "text-amber-500",
    glow: "group-hover:shadow-amber-500/10",
    bg: "bg-amber-500/10",
    borderColor: "group-hover:border-amber-500/30",
    features: [
      { icon: Target, text: "Choose Specific Tasks & Categories" },
      { icon: Clock, text: "Flexible, Self-Paced Time Limits" },
      { icon: Sparkles, text: "Instant AI Band Score & Feedback" },
      { icon: PenTool, text: "Practice Reworks & Revisions" },
    ],
    buttonText: "Choose Question & Practice",
  },
  {
    id: "exam" as const,
    title: "Exam Mode",
    description:
      "Authentic, timed exam simulation with strict 20/40 minute countdowns to build real-world exam stamina.",
    icon: ShieldCheck,
    color: "text-primary",
    glow: "group-hover:shadow-primary/10",
    bg: "bg-primary/10",
    borderColor: "group-hover:border-primary/30",
    features: [
      { icon: Target, text: "Select Authentic IELTS Exam Tasks" },
      { icon: Clock, text: "Strict 20 / 40 Minute Countdown Timers" },
      { icon: Lock, text: "Authentic Exam Conditions" },
      { icon: Award, text: "Comprehensive Performance Band Report" },
    ],
    buttonText: "Choose Question & Start Exam",
  },
];

const task2Categories = [
  {
    title: "Agree or Disagree",
    categoryValue: "Agree / Disagree",
    desc: "State your opinion clearly and provide reasoned supporting arguments.",
  },
  {
    title: "Discuss Both Views",
    categoryValue: "Discuss Both Views",
    desc: "Examine two opposing perspectives before presenting your own stance.",
  },
  {
    title: "Advantages & Disadvantages",
    categoryValue: "Advantages & Disadvantages",
    desc: "Weigh positive and negative aspects and evaluate overall impact.",
  },
  {
    title: "Problem & Solution / Causes",
    categoryValue: "Causes & Solutions",
    desc: "Analyze root causes of an issue and propose realistic solutions.",
  },
  {
    title: "Direct / Two-Part Questions",
    categoryValue: "Direct / Two-Part Question",
    desc: "Answer two distinct prompt questions in structured paragraphs.",
  },
];

const task1Categories = [
  {
    title: "Bar Charts & Data",
    categoryValue: "Bar Chart",
    desc: "Compare discrete categories, highest/lowest values, and rankings.",
  },
  {
    title: "Line Graphs & Trends",
    categoryValue: "Line Graph",
    desc: "Highlight patterns over time: peaks, troughs, rises, and drops.",
  },
  {
    title: "Pie Charts & Proportions",
    categoryValue: "Pie Chart",
    desc: "Summarize percentages, shares, and comparative distributions.",
  },
  {
    title: "Tables & Multi-Category",
    categoryValue: "Table",
    desc: "Extract key trends from dense numerical rows and columns.",
  },
  {
    title: "Maps & Plans",
    categoryValue: "Map",
    desc: "Describe spatial transformations or geographic layout alterations.",
  },
  {
    title: "Process Diagrams",
    categoryValue: "Process Diagram",
    desc: "Describe sequential manufacturing or natural cyclical processes.",
  },
];

const examinerCriteria = [
  {
    code: "TA / TR",
    name: "Task Achievement / Response",
    badge: "25% of Score",
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800/40",
    tips: [
      "Task 1: Include a clear overview identifying main trends or contrasts.",
      "Task 2: Present a clear position and fully extend main ideas with examples.",
    ],
  },
  {
    code: "CC",
    name: "Coherence & Cohesion",
    badge: "25% of Score",
    color: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/40",
    tips: [
      "Structure 4–5 logical paragraphs with one clear central topic per paragraph.",
      "Use varied linking words naturally without mechanical repetition.",
    ],
  },
  {
    code: "LR",
    name: "Lexical Resource",
    badge: "25% of Score",
    color: "text-purple-600 dark:text-purple-400",
    bg: "bg-purple-50 dark:bg-purple-950/40 border-purple-200 dark:border-purple-800/40",
    tips: [
      "Use precise academic vocabulary and natural collocations.",
      "Paraphrase prompt keywords accurately and avoid spelling slips.",
    ],
  },
  {
    code: "GRA",
    name: "Grammatical Range & Accuracy",
    badge: "25% of Score",
    color: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800/40",
    tips: [
      "Mix complex structures: conditionals, relative clauses, passive voice.",
      "Maintain high sentence-level accuracy with correct punctuation.",
    ],
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
  show: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 100 } as const,
  },
};

const PracticePage = () => {
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedMode, setSelectedMode] = useState<"practice" | "exam">(
    "practice",
  );
  const [defaultTaskFilter, setDefaultTaskFilter] = useState<
    "all" | "task1" | "task2"
  >("all");
  const [defaultCategoryFilter, setDefaultCategoryFilter] =
    useState<string>("all");
  const [loadingRandom, setLoadingRandom] = useState(false);

  const handleOpenMode = (
    mode: "practice" | "exam",
    filter: "all" | "task1" | "task2" = "all",
    category: string = "all",
  ) => {
    setSelectedMode(mode);
    setDefaultTaskFilter(filter);
    setDefaultCategoryFilter(category);
    setModalOpen(true);
  };

  const handleRandomChallenge = async () => {
    setLoadingRandom(true);
    try {
      const randomQ = await getRandomQuestion();
      if (randomQ?._id) {
        router.push(
          `/dashboard/practice/writingbox?questionId=${randomQ._id}&mode=practice`,
        );
      } else {
        handleOpenMode("practice");
      }
    } catch {
      handleOpenMode("practice");
    } finally {
      setLoadingRandom(false);
    }
  };

  return (
    <DashboardShell className="max-w-[1300px] p-4 sm:p-6 lg:p-8 space-y-8">
      <QuestionSelectorModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        mode={selectedMode}
        defaultTaskType={defaultTaskFilter}
        defaultCategory={defaultCategoryFilter}
      />

      {/* ── HEADER ──────────────────────────────────────────────────── */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
            IELTS Writing{" "}
            <span className="text-primary italic">Practice Hub</span>
          </h1>
          <p className="text-muted-foreground text-xs sm:text-sm max-w-2xl leading-relaxed">
            Select your session format, jump straight into specific question
            categories, or review official examiner scoring criteria.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Button
            variant="outline"
            onClick={handleRandomChallenge}
            disabled={loadingRandom}
            className="rounded-xl text-xs font-bold border-border/60 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all cursor-pointer h-9 px-3.5 flex items-center gap-2"
          >
            <Shuffle className="h-3.5 w-3.5 text-primary" />
            {loadingRandom ? "Selecting prompt..." : "Random prompt challenge"}
          </Button>
        </div>
      </header>

      {/* ── PRACTICE FORMAT MODES ────────────────────────────────────── */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 gap-5"
      >
        {modes.map((mode) => (
          <motion.div key={mode.title} variants={itemVariants}>
            <div
              className={cn(
                "p-6 sm:p-7 rounded-3xl border border-border/60 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/50 backdrop-blur-md shadow-2xs hover:shadow-md transition-all duration-300 space-y-4",
                mode.borderColor,
              )}
            >
              {/* Top Row: Icon + Title on the SAME line, with Timer/Mode badge on the right */}
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-105",
                      mode.bg,
                    )}
                  >
                    <mode.icon className={cn("h-5 w-5", mode.color)} />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-zinc-900 dark:text-zinc-50 truncate">
                    {mode.title}
                  </h3>
                </div>

                <Badge
                  variant="outline"
                  className="text-[10px] font-semibold tracking-wider uppercase py-1 px-2.5 shrink-0"
                >
                  {mode.id === "exam" ? "20 / 40m Timer" : "Untimed / Guided"}
                </Badge>
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm leading-relaxed text-muted-foreground">
                {mode.description}
              </p>

              {/* Characteristics / Bullets */}
              <div className="space-y-2.5 pt-1">
                {mode.features.map((feature, fIdx) => (
                  <div
                    key={fIdx}
                    className="flex items-center gap-2.5 text-muted-foreground"
                  >
                    <div className="h-6 w-6 rounded-lg bg-zinc-100 dark:bg-zinc-800/80 border border-border/40 flex items-center justify-center shrink-0">
                      <feature.icon className="h-3 w-3 text-primary" />
                    </div>
                    <span className="text-xs sm:text-sm font-medium text-zinc-800 dark:text-zinc-200">
                      {feature.text}
                    </span>
                  </div>
                ))}
              </div>

              {/* Action Button */}
              <Button
                variant={mode.id === "exam" ? "outline" : "blue"}
                onClick={() => handleOpenMode(mode.id, "all", "all")}
                className="w-full h-11 text-xs sm:text-sm font-bold rounded-xl shadow-xs hover:scale-[1.01] transition-all cursor-pointer flex items-center justify-center gap-2 pt-0.5 mt-2"
              >
                {mode.buttonText}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* ── QUICK PRACTICE BY QUESTION CATEGORY ───────────────────────── */}
      <div className="space-y-3 pt-1">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
          <div>
            <h2 className="text-base sm:text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
              <Layers className="h-4 w-4 text-primary" />
              Practice by question category
            </h2>
            <p className="text-xs text-muted-foreground">
              Select an authentic Cambridge taxonomy to launch targeted prompt
              practice
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Task 2 Category Box */}
          <Card className="border border-border/60 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/50 backdrop-blur-md rounded-2xl shadow-2xs">
            <CardHeader className="p-3.5 sm:p-4 pb-2.5 border-b border-border/40 flex flex-row items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-7 w-7 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                  <FileText className="h-3.5 w-3.5" />
                </div>
                <div>
                  <CardTitle className="text-xs sm:text-sm font-bold">
                    IELTS Task 2: Academic Essay
                  </CardTitle>
                  <CardDescription className="text-[11px]">
                    250+ words • 40 minutes • 66% of writing score
                  </CardDescription>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleOpenMode("practice", "task2", "all")}
                className="text-[11px] font-bold text-primary hover:bg-primary/10 h-7 px-2.5 rounded-lg cursor-pointer"
              >
                Browse all Task 2
              </Button>
            </CardHeader>
            <CardContent className="p-3.5 sm:p-4 space-y-1.5">
              {task2Categories.map((cat) => (
                <button
                  key={cat.title}
                  type="button"
                  onClick={() =>
                    handleOpenMode("practice", "task2", cat.categoryValue)
                  }
                  className="w-full p-2.5 rounded-xl border border-border/40 hover:border-primary/40 bg-zinc-50/50 dark:bg-zinc-900/30 hover:bg-primary/5 transition-all text-left group flex items-center justify-between cursor-pointer"
                >
                  <div className="space-y-0.5 min-w-0 pr-2">
                    <span className="font-semibold text-xs text-zinc-900 dark:text-zinc-100 group-hover:text-primary transition-colors block">
                      {cat.title}
                    </span>
                    <span className="text-[11px] text-muted-foreground block truncate">
                      {cat.desc}
                    </span>
                  </div>
                  <ChevronRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                </button>
              ))}
            </CardContent>
          </Card>

          {/* Task 1 Category Box */}
          <Card className="border border-border/60 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/50 backdrop-blur-md rounded-2xl shadow-2xs">
            <CardHeader className="p-3.5 sm:p-4 pb-2.5 border-b border-border/40 flex flex-row items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-7 w-7 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                  <BarChart2 className="h-3.5 w-3.5" />
                </div>
                <div>
                  <CardTitle className="text-xs sm:text-sm font-bold">
                    IELTS Task 1: Visual Report
                  </CardTitle>
                  <CardDescription className="text-[11px]">
                    150+ words • 20 minutes • 33% of writing score
                  </CardDescription>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleOpenMode("practice", "task1", "all")}
                className="text-[11px] font-bold text-primary hover:bg-primary/10 h-7 px-2.5 rounded-lg cursor-pointer"
              >
                Browse all Task 1
              </Button>
            </CardHeader>
            <CardContent className="p-3.5 sm:p-4 space-y-1.5">
              {task1Categories.map((cat) => (
                <button
                  key={cat.title}
                  type="button"
                  onClick={() =>
                    handleOpenMode("practice", "task1", cat.categoryValue)
                  }
                  className="w-full p-2.5 rounded-xl border border-border/40 hover:border-primary/40 bg-zinc-50/50 dark:bg-zinc-900/30 hover:bg-primary/5 transition-all text-left group flex items-center justify-between cursor-pointer"
                >
                  <div className="space-y-0.5 min-w-0 pr-2">
                    <span className="font-semibold text-xs text-zinc-900 dark:text-zinc-100 group-hover:text-primary transition-colors block">
                      {cat.title}
                    </span>
                    <span className="text-[11px] text-muted-foreground block truncate">
                      {cat.desc}
                    </span>
                  </div>
                  <ChevronRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                </button>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* ── 4 OFFICIAL EXAMINER CRITERIA ─────────────────────────────── */}
      <div className="space-y-3 pt-1">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base sm:text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-primary" />
              Official 4-pillar examiner scoring criteria
            </h2>
            <p className="text-xs text-muted-foreground">
              Each criterion contributes 25% towards your overall IELTS Writing
              Band Score
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {examinerCriteria.map((c) => (
            <Card
              key={c.code}
              className={cn(
                "border bg-white dark:bg-zinc-900/50 backdrop-blur-md rounded-2xl shadow-2xs p-3.5 sm:p-4 space-y-2.5 flex flex-col justify-between",
                c.bg,
              )}
            >
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span
                    className={cn("font-black text-xs sm:text-sm", c.color)}
                  >
                    {c.code}
                  </span>
                  <Badge
                    variant="outline"
                    className="text-[9px] font-mono py-0"
                  >
                    {c.badge}
                  </Badge>
                </div>
                <h3 className="font-bold text-xs sm:text-sm text-zinc-900 dark:text-zinc-100">
                  {c.name}
                </h3>
              </div>

              <div className="space-y-1.5 text-xs text-muted-foreground pt-1.5 border-t border-border/30">
                {c.tips.map((tip, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-1.5 leading-relaxed"
                  >
                    <CheckCircle2 className="h-3 w-3 text-emerald-500 shrink-0 mt-0.5" />
                    <span className="text-[11px]">{tip}</span>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </DashboardShell>
  );
};

export default PracticePage;
