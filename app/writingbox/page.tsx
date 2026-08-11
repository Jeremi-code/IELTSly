"use client";

import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Sparkles, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  getQuestions,
  createEssay,
  evaluateEssay,
  getStoredAIKey,
  getStoredAIProvider,
  type Question,
  type Evaluation,
} from "@/lib/api";

const WritingBox = () => {
  const [question, setQuestion] = useState<Question | null>(null);
  const [questionLoading, setQuestionLoading] = useState(true);
  const [essayText, setEssayText] = useState("");
  const [wordCount, setWordCount] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<Evaluation | null>(null);
  const startedAt = useRef(Date.now());

  useEffect(() => {
    getQuestions({ limit: 30 })
      .then((res) => {
        const pool = res.questions;
        const task2 = pool.filter((q) => q.taskType === "task2");
        const picked = (task2.length ? task2 : pool)[Math.floor(Math.random() * (task2.length || pool.length))];
        setQuestion(picked ?? null);
      })
      .catch(() => setQuestion(null))
      .finally(() => setQuestionLoading(false));
  }, []);

  const changeHandler = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setEssayText(text);
    setWordCount(text.trim().split(/\s+/).filter(Boolean).length);
  };

  const handleSubmit = async () => {
    setError(null);
    setResult(null);

    if (!question) {
      setError("No question loaded yet. Refresh to pick another one.");
      return;
    }
    if (wordCount < 10) {
      setError("Write at least 10 words before submitting.");
      return;
    }
    if (!getStoredAIKey()) {
      setError("Add your AI API key in Settings first (Gemini or OpenAI).");
      return;
    }

    setSubmitting(true);
    try {
      const essay = await createEssay({
        type: question.taskType,
        mode: "practice",
        questionId: question._id,
        question: { text: question.text, category: question.category },
        response: essayText,
        durationSec: Math.round((Date.now() - startedAt.current) / 1000),
      });
      const evaluated = await evaluateEssay(essay._id);
      setResult(evaluated.evaluation ?? null);
      if (!evaluated.evaluation) {
        setError("Evaluation did not return a result. Please try again.");
      }
    } catch {
      setError("Evaluation failed. Check your API key and try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const providerLabel = getStoredAIProvider() === "gemini" ? "Gemini" : "OpenAI";

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
                    {question ? `Writing Task ${question.taskType === "task1" ? "1" : "2"} — ${question.category ?? "General"}` : questionLoading ? "Loading question..." : "No question available"}
                  </motion.h3>
                </AnimatePresence>
                <div className="flex items-center space-x-3 shrink-0">
                  <Badge className="bg-primary/10 text-primary hover:bg-primary/10 dark:bg-primary/10 dark:text-primary border-none px-2 py-0.5 text-[10px] lg:text-xs font-black uppercase tracking-wider">
                    {getStoredAIKey() ? `${providerLabel.toUpperCase()} READY` : "NO AI KEY"}
                  </Badge>
                  <div className="flex items-center text-zinc-600 dark:text-zinc-300 text-xs lg:text-sm font-bold">
                    <Clock className="w-4 h-4 lg:w-5 lg:h-5 mr-2" />
                    <span>{Math.max(0, Math.floor((Date.now() - startedAt.current) / 60000))} min</span>
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
                      {question ? question.text : questionLoading ? "Fetching a question from the bank..." : "No questions in the bank yet. Run the scraper or add one."}
                    </motion.p>
                  </AnimatePresence>
                </div>

                {/* Typing Area */}
                <div className="md:h-full h-100 md:w-1/2 w-full relative flex-1 border rounded-xl dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 lg:p-5 overflow-hidden shadow-inner">
                  <textarea
                    placeholder="type your answer here..."
                    onChange={changeHandler}
                    spellCheck="false"
                    className="w-full focus:outline-none text-zinc-800 dark:text-zinc-100 text-sm lg:text-base leading-relaxed h-full overflow-hidden whitespace-pre-wrap font-medium"
                  ></textarea>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-3 shrink-0">
                <div className="text-zinc-600 dark:text-zinc-300 text-xs lg:text-sm font-black border-t w-full pt-4 dark:border-zinc-800 flex justify-between uppercase tracking-tighter">
                  <span>
                    Word count:{" "}
                    <span className="text-primary dark:text-primary">{wordCount}</span>
                  </span>
                  <Button
                    variant="blue"
                    onClick={handleSubmit}
                    disabled={submitting}
                    className="rounded-full px-4 h-8 font-bold text-xs shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all hover:scale-105 cursor-pointer"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="h-3 w-3 mr-1 animate-spin" /> Evaluating...
                      </>
                    ) : (
                      "Submit"
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Result Panel */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-4 p-4 rounded-2xl bg-red-500/5 border border-red-500/20 text-red-500 text-sm font-semibold"
              >
                {error}
                {!getStoredAIKey() && (
                  <Link href="/dashboard/settings" className="underline font-bold ml-2">
                    Go to Settings
                  </Link>
                )}
              </motion.div>
            )}
            {result && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-6 rounded-2xl bg-white/80 dark:bg-zinc-900/80 border border-primary/20 backdrop-blur-xl shadow-lg"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="h-16 w-16 rounded-full bg-gradient-to-tr from-primary to-emerald-400 p-[3px] flex items-center justify-center shadow-md shrink-0">
                    <div className="h-full w-full rounded-full bg-white dark:bg-zinc-950 flex flex-col items-center justify-center">
                      <span className="text-xl font-black leading-none">{result.overallBand.toFixed(1)}</span>
                      <span className="text-[8px] text-muted-foreground font-black uppercase tracking-widest mt-0.5">Band</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-black text-lg flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-primary" />
                      AI Evaluation Complete
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      TA {result.criteria.ta.toFixed(1)} · CC {result.criteria.cc.toFixed(1)} · LR {result.criteria.lr.toFixed(1)} · GRA {result.criteria.gra.toFixed(1)}
                    </p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed italic">{`\u201C${result.feedback}\u201D`}</p>
                {result.tips.length > 0 && (
                  <div className="mt-3 space-y-1">
                    {result.tips.map((tip, i) => (
                      <p key={i} className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                        • {tip}
                      </p>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default WritingBox;