"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Button } from "@/components/ui/button";

const page = () => {
  const [wordCount, setWordCount] = useState(0);

  const changeHandler = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    const words = text.trim().split(/\s+/).filter(Boolean);
    setWordCount(words.length);
  }

  return (
    <div>
      <Navbar />
      <div className="w-full min-h-screen flex items-center justify-center">
        <div className="relative w-9/10 mx-auto font-sans mb-12">
          <Card className="shadow-2xl border-none bg-white dark:bg-zinc-900 overflow-hidden md:h-175 flex flex-col transition-colors duration-500">
            <CardContent className="p-5 lg:p-7 space-y-4 flex-1 flex flex-col h-full overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between border-b pb-4 dark:border-zinc-800 shrink-0">
                <AnimatePresence mode="wait">
                  <motion.h3
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className="text-base lg:text-xl font-black text-zinc-900 dark:text-zinc-50 truncate pr-6 tracking-tight"
                  >
                    This is the title
                  </motion.h3>
                </AnimatePresence>
                <div className="flex items-center space-x-3 shrink-0">
                  <Badge className="bg-blue-100 text-blue-600 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400 border-none px-2 py-0.5 text-[10px] lg:text-xs font-black uppercase tracking-wider">
                    ACTIVE
                  </Badge>
                  <div className="flex items-center text-zinc-600 dark:text-zinc-300 text-xs lg:text-sm font-bold">
                    <Clock className="w-4 h-4 lg:w-5 lg:h-5 mr-2" />
                    <span>minute</span>
                  </div>
                </div>
              </div>

              <div className="h-9/10 flex md:flex-row flex-col items-center justify-center gap-2">
                {/* Prompt Box */}
                <div className="h-full md:w-1/2 w-full bg-slate-50 dark:bg-zinc-800/50 rounded-xl p-4 border dark:border-zinc-800 shrink-0 overflow-hidden shadow-sm">
                  <AnimatePresence mode="wait">
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-zinc-700 dark:text-zinc-200 leading-relaxed text-xs lg:text-sm italic font-medium overflow-hidden"
                    >
                      This is the question
                    </motion.p>
                  </AnimatePresence>
                </div>

                {/* Typing Area */}
                <div className="md:h-full h-100 md:w-1/2 w-full relative flex-1 border rounded-xl dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 lg:p-5 overflow-hidden shadow-inner">
                  <textarea placeholder="type your answer here..." onChange={changeHandler} spellCheck="false" className="w-full focus:outline-none text-zinc-800 dark:text-zinc-100 text-sm lg:text-base leading-relaxed h-full overflow-hidden whitespace-pre-wrap font-medium"></textarea>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-3 shrink-0">
                <div className="text-zinc-600 dark:text-zinc-300 text-xs lg:text-sm font-black border-t w-full pt-4 dark:border-zinc-800 flex justify-between uppercase tracking-tighter">
                  <span>
                    Word count:{" "}
                    <span className="text-blue-600 dark:text-blue-400">{wordCount}</span>
                  </span>
                  <Button variant="blue" className="rounded-full px-4 h-8 font-bold text-xs shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all hover:scale-105">
                    Submit
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default page;
