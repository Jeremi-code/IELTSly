"use client";

import React, { useState, useEffect } from "react";
import Logo from "./Logo";
import {
  ChartColumn,
  House,
  LogOut,
  NotepadText,
  Plus,
  Settings,
  ChevronLeft,
  ChevronRight,
  User,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "./ModeToggle";
import { motion, AnimatePresence } from "framer-motion";

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: House },
  { name: "Practice Essay", href: "/dashboard/practice", icon: Plus },
  { name: "Essay History", href: "/dashboard/history", icon: NotepadText },
  { name: "Error Analytics", href: "/dashboard/analytics", icon: ChartColumn },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

const DashboardNav = ({ 
  collapsed: externalCollapsed, 
  onToggle 
}: { 
  collapsed?: boolean; 
  onToggle?: (val: boolean) => void 
}) => {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Sync with external state if provided, otherwise manage internally
  const collapsed = externalCollapsed !== undefined ? externalCollapsed : isCollapsed;

  const toggleSidebar = () => {
    const newVal = !collapsed;
    if (onToggle) {
      onToggle(newVal);
    } else {
      setIsCollapsed(newVal);
    }
  };

  return (
    <motion.aside 
      initial={false}
      animate={{ width: collapsed ? 80 : 256 }}
      className={cn(
        "fixed left-0 top-0 z-40 h-screen border-r border-zinc-200/50 dark:border-zinc-800/50 bg-white/70 dark:bg-zinc-950/70 backdrop-blur-xl transition-all duration-300",
        collapsed ? "w-20" : "w-64"
      )}
    >
      <div className="flex h-full flex-col p-4 relative">
        {/* Toggle Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="absolute -right-3 top-10 h-6 w-6 rounded-full border border-zinc-200 bg-background shadow-md dark:border-zinc-800 dark:bg-zinc-950 z-50 hover:bg-accent"
        >
          {collapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
        </Button>

        {/* Logo Section */}
        <div className={cn(
          "mb-8 flex items-center transition-all duration-300",
          collapsed ? "justify-center" : "gap-3 px-2"
        )}>
          <Logo className="h-10 w-10 flex-shrink-0" />
          {!collapsed && (
            <motion.span 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-xl font-bold tracking-tight whitespace-nowrap"
            >
              IELTSly
            </motion.span>
          )}
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.name} href={item.href}>
                <div
                  title={collapsed ? item.name : ""}
                  className={cn(
                    "group flex items-center rounded-xl p-2.5 text-sm font-medium transition-all duration-200",
                    collapsed ? "justify-center" : "gap-3 px-3",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                      : "text-muted-foreground hover:bg-zinc-200/50 dark:hover:bg-zinc-800/50 hover:text-zinc-900 dark:hover:text-zinc-50"
                  )}
                >
                  <item.icon className={cn(
                    "h-5 w-5 transition-transform duration-200 group-hover:scale-110",
                    isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-zinc-900 dark:group-hover:text-zinc-50"
                  )} />
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="whitespace-nowrap"
                    >
                      {item.name}
                    </motion.span>
                  )}
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Bottom Section */}
        <div className="mt-auto space-y-4 pt-4 border-t border-zinc-200/50 dark:border-zinc-800/50">
          <div className={cn(
            "flex items-center justify-between",
            collapsed ? "flex-col gap-4" : "px-2"
          )}>
             <ModeToggle />
             <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-full h-9 w-9">
               <LogOut className="h-4 w-4" />
             </Button>
          </div>
          
          <div className={cn(
            "flex items-center rounded-2xl transition-all duration-300",
            collapsed ? "justify-center p-1" : "gap-3 bg-zinc-100/50 dark:bg-zinc-900/50 border border-zinc-200/50 dark:border-zinc-800/50 p-3"
          )}>
            <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-primary to-blue-400 p-[2px] flex-shrink-0">
              <div className="h-full w-full rounded-full bg-background flex items-center justify-center font-bold text-sm">
                JD
              </div>
            </div>
            {!collapsed && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col min-w-0"
              >
                <span className="text-xs font-semibold truncate uppercase tracking-widest text-zinc-900 dark:text-zinc-200">Jeremi Doe</span>
                <span className="text-[10px] text-muted-foreground">Premium Plan</span>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </motion.aside>
  );
};

export default DashboardNav;
