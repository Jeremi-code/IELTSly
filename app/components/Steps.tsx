"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Key,
  FileSearch,
  PenTool,
  Award,
  Lock,
  Zap,
  Clock,
} from "lucide-react";

const stepsList = [
  {
    number: "01",
    title: "Connect AI Engine",
    subtitle: "Bring Your Own Key",
    description:
      "Enter your Gemini API key in account settings. It's stored securely in your browser session for unlimited, zero-cost practice.",
    icon: Key,
    badge: "Free & Private",
    preview: (
      <div className="mt-4 p-3 rounded-xl bg-slate-100/90 dark:bg-zinc-950/80 border border-slate-200/90 dark:border-zinc-800 text-left font-mono text-[11px] space-y-1.5">
        <div className="flex items-center justify-between text-slate-600 dark:text-zinc-400">
          <span className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 font-sans font-bold">
            <Lock className="w-3 h-3" /> Gemini API Status
          </span>
          <span className="text-[10px] bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/20">
            Connected ✓
          </span>
        </div>
        <div className="text-slate-500 dark:text-zinc-500 truncate text-[10px]">
          Key: AIzaSyD9x...••••••••
        </div>
      </div>
    ),
  },
  {
    number: "02",
    title: "Select Authentic Prompt",
    subtitle: "Task 1 & Task 2 Library",
    description:
      "Pick from our extensive prompt repository. Filter by Task 1 (Academic/General) or Task 2 essay topics including Education, Tech, and Society.",
    icon: FileSearch,
    badge: "100+ Prompts",
    preview: (
      <div className="mt-4 p-3 rounded-xl bg-slate-100/90 dark:bg-zinc-950/80 border border-slate-200/90 dark:border-zinc-800 text-left space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-slate-800 dark:text-zinc-300">Task 2 Academic Essay</span>
          <span className="text-[10px] px-2 py-0.5 bg-white/80 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 border border-slate-200 dark:border-zinc-700 rounded">
            Band 7.5 Target
          </span>
        </div>
        <p className="text-[11px] text-slate-600 dark:text-zinc-400 leading-tight line-clamp-2">
          "Should university education be funded by governments or students?"
        </p>
      </div>
    ),
  },
  {
    number: "03",
    title: "Write Under Exam Conditions",
    subtitle: "Real Test Simulation",
    description:
      "Draft your essay in our exam-accurate interface. Experience real test pressures with zero autocorrect, authentic timers, and live word tracking.",
    icon: PenTool,
    badge: "Simulative",
    preview: (
      <div className="mt-4 p-3 rounded-xl bg-slate-100/90 dark:bg-zinc-950/80 border border-slate-200/90 dark:border-zinc-800 text-left space-y-2">
        <div className="flex items-center justify-between text-[11px] font-mono">
          <span className="flex items-center gap-1 text-amber-700 dark:text-amber-400 font-bold">
            <Clock className="w-3 h-3" /> 35:00
          </span>
          <span className="text-slate-800 dark:text-zinc-300 font-bold">295 Words</span>
        </div>
        <div className="h-1.5 w-full bg-slate-200 dark:bg-zinc-800 rounded-full overflow-hidden">
          <div className="h-full bg-emerald-500 w-3/4 rounded-full" />
        </div>
      </div>
    ),
  },
  {
    number: "04",
    title: "Instant Criterion Assessment",
    subtitle: "Official IELTS Standards",
    description:
      "Get instant score breakdowns across Task Achievement, Coherence, Lexical Resource, and Grammar with actionable inline suggestions.",
    icon: Award,
    badge: "Official Criteria",
    preview: (
      <div className="mt-4 p-3 rounded-xl bg-slate-100/90 dark:bg-zinc-950/80 border border-slate-200/90 dark:border-zinc-800 text-left space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-slate-800 dark:text-zinc-300">Criteria Breakdown</span>
          <span className="text-[11px] font-black text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
            Overall 8.0
          </span>
        </div>
        <div className="flex gap-1 text-[10px] font-bold">
          <span className="bg-white/80 dark:bg-zinc-900 px-1.5 py-0.5 rounded text-emerald-700 dark:text-emerald-400 border border-slate-200 dark:border-zinc-800">TA: 8.0</span>
          <span className="bg-white/80 dark:bg-zinc-900 px-1.5 py-0.5 rounded text-emerald-700 dark:text-emerald-400 border border-slate-200 dark:border-zinc-800">CC: 8.0</span>
          <span className="bg-white/80 dark:bg-zinc-900 px-1.5 py-0.5 rounded text-teal-700 dark:text-teal-400 border border-slate-200 dark:border-zinc-800">LR: 7.5</span>
          <span className="bg-white/80 dark:bg-zinc-900 px-1.5 py-0.5 rounded text-emerald-700 dark:text-emerald-400 border border-slate-200 dark:border-zinc-800">GRA: 8.0</span>
        </div>
      </div>
    ),
  },
];

const Steps = () => {
  return (
    <section
      id="how-it-works"
      className="relative w-full py-24 px-6 lg:px-20 bg-white dark:bg-zinc-900 transition-colors duration-500 scroll-mt-24 overflow-hidden"
    >
      {/* Background glow spot */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-emerald-500/5 dark:bg-emerald-500/5 blur-[140px] rounded-full pointer-events-none" />

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
            Start Practicing in{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 dark:from-emerald-400 dark:via-teal-400 dark:to-green-400">
              4 Easy Steps
            </span>
          </h2>

          <p className="text-slate-600 dark:text-zinc-400 text-base sm:text-lg lg:text-xl leading-relaxed">
            From setup to band score analysis in less than 2 minutes. Simple, transparent, and built for rapid improvement.
          </p>
        </motion.div>

        {/* Steps Grid / Timeline Pipeline */}
        <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {stepsList.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.12, ease: "easeOut" }}
                className="group relative rounded-3xl p-6 bg-slate-50 dark:bg-zinc-950/80 border border-slate-200/80 dark:border-zinc-800/80 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden backdrop-blur-md hover:-translate-y-1"
              >
                <div>
                  {/* Number & Icon Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="relative">
                      <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 dark:bg-emerald-500/15 border border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform duration-300 shadow-xs">
                        <Icon className="w-6 h-6" />
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
                        {step.badge}
                      </span>
                      <span className="font-mono text-2xl font-black text-slate-300 dark:text-zinc-700 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                        {step.number}
                      </span>
                    </div>
                  </div>

                  <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 tracking-wider uppercase block mb-1">
                    {step.subtitle}
                  </span>

                  <h3 className="text-xl font-bold text-slate-900 dark:text-zinc-50 mb-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    {step.title}
                  </h3>

                  <p className="text-slate-600 dark:text-zinc-400 text-xs leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {/* Mini Preview Widget */}
                {step.preview}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Steps;
