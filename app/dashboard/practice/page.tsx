"use client";

import React from "react";
import DashboardShell from "../../components/DashboardShell";
import {
  Zap,
  ShieldCheck,
  Clock,
  Target,
  Sparkles,
  ChevronRight,
  BookOpen,
  TrendingUp,
  Award,
  PenTool,
  Lock,
  Globe,
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
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import Link from "next/link";

const modes = [
  {
    title: "Practice Mode",
    description: "Build specific writing skills at your own pace.",
    icon: Zap,
    color: "text-yellow-500",
    bg: "bg-yellow-500/10",
    features: [
      { icon: Clock, text: "Flexible Time Limits" },
      { icon: Target, text: "Choose Specific Tasks (1 or 2)" },
      { icon: Sparkles, text: "Instant AI Feedback" },
      { icon: PenTool, text: "Focus on Argument Types" },
    ],
    buttonText: "Start Practicing",
    primaryColor: "bg-primary",
  },
  {
    title: "Exam Mode",
    description: "Authentic full exam experience under pressure.",
    icon: ShieldCheck,
    color: "text-green-500",
    bg: "bg-green-500/10",
    features: [
      { icon: Lock, text: "Anti-Cheating Measures" },
      { icon: Globe, text: "Public Fullscreen Mode" },
      { icon: Clock, text: "Strict 60-Minute Limit" },
      { icon: Award, text: "Full Performance Report" },
    ],
    buttonText: "Start Exam",
    primaryColor: "bg-zinc-900 dark:bg-zinc-800",
  },
];

const progressStats = [
  { label: "Essays Written", value: "12", icon: BookOpen },
  { label: "Average Band", value: "6.5", icon: TrendingUp },
  { label: "Improvement", value: "↑ 0.5", icon: Sparkles },
  { label: "Total Words", value: "5,240", icon: PenTool },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const item = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1 },
};

const PracticePage = () => {
  return (
    <DashboardShell className="max-w-[1200px] p-6 lg:p-12 space-y-12">
          {/* Header Section */}
          <header className="space-y-4 text-center">
            <motion.h1
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-5xl font-extrabold tracking-tight lg:text-6xl"
            >
              IELTS Writing{" "}
              <span className="text-primary italic">Practice</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-muted-foreground text-xl max-w-2xl mx-auto"
            >
              Choose your path: refine specific skills in practice mode or take
              a full exam to assess your overall performance.
            </motion.p>
          </header>

          {/* Mode Selection Grid */}
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            {modes.map((mode, index) => (
              <motion.div key={mode.title} variants={item}>
                <Card className="group relative overflow-hidden h-full border-border/50 dark:border-zinc-800/80 bg-white/70 dark:bg-zinc-900/40 backdrop-blur-xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:border-primary/30">
                  <div
                    className={cn(
                      "absolute top-0 right-0 -mr-10 -mt-10 h-40 w-40 rounded-full mix-blend-multiply dark:mix-blend-overlay filter blur-3xl opacity-20 group-hover:scale-150 transition-transform duration-700",
                      mode.bg,
                    )}
                  />

                  <CardHeader className="space-y-4">
                    <div
                      className={cn(
                        "w-14 h-14 rounded-2xl flex items-center justify-center transition-transform duration-500 group-hover:scale-110 group-hover:rotate-12",
                        mode.bg,
                      )}
                    >
                      <mode.icon className={cn("h-8 w-8", mode.color)} />
                    </div>
                    <div>
                      <CardTitle className="text-3xl font-bold">
                        {mode.title}
                      </CardTitle>
                      <CardDescription className="text-lg mt-2">
                        {mode.description}
                      </CardDescription>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-8">
                    <div className="space-y-4">
                      {mode.features.map((feature, fIdx) => (
                        <div
                          key={fIdx}
                          className="flex items-center gap-3 text-muted-foreground group/feature"
                        >
                          <feature.icon className="h-4 w-4 text-primary/70 group-hover/feature:text-primary transition-colors" />
                          <span className="text-sm font-medium">
                            {feature.text}
                          </span>
                        </div>
                      ))}
                    </div>

                    <Link href="/writingbox">
                      <Button
                        variant="blue"
                        className="w-full h-14 text-lg font-bold rounded-2xl shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300 hover:scale-[1.02] cursor-pointer"
                      >
                        {mode.buttonText}
                        <ChevronRight className="ml-2 h-5 w-5" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {/* Live Progress Section - Compact & Ultra-Slick */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="pt-2"
          >
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600/20 via-primary/20 to-blue-600/20 rounded-3xl blur opacity-20 group-hover:opacity-100 transition duration-700" />

              <div className="relative overflow-hidden rounded-3xl border border-white/20 dark:border-zinc-800/50 bg-white/60 dark:bg-zinc-950/60 backdrop-blur-3xl shadow-xl">
                <div className="flex flex-col lg:flex-row items-center">
                  {/* Minimal Identity */}
                  <div className="px-8 py-6 lg:border-r border-border/10 dark:border-zinc-800/20 bg-primary/5 flex items-center gap-4">
                    <div className="h-10 w-10 rounded-xl bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center border border-border/50 shadow-sm">
                      <TrendingUp className="h-5 w-5 text-zinc-900 dark:text-zinc-100" />
                    </div>
                    <div className="whitespace-nowrap">
                      <h3 className="text-sm font-black tracking-tight uppercase leading-none">
                        Live Mastery
                      </h3>
                      <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mt-1 opacity-60">
                        Insight Console
                      </p>
                    </div>
                  </div>

                  {/* Horizontal Stats */}
                  <div className="flex-1 grid grid-cols-2 lg:grid-cols-4 w-full">
                    {progressStats.map((stat, idx) => (
                      <div
                        key={idx}
                        className="px-8 py-6 flex lg:flex-col items-center justify-center gap-2 group/stat border-r last:border-0 border-border/10 dark:border-zinc-800/10 hover:bg-black/5 dark:hover:bg-white/5 transition-all duration-300"
                      >
                        <stat.icon className="h-3.5 w-3.5 text-muted-foreground group-hover/stat:text-blue-500 transition-colors" />
                        <div className="flex flex-col items-center">
                          <span className="text-2xl font-black tracking-tighter group-hover/stat:scale-110 transition-transform duration-300">
                            {stat.value}
                          </span>
                          <span className="text-[9px] uppercase tracking-[0.2em] font-black text-muted-foreground/40 group-hover/stat:text-primary transition-colors">
                            {stat.label}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
    </DashboardShell>
  );
};

export default PracticePage;
