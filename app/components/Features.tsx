import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Monitor, Cpu, Map, LineChart, Database, Clock } from "lucide-react";

const featureLists = [
  {
    title: "Real Exam Environment",
    description:
      "Practice in a distraction-free environment that mirrors the actual IELTS exam. No autocorrect, no spell-check—just like the real test",
    icon: Monitor,
    color: "text-blue-500",
    bgColor: "bg-blue-50 dark:bg-blue-900/20",
  },
  {
    title: "AI-Powered Feedback",
    description:
      "Receive instant, detailed feedback on your essays powered by advanced AI technology trained on official IELTS standards.",
    icon: Cpu,
    color: "text-purple-500",
    bgColor: "bg-purple-50 dark:bg-purple-900/20",
  },
  {
    title: "Personalized Study Plans",
    description:
      "Get customized study plans based on your performance to help you focus on areas that need improvement.",
    icon: Map,
    color: "text-emerald-500",
    bgColor: "bg-emerald-50 dark:bg-emerald-900/20",
  },
  {
    title: "Progress Tracking",
    description:
      "Monitor your improvement over time with comprehensive progress tracking and analytics.",
    icon: LineChart,
    color: "text-orange-500",
    bgColor: "bg-orange-50 dark:bg-orange-900/20",
  },
  {
    title: "Extensive Question Bank",
    description:
      "Access a vast library of practice questions covering all IELTS writing task types and topics.",
    icon: Database,
    color: "text-cyan-500",
    bgColor: "bg-cyan-50 dark:bg-cyan-900/20",
  },
  {
    title: "24/7 Accessibility",
    description:
      "Practice anytime, anywhere with our online platform that’s available around the clock.",
    icon: Clock,
    color: "text-rose-500",
    bgColor: "bg-rose-50 dark:bg-rose-900/20",
  },
];

const Features = () => {
  return (
    <div className="w-full min-h-screen py-10 px-6 lg:px-20 bg-slate-50 dark:bg-zinc-950 flex flex-col items-center justify-center gap-12 lg:gap-16 transition-colors duration-500">

      <div className="flex flex-col items-center justify-center text-center max-w-3xl mx-auto space-y-4">
        <div className="px-4 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-bold rounded-full text-sm uppercase tracking-wider">
          Features
        </div>
        <h2 className="text-3xl lg:text-5xl font-extrabold text-slate-900 dark:text-zinc-50 tracking-tight">
          Everything You Need to Ace IELTS Writing
        </h2>
        <p className="text-slate-500 dark:text-zinc-400 text-lg lg:text-xl leading-relaxed">
          Authentic exam simulation meets powerful AI feedback to help you
          achieve your target band score
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-7xl mx-auto">
        {featureLists.map((feature, index) => (
          <Card 
            key={index} 
            className="group border-none shadow-md hover:shadow-xl transition-all duration-300 bg-white dark:bg-zinc-900/50 backdrop-blur-sm overflow-hidden"
          >
            <CardHeader className="pt-8 px-8 pb-4">
              <div className={`w-14 h-14 rounded-2xl ${feature.bgColor} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className={`w-7 h-7 ${feature.color}`} />
              </div>
              <CardTitle className="text-xl font-bold text-slate-900 dark:text-zinc-50 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {feature.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="px-8 pb-8 text-slate-500 dark:text-zinc-400 leading-relaxed">
              {feature.description}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Features;
