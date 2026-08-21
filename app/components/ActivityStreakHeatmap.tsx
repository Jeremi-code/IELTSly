"use client";

import React, { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Flame,
  Trophy,
  Clock,
  Calendar,
  Sparkles,
  Info,
  ChevronRight,
  TrendingUp,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn, formatDuration, getIntensityLevel } from "@/lib/utils";
import { format, parseISO } from "date-fns";
import type { ActivitySummary, DailyActivity } from "@/types/analytics";

interface ActivityStreakHeatmapProps {
  activitySummary?: ActivitySummary;
  className?: string;
  compact?: boolean;
}

const DAYS_OF_WEEK = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];



export default function ActivityStreakHeatmap({
  activitySummary,
  className,
  compact = false,
}: ActivityStreakHeatmapProps) {
  const [hoveredDay, setHoveredDay] = useState<{
    dateStr: string;
    activity?: DailyActivity;
    x: number;
    y: number;
  } | null>(null);

  const [timeRange, setTimeRange] = useState<"year" | "half">("year");

  // Map of date YYYY-MM-DD -> DailyActivity
  const activityMap = useMemo(() => {
    const map = new Map<string, DailyActivity>();
    if (activitySummary?.activities) {
      for (const act of activitySummary.activities) {
        map.set(act.date, act);
      }
    }
    return map;
  }, [activitySummary]);

  // Generate 52 weeks or 26 weeks grid ending today
  const { weeks, monthLabels } = useMemo(() => {
    const numWeeks = timeRange === "year" ? 52 : 26;
    const today = new Date();

    // Find the end date: end of current week (Sunday)
    const currentDayOfWeek = (today.getDay() + 6) % 7; // 0 = Mon, 6 = Sun
    const daysUntilSunday = 6 - currentDayOfWeek;
    const endDate = new Date(today);
    endDate.setDate(today.getDate() + daysUntilSunday);
    endDate.setHours(23, 59, 59, 999);

    // Total days needed: numWeeks * 7
    const totalDays = numWeeks * 7;
    const startDate = new Date(endDate);
    startDate.setDate(endDate.getDate() - totalDays + 1);
    startDate.setHours(0, 0, 0, 0);

    const generatedWeeks: Array<
      Array<{
        dateStr: string;
        date: Date;
        isFuture: boolean;
        isToday: boolean;
        activity?: DailyActivity;
        intensity: 0 | 1 | 2 | 3 | 4;
      }>
    > = [];

    const monthHeaders: Array<{ monthName: string; weekIndex: number }> = [];
    let lastSeenMonth = -1;

    let cursor = new Date(startDate);

    for (let w = 0; w < numWeeks; w++) {
      const currentWeekDays: (typeof generatedWeeks)[0] = [];

      for (let d = 0; d < 7; d++) {
        const year = cursor.getFullYear();
        const month = String(cursor.getMonth() + 1).padStart(2, "0");
        const day = String(cursor.getDate()).padStart(2, "0");
        const dateStr = `${year}-${month}-${day}`;

        const isToday =
          cursor.getDate() === today.getDate() &&
          cursor.getMonth() === today.getMonth() &&
          cursor.getFullYear() === today.getFullYear();

        const isFuture = cursor > today;

        const activity = activityMap.get(dateStr);
        const intensity = isFuture ? 0 : getIntensityLevel(activity);

        // Check if month changed in the first row of week
        if (d === 0) {
          const m = cursor.getMonth();
          if (m !== lastSeenMonth) {
            monthHeaders.push({ monthName: MONTHS[m], weekIndex: w });
            lastSeenMonth = m;
          }
        }

        currentWeekDays.push({
          dateStr,
          date: new Date(cursor),
          isFuture,
          isToday,
          activity,
          intensity,
        });

        cursor.setDate(cursor.getDate() + 1);
      }

      generatedWeeks.push(currentWeekDays);
    }

    return { weeks: generatedWeeks, monthLabels: monthHeaders };
  }, [activityMap, timeRange]);

  const currentStreak = activitySummary?.currentStreak ?? 0;
  const longestStreak = activitySummary?.longestStreak ?? 0;
  const totalActiveDays = activitySummary?.totalActiveDays ?? 0;
  const totalDurationSec = activitySummary?.totalDurationSec ?? 0;
  const totalEssays = activitySummary?.totalEssays ?? 0;

  const avgDurationPerDay =
    totalActiveDays > 0 ? Math.round(totalDurationSec / totalActiveDays) : 0;

  return (
    <Card
      className={cn(
        "border border-border/60 dark:border-zinc-800/80 bg-white/90 dark:bg-zinc-900/50 backdrop-blur-md rounded-2xl shadow-2xs overflow-hidden transition-all duration-200 relative",
        className,
      )}
    >
      {/* ── Header Strip ────────────────────────────────────────────── */}
      <CardHeader className="p-4 sm:p-5 pb-3">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <Calendar className="h-4 w-4" />
              </div>
              <CardTitle className="text-base sm:text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                Writing Activity & Practice Streaks
              </CardTitle>
            </div>
            <p className="text-xs text-muted-foreground">
              Visual log of your daily IELTS practice consistency, time
              invested, and evaluation milestones
            </p>
          </div>

          {/* Time range selector */}
          <div className="flex items-center gap-1.5 self-start lg:self-center bg-zinc-100 dark:bg-zinc-800/70 p-1 rounded-xl border border-border/40">
            <button
              type="button"
              onClick={() => setTimeRange("half")}
              className={cn(
                "px-3 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer",
                timeRange === "half"
                  ? "bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-xs"
                  : "text-muted-foreground hover:text-zinc-900 dark:hover:text-zinc-100",
              )}
            >
              Past 6 Months
            </button>
            <button
              type="button"
              onClick={() => setTimeRange("year")}
              className={cn(
                "px-3 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer",
                timeRange === "year"
                  ? "bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-xs"
                  : "text-muted-foreground hover:text-zinc-900 dark:hover:text-zinc-100",
              )}
            >
              Full Year
            </button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4 sm:p-5 pt-0 space-y-4">
        {/* ── Quick KPI Stat Strip ──────────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
          {/* Current Streak */}
          <div className="p-3 rounded-xl bg-amber-500/5 dark:bg-amber-500/10 border border-amber-500/20 flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
              <Flame className="h-4 w-4 fill-current" />
            </div>
            <div>
              <span className="text-[11px] font-medium text-muted-foreground block">
                Current Streak
              </span>
              <span className="text-base sm:text-lg font-black text-amber-600 dark:text-amber-400">
                {currentStreak} {currentStreak === 1 ? "day" : "days"}
              </span>
            </div>
          </div>

          {/* Longest Streak */}
          <div className="p-3 rounded-xl bg-purple-500/5 dark:bg-purple-500/10 border border-purple-500/20 flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-purple-500/20 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
              <Trophy className="h-4 w-4" />
            </div>
            <div>
              <span className="text-[11px] font-medium text-muted-foreground block">
                Longest Streak
              </span>
              <span className="text-base sm:text-lg font-black text-purple-600 dark:text-purple-400">
                {longestStreak} {longestStreak === 1 ? "day" : "days"}
              </span>
            </div>
          </div>

          {/* Total Practice Time */}
          <div className="p-3 rounded-xl bg-blue-500/5 dark:bg-blue-500/10 border border-blue-500/20 flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
              <Clock className="h-4 w-4" />
            </div>
            <div>
              <span className="text-[11px] font-medium text-muted-foreground block">
                Practice Time
              </span>
              <span className="text-base sm:text-lg font-black text-blue-600 dark:text-blue-400">
                {formatDuration(totalDurationSec)}
              </span>
            </div>
          </div>

          {/* Active Days */}
          <div className="p-3 rounded-xl bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <TrendingUp className="h-4 w-4" />
            </div>
            <div>
              <span className="text-[11px] font-medium text-muted-foreground block">
                Active Days
              </span>
              <span className="text-base sm:text-lg font-black text-emerald-600 dark:text-emerald-400">
                {totalActiveDays} {totalActiveDays === 1 ? "day" : "days"}
              </span>
            </div>
          </div>
        </div>

        {/* ── Heatmap Interactive Grid Container ─────────────────────── */}
        <div className="pt-2">
          <div className="overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-zinc-300 dark:scrollbar-thumb-zinc-700">
            <div className="inline-block min-w-full">
              {/* Month Headers */}
              <div className="flex text-[10px] font-bold text-muted-foreground mb-1 pl-7">
                {weeks.map((_, weekIdx) => {
                  const label = monthLabels.find(
                    (m) => m.weekIndex === weekIdx,
                  );
                  return (
                    <div
                      key={weekIdx}
                      className="w-3.5 sm:w-4 mr-1 text-left shrink-0 truncate"
                    >
                      {label ? label.monthName : ""}
                    </div>
                  );
                })}
              </div>

              {/* Grid: 7 Rows (Mon-Sun) */}
              <div className="flex gap-1.5">
                {/* Day Labels (Mon, Wed, Fri) */}
                <div className="flex flex-col justify-between text-[9px] font-semibold text-muted-foreground py-0.5 pr-1 w-5 shrink-0 select-none">
                  <span>Mon</span>
                  <span className="opacity-0">Tue</span>
                  <span>Wed</span>
                  <span className="opacity-0">Thu</span>
                  <span>Fri</span>
                  <span className="opacity-0">Sat</span>
                  <span className="opacity-0">Sun</span>
                </div>

                {/* Week Columns */}
                <div className="flex gap-1 sm:gap-1.5">
                  {weeks.map((week, weekIdx) => (
                    <div
                      key={weekIdx}
                      className="flex flex-col gap-1 sm:gap-1.5 shrink-0"
                    >
                      {week.map((day) => {
                        const {
                          dateStr,
                          isFuture,
                          isToday,
                          activity,
                          intensity,
                        } = day;

                        return (
                          <div
                            key={dateStr}
                            onMouseEnter={(e) => {
                              if (isFuture) return;
                              const rect =
                                e.currentTarget.getBoundingClientRect();
                              setHoveredDay({
                                dateStr,
                                activity,
                                x: rect.left + rect.width / 2,
                                y: rect.top - 10,
                              });
                            }}
                            onMouseLeave={() => setHoveredDay(null)}
                            className={cn(
                              "w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-[3px] sm:rounded-sm transition-all duration-150 cursor-pointer select-none",
                              isFuture &&
                                "opacity-20 pointer-events-none bg-zinc-100 dark:bg-zinc-800/40",
                              !isFuture &&
                                intensity === 0 &&
                                "bg-zinc-100 dark:bg-zinc-800/70 border border-zinc-200/60 dark:border-zinc-700/40 hover:border-zinc-400 dark:hover:border-zinc-500",
                              !isFuture &&
                                intensity === 1 &&
                                "bg-emerald-200 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-800/90 hover:scale-115",
                              !isFuture &&
                                intensity === 2 &&
                                "bg-emerald-400 dark:bg-emerald-700/90 border border-emerald-500/60 hover:scale-115",
                              !isFuture &&
                                intensity === 3 &&
                                "bg-emerald-500 dark:bg-emerald-600 border border-emerald-600/70 hover:scale-115 shadow-xs",
                              !isFuture &&
                                intensity === 4 &&
                                "bg-emerald-600 dark:bg-emerald-500 border border-emerald-400/90 hover:scale-115 shadow-[0_0_8px_rgba(16,185,129,0.4)]",
                              isToday &&
                                "ring-1.5 ring-primary ring-offset-1 dark:ring-offset-zinc-900",
                            )}
                          />
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Footer Legend & Study Habit Insight ─────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-3 border-t border-border/40 gap-3 text-xs">
          {/* Quick study habit insight */}
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5 text-amber-500" />
            <span>
              {totalActiveDays > 0 ? (
                <>
                  Logged{" "}
                  <strong className="text-zinc-900 dark:text-zinc-100">
                    {totalEssays} {totalEssays === 1 ? "essay" : "essays"}
                  </strong>{" "}
                  across{" "}
                  <strong className="text-zinc-900 dark:text-zinc-100">
                    {totalActiveDays} active days
                  </strong>{" "}
                  (avg {formatDuration(avgDurationPerDay)}/day)
                </>
              ) : (
                "Write your first essay to start your daily consistency streak!"
              )}
            </span>
          </div>

          {/* Color Density Legend */}
          <div className="flex items-center gap-1.5 self-end sm:self-center text-muted-foreground text-[11px]">
            <span>Less</span>
            <div className="w-2.5 h-2.5 rounded-[2px] bg-zinc-100 dark:bg-zinc-800/70 border border-zinc-200/60 dark:border-zinc-700/40" />
            <div className="w-2.5 h-2.5 rounded-[2px] bg-emerald-200 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-800/90" />
            <div className="w-2.5 h-2.5 rounded-[2px] bg-emerald-400 dark:bg-emerald-700/90 border border-emerald-500/60" />
            <div className="w-2.5 h-2.5 rounded-[2px] bg-emerald-500 dark:bg-emerald-600 border border-emerald-600/70" />
            <div className="w-2.5 h-2.5 rounded-[2px] bg-emerald-600 dark:bg-emerald-500 border border-emerald-400/90" />
            <span>More</span>
          </div>
        </div>
      </CardContent>

      {/* ── Fixed Position Rich Hover Tooltip ───────────────────────── */}
      <AnimatePresence>
        {hoveredDay && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 5 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 5 }}
            transition={{ duration: 0.1 }}
            style={{
              position: "fixed",
              left: hoveredDay.x,
              top: hoveredDay.y,
              transform: "translate(-50%, -100%)",
              zIndex: 9999,
              pointerEvents: "none",
            }}
            className="w-56 p-3 rounded-xl bg-zinc-950/95 text-zinc-50 dark:bg-zinc-900/95 dark:text-zinc-100 backdrop-blur-xl border border-zinc-800 dark:border-zinc-700 shadow-xl space-y-2 text-xs"
          >
            {/* Header: Formatted Date */}
            <div className="flex items-center justify-between pb-1.5 border-b border-zinc-800">
              <span className="font-bold text-zinc-100">
                {format(parseISO(hoveredDay.dateStr), "EEE, MMM d, yyyy")}
              </span>
            </div>

            {/* Content: Activity details */}
            {hoveredDay.activity && hoveredDay.activity.count > 0 ? (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-zinc-400 flex items-center gap-1">
                    <Clock className="h-3 w-3 text-emerald-400" />
                    Practice Time:
                  </span>
                  <span className="font-bold text-emerald-400">
                    {formatDuration(hoveredDay.activity.durationSec)}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-zinc-400 flex items-center gap-1">
                    <Calendar className="h-3 w-3 text-blue-400" />
                    Essays Written:
                  </span>
                  <span className="font-bold text-zinc-100">
                    {hoveredDay.activity.count}{" "}
                    {hoveredDay.activity.count === 1 ? "essay" : "essays"}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-zinc-400">Total Words:</span>
                  <span className="font-medium text-zinc-200">
                    {hoveredDay.activity.wordCount} words
                  </span>
                </div>

                {hoveredDay.activity.avgBand !== null && (
                  <div className="flex items-center justify-between pt-1 border-t border-zinc-800">
                    <span className="text-zinc-400">Avg Evaluation:</span>
                    <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/40 text-[10px] py-0 font-bold">
                      Band {hoveredDay.activity.avgBand.toFixed(1)}
                    </Badge>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-zinc-400 text-[11px] py-0.5">
                No writing activity on this day.
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}
