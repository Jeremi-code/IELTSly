"use client";

import React, { useState } from "react";
import DashboardNav from "../components/DashboardNav";
import AuthGuard from "../components/AuthGuard";
import { cn } from "@/lib/utils";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <AuthGuard>
      <div className="flex h-screen bg-linear-to-br from-[#E4EEFF] via-[#FFFFFF] to-[#E4EEFF] dark:from-zinc-950 dark:via-zinc-950 dark:to-zinc-900 text-foreground relative overflow-hidden transition-colors duration-500">
        <DashboardNav collapsed={isCollapsed} onToggle={setIsCollapsed} />

        <main
          className={cn(
            "flex-1 h-full overflow-y-auto transition-all duration-300 p-6 lg:p-10",
            isCollapsed ? "ml-20" : "ml-64",
          )}
        >
          <div className="mx-auto w-full max-w-7xl h-full relative">
            {children}
          </div>
        </main>
      </div>
    </AuthGuard>
  );
};

export default DashboardLayout;
