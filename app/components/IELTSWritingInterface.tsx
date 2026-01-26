"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Edit3, TrendingUp } from "lucide-react";

const IELTSWritingInterface = () => {
  return (
    <div className="relative w-full max-w-2xl mx-auto font-sans">
      <Card className="shadow-lg border-none bg-white dark:bg-zinc-900 overflow-hidden">
        <CardContent className="p-4 lg:p-6 space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between border-b pb-3 dark:border-zinc-800">
            <h3 className="text-base lg:text-lg font-semibold text-zinc-700 dark:text-zinc-200">
              IELTS Writing Task 2
            </h3>
            <div className="flex items-center space-x-3 lg:space-x-4">
              <Badge className="bg-emerald-100 text-emerald-600 hover:bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400 border-none px-2 py-0.5 text-[10px] lg:text-xs font-medium">
                Active
              </Badge>
              <div className="flex items-center text-zinc-500 dark:text-zinc-400 text-xs lg:text-sm font-medium">
                <Clock className="w-3.5 h-3.5 lg:w-4 lg:h-4 mr-1" />
                <span>40:00</span>
              </div>
            </div>
          </div>

          {/* Prompt Box */}
          <div className="bg-slate-50 dark:bg-zinc-800/50 rounded-xl p-4 lg:p-5 border dark:border-zinc-800">
            <p className="text-zinc-600 dark:text-zinc-300 leading-relaxed text-sm lg:text-base">
              Some people believe that unpaid community service should be a compulsory part of high school programs. To what extent do you agree or disagree?
            </p>
          </div>

          {/* Typing Area */}
          <div className="relative h-40 lg:h-52 border rounded-xl dark:border-zinc-800 bg-white dark:bg-zinc-900 flex flex-col items-center justify-center">
            <div className="absolute top-3 left-4 text-zinc-300 dark:text-zinc-600 text-xs lg:text-sm">
              Start typing your essay here...
            </div>
            
            <div className="flex flex-col items-center text-zinc-300 dark:text-zinc-600">
              <Edit3 className="w-10 h-10 lg:w-12 lg:h-12 mb-2 opacity-50" />
              <p className="text-xs lg:text-sm font-medium">Real exam experience</p>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-1">
            <div className="text-zinc-500 dark:text-zinc-400 text-xs lg:text-sm font-medium border-t w-full pt-3 dark:border-zinc-800">
              Word count: 0 / 250
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Floating Score Card */}
      <div className="absolute -bottom-4 -right-4 lg:-bottom-6 lg:-right-6 transform translate-y-1/4">
        <Card className="shadow-xl bg-white dark:bg-zinc-950 border dark:border-zinc-800 p-3 lg:p-4 min-w-[150px] lg:min-w-[180px]">
          <div className="flex items-center space-x-2 lg:space-x-3">
            <div className="bg-blue-100 dark:bg-blue-900/40 p-2 lg:p-3 rounded-xl text-blue-600 dark:text-blue-400">
              <TrendingUp className="w-5 h-5 lg:w-6 lg:h-6" />
            </div>
            <div>
              <p className="text-[10px] font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
                Your Score
              </p>
              <p className="text-xl lg:text-2xl font-black text-zinc-800 dark:text-zinc-100">
                7.5
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};


export default IELTSWritingInterface;
