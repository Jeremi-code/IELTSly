"use client";

import React from "react";
import {
  Award,
  BookOpen,
  CircleAlert,
  TrendingUp,
  Clock,
  ChevronRight,
  Target,
  Zap,
  Sparkles,
} from "lucide-react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import DashboardShell from "../components/DashboardShell";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useSession } from "@/lib/auth-client";

const dashboardStat = [
  {
    title: "Total Essays",
    value: "14",
    change: "+3 this week",
    icon: BookOpen,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
  {
    title: "Average Band",
    value: "7.0",
    change: "+0.5 from last week",
    icon: TrendingUp,
    color: "text-green-500",
    bg: "bg-green-500/10",
  },
  {
    title: "Task 1 Avg",
    value: "6.5",
    change: "Target: 7.0",
    icon: Target,
    color: "text-purple-500",
    bg: "bg-purple-500/10",
  },
  {
    title: "Task 2 Avg",
    value: "7.5",
    change: "Target: 8.0",
    icon: Award,
    color: "text-orange-500",
    bg: "bg-orange-500/10",
  },
];

const recentEssays = [
  {
    id: 1,
    title: "The impact of social media on youth",
    type: "Task 2",
    date: "2 hours ago",
    score: "7.5",
    status: "evaluated",
  },
  {
    id: 2,
    title: "Climate change and global policy",
    type: "Task 2",
    date: "Yesturday",
    score: "6.5",
    status: "feedback-given",
  },
  {
    id: 3,
    title: "Line graph: Population trends in Asia",
    type: "Task 1",
    date: "2 days ago",
    score: "7.0",
    status: "evaluated",
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1 },
};

const DashboardPage = () => {
  const { data: session } = useSession();
  const user = session?.user;
  const displayName = user?.name || user?.email?.split("@")[0] || "Student";

  return (
    <DashboardShell className="max-w-[1400px] p-6 lg:p-10 space-y-10">
          {/* Header Section */}
          <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="space-y-1"
            >
              <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
                Ready to <span className="text-primary italic">Conquer</span>{" "}
                IELTS?
              </h1>
              <p className="text-muted-foreground text-lg">
                Welcome back, {displayName}. Your writing is improving faster than 85%
                of peers.
              </p>
            </motion.div>

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex items-center gap-3"
            >
              <Link href="/dashboard/practice">
                <Button
                  variant="blue"
                  size="lg"
                  className="rounded-full px-8 shadow-lg shadow-primary/20 hover:scale-105 transition-transform cursor-pointer"
                >
                  <Zap className="mr-2 h-4 w-4 fill-current" />
                  Start New Practice
                </Button>
              </Link>
            </motion.div>
          </header>

          {/* API Warning Section */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="border-border/50 dark:border-zinc-800/50 bg-white/70 dark:bg-zinc-600/40 backdrop-blur-xl overflow-hidden relative shadow-sm">
              <div className="absolute top-0 right-0 p-1 bg-destructive/20 rounded-bl-xl">
                <Sparkles className="h-4 w-4 text-destructive animate-pulse" />
              </div>
              <CardContent className="p-6 flex flex-col md:flex-row items-center gap-6">
                <div className="h-14 w-14 rounded-2xl bg-destructive/20 flex items-center justify-center flex-shrink-0">
                  <CircleAlert className="h-8 w-8 text-destructive" />
                </div>
                <div className="flex-1 space-y-1 text-center md:text-left">
                  <h3 className="text-lg font-bold text-destructive">
                    Gemini Intelligence is Offline
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Connect your Gemini API key to unlock instant, deep-dive
                    feedback and personalized writing improvements.
                  </p>
                </div>
                <Link href="dashboard/settings">
                  <Button
                    variant="outline"
                    className="border-destructive/30 hover:bg-destructive hover:text-white transition-colors cursor-pointer"
                  >
                    Setup API Key
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>

          {/* Stats Grid */}
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
          >
            {dashboardStat.map((stat, index) => (
              <motion.div key={stat.title} variants={item}>
                <Card className="group relative overflow-hidden border-border/50 dark:border-zinc-800/80 bg-white/70 dark:bg-zinc-950/40 backdrop-blur-xl shadow-sm hover:shadow-md hover:border-primary/30 transition-all duration-300">
                  <div
                    className={`absolute top-0 right-0 -mr-4 -mt-4 h-24 w-24 rounded-full ${stat.bg} mix-blend-multiply filter blur-2xl opacity-50 group-hover:scale-150 transition-transform duration-500`}
                  />
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      {stat.title}
                    </CardTitle>
                    <div className={`rounded-xl ${stat.bg} p-2`}>
                      <stat.icon className={`h-4 w-4 ${stat.color}`} />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                      {stat.change}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {/* Main Content Area */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Left Column: Activity & Performance */}
            <div className="xl:col-span-2 space-y-8">
              <Tabs defaultValue="activity" className="w-full">
                <div className="flex items-center justify-between mb-4">
                  <TabsList className="bg-zinc-100/80 dark:bg-zinc-800/50 p-1 backdrop-blur-sm border border-border/50 dark:border-zinc-800/50">
                    <TabsTrigger value="activity">Recent Activity</TabsTrigger>
                    <TabsTrigger value="performance">Performance</TabsTrigger>
                  </TabsList>
                  <Button
                    variant="blue"
                    size="sm"
                    className="cursor-pointer"
                  >
                    View All <ChevronRight className="ml-1 h-3 w-3" />
                  </Button>
                </div>

                <TabsContent value="activity">
                  <Card className="border-border/50 dark:border-zinc-800/50 bg-white/70 dark:bg-zinc-900/40 backdrop-blur-xl shadow-sm">
                    <CardContent className="p-0">
                      <div className="divide-y divide-border/30 dark:divide-zinc-800/50">
                        {recentEssays.map((essay) => (
                          <div
                            key={essay.id}
                            className="p-4 flex items-center justify-between hover:bg-zinc-100/50 dark:hover:bg-zinc-800/30 transition-colors group"
                          >
                            <div className="flex gap-4 items-center">
                              <div className="h-10 w-10 rounded-xl bg-[#2563EB] flex items-center justify-center font-bold text-lg text-white">
                                {essay.score}
                              </div>
                              <div className="space-y-1">
                                <h4 className="text-sm font-semibold group-hover:text-primary transition-colors cursor-pointer">
                                  {essay.title}
                                </h4>
                                <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
                                  <Badge
                                    variant="outline"
                                    className="text-[10px] h-4 leading-none py-0"
                                  >
                                    {essay.type}
                                  </Badge>
                                  <span className="flex items-center">
                                    <Clock className="mr-1 h-3 w-3" />{" "}
                                    {essay.date}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="rounded-full"
                            >
                              <ChevronRight className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="performance">
                  <Card className="border-border/50 dark:border-zinc-800/50 bg-white/70 dark:bg-zinc-900/40 backdrop-blur-xl shadow-sm h-[300px] flex items-center justify-center">
                    <div className="text-center space-y-4">
                      <TrendingUp className="h-12 w-12 text-primary/40 mx-auto" />
                      <p className="text-muted-foreground text-sm max-w-xs">
                        Insights will appear here once you complete 5 more
                        essays. Keep up the momentum!
                      </p>
                    </div>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>

            {/* Right Column: Goal & Tips */}
            <div className="space-y-8">
              {/* Weekly Goal Card */}
              <Card className="border-border/50 dark:border-zinc-800/50 bg-white/70 dark:bg-zinc-900/40 backdrop-blur-xl shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 p-1 opacity-20">
                  <Target className="h-20 w-20 -mr-6 -mt-6" />
                </div>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Target className="h-5 w-5 text-[#2563EB]" />
                    Weekly Progress
                  </CardTitle>
                  <CardDescription>Target: 10 Essays / Week</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm font-medium">
                      <span>Completed</span>
                      <span>70%</span>
                    </div>
                    <Progress value={70} className="h-2" />
                  </div>
                  <div className="p-4 rounded-xl bg-background/50 border border-border/50 dark:border-zinc-800/50 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-300 space-y-2">
                    <p className="text-xs text-muted-foreground">
                      Next Milestone
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm">
                        Consistent Writer
                      </span>
                      <Badge className="bg-green-500/20 text-green-500 hover:bg-green-500/30">
                        +50 XP
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick AI Tip */}
              <Card className="border-border/50 dark:border-zinc-800/50 bg-white/70 dark:bg-zinc-900/40 backdrop-blur-xl shadow-sm overflow-hidden group">
                <div className="h-1 bg-gradient-to-r from-primary to-blue-500" />
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2 text-muted-foreground">
                    <Zap className="h-4 w-4 text-yellow-500" />
                    Expert Tip of the Day
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm font-medium leading-relaxed italic">
                    "Use more cohesive devices like 'Furthermore' or
                    'Consequently' to improve your Coherence and Cohesion
                    score."
                  </p>
                  <Button
                    variant="link"
                    className="px-0 mt-2 text-primary h-auto p-0 text-xs"
                  >
                    Learn more about Band 7 strategies
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Call to Action Footer */}
          <motion.footer
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="pt-10 border-t border-accent/10 text-center space-y-4"
          >
            <div className="inline-flex items-center justify-center p-2 rounded-full bg-accent/20 px-6 space-x-2">
              <span className="text-xs text-muted-foreground">
                Join 1,200+ students practicing today
              </span>
              <div className="flex -space-x-2">
                {[1, 2, 3].map((i) => (
                  <Avatar
                    key={i}
                    className="h-6 w-6 border-2 border-background"
                  >
                    <AvatarFallback className="text-[8px]">U{i}</AvatarFallback>
                  </Avatar>
                ))}
              </div>
            </div>
            <p className="text-sm text-muted-foreground italic">
              "The only way to write better is to write more."
            </p>
          </motion.footer>
    </DashboardShell>
  );
};

export default DashboardPage;
