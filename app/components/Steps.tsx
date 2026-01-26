import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Key, FileSearch, PenTool } from "lucide-react";

const stepLists = [
  {
    title: "Add Your API Key",
    description:
      "Simply enter your Gemini API key in your account settings. It's secure, private, and gives you unlimited access.",
    icon: Key,
    color: "text-blue-500",
    bgColor: "bg-blue-100 dark:bg-blue-900/30",
  },
  {
    title: "Choose a Question",
    description:
      "Select from our extensive bank of authentic IELTS questions. Filter by task type, topic, or difficulty level. ",
    icon: FileSearch,
    color: "text-indigo-500",
    bgColor: "bg-indigo-100 dark:bg-indigo-900/30",
  },
  {
    title: "Write & Get Feedback",
    description:
      "Write your essay in our distraction-free editor and receive instant, detailed AI feedback with band scores.",
    icon: PenTool,
    color: "text-violet-500",
    bgColor: "bg-violet-100 dark:bg-violet-900/30",
  },
];

const Steps = () => {
  return (
    <div className="py-24 px-6 lg:px-20 bg-white dark:bg-zinc-900 transition-colors duration-500">
      <div className="flex flex-col items-center justify-center text-center max-w-4xl mx-auto space-y-4 mb-16">
        <div className="px-4 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 font-bold rounded-full text-sm uppercase tracking-wider">
          How It Works
        </div>
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-zinc-50 tracking-tight leading-[1.1]">
          Start Practicing in 3 Simple Steps
        </h2>
        <p className="text-slate-500 dark:text-zinc-400 text-lg lg:text-xl leading-relaxed max-w-2xl">
          Get started with IELTSly in minutes and begin your journey to a higher
          band score
        </p>
      </div>


      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 w-full max-w-7xl mx-auto items-start">
        {stepLists.map((step, index) => (
          <div key={index} className="relative group">
            <Card className="relative z-10 border-none shadow-none bg-transparent text-center flex flex-col items-center">

              <div className="pb-4 px-0 flex flex-col items-center">
                <div className="relative mb-6">
                  <div className={`w-20 h-20 rounded-3xl ${step.bgColor} flex items-center justify-center group-hover:rotate-6 transition-transform duration-300 ring-4 ring-white dark:ring-zinc-900`}>
                    <step.icon className={`w-10 h-10 ${step.color}`} />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-slate-900 dark:bg-zinc-50 text-white dark:text-zinc-900 flex items-center justify-center font-bold text-sm border-4 border-white dark:border-zinc-900">
                    {index + 1}
                  </div>
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-zinc-50 leading-tight text-balance px-2">
                  {step.title}
                </h3>
              </div>
              <div className="px-0 pt-2 text-slate-500 dark:text-zinc-400 leading-relaxed text-lg">
                {step.description}
              </div>
            </Card>

          </div>
        ))}
      </div>
    </div>
  );
};

export default Steps;
