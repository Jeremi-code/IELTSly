"use client";

import React, { useState } from "react";
import DashboardNav from "@/app/components/DashboardNav";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { NotepadText, Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const HistoryPage = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen bg-linear-to-br from-[#E4EEFF] via-[#FFFFFF] to-[#E4EEFF] dark:from-zinc-950 dark:via-zinc-950 dark:to-zinc-900 text-foreground relative transition-colors duration-500">
      <DashboardNav collapsed={isCollapsed} onToggle={setIsCollapsed} />
      
      <main className={cn(
        "flex-1 transition-all duration-300 p-6 lg:p-10",
        isCollapsed ? "pl-20" : "pl-64"
      )}>
        <div className="max-w-6xl mx-auto space-y-8">
          <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Essay History</h1>
              <p className="text-muted-foreground">Review and learn from your past writing attempts.</p>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search essays..." className="pl-9 bg-white/50 dark:bg-zinc-900/50" />
              </div>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </header>

          <Card className="border-border/50 dark:border-zinc-800/50 bg-white/70 dark:bg-zinc-900/40 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <NotepadText className="h-5 w-5 text-primary" />
                All Essays
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                <div className="h-20 w-20 rounded-full bg-primary/5 flex items-center justify-center text-primary/40">
                  <NotepadText className="h-10 w-10" />
                </div>
                <div className="max-w-xs space-y-2">
                   <p className="font-bold">No essays found</p>
                   <p className="text-sm text-muted-foreground">Start practicing to see your writing history and AI feedback here.</p>
                </div>
                <Button 
                  variant="blue" 
                  className="rounded-full px-8 h-12 font-bold transition-all hover:scale-105 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 cursor-pointer"
                >
                  Start Your First Essay
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default HistoryPage;
