"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Edit3, TrendingUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import AnimatedChart from "./AnimatedChart";

interface WritingTask {
  task: 1 | 2;
  title: string;
  prompt: string;
  fullText: string;
  targetScore: string;
  chartType?: "bar" | "line" | "pie" | "table" | "map";
}

const mockData: WritingTask[] = [
  {
    task: 2,
    title: "IELTS Writing Task 2 - Agree/Disagree",
    prompt: "Unpaid community service should be a compulsory part of high school. To what extent do you agree or disagree?",
    fullText: "The proposal to make community service a mandatory requirement for high school students is a highly debated topic. I firmly believe that this initiative offers profound benefits. Firstly, it cultivates a sense of civic duty and empathy by exposing students to various social challenges.",
    targetScore: "7.5",
  },
  {
    task: 1,
    title: "IELTS Writing Task 1 - Bar Chart",
    prompt: "The bar chart illustrates the participation of men and women in various sports in the UK.",
    fullText: "The bar chart compares the levels of sports participation between genders in the United Kingdom. Overall, swimming emerges as the most popular activity for both men and women. Notably, women show a significantly higher preference for gymnastics and dance.",
    targetScore: "8.0",
    chartType: "bar",
  },
  {
    task: 1,
    title: "IELTS Writing Task 1 - Table",
    prompt: "The table shows the percentage of mobile phone owners who used various features from 2006 to 2010.",
    fullText: "The table details the shifting trends in mobile phone usage over a five-year period. A notable observation is the exponential growth in internet access, starting at just 12% in 2006 and reaching 75% by 2010.",
    targetScore: "7.0",
    chartType: "table",
  },
  {
    task: 2,
    title: "IELTS Writing Task 2 - Discuss Both Views",
    prompt: "Some people think that it is best to work for the same organization for one's whole life. Others think that better to change jobs frequently.",
    fullText: "The choice between lifelong employment at a single firm and frequent career changes is a pivotal one in the modern job market. Opponents of job-hopping argue that loyalty leads to greater security and specialized expertise.",
    targetScore: "8.5",
  },
  {
    task: 1,
    title: "IELTS Writing Task 1 - Map",
    prompt: "The maps below show a village called Ryemead in 1995 and its subsequent development in 2015.",
    fullText: "The maps illustrate the transformation of Ryemead village over two decades. The most significant change is the conversion of farmland into residential areas. Additionally, several new amenities were introduced.",
    targetScore: "8.0",
    chartType: "map",
  },
  {
    task: 1,
    title: "IELTS Writing Task 1 - Line Graph",
    prompt: "The line graph shows changes in the price of fresh fruit and vegetables in the US.",
    fullText: "The line graph tracks the price fluctuations of produce in the United States over a twenty-year period. A striking trend is the continuous rise in fruit and vegetable prices compared to the general consumer price index.",
    targetScore: "7.5",
    chartType: "line",
  },
  {
    task: 1,
    title: "IELTS Writing Task 1 - Pie Chart",
    prompt: "The pie charts show the secondary school attendance by type in 2000 and 2010.",
    fullText: "The pie charts depict the distribution of students across different types of secondary education over a decade. In 2000, community schools accounted for nearly half of all attendance.",
    targetScore: "7.5",
    chartType: "pie",
  },
];

const IELTSWritingInterface = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  const currentData = mockData[currentIndex];

  useEffect(() => {
    let charIndex = 0;
    let typingInterval: NodeJS.Timeout;

    const startTyping = () => {
      setDisplayText("");
      setIsTyping(true);
      
      typingInterval = setInterval(() => {
        if (charIndex < currentData.fullText.length) {
          setDisplayText(currentData.fullText.substring(0, charIndex + 1));
          charIndex++;
          
          // If Task 1, check if we've reached a character limit that might truncate
          // Adding early exit for Task 1 to keep things snappy and ensure visibility
          if (currentData.task === 1 && charIndex > 220) {
            clearInterval(typingInterval);
            setIsTyping(false);
            setTimeout(() => setCurrentIndex((prev) => (prev + 1) % mockData.length), 2000);
          }
        } else {
          clearInterval(typingInterval);
          setIsTyping(false);
          
          setTimeout(() => {
            setCurrentIndex((prev) => (prev + 1) % mockData.length);
          }, 2500);
        }
      }, 20);
    };

    startTyping();

    return () => clearInterval(typingInterval);
  }, [currentIndex, currentData]);

  const wordCount = displayText.split(/\s+/).filter(Boolean).length;

  return (
    <div className="relative w-full max-w-2xl mx-auto font-sans mb-12">
      <Card className="shadow-2xl border-none bg-white dark:bg-zinc-900 overflow-hidden h-[540px] flex flex-col transition-colors duration-500">
        <CardContent className="p-5 lg:p-7 space-y-4 flex-1 flex flex-col h-full overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between border-b pb-4 dark:border-zinc-800 shrink-0">
            <AnimatePresence mode="wait">
              <motion.h3 
                key={currentIndex}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="text-base lg:text-xl font-black text-zinc-900 dark:text-zinc-50 truncate pr-6 tracking-tight"
              >
                {currentData.title}
              </motion.h3>
            </AnimatePresence>
            <div className="flex items-center space-x-3 shrink-0">
              <Badge className="bg-primary/10 text-primary hover:bg-primary/10 dark:bg-primary/10 dark:text-primary border-none px-2 py-0.5 text-[10px] lg:text-xs font-black uppercase tracking-wider">
                ACTIVE
              </Badge>
              <div className="flex items-center text-zinc-600 dark:text-zinc-300 text-xs lg:text-sm font-bold">
                <Clock className="w-4 h-4 lg:w-5 lg:h-5 mr-2" />
                <span>{currentData.task === 1 ? "20:00" : "40:00"}</span>
              </div>
            </div>
          </div>

          {/* Prompt Box */}
          <div className="bg-slate-50 dark:bg-zinc-800/50 rounded-xl p-4 border dark:border-zinc-800 h-[85px] shrink-0 overflow-hidden shadow-sm">
            <AnimatePresence mode="wait">
              <motion.p 
                key={currentIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-zinc-700 dark:text-zinc-200 leading-relaxed text-xs lg:text-sm italic font-medium overflow-hidden"
              >
                {currentData.prompt}
              </motion.p>
            </AnimatePresence>
          </div>

          {/* Visual Data Area */}
          <AnimatePresence mode="wait">
            {currentData.task === 1 && currentData.chartType && (
              <motion.div 
                key={`chart-${currentIndex}`}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 100 }}
                exit={{ opacity: 0, height: 0 }}
                className="shrink-0 py-3 bg-zinc-50/50 dark:bg-zinc-800/20 rounded-xl border border-dashed dark:border-zinc-800 flex items-center justify-center overflow-hidden"
              >
                 <AnimatedChart type={currentData.chartType} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Typing Area */}
          <div className="relative flex-1 border rounded-xl dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 lg:p-5 overflow-hidden shadow-inner">
            <div className="text-zinc-800 dark:text-zinc-100 text-sm lg:text-base leading-relaxed h-full overflow-hidden whitespace-pre-wrap font-medium">
              {displayText}
              {isTyping && (
                <motion.span
                  animate={{ opacity: [1, 0] }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                  className="inline-block w-2 h-5 bg-primary ml-1.5 align-middle"
                />
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-3 shrink-0">
            <div className="text-zinc-600 dark:text-zinc-300 text-xs lg:text-sm font-black border-t w-full pt-4 dark:border-zinc-800 flex justify-between uppercase tracking-tighter">
              <span>Word count: <span className="text-primary dark:text-primary">{wordCount} / {currentData.task === 1 ? '150' : '250'}</span></span>
              <span className="opacity-60 text-[10px] tracking-widest font-black uppercase text-primary dark:text-primary">AI Feedback Loop</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Synchronized Score Card */}
      <motion.div 
        key={`score-${currentIndex}`}
        initial={{ scale: 0.95, opacity: 0, x: 20 }}
        animate={{ scale: 1, opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="absolute -bottom-6 -right-4 lg:-right-8 transform translate-y-1/4 z-20"
      >
        <Card className="shadow-2xl bg-white dark:bg-zinc-950 border-none p-4 lg:p-5 min-w-[170px] lg:min-w-[190px] ring-1 ring-zinc-200 dark:ring-zinc-800">
          <div className="flex items-center space-x-4">
            <div className="bg-primary dark:bg-primary p-3 rounded-2xl text-white shadow-lg shadow-primary/20">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] font-black text-zinc-500 dark:text-zinc-400 uppercase tracking-widest">
                Target Score
              </p>
              <motion.p 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
                className="text-2xl lg:text-4xl font-black text-slate-900 dark:text-zinc-50 tracking-tighter"
              >
                {currentData.targetScore}
              </motion.p>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default IELTSWritingInterface;
