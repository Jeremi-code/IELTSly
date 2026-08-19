"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Calendar as CalendarIcon,
  Target,
  GraduationCap,
  Sparkles,
  Clock,
  Trash2,
  CheckCircle2,
  BookOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { UserTarget, ExamType } from "@/types/target";
import { saveUserTarget, deleteUserTarget } from "@/lib/api";

interface ExamTargetModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentTarget?: UserTarget | null;
  onTargetSaved: (target: UserTarget) => void;
  onTargetDeleted?: () => void;
}

const BAND_OPTIONS = [
  { band: 6.0, label: "Band 6.0", desc: "Competent" },
  { band: 6.5, label: "Band 6.5", desc: "Competent +" },
  { band: 7.0, label: "Band 7.0", desc: "Good" },
  { band: 7.5, label: "Band 7.5", desc: "Good +" },
  { band: 8.0, label: "Band 8.0", desc: "Very Good" },
  { band: 8.5, label: "Band 8.5", desc: "Very Good +" },
  { band: 9.0, label: "Band 9.0", desc: "Expert" },
];

export default function ExamTargetModal({
  open,
  onOpenChange,
  currentTarget,
  onTargetSaved,
  onTargetDeleted,
}: ExamTargetModalProps) {
  const [examDate, setExamDate] = useState("");
  const [targetBand, setTargetBand] = useState<number>(7.5);
  const [examType, setExamType] = useState<ExamType>("academic");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Sync state when modal opens or currentTarget changes
  useEffect(() => {
    if (open) {
      if (currentTarget?.examDate) {
        // Format ISO date into YYYY-MM-DD for native date input
        const d = new Date(currentTarget.examDate);
        if (!isNaN(d.getTime())) {
          const year = d.getFullYear();
          const month = String(d.getMonth() + 1).padStart(2, "0");
          const day = String(d.getDate()).padStart(2, "0");
          setExamDate(`${year}-${month}-${day}`);
        } else {
          setExamDate("");
        }
      } else {
        setExamDate("");
      }
      setTargetBand(currentTarget?.targetBand ?? 7.5);
      setExamType(currentTarget?.examType ?? "academic");
      setError(null);
    }
  }, [open, currentTarget]);

  // Today ISO string for min date in picker
  const todayStr = useMemo(() => {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }, []);

  // Quick Presets
  const applyPreset = (daysToAdd: number) => {
    const d = new Date();
    d.setDate(d.getDate() + daysToAdd);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    setExamDate(`${year}-${month}-${day}`);
  };

  // Calculate live preview metrics
  const preview = useMemo(() => {
    if (!examDate) return null;
    const target = new Date(`${examDate}T00:00:00`);
    if (isNaN(target.getTime())) return null;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const diffMs = target.getTime() - today.getTime();
    const daysLeft = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    const weeksLeft = Math.ceil(daysLeft / 7);

    const formattedDate = target.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "short",
      day: "numeric",
    });

    let pace = "3-4 essays / week";
    if (daysLeft <= 7) pace = "1-2 essays daily (Final sprint!)";
    else if (daysLeft <= 30) pace = "4-5 essays / week";
    else if (daysLeft > 60) pace = "2-3 essays / week (Consistent pacing)";

    return {
      daysLeft,
      weeksLeft,
      formattedDate,
      pace,
      isToday: daysLeft === 0,
      isPassed: daysLeft < 0,
    };
  }, [examDate]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!examDate) {
      setError("Please select a target exam date.");
      return;
    }

    setIsSubmitting(true);
    setError(null);
    try {
      const saved = await saveUserTarget({
        examDate: new Date(`${examDate}T00:00:00`).toISOString(),
        targetBand,
        examType,
      });
      onTargetSaved(saved);
      onOpenChange(false);
    } catch (err: any) {
      setError(err.message || "Failed to save exam target.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to clear your target exam date?")) return;
    setIsDeleting(true);
    try {
      await deleteUserTarget();
      if (onTargetDeleted) onTargetDeleted();
      onOpenChange(false);
    } catch (err: any) {
      setError(err.message || "Failed to clear target date.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md sm:max-w-lg p-0 overflow-hidden border-border/80 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-2xl rounded-2xl">
        <form onSubmit={handleSave}>
          {/* Header Banner */}
          <div className="p-5 sm:p-6 pb-4 bg-gradient-to-br from-primary/10 via-background to-background border-b border-border/50">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-primary/15 text-primary flex items-center justify-center shadow-xs">
                <Target className="h-5 w-5" />
              </div>
              <div>
                <DialogTitle className="text-lg sm:text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                  {currentTarget?.examDate ? "Edit Exam Target & Date" : "Set Your IELTS Exam Target"}
                </DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                  Set your upcoming test date and score goal to activate live countdowns and practice pacing.
                </DialogDescription>
              </div>
            </div>
          </div>

          <div className="p-5 sm:p-6 space-y-5 max-h-[70vh] overflow-y-auto">
            {error && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-semibold">
                {error}
              </div>
            )}

            {/* Exam Module Switch */}
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Exam Module
              </Label>
              <div className="grid grid-cols-2 gap-2 p-1 bg-zinc-100 dark:bg-zinc-900 rounded-xl border border-border/50">
                <button
                  type="button"
                  onClick={() => setExamType("academic")}
                  className={cn(
                    "flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer",
                    examType === "academic"
                      ? "bg-white dark:bg-zinc-800 text-primary shadow-xs border border-border/40"
                      : "text-muted-foreground hover:text-zinc-900 dark:hover:text-zinc-100",
                  )}
                >
                  <GraduationCap className="h-4 w-4" />
                  Academic
                </button>
                <button
                  type="button"
                  onClick={() => setExamType("general")}
                  className={cn(
                    "flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer",
                    examType === "general"
                      ? "bg-white dark:bg-zinc-800 text-primary shadow-xs border border-border/40"
                      : "text-muted-foreground hover:text-zinc-900 dark:hover:text-zinc-100",
                  )}
                >
                  <BookOpen className="h-4 w-4" />
                  General Training
                </button>
              </div>
            </div>

            {/* Target Exam Date Input & Presets */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="exam-date" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Official Exam Date
                </Label>
                <span className="text-[11px] text-muted-foreground font-medium">
                  {preview ? preview.formattedDate : "Select date below"}
                </span>
              </div>
              <div className="relative">
                <Input
                  id="exam-date"
                  type="date"
                  min={todayStr}
                  value={examDate}
                  onChange={(e) => setExamDate(e.target.value)}
                  className="rounded-xl bg-zinc-50 dark:bg-zinc-900/60 border-border/60 font-mono text-sm py-2"
                  required
                />
              </div>

              {/* Quick Presets */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                <span className="text-[10px] text-muted-foreground font-semibold flex items-center mr-1">
                  Quick:
                </span>
                {[
                  { label: "+2 Wks", days: 14 },
                  { label: "+1 Mo", days: 30 },
                  { label: "+2 Mos", days: 60 },
                  { label: "+3 Mos", days: 90 },
                  { label: "+6 Mos", days: 180 },
                ].map((preset) => (
                  <button
                    key={preset.days}
                    type="button"
                    onClick={() => applyPreset(preset.days)}
                    className="px-2 py-0.5 rounded-lg text-[11px] font-semibold bg-zinc-100 dark:bg-zinc-800 hover:bg-primary/10 hover:text-primary transition-all cursor-pointer border border-border/40"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Target Band Selector */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Target Band Score
                </Label>
                <Badge className="bg-primary/10 text-primary border-primary/20 text-xs font-black">
                  Band {targetBand.toFixed(1)}
                </Badge>
              </div>

              <div className="grid grid-cols-4 sm:grid-cols-7 gap-1.5">
                {BAND_OPTIONS.map((item) => {
                  const isSelected = targetBand === item.band;
                  return (
                    <button
                      key={item.band}
                      type="button"
                      onClick={() => setTargetBand(item.band)}
                      className={cn(
                        "p-2 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center",
                        isSelected
                          ? "bg-primary text-white border-primary shadow-sm shadow-primary/20 scale-[1.03]"
                          : "bg-zinc-50 dark:bg-zinc-900 border-border/50 hover:border-primary/40 text-zinc-900 dark:text-zinc-100",
                      )}
                    >
                      <span className="text-xs font-black">{item.band.toFixed(1)}</span>
                      <span
                        className={cn(
                          "text-[9px] font-medium leading-none mt-0.5 truncate w-full",
                          isSelected ? "text-white/80" : "text-muted-foreground",
                        )}
                      >
                        {item.desc}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Live Interactive Preview Card */}
            {preview && (
              <div className="p-3.5 rounded-xl bg-gradient-to-r from-emerald-500/10 via-primary/5 to-primary/10 border border-emerald-500/20 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="h-4 w-4 text-emerald-500" />
                    <span className="text-xs font-bold text-zinc-900 dark:text-zinc-50">
                      Countdown Preview
                    </span>
                  </div>
                  <Badge className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 text-[10px] font-bold">
                    {preview.isToday
                      ? "Today is Exam Day!"
                      : preview.isPassed
                        ? "Exam Passed"
                        : `${preview.daysLeft} Day${preview.daysLeft === 1 ? "" : "s"} Remaining`}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2 rounded-lg bg-white/60 dark:bg-zinc-900/60 border border-border/40">
                    <span className="text-[10px] font-medium text-muted-foreground block">
                      Target Goal
                    </span>
                    <span className="font-bold text-zinc-900 dark:text-zinc-100">
                      Band {targetBand.toFixed(1)} ({examType === "academic" ? "Academic" : "General"})
                    </span>
                  </div>
                  <div className="p-2 rounded-lg bg-white/60 dark:bg-zinc-900/60 border border-border/40">
                    <span className="text-[10px] font-medium text-muted-foreground block">
                      Suggested Pacing
                    </span>
                    <span className="font-bold text-zinc-900 dark:text-zinc-100">
                      {preview.pace}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <DialogFooter className="p-4 sm:p-5 pt-3 bg-zinc-50/50 dark:bg-zinc-900/50 border-t border-border/50 flex flex-col-reverse sm:flex-row items-center justify-between gap-2">
            <div>
              {currentTarget?.examDate ? (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleDelete}
                  disabled={isDeleting || isSubmitting}
                  className="text-red-500 hover:text-red-600 hover:bg-red-500/10 text-xs font-semibold cursor-pointer gap-1.5"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  {isDeleting ? "Clearing..." : "Clear Target"}
                </Button>
              ) : null}
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => onOpenChange(false)}
                className="w-full sm:w-auto text-xs font-semibold rounded-xl"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="blue"
                size="sm"
                disabled={isSubmitting || !examDate}
                className="w-full sm:w-auto text-xs font-bold rounded-xl shadow-xs cursor-pointer"
              >
                {isSubmitting ? (
                  "Saving Target..."
                ) : (
                  <>
                    <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                    Save Target Goal
                  </>
                )}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
