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
  Zap,
  ArrowRight,
  Flame,
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { UserTarget } from "@/types/target";

interface ExamCountdownWidgetProps {
  target?: UserTarget | null;
  onOpenModal: () => void;
  onStartPractice?: () => void;
  className?: string;
  compact?: boolean;
}

export default function ExamCountdownWidget({
  target,
  onOpenModal,
  onStartPractice,
  className,
  compact = false,
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
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });

    const isToday = daysLeft === 0;
    const isPassed = daysLeft < 0;

    // Progress percentage: assuming a standard 90-day study window or days left proportion
    const studyWindow = 90;
    const elapsedDays = Math.max(0, studyWindow - daysLeft);
    const progressPercent = Math.min(
      100,
      Math.max(10, Math.round((elapsedDays / studyWindow) * 100)),
    );

    let paceDesc = "3-4 essays / week";
    if (daysLeft <= 7) paceDesc = "Daily practice sprints";
    else if (daysLeft <= 30) paceDesc = "4-5 essays / week";
    else if (daysLeft > 60) paceDesc = "2-3 essays / week";

    return {
      daysLeft,
      weeksLeft,
      hoursLeft,
      formattedDate,
      isToday,
      isPassed,
      progressPercent,
      paceDesc,
    };
  }, [target]);

  // If no exam date is set yet, render an attractive call-to-action banner
  if (!calculations) {
    return (
      <Card
        className={cn(
          "border border-primary/20 bg-gradient-to-r from-blue-500/10 via-primary/5 to-purple-500/10 dark:from-blue-950/30 dark:via-primary/10 dark:to-purple-950/30 backdrop-blur-md rounded-2xl shadow-xs overflow-hidden transition-all duration-300 hover:shadow-md hover:border-primary/30",
          className,
        )}
      >
        <CardContent className="p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="h-11 w-11 rounded-2xl bg-gradient-to-tr from-primary to-blue-500 text-white flex items-center justify-center shadow-md shadow-primary/20 shrink-0 mt-0.5 sm:mt-0">
              <Calendar className="h-5 w-5" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-bold text-sm sm:text-base text-zinc-900 dark:text-zinc-50">
                  Set Your IELTS Exam Date & Target Score
                </h3>
                <Badge className="bg-primary/15 text-primary border-primary/20 text-[10px] font-bold py-0.5">
                  <Sparkles className="h-3 w-3 mr-1 inline" /> Recommended
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground max-w-xl leading-relaxed">
                Add your upcoming test date to unlock live countdowns, weekly
                pacing targets, and focused preparation milestones.
              </p>
            </div>
          </div>

          <Button
            variant="blue"
            size="sm"
            onClick={onOpenModal}
            className="w-full md:w-auto px-5 py-2 rounded-xl text-xs font-bold shadow-sm hover:scale-[1.02] active:scale-95 transition-all cursor-pointer shrink-0"
          >
            <Target className="h-3.5 w-3.5 mr-1.5" />
            Set Exam Target
          </Button>
        </CardContent>
      </Card>
    );
  }

  const {
    daysLeft,
    weeksLeft,
    hoursLeft,
    formattedDate,
    isToday,
    isPassed,
    progressPercent,
    paceDesc,
  } = calculations;

  const targetBand = target?.targetBand ?? 7.5;
  const examType = target?.examType ?? "academic";

  return (
    <Card
      className={cn(
        "border border-border/70 dark:border-zinc-800/80 bg-white/90 dark:bg-zinc-900/60 backdrop-blur-xl rounded-2xl shadow-xs overflow-hidden transition-all duration-300 hover:shadow-md hover:border-primary/30 relative",
        className,
      )}
    >
      {/* Subtle glowing corner highlight */}
      <div className="absolute top-0 right-0 w-64 h-32 bg-gradient-to-bl from-primary/10 via-emerald-500/5 to-transparent pointer-events-none rounded-tr-2xl" />

      <CardContent className="p-4 sm:p-5 space-y-4">
        {/* Top Header Row */}
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
              {examType === "academic" ? (
                <GraduationCap className="h-4 w-4" />
              ) : (
                <BookOpen className="h-4 w-4" />
              )}
            </div>
            <div>
              <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
                Official IELTS {examType === "academic" ? "Academic" : "General"}
              </span>
              <span className="text-[11px] text-muted-foreground font-medium block">
                Test Date: <strong className="text-zinc-800 dark:text-zinc-200">{formattedDate}</strong>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 text-xs font-bold px-2.5 py-0.5">
              <Target className="h-3 w-3 mr-1" />
              Target Band {targetBand.toFixed(1)}
            </Badge>

            <Button
              variant="ghost"
              size="sm"
              onClick={onOpenModal}
              title="Edit Exam Date"
              className="h-7 px-2 text-xs font-semibold text-muted-foreground hover:text-foreground rounded-lg cursor-pointer"
            >
              <Edit3 className="h-3.5 w-3.5 mr-1" />
              Edit
            </Button>
          </div>
        </div>

        {/* Middle Main Countdown Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 rounded-xl bg-zinc-50/70 dark:bg-zinc-900/40 border border-border/40">
          {/* Main Countdown Display */}
          <div className="sm:col-span-1 flex items-center gap-3">
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-primary to-blue-600 text-white flex flex-col items-center justify-center shadow-md shadow-primary/20 shrink-0">
              <span className="text-lg font-black leading-none">
                {isPassed ? "0" : daysLeft}
              </span>
              <span className="text-[9px] font-bold uppercase tracking-wider opacity-90">
                Days
              </span>
            </div>
            <div>
              <span className="text-xs font-bold text-zinc-900 dark:text-zinc-50 block">
                {isToday
                  ? "Today is Exam Day!"
                  : isPassed
                    ? "Exam Completed"
                    : `${daysLeft} Days Remaining`}
              </span>
              <span className="text-[11px] text-muted-foreground font-medium">
                {isPassed
                  ? "Update date for next attempt"
                  : `${weeksLeft} week${weeksLeft === 1 ? "" : "s"} • ~${hoursLeft} hrs left`}
              </span>
            </div>
          </div>

          {/* Recommended Pacing */}
          <div className="sm:col-span-1 flex items-center gap-2.5 sm:border-l border-border/40 sm:pl-3">
            <div className="h-8 w-8 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
              <Flame className="h-4 w-4 fill-current" />
            </div>
            <div>
              <span className="text-[10px] font-medium text-muted-foreground block">
                Study Pacing
              </span>
              <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                {paceDesc}
              </span>
            </div>
          </div>

          {/* Quick Action Button */}
          <div className="sm:col-span-1 flex items-center justify-start sm:justify-end sm:border-l border-border/40 sm:pl-3">
            {onStartPractice ? (
              <Button
                variant="blue"
                size="sm"
                onClick={onStartPractice}
                className="w-full sm:w-auto text-xs font-bold rounded-xl shadow-xs cursor-pointer gap-1.5"
              >
                <Zap className="h-3.5 w-3.5 fill-current" />
                Practice Now
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            ) : null}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
