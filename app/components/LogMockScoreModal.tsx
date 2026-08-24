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
  Headphones,
  BookOpen,
  PenTool,
  Mic,
  Calendar as CalendarIcon,
  Award,
  Sparkles,
  Plus,
  Loader2,
  Trash2,
  Link as LinkIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format, parseISO } from "date-fns";
import type { IELTSModule, MockScore } from "@/types/mock-score";
import { rawToBandScore } from "@/types/mock-score";
import { saveMockScore } from "@/lib/api";

interface LogMockScoreModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentScore?: MockScore | null;
  defaultModule?: IELTSModule;
  onScoreSaved: () => void;
}

const MODULE_OPTIONS: Array<{
  id: IELTSModule;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}> = [
  { id: "listening", label: "Listening", icon: Headphones },
  { id: "reading", label: "Reading", icon: BookOpen },
  { id: "writing", label: "Writing", icon: PenTool },
  { id: "speaking", label: "Speaking", icon: Mic },
];

const SOURCE_PRESETS = [
  "IELTSOnlineTests",
  "Cambridge Book",
  "GelIELTS",
  "Mini-IELTS",
  "Official Practice Test",
];

const BAND_SCORES = [9.0, 8.5, 8.0, 7.5, 7.0, 6.5, 6.0, 5.5, 5.0, 4.5, 4.0];

export default function LogMockScoreModal({
  open,
  onOpenChange,
  currentScore,
  defaultModule = "listening",
  onScoreSaved,
}: LogMockScoreModalProps) {
  const [module, setModule] = useState<IELTSModule>(defaultModule);
  const [inputMode, setInputMode] = useState<"band" | "raw">("raw");
  const [score, setScore] = useState<number>(7.5);
  const [rawCount, setRawCount] = useState<string>("32");
  const [source, setSource] = useState<string>("IELTSOnlineTests");
  const [testDate, setTestDate] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [resultUrl, setResultUrl] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      if (currentScore) {
        setModule(currentScore.module);
        setScore(currentScore.score);
        setRawCount(currentScore.rawCount ? String(currentScore.rawCount) : "");
        setInputMode(currentScore.rawCount ? "raw" : "band");
        setSource(currentScore.source || "Practice Test");
        try {
          const d = parseISO(currentScore.testDate);
          setTestDate(format(d, "yyyy-MM-dd"));
        } catch {
          setTestDate(format(new Date(), "yyyy-MM-dd"));
        }
        setNotes(currentScore.notes || "");
        setResultUrl(currentScore.resultUrl || "");
      } else {
        setModule(defaultModule);
        setScore(7.5);
        setRawCount("32");
        setInputMode(defaultModule === "listening" || defaultModule === "reading" ? "raw" : "band");
        setSource("IELTSOnlineTests");
        setTestDate(format(new Date(), "yyyy-MM-dd"));
        setNotes("");
        setResultUrl("");
      }
      setError(null);
    }
  }, [open, currentScore, defaultModule]);

  // Compute calculated band score dynamically
  const computedBand = useMemo(() => {
    if (module === "writing" || module === "speaking" || inputMode === "band") {
      return score;
    }
    const raw = parseInt(rawCount, 10);
    if (isNaN(raw) || raw < 0) return null;
    return rawToBandScore(raw);
  }, [module, inputMode, score, rawCount]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      let finalScore = score;
      let finalRaw: number | undefined = undefined;

      if ((module === "listening" || module === "reading") && inputMode === "raw") {
        const raw = parseInt(rawCount, 10);
        if (isNaN(raw) || raw < 0 || raw > 40) {
          throw new Error("Please enter a valid raw correct score between 0 and 40.");
        }
        finalRaw = raw;
        finalScore = rawToBandScore(raw);
      }

      await saveMockScore({
        id: currentScore?._id,
        module,
        score: finalScore,
        rawCount: finalRaw,
        source: source.trim() || "Practice Test",
        testDate: testDate ? `${testDate}T12:00:00.000Z` : new Date().toISOString(),
        notes: notes.trim(),
        resultUrl: resultUrl.trim() || undefined,
      });

      onScoreSaved();
      onOpenChange(false);
    } catch (err: any) {
      setError(err.message || "Failed to log test score.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md p-0 overflow-hidden border-border/60 bg-white dark:bg-zinc-950 rounded-2xl shadow-xl">
        <form onSubmit={handleSubmit}>
          {/* Header */}
          <div className="p-5 pb-4 bg-zinc-50 dark:bg-zinc-900/60 border-b border-border/50 flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 border border-primary/20">
              <Award className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle className="text-base sm:text-lg font-bold text-zinc-900 dark:text-zinc-50">
                {currentScore ? "Edit External Test Entry" : "Log External Practice Test"}
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                Record scores from external mock tests for analysis. These do not affect your Writing band target.
              </DialogDescription>
            </div>
          </div>

          <div className="p-5 space-y-4 max-h-[72vh] overflow-y-auto">
            {error && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-semibold">
                {error}
              </div>
            )}

            {/* 1. Module Selector */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-muted-foreground">
                IELTS Module
              </Label>
              <div className="grid grid-cols-4 gap-2">
                {MODULE_OPTIONS.map((opt) => {
                  const Icon = opt.icon;
                  const isSelected = module === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => {
                        setModule(opt.id);
                        if (opt.id === "writing" || opt.id === "speaking") {
                          setInputMode("band");
                        }
                      }}
                      className={cn(
                        "flex flex-col items-center justify-center p-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer gap-1",
                        isSelected
                          ? "bg-primary text-primary-foreground border-primary shadow-2xs"
                          : "bg-zinc-50 dark:bg-zinc-900/60 border-border/50 text-muted-foreground hover:text-foreground hover:bg-zinc-100 dark:hover:bg-zinc-800",
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{opt.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Score Input Mode (for Listening & Reading) */}
            {(module === "listening" || module === "reading") && (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-semibold text-muted-foreground">
                    Score Input Mode
                  </Label>
                  <div className="flex items-center gap-1 p-0.5 bg-zinc-100 dark:bg-zinc-800/80 rounded-lg border border-border/40">
                    <button
                      type="button"
                      onClick={() => setInputMode("raw")}
                      className={cn(
                        "px-2 py-0.5 text-[11px] font-semibold rounded-md transition-all cursor-pointer",
                        inputMode === "raw"
                          ? "bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-xs"
                          : "text-muted-foreground hover:text-foreground",
                      )}
                    >
                      Raw Score (/40)
                    </button>
                    <button
                      type="button"
                      onClick={() => setInputMode("band")}
                      className={cn(
                        "px-2 py-0.5 text-[11px] font-semibold rounded-md transition-all cursor-pointer",
                        inputMode === "band"
                          ? "bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-xs"
                          : "text-muted-foreground hover:text-foreground",
                      )}
                    >
                      Band Score
                    </button>
                  </div>
                </div>

                {inputMode === "raw" ? (
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 border border-border/60">
                    <div className="space-y-1 flex-1">
                      <Label htmlFor="rawInput" className="text-xs font-bold">
                        Correct Answers Count
                      </Label>
                      <div className="flex items-center gap-2">
                        <Input
                          id="rawInput"
                          type="number"
                          min={0}
                          max={40}
                          value={rawCount}
                          onChange={(e) => setRawCount(e.target.value)}
                          placeholder="e.g. 32"
                          className="h-9 text-sm font-bold w-28 rounded-lg"
                        />
                        <span className="text-xs text-muted-foreground font-bold">/ 40</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] text-muted-foreground font-semibold block">
                        Calculated Band
                      </span>
                      <span className="text-xl font-black text-primary">
                        Band {computedBand !== null ? computedBand.toFixed(1) : "-"}
                      </span>
                    </div>
                  </div>
                ) : null}
              </div>
            )}

            {/* Direct Band Selector (when inputMode === 'band' or writing/speaking) */}
            {(inputMode === "band" || module === "writing" || module === "speaking") && (
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-muted-foreground">
                  Select Band Score
                </Label>
                <div className="grid grid-cols-6 gap-1.5">
                  {BAND_SCORES.map((b) => (
                    <button
                      key={b}
                      type="button"
                      onClick={() => setScore(b)}
                      className={cn(
                        "py-1.5 rounded-lg border text-xs font-bold transition-all cursor-pointer text-center",
                        score === b
                          ? "bg-primary text-primary-foreground border-primary shadow-2xs"
                          : "bg-zinc-50 dark:bg-zinc-900/60 border-border/50 text-muted-foreground hover:text-foreground hover:bg-zinc-100 dark:hover:bg-zinc-800",
                      )}
                    >
                      {b.toFixed(1)}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* 3. Test Source / Website Tag */}
            <div className="space-y-1.5">
              <Label htmlFor="source" className="text-xs font-semibold text-muted-foreground">
                Platform / Test Source
              </Label>
              <Input
                id="source"
                value={source}
                onChange={(e) => setSource(e.target.value)}
                placeholder="e.g. IELTSOnlineTests, Cambridge 18 Test 1"
                className="h-9 text-xs rounded-xl"
              />
              <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
                {SOURCE_PRESETS.map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setSource(p)}
                    className={cn(
                      "px-2 py-0.5 rounded-md text-[10px] font-semibold border cursor-pointer transition-all",
                      source === p
                        ? "bg-primary/10 text-primary border-primary/30 font-bold"
                        : "bg-zinc-100 dark:bg-zinc-800 text-muted-foreground border-border/40 hover:text-foreground",
                    )}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {/* 4. Test Date */}
            <div className="space-y-1.5">
              <Label htmlFor="testDate" className="text-xs font-semibold text-muted-foreground">
                Date Taken
              </Label>
              <div className="relative">
                <Input
                  id="testDate"
                  type="date"
                  value={testDate}
                  onChange={(e) => setTestDate(e.target.value)}
                  className="h-9 text-xs rounded-xl"
                />
              </div>
            </div>

            {/* 5. Notes (Optional) */}
            <div className="space-y-1.5">
              <Label htmlFor="notes" className="text-xs font-semibold text-muted-foreground">
                Notes (Optional)
              </Label>
              <Input
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Practice Test #3, Part 2 missed 3 questions"
                className="h-9 text-xs rounded-xl"
              />
            </div>

            {/* 6. Result URL (Optional) */}
            <div className="space-y-1.5">
              <Label htmlFor="result-url" className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                <LinkIcon className="h-3 w-3" />
                Result Link (Optional)
              </Label>
              <div className="relative">
                <Input
                  id="result-url"
                  type="url"
                  value={resultUrl}
                  onChange={(e) => setResultUrl(e.target.value)}
                  placeholder="https://ieltsonlinetests.com/result/..."
                  className="h-9 text-xs rounded-xl pl-8"
                />
                <LinkIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
              </div>
              <p className="text-[10px] text-muted-foreground">
                Paste a link to your external test result page for your own reference.
              </p>
            </div>
          </div>

          <DialogFooter className="p-4 bg-zinc-50 dark:bg-zinc-900/60 border-t border-border/50 flex items-center justify-between sm:justify-between gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="h-9 text-xs font-semibold rounded-xl cursor-pointer"
            >
              Cancel
            </Button>

            <Button
              type="submit"
              variant="blue"
              size="sm"
              disabled={isSubmitting}
              className="h-9 text-xs font-bold px-4 rounded-xl cursor-pointer shadow-xs gap-1.5"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Award className="h-3.5 w-3.5" />
                  <span>{currentScore ? "Update Entry" : "Save Test Score"}</span>
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
