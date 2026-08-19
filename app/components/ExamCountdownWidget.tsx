"use client";

import React, { useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Calendar,
  Target,
  Edit3,
  GraduationCap,
  BookOpen,
  Flame,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
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
      "bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200 border-zinc-200 dark:border-zinc-700";

    if (daysLeft <= 0) {
      paceDesc = "Exam Day / Completed";
      paceDetail = "Best of luck on your official score!";
      urgencyBadge = isToday ? "Test Day" : "Completed";
      urgencyColor =
        "bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200 border-zinc-200 dark:border-zinc-700";
    } else if (daysLeft <= 7) {
      paceDesc = "1-2 timed essays daily";
      paceDetail = "Final sprint & error review";
      urgencyBadge = "Final Sprint";
      urgencyColor =
        "bg-amber-50 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300 border-amber-200 dark:border-amber-800/60";
    } else if (daysLeft <= 30) {
      paceDesc = "4-5 essays / week";
      paceDetail = "Intensive criteria targeting";
      urgencyBadge = "Active Prep";
      urgencyColor =
        "bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200 border-zinc-200 dark:border-zinc-700";
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

  // ── State 1: Clean Target Setting Widget (When no date is set) ────────────
  if (!calculations) {
    return (
      <div
        className={cn(
          "relative overflow-hidden rounded-2xl border border-border/70 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 backdrop-blur-md shadow-2xs transition-all duration-200",
          className,
        )}
      >
        <div className="p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          {/* Left content */}
          <div className="flex items-start gap-3.5">
            <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 border border-primary/20 mt-0.5">
              <Target className="h-5 w-5" />
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-bold text-sm sm:text-base text-zinc-900 dark:text-zinc-50">
                  Set Your IELTS Exam Target Date
                </h3>
                <Badge
                  variant="outline"
                  className="text-[10px] font-semibold text-muted-foreground border-border/70"
                >
                  Goal Tracker
                </Badge>
              </div>

              <p className="text-xs text-muted-foreground max-w-xl leading-relaxed">
                Add your official test date and target band to track day
                countdowns and weekly practice pacing.
              </p>
            </div>
          </div>

          {/* Right Action Trigger */}
          <Button
            variant="blue"
            size="sm"
            onClick={onOpenModal}
            className="w-full md:w-auto px-4 py-2 h-9 rounded-xl text-xs font-bold shadow-2xs hover:scale-[1.01] active:scale-95 transition-all cursor-pointer shrink-0 flex items-center justify-center gap-1.5"
          >
            <Calendar className="h-3.5 w-3.5" />
            <span>Set Target Date</span>
            <ArrowRight className="h-3.5 w-3.5 ml-0.5" />
          </Button>
        </div>
      </div>
    );
  }

  // ── State 2: Clean Active Countdown Widget ────────────────────────────────
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
        "relative overflow-hidden rounded-2xl border border-border/70 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 backdrop-blur-md shadow-2xs transition-all duration-200",
        className,
      )}
    >
      <div className="p-4 sm:p-5 space-y-3.5">
        {/* Top Header Row */}
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 flex items-center justify-center shrink-0 border border-border/50">
              {examType === "academic" ? (
                <GraduationCap className="h-4 w-4" />
              ) : (
                <BookOpen className="h-4 w-4" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs sm:text-sm font-bold text-zinc-900 dark:text-zinc-100">
                  IELTS {examType === "academic" ? "Academic" : "General Training"}
                </span>
                <Badge
                  variant="outline"
                  className={cn("text-[10px] font-semibold px-2 py-0.5 rounded-md", urgencyColor)}
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

          <div className="flex items-center gap-2">
            {/* Target Band Pill */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-zinc-100 dark:bg-zinc-800 border border-border/60">
              <Target className="h-3.5 w-3.5 text-primary" />
              <span className="text-[11px] font-medium text-muted-foreground">
                Target:
              </span>
              <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                Band {targetBand.toFixed(1)}
              </span>
            </div>

            {/* Edit Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={onOpenModal}
              title="Edit Target Date & Goal"
              className="h-7 px-2.5 rounded-lg border-border/60 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-xs font-medium text-muted-foreground hover:text-foreground cursor-pointer transition-all gap-1"
            >
              <Edit3 className="h-3 w-3" />
              <span>Edit Goal</span>
            </Button>
          </div>
        </div>

        {/* Middle Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-0.5">
          {/* Main Countdown Stat Card */}
          <div className="p-3.5 rounded-xl bg-zinc-50/80 dark:bg-zinc-850/50 border border-border/50 flex items-center justify-between gap-3">
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
                  ? "Click Edit Goal to plan next test"
                  : `${daysLeft} total days until official test`}
              </p>
            </div>

            {/* Clean Number Badge */}
            <div className="h-13 w-16 rounded-xl bg-primary text-primary-foreground flex flex-col items-center justify-center shrink-0 shadow-2xs">
              <span className="text-xl font-black leading-none">
                {isPassed ? "0" : daysLeft}
              </span>
              <span className="text-[9px] font-bold uppercase tracking-wider opacity-90 mt-0.5">
                {daysLeft === 1 ? "Day" : "Days"}
              </span>
            </div>
          </div>

          {/* Recommended Study Pace Card */}
          <div className="p-3.5 rounded-xl bg-zinc-50/80 dark:bg-zinc-850/50 border border-border/50 flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 flex items-center justify-center shrink-0 border border-border/50">
              <Flame className="h-4 w-4" />
            </div>

            <div className="space-y-0.5 overflow-hidden">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
                Study Pacing
              </span>
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
          <div className="space-y-1 pt-0.5">
            <div className="flex items-center justify-between text-[10px] font-medium text-muted-foreground">
              <span className="flex items-center gap-1">
                <TrendingUp className="h-3 w-3 text-muted-foreground" />
                Preparation Window Progress
              </span>
              <span>
                {daysLeft > 0 ? `${daysLeft} days left` : "Exam Day"}
              </span>
            </div>
            <Progress value={progressPercent} className="h-1 bg-zinc-100 dark:bg-zinc-800" />
          </div>
        )}
      </div>
    </div>
  );
}
