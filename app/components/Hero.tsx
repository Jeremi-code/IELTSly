import { Button } from "@/components/ui/button";
import IELTSWritingInterface from "./IELTSWritingInterface";
import InteractiveGridBackground from "./InteractiveGridBackground";

const Hero = () => {
  return (
    <div className="relative flex flex-col lg:flex-row items-center justify-center bg-linear-to-br from-[#E4EEFF] via-[#FFFFFF] to-[#E4EEFF] dark:from-zinc-900 dark:via-zinc-950 dark:to-zinc-900 min-h-screen overflow-hidden px-10 lg:px-20">
      {/* Interactive Grid Background */}
      <InteractiveGridBackground />
      <div className="relative z-10 w-full lg:w-5/12 flex flex-col items-center lg:items-start justify-center mb-12 lg:mb-0 text-center lg:text-left pt-20 lg:pt-0">
        <div className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-sm font-medium text-blue-800 dark:border-blue-800 dark:bg-blue-950/30 dark:text-blue-300 mb-6 backdrop-blur-sm">
          <span className="flex h-2 w-2 rounded-full bg-blue-600 mr-2 animate-pulse"></span>
          AI-Powered IELTS Coach
        </div>
        
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight leading-[1.15] mb-6">
          Master IELTS Writing with <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">Real Simulation</span>
        </h1>
        
        <p className="text-zinc-600 dark:text-zinc-400 text-lg sm:text-xl mb-8 max-w-lg leading-relaxed">
          Experience an authentic exam environment without distractions. Get instant, detailed AI feedback to improve your band score.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <Button 
            variant="blue" 
            size="lg" 
            className="w-full sm:w-auto rounded-full px-8 h-12 font-bold text-base shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all hover:scale-105"
          >
            Start Practice
          </Button>
          
          <Button 
            variant="outline" 
            size="lg" 
            className="w-full sm:w-auto rounded-full px-8 h-12 font-semibold text-base border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 transition-all hover:scale-105 backdrop-blur-sm bg-white/50 dark:bg-zinc-900/50"
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
