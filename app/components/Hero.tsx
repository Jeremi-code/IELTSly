"use client";

import { Button } from "@/components/ui/button";
import IELTSWritingInterface from "./IELTSWritingInterface";
import InteractiveGridBackground from "./InteractiveGridBackground";
import { useRouter } from "next/navigation";

const Hero = () => {
  const router = useRouter();
  return (
    <div className="relative flex flex-col lg:flex-row items-center justify-center bg-linear-to-br from-[#E9F5EF] via-[#FFFFFF] to-[#E9F5EF] dark:from-zinc-900 dark:via-zinc-950 dark:to-zinc-900 min-h-screen overflow-hidden px-10 lg:px-20">
      {/* Interactive Grid Background */}
      <InteractiveGridBackground />
      <div className="relative z-10 w-full flex flex-col items-center lg:items-start justify-center mb-12 lg:mb-0 text-center lg:text-left pt-20 lg:pt-0">
        <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-sm font-medium text-primary dark:border-primary/30 dark:bg-primary/10 dark:text-primary mb-6 backdrop-blur-sm">
          <span className="flex h-2 w-2 rounded-full bg-primary mr-2 animate-pulse"></span>
          AI-Powered IELTS Coach
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight leading-[1.15] mb-6">
          Master IELTS Writing with{" "}
          <span className="text-transparent bg-clip-text bg-linear-to-r from-emerald-600 to-green-600 dark:from-emerald-400 dark:to-green-500">
            Real Simulation
          </span>
        </h1>

        <p className="text-zinc-600 dark:text-zinc-400 text-lg sm:text-xl mb-8 max-w-lg leading-relaxed">
          Experience an authentic exam environment without distractions. Get
          instant, detailed AI feedback to improve your band score.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <Button
            variant="blue"
            size="lg"
            className="w-full sm:w-auto rounded-full px-8 h-12 font-bold text-base shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all hover:scale-105"
            onClick={() => router.push("/signin?mode=signup")}
          >
            Start Practice
          </Button>

          <Button
            variant="outline"
            size="lg"
            className="w-full sm:w-auto rounded-full px-8 h-12 font-semibold text-base border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 transition-all hover:scale-105 backdrop-blur-sm bg-white/50 dark:bg-zinc-900/50"
            onClick={() => router.push("/signin")}
          >
            Continue
          </Button>
        </div>
      </div>
      <div className="relative z-10 w-full lg:w-7/12 flex justify-center lg:justify-end items-center px-4 scale-90 lg:scale-100">
        <IELTSWritingInterface />
      </div>
    </div>
  );
};

export default Hero;
