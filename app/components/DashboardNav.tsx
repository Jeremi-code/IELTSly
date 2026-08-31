"use client";

import React, { useState, useEffect, useMemo } from "react";
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
  Loader2,
  Calendar,
  Award,
  Menu,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ModeToggle } from "./ModeToggle";
import { motion, AnimatePresence } from "framer-motion";
import { differenceInCalendarDays, parseISO, startOfDay } from "date-fns";
import { useSession, signOut } from "@/lib/auth-client";
import { getUserTarget } from "@/lib/api";
import type { UserTarget } from "@/types/target";
import ExamTargetModal from "./ExamTargetModal";

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: House },
  { name: "Practice Essay", href: "/dashboard/practice", icon: Plus },
  { name: "Essay History", href: "/dashboard/history", icon: NotepadText },
  { name: "Analytics", href: "/dashboard/analytics", icon: ChartColumn },
  { name: "Band Calculator", href: "/dashboard/calculator", icon: Award },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

const DashboardNav = ({
  collapsed: externalCollapsed,
  onToggle,
}: {
  collapsed?: boolean;
  onToggle?: (val: boolean) => void;
}) => {
  const pathname = usePathname();
  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [userTarget, setUserTarget] = useState<UserTarget | null>(null);
  const [targetModalOpen, setTargetModalOpen] = useState(false);
  const { data: session } = useSession();

  useEffect(() => {
    getUserTarget()
      .then((target) => {
        if (target) setUserTarget(target);
      })
      .catch(() => {});
  }, [pathname]);

  // Close mobile drawer whenever route changes
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Sync with external state if provided, otherwise manage internally
  const collapsed =
    externalCollapsed !== undefined ? externalCollapsed : isCollapsed;

  const toggleSidebar = () => {
    const newVal = !collapsed;
    if (onToggle) {
      onToggle(newVal);
    } else {
      setIsCollapsed(newVal);
    }
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await signOut();
      router.push("/signin");
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  // Derive user display info from session
  const user = session?.user;
  const displayName = user?.name || user?.email?.split("@")[0] || "User";
  const initials = displayName
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const daysLeft = useMemo(() => {
    if (!userTarget?.examDate) return null;
    try {
      const exam =
        typeof userTarget.examDate === "string"
          ? parseISO(userTarget.examDate)
          : new Date(userTarget.examDate);
      if (isNaN(exam.getTime())) return null;
      return differenceInCalendarDays(startOfDay(exam), startOfDay(new Date()));
    } catch {
      return null;
    }
  }, [userTarget]);

  return (
    <>
      <ExamTargetModal
        open={targetModalOpen}
        onOpenChange={setTargetModalOpen}
        currentTarget={userTarget}
        onTargetSaved={(saved) => setUserTarget(saved)}
        onTargetDeleted={() => setUserTarget(null)}
      />

      {/* ── MOBILE TOP HEADER BAR (Shown on screens < lg) ────────────────── */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-40 h-16 border-b border-zinc-200/80 dark:border-zinc-800/80 bg-white/90 dark:bg-zinc-950/90 backdrop-blur-xl px-4 flex items-center justify-between shadow-xs">
        <Link href="/" className="flex items-center gap-2.5">
          <Logo className="h-8 w-8 shrink-0" />
          <span className="text-lg font-black tracking-tight text-zinc-900 dark:text-zinc-50">
            IELTSly
          </span>
        </Link>

        <div className="flex items-center gap-2">
          <ModeToggle />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle Navigation Menu"
            className="h-9 w-9 rounded-xl text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </header>

      {/* ── MOBILE DRAWER SIDEBAR (Shown when mobileOpen is true) ───────── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Dark Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMobileOpen(false)}
              className="lg:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-xs"
            />

            {/* Slide-out Panel */}
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 350, damping: 35 }}
              className="lg:hidden fixed inset-y-0 left-0 z-50 w-72 bg-white dark:bg-zinc-950 border-r border-zinc-200/80 dark:border-zinc-800/80 shadow-2xl flex flex-col justify-between p-4 overflow-y-auto"
            >
              <div className="space-y-6">
                {/* Top Brand Header inside Mobile Drawer */}
                <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-850">
                  <Link href="/" className="flex items-center gap-2.5">
                    <Logo className="h-8 w-8 shrink-0" />
                    <span className="text-xl font-black tracking-tight text-zinc-900 dark:text-zinc-50">
                      IELTSly
                    </span>
                  </Link>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setMobileOpen(false)}
                    className="h-8 w-8 rounded-xl"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                {/* Mobile Navigation Links */}
                <nav className="space-y-1.5">
                  {navItems.map((item) => {
                    const isActive =
                      item.href === "/dashboard"
                        ? pathname === "/dashboard"
                        : pathname === item.href ||
                          pathname.startsWith(item.href + "/");
                    const Icon = item.icon;

                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={() => setMobileOpen(false)}
                        className="block"
                      >
                        <div
                          className={cn(
                            "flex items-center rounded-xl font-medium transition-all duration-150 px-3.5 py-3 gap-3 text-sm",
                            isActive
                              ? "bg-primary text-primary-foreground dark:text-white shadow-xs font-bold"
                              : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100/80 dark:hover:bg-zinc-850 hover:text-zinc-950 dark:hover:text-zinc-100",
                          )}
                        >
                          <Icon
                            className={cn(
                              "h-4 w-4 shrink-0 transition-colors",
                              isActive
                                ? "text-primary-foreground dark:text-white"
                                : "text-zinc-500 dark:text-zinc-400",
                            )}
                          />
                          <span className="truncate">{item.name}</span>
                          {isActive && (
                            <span className="ml-auto h-2 w-2 rounded-full bg-white dark:bg-white shrink-0" />
                          )}
                        </div>
                      </Link>
                    );
                  })}
                </nav>
              </div>

              {/* Bottom Mobile Drawer Section */}
              <div className="space-y-3 pt-3 border-t border-zinc-200/60 dark:border-zinc-800/60">
                {/* Exam Target Countdown Pill */}
                {userTarget?.examDate && (
                  <div
                    onClick={() => {
                      setTargetModalOpen(true);
                      setMobileOpen(false);
                    }}
                    className="p-3 rounded-xl bg-primary/5 hover:bg-primary/10 border border-primary/20 cursor-pointer transition-all flex items-center justify-between gap-2 shadow-2xs"
                  >
                    <div className="flex items-center gap-2.5 overflow-hidden">
                      <div className="h-7 w-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                        <Calendar className="h-3.5 w-3.5" />
                      </div>
                      <div className="overflow-hidden">
                        <span className="text-[11px] font-bold text-zinc-900 dark:text-zinc-100 block truncate leading-tight">
                          {daysLeft !== null && daysLeft <= 0
                            ? "Exam Completed"
                            : `${daysLeft} days to Exam`}
                        </span>
                        <span className="text-[10px] text-muted-foreground block truncate leading-tight mt-0.5">
                          Band {userTarget.targetBand?.toFixed(1) || "7.5"} • {userTarget.examType === "general" ? "General" : "Academic"}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* User Profile & Sign Out Card */}
                <div className="rounded-xl border border-border/50 bg-zinc-50/80 dark:bg-zinc-900/60 p-3 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0 overflow-hidden">
                    <div className="relative shrink-0">
                      <div className="h-8 w-8 rounded-full bg-linear-to-tr from-primary to-emerald-400 p-[1.5px] shadow-2xs">
                        {user?.image ? (
                          <img
                            src={user.image}
                            alt={displayName}
                            className="h-full w-full rounded-full object-cover"
                          />
                        ) : (
                          <div className="h-full w-full rounded-full bg-background flex items-center justify-center font-bold text-xs text-foreground">
                            {initials}
                          </div>
                        )}
                      </div>
                      <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-background" />
                    </div>

                    <div className="flex flex-col min-w-0 overflow-hidden">
                      <span className="text-xs font-bold truncate text-zinc-900 dark:text-zinc-100 leading-tight">
                        {displayName}
                      </span>
                      <span className="text-[10px] text-muted-foreground truncate leading-tight mt-0.5">
                        {user?.email || "Pro Student"}
                      </span>
                    </div>
                  </div>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    title="Sign out"
                    className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl h-8 w-8 shrink-0 cursor-pointer"
                  >
                    {isLoggingOut ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <LogOut className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ── DESKTOP SIDEBAR (Shown on screens >= lg) ────────────────────── */}
      <motion.aside
        initial={false}
        animate={{ width: collapsed ? 76 : 256 }}
        transition={{ type: "spring", stiffness: 320, damping: 32 }}
        className="hidden lg:flex fixed left-0 top-0 z-40 h-screen border-r border-zinc-200/70 dark:border-zinc-800/80 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-2xl shadow-xs"
      >
        {/* Sidebar Toggle Button */}
        <Button
          variant="outline"
          size="icon"
          onClick={toggleSidebar}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="absolute -right-3.5 top-7 h-7 w-7 rounded-full border border-border/80 bg-white dark:bg-zinc-900 shadow-md hover:bg-primary hover:text-white dark:hover:bg-primary dark:hover:text-white transition-all z-50 cursor-pointer p-0 flex items-center justify-center"
        >
          {collapsed ? (
            <ChevronRight className="h-3.5 w-3.5" />
          ) : (
            <ChevronLeft className="h-3.5 w-3.5" />
          )}
        </Button>

        {/* Inner container */}
        <div className="flex h-full flex-col justify-between p-3.5 relative w-full overflow-hidden">
          {/* Top Section: Logo & Nav Links */}
          <div className="space-y-6">
            {/* Logo Brand Emblem */}
            <div className="h-12 flex items-center">
              <Link
                href="/"
                className={cn(
                  "flex items-center group transition-all duration-200 cursor-pointer",
                  collapsed ? "w-full justify-center" : "gap-2.5 px-1.5 w-full",
                )}
              >
                <Logo className="h-9 w-9 shrink-0 group-hover:scale-105 transition-transform duration-200 drop-shadow-xs" />

                {!collapsed && (
                  <motion.div
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -6 }}
                    transition={{ duration: 0.15 }}
                    className="flex items-center overflow-hidden whitespace-nowrap"
                  >
                    <span className="text-xl font-black tracking-tight text-zinc-900 dark:text-zinc-50">
                      IELTSly
                    </span>
                  </motion.div>
                )}
              </Link>
            </div>

            {/* Navigation Links */}
            <nav className="space-y-1.5">
              {navItems.map((item) => {
                const isActive =
                  item.href === "/dashboard"
                    ? pathname === "/dashboard"
                    : pathname === item.href ||
                      pathname.startsWith(item.href + "/");
                const Icon = item.icon;

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    title={collapsed ? item.name : undefined}
                    className="block relative"
                  >
                    <div
                      className={cn(
                        "flex items-center rounded-xl font-medium transition-all duration-150 cursor-pointer relative",
                        collapsed
                          ? "h-10 w-10 mx-auto justify-center p-0"
                          : "w-full px-3 py-2.5 gap-3 text-xs sm:text-sm",
                        isActive
                          ? "bg-primary text-primary-foreground dark:text-white shadow-xs font-bold"
                          : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100/80 dark:hover:bg-zinc-850 hover:text-zinc-950 dark:hover:text-zinc-100",
                      )}
                    >
                      <Icon
                        className={cn(
                          "h-4 w-4 shrink-0 transition-colors",
                          isActive
                            ? "text-primary-foreground dark:text-white"
                            : "text-zinc-500 dark:text-zinc-400",
                        )}
                      />

                      {!collapsed && (
                        <span className="whitespace-nowrap truncate leading-none">
                          {item.name}
                        </span>
                      )}

                      {isActive && !collapsed && (
                        <span className="ml-auto h-1.5 w-1.5 rounded-full bg-white dark:bg-white shrink-0" />
                      )}
                    </div>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Bottom Section: Exam Target Pill, Mode Toggle, Sign Out & User Info */}
          <div className="space-y-3 pt-3 border-t border-zinc-200/60 dark:border-zinc-800/60">
            {/* Exam Target Countdown Pill in Nav */}
            {userTarget?.examDate && !collapsed && (
              <div
                onClick={() => setTargetModalOpen(true)}
                className="p-2.5 rounded-xl bg-primary/5 hover:bg-primary/10 border border-primary/20 cursor-pointer transition-all flex items-center justify-between gap-2 shadow-2xs group"
              >
                <div className="flex items-center gap-2.5 overflow-hidden">
                  <div className="h-7 w-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <Calendar className="h-3.5 w-3.5" />
                  </div>
                  <div className="overflow-hidden">
                    <span className="text-[11px] font-bold text-zinc-900 dark:text-zinc-100 block truncate leading-tight">
                      {daysLeft !== null && daysLeft <= 0
                        ? "Exam Completed"
                        : `${daysLeft} days to Exam`}
                    </span>
                    <span className="text-[10px] text-muted-foreground block truncate leading-tight mt-0.5">
                      Band {userTarget.targetBand?.toFixed(1) || "7.5"} • {userTarget.examType === "general" ? "General" : "Academic"}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Quick Actions Row */}
            <div
              className={cn(
                "flex items-center",
                collapsed
                  ? "flex-col gap-2 justify-center"
                  : "justify-between px-1",
              )}
            >
              <ModeToggle />
              <Button
                variant="ghost"
                size="icon"
                onClick={handleLogout}
                disabled={isLoggingOut}
                title="Sign out"
                className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl h-8 w-8 cursor-pointer"
              >
                {isLoggingOut ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <LogOut className="h-4 w-4" />
                )}
              </Button>
            </div>

            {/* User Profile Card */}
            <div
              className={cn(
                "rounded-xl border transition-all duration-200 flex items-center",
                collapsed
                  ? "justify-center p-1.5 border-transparent bg-transparent"
                  : "p-2.5 bg-zinc-50/80 dark:bg-zinc-900/60 border-border/50 gap-2.5 shadow-2xs",
              )}
            >
              {/* Avatar with status ring */}
              <div className="relative shrink-0">
                <div className="h-8 w-8 rounded-full bg-linear-to-tr from-primary to-emerald-400 p-[1.5px] shadow-2xs">
                  {user?.image ? (
                    <img
                      src={user.image}
                      alt={displayName}
                      className="h-full w-full rounded-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full rounded-full bg-background flex items-center justify-center font-bold text-xs text-foreground">
                      {initials}
                    </div>
                  )}
                </div>
                <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-background" />
              </div>

              {/* User details */}
              {!collapsed && (
                <div className="flex flex-col min-w-0 overflow-hidden">
                  <span className="text-xs font-bold truncate text-zinc-900 dark:text-zinc-100 leading-tight">
                    {displayName}
                  </span>
                  <span className="text-[10px] text-muted-foreground truncate leading-tight mt-0.5">
                    {user?.email || "Pro Student"}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.aside>
    </>
  );
};

export default DashboardNav;
