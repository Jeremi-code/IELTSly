"use client";

import React, { useState, useMemo } from "react";
import DashboardShell from "../../components/DashboardShell";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  NotepadText, 
  Search, 
  Filter, 
  Clock, 
  ChevronRight, 
  Sparkles, 
  FileText, 
  CheckCircle,
  HelpCircle,
  BookOpen
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { motion } from "framer-motion";

// Mock completed essays list
const initialEssays = [
  {
    id: "ess-104",
    title: "The impact of social media on youth development and communication",
    type: "Task 2",
    date: "Aug 09, 2026",
    score: "7.5",
    criteria: { ta: 7.5, cc: 7.5, lr: 7.0, gra: 8.0 },
    status: "Evaluated",
    duration: "38 mins",
    words: "284 words",
    aiFeedback: "Strong vocabulary usage and structural layout. Minor errors in punctuation."
  },
  {
    id: "ess-103",
    title: "Climate change global policy and individual responsibility",
    type: "Task 2",
    date: "Aug 07, 2026",
    score: "6.5",
    criteria: { ta: 6.5, cc: 6.0, lr: 7.0, gra: 6.5 },
    status: "Evaluated",
    duration: "40 mins",
    words: "260 words",
    aiFeedback: "Good arguments, but Coherence and Cohesion fell short due to weak transitionals."
  },
  {
    id: "ess-102",
    title: "Line graph: Population trends in major Asian cities (1990-2020)",
    type: "Task 1",
    date: "Aug 06, 2026",
    score: "7.0",
    criteria: { ta: 7.0, cc: 7.0, lr: 7.0, gra: 7.0 },
    status: "Evaluated",
    duration: "18 mins",
    words: "172 words",
    aiFeedback: "Data trends were accurately summarized. Lexical resource was precise."
  },
  {
    id: "ess-101",
    title: "Bar chart: Energy consumption patterns in five European countries",
    type: "Task 1",
    date: "Aug 02, 2026",
    score: "6.0",
    criteria: { ta: 6.0, cc: 6.0, lr: 6.0, gra: 6.0 },
    status: "Evaluated",
    duration: "20 mins",
    words: "155 words",
    aiFeedback: "Summarized the major categories, but missed key comparative data points."
  }
];

const HistoryPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"All" | "Task 1" | "Task 2">("All");

  // Filtering logic
  const filteredEssays = useMemo(() => {
    return initialEssays.filter((essay) => {
      const matchesSearch = essay.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            essay.id.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesTab = activeTab === "All" || essay.type === activeTab;
      return matchesSearch && matchesTab;
    });
  }, [searchQuery, activeTab]);

  return (
    <DashboardShell className="max-w-[1400px] p-6 lg:p-10 space-y-8">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
            Essay <span className="text-primary italic">History</span>
          </h1>
          <p className="text-muted-foreground text-lg">
            Review your historical progress, words written, and AI evaluations.
          </p>
        </div>

        <Link href="/dashboard/practice">
          <Button variant="blue" className="rounded-full shadow-lg shadow-primary/20 hover:scale-105 transition-transform cursor-pointer">
            <Sparkles className="h-4 w-4 mr-2" />
            Write New Essay
          </Button>
        </Link>
      </header>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        {/* Tab Filters */}
        <div className="flex items-center p-1 bg-zinc-100/80 dark:bg-zinc-800/50 rounded-xl border border-border/50 dark:border-zinc-800/50 w-full sm:w-auto">
          {(["All", "Task 1", "Task 2"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer flex-1 sm:flex-none whitespace-nowrap",
                activeTab === tab
                  ? "bg-[#2563EB] text-white shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search essays by title or ID..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-white/50 dark:bg-zinc-900/50 border-border/50 dark:border-zinc-800/80 rounded-xl" 
          />
        </div>
      </div>

      {/* Essay Cards list */}
      <div className="space-y-4">
        {filteredEssays.length > 0 ? (
          filteredEssays.map((essay) => (
            <motion.div
              key={essay.id}
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.2 }}
            >
              <Card className="group overflow-hidden border-border/50 dark:border-zinc-800/80 bg-white/70 dark:bg-zinc-950/40 backdrop-blur-xl shadow-sm hover:shadow-md transition-all duration-300 hover:border-primary/20">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row gap-6 justify-between">
                    
                    {/* Details Column */}
                    <div className="space-y-3 flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20">
                          {essay.id}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {essay.type}
                        </Badge>
                        <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {essay.date}
                        </span>
                      </div>
                      
                      <h3 className="text-lg font-bold truncate group-hover:text-primary transition-colors">
                        {essay.title}
                      </h3>
                      
                      {/* Sub-Criteria bands */}
                      <div className="flex gap-4 flex-wrap text-xs text-muted-foreground pt-1">
                        <span className="bg-zinc-100/50 dark:bg-zinc-900/50 px-2.5 py-1 rounded-lg border border-border/10">
                          TA: <strong>{essay.criteria.ta}</strong>
                        </span>
                        <span className="bg-zinc-100/50 dark:bg-zinc-900/50 px-2.5 py-1 rounded-lg border border-border/10">
                          CC: <strong>{essay.criteria.cc}</strong>
                        </span>
                        <span className="bg-zinc-100/50 dark:bg-zinc-900/50 px-2.5 py-1 rounded-lg border border-border/10">
                          LR: <strong>{essay.criteria.lr}</strong>
                        </span>
                        <span className="bg-zinc-100/50 dark:bg-zinc-900/50 px-2.5 py-1 rounded-lg border border-border/10">
                          GRA: <strong>{essay.criteria.gra}</strong>
                        </span>
                        <span className="bg-zinc-100/50 dark:bg-zinc-900/50 px-2.5 py-1 rounded-lg border border-border/10">
                          Words: <strong>{essay.words}</strong>
                        </span>
                        <span className="bg-zinc-100/50 dark:bg-zinc-900/50 px-2.5 py-1 rounded-lg border border-border/10">
                          Time: <strong>{essay.duration}</strong>
                        </span>
                      </div>

                      {/* AI Summary snippet */}
                      <div className="p-3 rounded-xl bg-blue-500/5 border border-blue-500/10 flex items-start gap-2">
                        <Sparkles className="h-4 w-4 text-[#2563EB] shrink-0 mt-0.5" />
                        <p className="text-xs text-muted-foreground font-medium italic line-clamp-1">
                          "{essay.aiFeedback}"
                        </p>
                      </div>
                    </div>

                    {/* Score Circle & Action Column */}
                    <div className="flex flex-row lg:flex-col items-center justify-between lg:justify-center gap-4 lg:pl-6 lg:border-l border-border/20 dark:border-zinc-800/50">
                      <div className="text-center lg:space-y-1">
                        <div className="h-16 w-16 rounded-full bg-gradient-to-tr from-primary to-blue-400 p-[3px] flex items-center justify-center shadow-md">
                          <div className="h-full w-full rounded-full bg-white dark:bg-zinc-950 flex flex-col items-center justify-center">
                            <span className="text-xl font-black leading-none">{essay.score}</span>
                            <span className="text-[8px] text-muted-foreground font-black uppercase tracking-widest mt-0.5">Band</span>
                          </div>
                        </div>
                      </div>
                      
                      <Link href={`/dashboard/history`}>
                        <Button variant="outline" size="sm" className="rounded-full gap-1 border-primary/20 hover:bg-primary hover:text-white transition-all cursor-pointer">
                          Details
                          <ChevronRight className="h-3 w-3" />
                        </Button>
                      </Link>
                    </div>

                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))
        ) : (
          <Card className="border-border/50 dark:border-zinc-800/50 bg-white/70 dark:bg-zinc-900/40 backdrop-blur-xl">
            <CardContent className="py-20 text-center space-y-4">
              <div className="h-20 w-20 rounded-full bg-primary/5 flex items-center justify-center text-primary/40 mx-auto">
                <NotepadText className="h-10 w-10" />
              </div>
              <div className="max-w-xs space-y-2 mx-auto">
                <p className="font-bold text-lg">No essays match your search</p>
                <p className="text-sm text-muted-foreground">Try modifying your query or filter keywords.</p>
              </div>
              <Button 
                variant="outline"
                onClick={() => { setSearchQuery(""); setActiveTab("All"); }}
                className="rounded-full cursor-pointer"
              >
                Clear Filters
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardShell>
  );
};

export default HistoryPage;
