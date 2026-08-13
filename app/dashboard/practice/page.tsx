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
  BookOpen,
  TrendingUp,
  Award,
  PenTool,
  Lock,
  Flame,
  ArrowRight,
  Search,
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
import { cn } from "@/lib/utils";

const modes = [
  {
    id: "practice" as const,
    title: "Practice Mode",
    description:
      "Build specific IELTS writing skills at your own pace with guidance and custom prompt selection.",
    icon: Zap,
    color: "text-yellow-500",
    glow: "group-hover:shadow-yellow-500/10",
    bg: "bg-yellow-500/10",
    borderColor: "group-hover:border-yellow-500/30",
    features: [
      { icon: Target, text: "Choose Specific Tasks & Topics" },
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
      "Authentic, high-pressure full exam experience under strict IELTS conditions.",
    icon: ShieldCheck,
    color: "text-primary",
    glow: "group-hover:shadow-primary/10",
    bg: "bg-primary/10",
    borderColor: "group-hover:border-primary/30",
    features: [
      { icon: Target, text: "Select Authentic IELTS Exam Tasks" },
      { icon: Clock, text: "Strict 20 / 40 Minute Countdown Timers" },
      { icon: Lock, text: "Authentic Exam Environment" },
      { icon: Award, text: "Comprehensive Performance Band Report" },
    ],
    buttonText: "Choose Question & Start Exam",
  },
];

const progressStats = [
  {
    label: "Essays Written",
    value: "12",
    icon: BookOpen,
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    label: "Average Band",
    value: "6.5",
    icon: TrendingUp,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
  },
  {
    label: "Weekly Streak",
    value: "5 Days",
    icon: Flame,
    color: "text-orange-500",
    bg: "bg-orange-500/10",
  },
  {
    label: "Total Words",
    value: "5,240",
    icon: PenTool,
    color: "text-purple-500",
    bg: "bg-purple-500/10",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const itemVariants = {
  hidden: { y: 30, opacity: 0 },
  show: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 100 } as const,
  },
};

const PracticePage = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedMode, setSelectedMode] = useState<"practice" | "exam">("practice");

  const handleOpenMode = (mode: "practice" | "exam") => {
    setSelectedMode(mode);
    setModalOpen(true);
  };

  return (
    <DashboardShell className="max-w-[1300px] p-6 lg:p-10 space-y-10">
      <QuestionSelectorModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        mode={selectedMode}
      />

      <header className="space-y-4 text-center max-w-3xl mx-auto">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-bold text-primary w-fit uppercase tracking-widest"
        >
          <Sparkles className="h-3 w-3 fill-current" />
          Improve Your Writing
        </motion.div>

        <motion.h1
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-5xl font-extrabold tracking-tight lg:text-6xl"
        >
          IELTS Writing <span className="text-primary italic">Practice</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-muted-foreground text-lg"
        >
          Choose your practice format: refine your parameters step-by-step or
          replicate the real exam environment.
        </motion.p>
      </header>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 gap-8"
      >
        {modes.map((mode) => (
          <motion.div key={mode.title} variants={itemVariants}>
            <Card
              className={cn(
                "group relative overflow-hidden h-full border border-border/50 dark:border-zinc-800/80 bg-white/70 dark:bg-zinc-950/40 backdrop-blur-xl shadow-lg hover:shadow-xl transition-all duration-500 rounded-3xl flex flex-col justify-between",
                mode.borderColor,
                mode.glow,
              )}
            >
              <div
                className={cn(
                  "absolute top-0 right-0 -mr-12 -mt-12 h-44 w-44 rounded-full mix-blend-multiply dark:mix-blend-overlay filter blur-3xl opacity-10 group-hover:scale-150 transition-transform duration-700",
                  mode.bg,
                )}
              />

              <CardHeader className="space-y-4 p-6 lg:p-8">
                <div
                  className={cn(
                    "w-12 h-12 rounded-2xl flex items-center justify-center transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6",
                    mode.bg,
                  )}
                >
                  <mode.icon className={cn("h-6 w-6", mode.color)} />
                </div>
                <div className="space-y-2">
                  <CardTitle className="text-2xl lg:text-3xl font-black">
                    {mode.title}
                  </CardTitle>
                  <CardDescription className="text-sm lg:text-base leading-relaxed text-muted-foreground">
                    {mode.description}
                  </CardDescription>
                </div>
              </CardHeader>

              <CardContent className="space-y-8 p-6 lg:p-8 pt-0 flex-1 flex flex-col justify-between">
                <div className="space-y-4">
                  {mode.features.map((feature, fIdx) => (
                    <div
                      key={fIdx}
                      className="flex items-center gap-3 text-muted-foreground group/feature"
                    >
                      <div className="h-7 w-7 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-border/20 flex items-center justify-center shrink-0">
                        <feature.icon className="h-3.5 w-3.5 text-primary/70 group-hover/feature:text-primary transition-colors" />
                      </div>
                      <span className="text-sm font-semibold">
                        {feature.text}
                      </span>
                    </div>
                  ))}
                </div>

                <Button
                  variant="blue"
                  onClick={() => handleOpenMode(mode.id)}
                  className="w-full h-14 text-base font-bold rounded-2xl shadow-lg shadow-primary/10 hover:shadow-primary/20 hover:scale-[1.01] transition-all duration-300 cursor-pointer flex items-center justify-center gap-2 mt-4"
                >
                  {mode.buttonText}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {progressStats.map((stat, idx) => (
          <Card
            key={idx}
            className="border-border/50 dark:border-zinc-800/80 bg-white/70 dark:bg-zinc-950/40 backdrop-blur-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden relative group"
          >
            <CardContent className="p-5 flex items-center gap-4">
              <div
                className={cn(
                  "h-10 w-10 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-105",
                  stat.bg,
                )}
              >
                <stat.icon className={cn("h-5 w-5", stat.color)} />
              </div>
              <div className="min-w-0">
                <span className="text-2xl font-black tracking-tight block group-hover:text-primary transition-colors">
                  {stat.value}
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground/60 block truncate">
                  {stat.label}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </motion.div>
    </DashboardShell>
  );
};

export default PracticePage;
