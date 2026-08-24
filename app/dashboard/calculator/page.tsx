"use client";

import React, { useState, useEffect, useCallback } from "react";
import DashboardShell from "../../components/DashboardShell";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Award,
  Headphones,
  BookOpen,
  PenTool,
  Mic,
  Plus,
  Trash2,
  Calendar,
  Sparkles,
  Target,
  RefreshCw,
  TrendingUp,
  Info,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";
import { format, parseISO } from "date-fns";
import type { MockScore, MockScoreSummary, IELTSModule } from "@/types/mock-score";
import type { UserTarget } from "@/types/target";
import { getMockScores, getMockSummary, deleteMockScore, getUserTarget } from "@/lib/api";
import LogMockScoreModal from "../../components/LogMockScoreModal";

const MODULE_CONFIG: Record<
  IELTSModule,
  {
    title: string;
    icon: React.ComponentType<{ className?: string }>;
    bgColor: string;
    borderColor: string;
    textColor: string;
  }
> = {
  listening: {
    title: "Listening",
    icon: Headphones,
    bgColor: "bg-blue-500/10 dark:bg-blue-500/15",
    borderColor: "border-blue-500/25",
    textColor: "text-blue-600 dark:text-blue-400",
  },
  reading: {
    title: "Reading",
    icon: BookOpen,
    bgColor: "bg-emerald-500/10 dark:bg-emerald-500/15",
    borderColor: "border-emerald-500/25",
    textColor: "text-emerald-600 dark:text-emerald-400",
  },
  writing: {
    title: "Writing",
    icon: PenTool,
    bgColor: "bg-primary/10 dark:bg-primary/15",
    borderColor: "border-primary/25",
    textColor: "text-primary",
  },
  speaking: {
    title: "Speaking",
    icon: Mic,
    bgColor: "bg-purple-500/10 dark:bg-purple-500/15",
    borderColor: "border-purple-500/25",
    textColor: "text-purple-600 dark:text-purple-400",
  },
};

export default function BandCalculatorPage() {
  const [summary, setSummary] = useState<MockScoreSummary | null>(null);
  const [scores, setScores] = useState<MockScore[]>([]);
  const [userTarget, setUserTarget] = useState<UserTarget | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedModuleFilter, setSelectedModuleFilter] = useState<string>("all");
  const [calculationMode, setCalculationMode] = useState<"latest" | "average">("latest");

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingScore, setEditingScore] = useState<MockScore | null>(null);
  const [targetModule, setTargetModule] = useState<IELTSModule>("listening");

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [sumData, scoreData, targetData] = await Promise.all([
        getMockSummary(),
        getMockScores(selectedModuleFilter === "all" ? undefined : selectedModuleFilter),
        getUserTarget().catch(() => null),
      ]);
      setSummary(sumData);
      setScores(scoreData.scores || []);
      setUserTarget(targetData);
    } catch (err) {
      console.error("Failed to load mock calculator data:", err);
    } finally {
      setLoading(false);
    }
  }, [selectedModuleFilter]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this test entry?")) return;
    try {
      await deleteMockScore(id);
      fetchData();
    } catch (err) {
      console.error("Failed to delete score:", err);
    }
  };

  const handleOpenAdd = (mod: IELTSModule = "listening") => {
    setEditingScore(null);
    setTargetModule(mod);
    setModalOpen(true);
  };

  const handleOpenEdit = (scoreItem: MockScore) => {
    setEditingScore(scoreItem);
    setTargetModule(scoreItem.module);
    setModalOpen(true);
  };

  const computedOverallBand =
    calculationMode === "latest" ? summary?.overallLatest : summary?.overallAverage;

  const targetBand = userTarget?.targetBand ?? 7.5;

  let deltaText = "";
  let deltaColor = "text-muted-foreground";

  if (computedOverallBand !== null && computedOverallBand !== undefined) {
    const diff = computedOverallBand - targetBand;
    if (diff === 0) {
      deltaText = "On Target Band Goal";
      deltaColor = "text-emerald-600 dark:text-emerald-400 font-bold";
    } else if (diff > 0) {
      deltaText = `+${diff.toFixed(1)} above Target Band ${targetBand.toFixed(1)}`;
      deltaColor = "text-emerald-600 dark:text-emerald-400 font-bold";
    } else {
      deltaText = `${diff.toFixed(1)} away from Target Band ${targetBand.toFixed(1)}`;
      deltaColor = "text-amber-600 dark:text-amber-400 font-bold";
    }
  }

  return (
    <DashboardShell>
      <div className="space-y-6 max-w-7xl mx-auto pb-12">
        {/* ── Page Header ─────────────────────────────────────────────── */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center border border-primary/20 shrink-0">
                <Award className="h-5 w-5" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
                IELTS Band Calculator & Mock Log
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl">
              Record external mock tests for Listening, Reading, Writing, and Speaking, and compute your official overall IELTS Band score.
            </p>
          </div>

          <Button
            variant="blue"
            size="sm"
            onClick={() => handleOpenAdd("listening")}
            className="h-10 px-4 rounded-xl text-xs sm:text-sm font-bold shadow-xs hover:scale-[1.01] active:scale-98 transition-all cursor-pointer shrink-0 flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            <span>Log External Test</span>
          </Button>
        </header>

        {/* ── Hero Card: Overall Band Score Calculator ───────────────── */}
        <Card className="border border-border/70 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 backdrop-blur-md rounded-2xl shadow-2xs overflow-hidden">
          <CardContent className="p-5 sm:p-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              {/* Left Column: Computation Result */}
              <div className="flex items-center gap-5">
                {/* Big Score Emblem */}
                <div className="h-20 w-24 sm:h-24 sm:w-28 rounded-2xl bg-primary text-primary-foreground flex flex-col items-center justify-center shadow-md shrink-0">
                  {loading ? (
                    <Skeleton className="h-8 w-12 bg-white/20" />
                  ) : computedOverallBand !== null && computedOverallBand !== undefined ? (
                    <span className="text-3xl sm:text-4xl font-black leading-none tracking-tight">
                      {computedOverallBand.toFixed(1)}
                    </span>
                  ) : (
                    <span className="text-xl font-bold opacity-80">-.-</span>
                  )}
                  <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider opacity-90 mt-1">
                    Overall Band
                  </span>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-extrabold text-base sm:text-xl text-zinc-900 dark:text-zinc-50">
                      Calculated Overall IELTS Score
                    </h3>
                    <Badge
                      variant="outline"
                      className="text-[10px] font-semibold border-border/80 text-muted-foreground flex items-center gap-1"
                    >
                      <Sparkles className="h-3 w-3 text-amber-500" />
                      Official IELTS Rounding
                    </Badge>
                  </div>

                  <p className="text-xs sm:text-sm text-muted-foreground">
                    {computedOverallBand !== null && computedOverallBand !== undefined ? (
                      <>
                        Based on your {calculationMode} module scores.{" "}
                        <span className={deltaColor}>{deltaText}</span>
                      </>
                    ) : (
                      "Log test scores for all 4 modules (Listening, Reading, Writing, Speaking) to compute your overall band."
                    )}
                  </p>

                  <div className="flex items-center gap-2 pt-1 text-xs">
                    <span className="text-muted-foreground font-medium">Calculation Basis:</span>
                    <div className="flex items-center gap-1 p-0.5 bg-zinc-100 dark:bg-zinc-800 rounded-lg border border-border/40">
                      <button
                        type="button"
                        onClick={() => setCalculationMode("latest")}
                        className={cn(
                          "px-2.5 py-0.5 text-[11px] font-semibold rounded-md transition-all cursor-pointer",
                          calculationMode === "latest"
                            ? "bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-xs"
                            : "text-muted-foreground hover:text-foreground",
                        )}
                      >
                        Latest Scores
                      </button>
                      <button
                        type="button"
                        onClick={() => setCalculationMode("average")}
                        className={cn(
                          "px-2.5 py-0.5 text-[11px] font-semibold rounded-md transition-all cursor-pointer",
                          calculationMode === "average"
                            ? "bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-xs"
                            : "text-muted-foreground hover:text-foreground",
                        )}
                      >
                        Average Scores
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Target Pill & Quick Stats */}
              <div className="flex flex-row lg:flex-col items-center lg:items-end justify-between border-t lg:border-t-0 border-border/50 pt-4 lg:pt-0 gap-3">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-border/60">
                  <Target className="h-4 w-4 text-primary" />
                  <span className="text-xs font-semibold text-muted-foreground">Target Goal:</span>
                  <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                    Band {targetBand.toFixed(1)}
                  </span>
                </div>

                <div className="text-right text-xs text-muted-foreground">
                  <span>Total Practice Logs: </span>
                  <strong className="text-zinc-900 dark:text-zinc-100">{summary?.totalLogs ?? 0}</strong>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ── 4 Skill Module Cards Grid ───────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {(["listening", "reading", "writing", "speaking"] as IELTSModule[]).map((modKey) => {
            const conf = MODULE_CONFIG[modKey];
            const Icon = conf.icon;
            const item = summary?.summary[modKey];
            const latestScore = item?.latest;
            const avgScore = item?.average;
            const count = item?.count ?? 0;

            return (
              <Card
                key={modKey}
                className="border border-border/70 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 backdrop-blur-md rounded-2xl shadow-2xs hover:shadow-xs transition-all duration-200"
              >
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className={cn(
                          "h-8 w-8 rounded-lg flex items-center justify-center border shrink-0",
                          conf.bgColor,
                          conf.borderColor,
                          conf.textColor,
                        )}
                      >
                        <Icon className="h-4 w-4" />
                      </div>
                      <span className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
                        {conf.title}
                      </span>
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleOpenAdd(modKey)}
                      title={`Log ${conf.title} test`}
                      className="h-7 w-7 p-0 rounded-lg text-muted-foreground hover:text-foreground cursor-pointer"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="flex items-baseline justify-between pt-1 border-t border-border/40">
                    <div>
                      <span className="text-[10px] font-semibold text-muted-foreground block">
                        Latest Score
                      </span>
                      {loading ? (
                        <Skeleton className="h-6 w-12" />
                      ) : latestScore !== null && latestScore !== undefined ? (
                        <span className="text-xl font-black text-zinc-900 dark:text-zinc-50">
                          Band {latestScore.toFixed(1)}
                        </span>
                      ) : (
                        <span className="text-xs text-muted-foreground italic">No tests logged</span>
                      )}
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] font-semibold text-muted-foreground block">
                        Average
                      </span>
                      <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200">
                        {avgScore !== null && avgScore !== undefined
                          ? `Band ${avgScore.toFixed(1)}`
                          : "-"}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1">
                    <span>{count} {count === 1 ? "entry" : "entries"} logged</span>
                    <button
                      type="button"
                      onClick={() => handleOpenAdd(modKey)}
                      className="text-primary font-bold hover:underline cursor-pointer"
                    >
                      + Add Score
                    </button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* ── Mock Scores History Table / List ────────────────────────── */}
        <Card className="border border-border/70 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 backdrop-blur-md rounded-2xl shadow-2xs overflow-hidden">
          <CardHeader className="p-4 sm:p-5 pb-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <CardTitle className="text-base sm:text-lg font-bold text-zinc-900 dark:text-zinc-50">
                  Logged Mock Tests History
                </CardTitle>
                <p className="text-xs text-muted-foreground">
                  View and manage all recorded test attempts from external websites or practice tests.
                </p>
              </div>

              {/* Module Filter Tabs */}
              <div className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-800/70 p-1 rounded-xl border border-border/40 self-start sm:self-center overflow-x-auto max-w-full">
                {[
                  { id: "all", label: "All Modules" },
                  { id: "listening", label: "Listening" },
                  { id: "reading", label: "Reading" },
                  { id: "writing", label: "Writing" },
                  { id: "speaking", label: "Speaking" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setSelectedModuleFilter(tab.id)}
                    className={cn(
                      "px-2.5 py-1 text-xs font-semibold rounded-lg whitespace-nowrap transition-all cursor-pointer",
                      selectedModuleFilter === tab.id
                        ? "bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-xs font-bold"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-4 sm:p-5 pt-0">
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-16 w-full rounded-xl" />
                ))}
              </div>
            ) : scores.length === 0 ? (
              <div className="p-8 text-center space-y-3 border border-dashed border-border/60 rounded-xl bg-zinc-50/50 dark:bg-zinc-900/30">
                <div className="h-12 w-12 rounded-2xl bg-zinc-100 dark:bg-zinc-800 text-muted-foreground flex items-center justify-center mx-auto">
                  <Award className="h-6 w-6" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
                    No mock test scores logged yet
                  </h4>
                  <p className="text-xs text-muted-foreground max-w-md mx-auto">
                    Record your scores from websites like IELTSOnlineTests, Cambridge Books, or GelIELTS to calculate your overall band.
                  </p>
                </div>
                <Button
                  variant="blue"
                  size="sm"
                  onClick={() => handleOpenAdd("listening")}
                  className="h-9 px-4 text-xs font-bold rounded-xl cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5 mr-1.5" />
                  Log First Test Score
                </Button>
              </div>
            ) : (
              <div className="space-y-2.5">
                {scores.map((scoreItem) => {
                  const conf = MODULE_CONFIG[scoreItem.module];
                  const Icon = conf.icon;
                  const formattedDate = format(parseISO(scoreItem.testDate), "MMM dd, yyyy");

                  return (
                    <div
                      key={scoreItem._id}
                      className="p-3.5 rounded-xl border border-border/50 dark:border-zinc-800/80 bg-zinc-50/60 dark:bg-zinc-900/40 hover:bg-zinc-100/80 dark:hover:bg-zinc-850/60 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
                    >
                      {/* Left Details */}
                      <div className="flex items-start sm:items-center gap-3">
                        <div
                          className={cn(
                            "h-9 w-9 rounded-xl flex items-center justify-center border shrink-0 mt-0.5 sm:mt-0",
                            conf.bgColor,
                            conf.borderColor,
                            conf.textColor,
                          )}
                        >
                          <Icon className="h-4.5 w-4.5" />
                        </div>

                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-bold text-xs sm:text-sm text-zinc-900 dark:text-zinc-100">
                              {conf.title} Test
                            </span>
                            <Badge
                              variant="outline"
                              className="text-[10px] font-semibold border-border/60 text-muted-foreground"
                            >
                              {scoreItem.source}
                            </Badge>
                            {scoreItem.rawCount !== undefined && scoreItem.rawCount !== null && (
                              <span className="text-[11px] font-semibold text-muted-foreground">
                                ({scoreItem.rawCount} / {scoreItem.totalQuestions || 40} correct)
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {formattedDate}
                            </span>
                            {scoreItem.notes && (
                              <span className="truncate max-w-xs text-zinc-700 dark:text-zinc-300">
                                • {scoreItem.notes}
                              </span>
                            )}
                            {scoreItem.resultUrl && (
                              <a
                                href={scoreItem.resultUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="flex items-center gap-0.5 text-primary hover:underline font-semibold shrink-0"
                              >
                                <ExternalLink className="h-3 w-3" />
                                View Result
                              </a>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Right Action & Score Badge */}
                      <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-border/40">
                        <div className="px-3 py-1 rounded-xl bg-white dark:bg-zinc-800 border border-border/60 text-center">
                          <span className="text-[10px] font-medium text-muted-foreground block leading-tight">
                            Score
                          </span>
                          <span className="text-sm sm:text-base font-black text-zinc-900 dark:text-zinc-100">
                            Band {scoreItem.score.toFixed(1)}
                          </span>
                        </div>

                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleOpenEdit(scoreItem)}
                            className="h-8 text-xs font-semibold rounded-lg text-muted-foreground hover:text-foreground cursor-pointer"
                          >
                            Edit
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(scoreItem._id)}
                            className="h-8 w-8 p-0 rounded-lg text-muted-foreground hover:text-red-500 hover:bg-red-500/10 cursor-pointer"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Modal Trigger */}
      <LogMockScoreModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        currentScore={editingScore}
        defaultModule={targetModule}
        onScoreSaved={fetchData}
      />
    </DashboardShell>
  );
}
