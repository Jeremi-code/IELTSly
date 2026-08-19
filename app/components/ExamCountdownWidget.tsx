"use client";

import React, { useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Calendar,
  Target,
  Clock,
  Sparkles,
  Edit3,
  GraduationCap,
  BookOpen,
  Flame,
  ArrowRight,
  CheckCircle2,
  Hourglass,
  TrendingUp,
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { UserTarget } from "@/types/target";

interface ExamCountdownWidgetProps {
  target?: UserTarget | null;
  onOpenModal: () => void;
  className?: string;
}

export default function ExamCountdownWidget({
  target,
  onOpenModal,
  className,
}: ExamCountdownWidgetProps) {
  const calculations = useMemo(() => {
    if (!target?.examDate) return null;
    const exam = new Date(target.examDate);
    if (isNaN(exam.getTime())) return null;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const diffMs = exam.getTime() - today.getTime();
    const daysLeft = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    const weeksLeft = Math.max(0, Math.ceil(daysLeft / 7));
    const hoursLeft = Math.max(0, daysLeft * 24);

    const formattedDate = exam.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "short",
      day: "numeric",
    });

    const isToday = daysLeft === 0;
    const isPassed = daysLeft < 0;

    // Standard preparation window progress (90 days baseline)
    const baseWindow = 90;
    const elapsedDays = Math.max(0, baseWindow - Math.max(0, daysLeft));
    const progressPercent = Math.min(
      100,
      Math.max(8, Math.round((elapsedDays / baseWindow) * 100)),
    );

    let paceDesc = "3-4 essays / week";
    let paceDetail = "Balanced steady preparation pace";
    let urgencyBadge = "On Track";
    let urgencyColor =
      "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20";

    if (daysLeft <= 0) {
      paceDesc = "Exam Day / Completed";
      paceDetail = "Best of luck on your official score!";
      urgencyBadge = isToday ? "Test Day" : "Completed";
      urgencyColor =
        "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20";
    } else if (daysLeft <= 7) {
      paceDesc = "1-2 timed essays daily";
      paceDetail = "Final sprint & error review";
      urgencyBadge = "Final Sprint";
      urgencyColor =
        "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20";
    } else if (daysLeft <= 30) {
      paceDesc = "4-5 essays / week";
      paceDetail = "Intensive criteria targeting";
      urgencyBadge = "Active Prep";
      urgencyColor =
        "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20";
    }

    return {
      daysLeft,
      weeksLeft,
      hoursLeft,
      formattedDate,
      isToday,
      isPassed,
      progressPercent,
      paceDesc,
      paceDetail,
      urgencyBadge,
      urgencyColor,
    };
  }, [target]);

  // ── State 1: Attractive Target Setting Widget (When no date is set) ──────
  if (!calculations) {
    return (
      <div
        className={cn(
          "relative overflow-hidden rounded-3xl border border-primary/25 bg-gradient-to-br from-white/90 via-blue-50/50 to-indigo-50/30 dark:from-zinc-900/90 dark:via-zinc-900/60 dark:to-primary/10 backdrop-blur-xl shadow-sm hover:shadow-md transition-all duration-300 group",
          className,
        )}
      >
        {/* Ambient decorative glow */}
        <div className="absolute -top-24 -right-24 w-60 h-60 bg-gradient-to-br from-primary/20 via-blue-400/10 to-transparent rounded-full blur-3xl pointer-events-none group-hover:scale-110 transition-transform duration-700" />
        <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-gradient-to-tr from-indigo-500/10 via-purple-400/10 to-transparent rounded-full blur-2xl pointer-events-none" />

        <div className="relative p-5 sm:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
          {/* Left content */}
          <div className="flex items-start gap-4">
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-primary via-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-primary/25 shrink-0 group-hover:scale-105 transition-transform duration-300">
              <Target className="h-6 w-6" />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center gap-2.5 flex-wrap">
                <h3 className="font-extrabold text-base sm:text-lg tracking-tight text-zinc-900 dark:text-zinc-50">
                  Set Your IELTS Exam Target Date
                </h3>
                <Badge className="bg-primary/15 text-primary border-primary/25 text-[10px] font-bold px-2 py-0.5 rounded-lg flex items-center gap-1 shadow-2xs">
                  <Sparkles className="h-3 w-3" />
                  Goal Tracker
                </Badge>
              </div>

              <p className="text-xs sm:text-sm text-muted-foreground max-w-xl leading-relaxed">
                Lock in your official test date and target band to activate
                live countdowns, volume recommendations, and pacing milestones.
              </p>

              {/* Feature Benefit Badges */}
              <div className="flex items-center gap-2 pt-1 flex-wrap">
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-zinc-700 dark:text-zinc-300 bg-white/70 dark:bg-zinc-800/70 border border-border/50 px-2.5 py-0.5 rounded-full">
                  <Hourglass className="h-3 w-3 text-primary" />
                  Live Day Countdown
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-zinc-700 dark:text-zinc-300 bg-white/70 dark:bg-zinc-800/70 border border-border/50 px-2.5 py-0.5 rounded-full">
                  <Target className="h-3 w-3 text-emerald-500" />
                  Band Goal Tracking
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-zinc-700 dark:text-zinc-300 bg-white/70 dark:bg-zinc-800/70 border border-border/50 px-2.5 py-0.5 rounded-full">
                  <Flame className="h-3 w-3 text-amber-500" />
                  Study Pacing
                </span>
              </div>
            </div>
          </div>

          {/* Right Action Trigger */}
          <Button
            variant="blue"
            size="lg"
            onClick={onOpenModal}
            className="w-full md:w-auto px-6 py-2.5 h-11 rounded-2xl text-xs sm:text-sm font-bold shadow-md shadow-primary/25 hover:shadow-lg hover:shadow-primary/35 hover:scale-[1.02] active:scale-98 transition-all cursor-pointer shrink-0 flex items-center justify-center gap-2"
          >
            <Calendar className="h-4 w-4" />
            <span>Set Target Date</span>
            <ArrowRight className="h-4 w-4 ml-0.5" />
          </Button>
        </div>
      </div>
    );
  }

  // ── State 2: Highly Attractive Active Countdown Widget ────────────────────
  const {
    daysLeft,
    weeksLeft,
    formattedDate,
    isToday,
    isPassed,
    progressPercent,
    paceDesc,
    paceDetail,
    urgencyBadge,
    urgencyColor,
  } = calculations;

  const targetBand = target?.targetBand ?? 7.5;
  const examType = target?.examType ?? "academic";

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-3xl border border-border/80 dark:border-zinc-800/90 bg-white/90 dark:bg-zinc-950/70 backdrop-blur-2xl shadow-sm hover:shadow-md transition-all duration-300 group",
        className,
      )}
    >
      {/* Subtle top accent gradient */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-indigo-500 to-emerald-400" />

      {/* Ambient background glow */}
      <div className="absolute top-0 right-0 w-80 h-36 bg-gradient-to-bl from-primary/10 via-indigo-500/5 to-transparent pointer-events-none rounded-tr-3xl" />

      <div className="p-5 sm:p-6 space-y-4 relative">
        {/* Top Header Row */}
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 border border-primary/20">
              {examType === "academic" ? (
                <GraduationCap className="h-5 w-5" />
              ) : (
                <BookOpen className="h-5 w-5" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs sm:text-sm font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100">
                  IELTS {examType === "academic" ? "Academic" : "General Training"}
                </span>
                <Badge
                  variant="outline"
                  className={cn(
                    "text-[10px] font-bold px-2 py-0.5 rounded-md",
                    urgencyColor,
                  )}
                >
                  {urgencyBadge}
                </Badge>
              </div>
              <span className="text-[11px] text-muted-foreground font-medium flex items-center gap-1 mt-0.5">
                <Calendar className="h-3 w-3" />
                {formattedDate}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Target Band Pill */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/15 border border-emerald-500/25">
              <Target className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
              <span className="text-[11px] font-medium text-emerald-700 dark:text-emerald-300">
                Target:
              </span>
              <span className="text-xs font-black text-emerald-700 dark:text-emerald-300">
                Band {targetBand.toFixed(1)}
              </span>
            </div>

            {/* Edit Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={onOpenModal}
              title="Edit Target Date & Goal"
              className="h-8 px-3 rounded-xl border-border/70 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-xs font-semibold text-muted-foreground hover:text-foreground cursor-pointer transition-all gap-1.5"
            >
              <Edit3 className="h-3.5 w-3.5" />
              <span>Edit Goal</span>
            </Button>
          </div>
        </div>

        {/* Middle Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
          {/* Main Countdown Stat Card */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/20 flex items-center justify-between gap-4">
            <div className="space-y-0.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
                Time Remaining
              </span>
              <h4 className="text-xs sm:text-sm font-bold text-zinc-900 dark:text-zinc-100">
                {isToday
                  ? "Today is Exam Day!"
                  : isPassed
                    ? "Exam Date Completed"
                    : `${weeksLeft} week${weeksLeft === 1 ? "" : "s"} remaining`}
              </h4>
              <p className="text-[11px] text-muted-foreground">
                {isPassed
                  ? "Click Edit Goal to plan your next attempt"
                  : "Target date locked and counting down"}
              </p>
            </div>

            {/* Large Glowing Number Badge */}
            <div className="h-16 w-20 rounded-2xl bg-gradient-to-tr from-primary to-blue-600 text-white flex flex-col items-center justify-center shadow-lg shadow-primary/25 shrink-0">
              <span className="text-2xl font-black leading-none tracking-tight">
                {isPassed ? "0" : daysLeft}
              </span>
              <span className="text-[9px] font-extrabold uppercase tracking-widest opacity-90 mt-0.5">
                {daysLeft === 1 ? "Day" : "Days"}
              </span>
            </div>
          </div>

          {/* Recommended Study Pace Card */}
          <div className="p-4 rounded-2xl bg-zinc-50/80 dark:bg-zinc-900/50 border border-border/50 flex items-center gap-3.5">
            <div className="h-11 w-11 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/20">
              <Flame className="h-5 w-5 fill-current" />
            </div>

            <div className="space-y-0.5 overflow-hidden">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
                  Recommended Study Pace
                </span>
              </div>
              <h4 className="text-xs sm:text-sm font-bold text-zinc-900 dark:text-zinc-100 truncate">
                {paceDesc}
              </h4>
              <p className="text-[11px] text-muted-foreground truncate">
                {paceDetail}
              </p>
            </div>
          </div>
        </div>

        {/* Timeline Progress Bar */}
        {!isPassed && (
          <div className="space-y-1.5 pt-1">
            <div className="flex items-center justify-between text-[10px] font-semibold text-muted-foreground">
              <span className="flex items-center gap-1">
                <TrendingUp className="h-3 w-3 text-primary" />
                Preparation Window Progress
              </span>
              <span>
                {daysLeft > 0 ? `${daysLeft} days until test` : "Exam Day"}
              </span>
            </div>
            <Progress value={progressPercent} className="h-1.5 bg-zinc-100 dark:bg-zinc-800" />
          </div>
        )}
      </div>
    </div>
  );
}
