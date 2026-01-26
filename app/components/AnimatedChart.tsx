"use client";

import React from "react";
import { motion } from "framer-motion";

interface ChartProps {
  type: "bar" | "line" | "pie" | "table" | "map";
}

const AnimatedChart: React.FC<ChartProps> = ({ type }) => {
  if (type === "bar") {
    return (
      <div className="flex items-end justify-between h-24 w-full gap-1.5 px-2">

        {[40, 70, 55, 90, 65, 80].map((height, i) => (
          <motion.div
            key={i}
            initial={{ height: 0 }}
            animate={{ height: `${height}%` }}
            transition={{ duration: 1, delay: i * 0.1, ease: "easeOut" }}
            className="flex-1 bg-blue-500/80 dark:bg-blue-400/80 rounded-t-sm min-w-[12px]"
          />
        ))}
      </div>
    );
  }


  if (type === "line") {
    return (
      <div className="relative h-24 w-full px-2 overflow-hidden flex items-center justify-center">
        <svg viewBox="0 0 240 100" className="w-full h-full" preserveAspectRatio="none">

          <motion.path
            d="M0,80 L50,60 L100,70 L150,30 L200,50 L240,10"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            className="text-blue-500 dark:text-blue-400"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, ease: "easeInOut" }}
          />
          {[0, 50, 100, 150, 200, 240].map((x, i) => (
            <motion.circle
              key={i}
              cx={x}
              cy={[80, 60, 70, 30, 50, 10][i]}
              r="4"
              className="fill-white stroke-blue-500 dark:stroke-blue-400 stroke-2"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1 + i * 0.2 }}
            />
          ))}
        </svg>
      </div>
    );
  }

  if (type === "pie") {
    return (
      <div className="relative h-24 w-full flex items-center justify-center">
        <svg viewBox="0 0 100 100" className="w-24 h-24 transform -rotate-90">

          <motion.circle
            cx="50"
            cy="50"
            r="40"
            stroke="currentColor"
            strokeWidth="20"
            fill="transparent"
            className="text-blue-100 dark:text-blue-900/30"
          />
          <motion.circle
            cx="50"
            cy="50"
            r="40"
            stroke="currentColor"
            strokeWidth="20"
            fill="transparent"
            strokeDasharray="251.2"
            className="text-blue-500 dark:text-blue-400"
            initial={{ strokeDashoffset: 251.2 }}
            animate={{ strokeDashoffset: 251.2 * 0.4 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          />
          <motion.circle
            cx="50"
            cy="50"
            r="40"
            stroke="currentColor"
            strokeWidth="20"
            fill="transparent"
            strokeDasharray="251.2"
            className="text-indigo-500 dark:text-indigo-400"
            initial={{ strokeDashoffset: 251.2 }}
            animate={{ strokeDashoffset: 251.2 * 0.7 }}
            style={{ rotate: "108deg", transformOrigin: "50% 50%" }}
            transition={{ duration: 1.5, ease: "easeInOut", delay: 0.2 }}
          />
        </svg>
      </div>
    );
  }

  if (type === "table") {
    return (
      <div className="h-24 w-full flex flex-col items-center justify-center px-2">

        <div className="w-full border rounded-lg overflow-hidden border-slate-200 dark:border-zinc-800">
          {[...Array(4)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`grid grid-cols-3 p-2.5 border-b last:border-0 ${
                i === 0 ? "bg-slate-50 dark:bg-zinc-800/50 font-extrabold text-xs" : "bg-white dark:bg-zinc-900 text-[11px]"
              } dark:border-zinc-800 text-center uppercase tracking-tight`}
            >
              <span>{i === 0 ? "Yearly Period" : 1990 + i * 5}</span>
              <span>{i === 0 ? "User Base" : `${i * 12}%`}</span>
              <span>{i === 0 ? "Annual Growth" : `+${i * 2}%`}</span>
            </motion.div>
          ))}
        </div>
      </div>
    );
  }


  return (
    <div className="relative h-24 w-full flex items-center justify-center p-2">
      <div className="relative w-full h-full bg-slate-100 dark:bg-zinc-800/50 rounded-xl overflow-hidden border dark:border-zinc-800 grid grid-cols-2 gap-px bg-slate-200 dark:bg-zinc-700">

        <div className="relative bg-teal-50 dark:bg-zinc-900 flex items-center justify-center overflow-hidden p-2">
          <div className="absolute inset-0 opacity-10 flex items-center justify-center">
             <div className="w-20 h-20 border-2 border-teal-500 rounded-full" />
             <div className="w-10 h-10 border-2 border-teal-500 absolute rotate-45" />
          </div>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-[8px] font-bold text-teal-600 dark:text-teal-400 bg-teal-100 dark:bg-teal-900/50 px-2 py-1 rounded border border-teal-200 dark:border-teal-800 z-10"
          >
            Village 1995 (Farmland)
          </motion.div>
        </div>
        <div className="relative bg-sky-50 dark:bg-zinc-900 flex items-center justify-center overflow-hidden p-2">
          <div className="absolute inset-0 opacity-10 flex flex-col items-center justify-center gap-1">
             <div className="w-24 h-4 bg-sky-500 rounded" />
             <div className="w-24 h-4 bg-sky-500 rounded" />
             <div className="w-24 h-4 bg-sky-500 rounded" />
          </div>
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="text-[8px] font-bold text-sky-600 dark:text-sky-400 bg-sky-100 dark:bg-sky-900/50 px-2 py-1 rounded border border-sky-200 dark:border-sky-800 z-10"
          >
            Village 2015 (Residential)
          </motion.div>
        </div>
      </div>
    </div>
  );
};



export default AnimatedChart;
