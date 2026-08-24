"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Monitor,
  Cpu,
  Sliders,
  Calculator,
  Database,
  Sparkles,
  Clock,
  Lock,
  Award,
  CheckCircle2,
} from "lucide-react";

const mainFeatures = [
  {
    id: "simulator",
    colSpan: "lg:col-span-2",
    badge: "Authentic Experience",
    title: "Real Computer-Delivered Exam Environment",
    description:
      "Practice in a zero-distraction environment that perfectly replicates official test day conditions. No autocorrect, no spellcheck, with authentic timers and word counts.",
    icon: Monitor,
    preview: (
      <div className="mt-6 w-full rounded-2xl bg-slate-100/90 dark:bg-zinc-900/90 border border-slate-200/90 dark:border-zinc-800 p-4 shadow-sm text-left font-sans space-y-3">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-zinc-800 pb-2.5 text-xs text-slate-600 dark:text-zinc-400">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-semibold text-slate-800 dark:text-zinc-200">Writing Task 2: Academic Essay</span>
          </div>
          <div className="flex items-center gap-2.5 font-mono text-[11px]">
            <span className="flex items-center gap-1 text-amber-700 dark:text-amber-400 font-bold bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
              <Clock className="w-3 h-3" /> 38:42
            </span>
            <span className="bg-slate-200/80 dark:bg-zinc-800 px-2 py-0.5 rounded text-slate-700 dark:text-zinc-300">284 Words</span>
            <span className="flex items-center gap-1 text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              <Lock className="w-3 h-3" /> No Autocorrect
            </span>
          </div>
        </div>
        <div className="text-xs text-slate-700 dark:text-zinc-300 leading-relaxed font-mono bg-white/80 dark:bg-zinc-950/60 p-3 rounded-xl border border-slate-200/80 dark:border-zinc-800/80 space-y-1">
          <p className="text-slate-500 dark:text-zinc-400 text-[11px]">Prompt: Some people believe university education should be free for everyone...</p>
          <p className="text-slate-800 dark:text-emerald-300/90 font-sans text-xs">
            In contemporary society, the debate regarding higher education financing has gained significant momentum...
            <span className="inline-block w-1.5 h-3.5 bg-emerald-500 ml-0.5 animate-pulse" />
          </p>
        </div>
      </div>
    ),
  },
  {
    id: "ai-feedback",
    colSpan: "lg:col-span-1",
    badge: "Instant Evaluation",
    title: "Official Criteria AI Feedback",
    description:
      "Get instant evaluations scored on all 4 official IELTS criteria: Task Achievement, Coherence & Cohesion, Lexical Resource, and Grammar.",
    icon: Cpu,
    preview: (
      <div className="mt-6 w-full rounded-2xl bg-slate-100/90 dark:bg-zinc-900/90 border border-slate-200/90 dark:border-zinc-800 p-4 shadow-sm space-y-2 text-left">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-800 dark:text-zinc-300 flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> Assessment Result
          </span>
          <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 text-xs font-black border border-emerald-500/20">
            Overall Band 7.5
          </span>
        </div>
        <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
          <div className="p-2 rounded-lg bg-white/80 dark:bg-zinc-950/60 border border-slate-200/80 dark:border-zinc-800">
            <span className="text-slate-500 dark:text-zinc-500 block text-[10px]">Task Achievement</span>
            <span className="font-bold text-emerald-700 dark:text-emerald-400">Band 8.0</span>
          </div>
          <div className="p-2 rounded-lg bg-white/80 dark:bg-zinc-950/60 border border-slate-200/80 dark:border-zinc-800">
            <span className="text-slate-500 dark:text-zinc-500 block text-[10px]">Coherence & Cohesion</span>
            <span className="font-bold text-teal-700 dark:text-teal-400">Band 7.5</span>
          </div>
          <div className="p-2 rounded-lg bg-white/80 dark:bg-zinc-950/60 border border-slate-200/80 dark:border-zinc-800">
            <span className="text-slate-500 dark:text-zinc-500 block text-[10px]">Lexical Resource</span>
            <span className="font-bold text-emerald-700 dark:text-emerald-400">Band 7.5</span>
          </div>
          <div className="p-2 rounded-lg bg-white/80 dark:bg-zinc-950/60 border border-slate-200/80 dark:border-zinc-800">
            <span className="text-slate-500 dark:text-zinc-500 block text-[10px]">Grammar & Accuracy</span>
            <span className="font-bold text-teal-700 dark:text-teal-400">Band 8.0</span>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "modes",
    colSpan: "lg:col-span-1",
    badge: "Flexible Workflows",
    title: "Practice vs Exam Modes",
    description:
      "Switch between relaxed practice mode with real-time assistance or strict exam simulation with time limits and final score reports.",
    icon: Sliders,
    preview: (
      <div className="mt-6 w-full rounded-2xl bg-slate-100/90 dark:bg-zinc-900/90 border border-slate-200/90 dark:border-zinc-800 p-4 shadow-sm space-y-3 text-left">
        <div className="flex items-center gap-2 p-1.5 bg-white/80 dark:bg-zinc-950 rounded-xl border border-slate-200/80 dark:border-zinc-800 text-xs font-semibold">
          <div className="flex-1 py-1.5 px-3 rounded-lg bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 text-center border border-emerald-500/20 flex items-center justify-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> Practice Mode
          </div>
          <div className="flex-1 py-1.5 px-3 rounded-lg text-slate-500 dark:text-zinc-500 text-center flex items-center justify-center gap-1.5">
            <Clock className="w-3.5 h-3.5" /> Exam Mode
          </div>
        </div>
        <div className="flex items-center gap-2 text-[11px] text-slate-600 dark:text-zinc-400 bg-white/80 dark:bg-zinc-950/40 p-2.5 rounded-xl border border-slate-200/80 dark:border-zinc-850">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span>Real-time word guidance & criteria hints enabled</span>
        </div>
      </div>
    ),
  },
  {
    id: "calculator",
    colSpan: "lg:col-span-1",
    badge: "Overall Score Tracking",
    title: "IELTS Band Score Calculator",
    description:
      "Log results from external Listening, Reading, and Speaking practice tests alongside your Writing scores to calculate your true overall band score.",
    icon: Calculator,
    preview: (
      <div className="mt-6 w-full rounded-2xl bg-slate-100/90 dark:bg-zinc-900/90 border border-slate-200/90 dark:border-zinc-800 p-4 shadow-sm space-y-2 text-left">
        <div className="flex items-center justify-between text-xs pb-1 border-b border-slate-200 dark:border-zinc-800">
          <span className="text-slate-600 dark:text-zinc-400 font-medium">Multi-Module Summary</span>
          <span className="text-emerald-700 dark:text-emerald-400 font-bold">Computed Overall</span>
        </div>
        <div className="flex items-center justify-between gap-1 text-[10px] font-bold pt-1">
          <span className="px-2 py-1 bg-white/80 dark:bg-zinc-950 rounded border border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-zinc-300">L: 8.5</span>
          <span className="px-2 py-1 bg-white/80 dark:bg-zinc-950 rounded border border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-zinc-300">R: 8.0</span>
          <span className="px-2 py-1 bg-white/80 dark:bg-zinc-950 rounded border border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-zinc-300">W: 7.5</span>
          <span className="px-2 py-1 bg-white/80 dark:bg-zinc-950 rounded border border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-zinc-300">S: 7.5</span>
        </div>
        <div className="p-2 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/20 border border-emerald-500/20 dark:border-emerald-500/30 text-center mt-2">
          <span className="text-[10px] text-emerald-800 dark:text-zinc-400 uppercase font-bold tracking-wider block">Target Reached</span>
          <span className="text-sm font-black text-emerald-700 dark:text-emerald-300">Overall Band 8.0</span>
        </div>
      </div>
    ),
  },
  {
    id: "questions",
    colSpan: "lg:col-span-1",
    badge: "Extensive Database",
    title: "Curated IELTS Question Bank",
    description:
      "Practice with hundreds of real IELTS Task 1 (Academic & General Training) and Task 2 essay questions categorized by topic and difficulty.",
    icon: Database,
    preview: (
      <div className="mt-6 w-full rounded-2xl bg-slate-100/90 dark:bg-zinc-900/90 border border-slate-200/90 dark:border-zinc-800 p-4 shadow-sm space-y-2 text-left">
        <div className="flex flex-wrap gap-1.5">
          <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-[10px] font-bold rounded-lg border border-emerald-500/20">
            Task 2 Essay
          </span>
          <span className="px-2.5 py-1 bg-teal-500/10 text-teal-700 dark:text-teal-400 text-[10px] font-bold rounded-lg border border-teal-500/20">
            Task 1 Line Graph
          </span>
          <span className="px-2.5 py-1 bg-white/80 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 text-[10px] font-bold rounded-lg border border-slate-200 dark:border-zinc-700">
            Education
          </span>
          <span className="px-2.5 py-1 bg-white/80 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 text-[10px] font-bold rounded-lg border border-slate-200 dark:border-zinc-700">
            Technology
          </span>
        </div>
        <p className="text-[11px] text-slate-600 dark:text-zinc-400 pt-1 leading-normal line-clamp-2">
          "The increase in international travel has negative impacts on the environment..."
        </p>
      </div>
    ),
  },
];

const Features = () => {
  return (
    <section
      id="features"
      className="relative w-full py-24 px-6 lg:px-20 bg-slate-50 dark:bg-zinc-950 overflow-hidden transition-colors duration-500 scroll-mt-24"
    >
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-emerald-500/5 dark:bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10 space-y-16">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex flex-col items-center text-center max-w-3xl mx-auto space-y-4"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-zinc-50 tracking-tight leading-[1.15]">
            Everything You Need to Reach{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 dark:from-emerald-400 dark:via-teal-400 dark:to-green-400">
              Band 8.0+
            </span>
          </h2>

          <p className="text-slate-600 dark:text-zinc-400 text-base sm:text-lg lg:text-xl leading-relaxed">
            Built specifically for serious IELTS candidates. Authentic test condition simulation combined with official criteria-level AI assessment.
          </p>
        </motion.div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {mainFeatures.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
                className={`group relative rounded-3xl p-6 sm:p-8 bg-white dark:bg-zinc-900/60 border border-slate-200/80 dark:border-zinc-800/80 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden backdrop-blur-md hover:-translate-y-1 ${item.colSpan}`}
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 dark:bg-emerald-500/15 border border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform duration-300 shadow-xs">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 border border-slate-200 dark:border-zinc-700/60">
                      {item.badge}
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-zinc-50 mb-3 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    {item.title}
                  </h3>

                  <p className="text-slate-600 dark:text-zinc-400 text-sm leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {/* Embedded UI Interactive Preview */}
                {item.preview}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;
