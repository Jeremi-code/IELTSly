"use client";

import React, { useState } from "react";
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
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "./ModeToggle";
import { motion } from "framer-motion";
import { useSession, signOut } from "@/lib/auth-client";

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
  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { data: session } = useSession();

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

  return (
    <motion.aside 
      initial={false}
      animate={{ width: collapsed ? 80 : 256 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="fixed left-0 top-0 z-40 h-screen border-r border-zinc-200/50 dark:border-zinc-800/50 bg-white/70 dark:bg-zinc-950/70 backdrop-blur-xl"
    >
      {/* Toggle Button placed outside the overflow-clipped container */}
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleSidebar}
        className="absolute -right-3 top-10 h-6 w-6 rounded-full border border-zinc-200 bg-background shadow-md dark:border-zinc-800 dark:bg-zinc-950 z-50 hover:bg-accent"
      >
        {collapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
      </Button>

      {/* Inner content wrapper with overflow clipping */}
      <div className="flex h-full flex-col p-4 relative w-full overflow-x-hidden">
        {/* Logo Section */}
        <div className="h-16 mb-8 flex items-center px-2">
          <Logo className="h-12 w-12 shrink-0" />
          <motion.span 
            initial={false}
            animate={{ 
              opacity: collapsed ? 0 : 1,
              width: collapsed ? 0 : "auto",
              marginLeft: collapsed ? 0 : 12,
            }}
            transition={{ duration: 0.15 }}
            className="text-xl font-bold tracking-tight whitespace-nowrap relative bottom-1 overflow-hidden"
          >
            IELTSly
          </motion.span>
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
                    "group flex items-center rounded-xl p-2.5 text-sm font-medium transition-all duration-200 px-3",
                    isActive
                      ? "bg-primary text-primary-foreground dark:text-white shadow-lg shadow-primary/20"
                      : "text-muted-foreground hover:bg-zinc-200/50 dark:hover:bg-zinc-800/50 hover:text-zinc-900 dark:hover:text-zinc-50 cursor-pointer"
                  )}
                >
                  <item.icon className={cn(
                    "h-5 w-5 transition-transform duration-200 group-hover:scale-110 shrink-0",
                    isActive ? "text-primary-foreground dark:text-white" : "text-muted-foreground group-hover:text-zinc-900 dark:group-hover:text-zinc-50"
                  )} />
                  <motion.span
                    initial={false}
                    animate={{
                      opacity: collapsed ? 0 : 1,
                      width: collapsed ? 0 : "auto",
                      marginLeft: collapsed ? 0 : 12,
                    }}
                    transition={{ duration: 0.15 }}
                    className="whitespace-nowrap overflow-hidden"
                  >
                    {item.name}
                  </motion.span>
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
             <Button
               variant="ghost"
               size="icon"
               onClick={handleLogout}
               disabled={isLoggingOut}
               title="Sign out"
               className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-full h-9 w-9"
             >
               {isLoggingOut ? (
                 <Loader2 className="h-4 w-4 animate-spin" />
               ) : (
                 <LogOut className="h-4 w-4" />
               )}
             </Button>
          </div>
          
          <div className={cn(
            "flex items-center rounded-2xl transition-all duration-300 overflow-hidden",
            collapsed ? "justify-center p-1 bg-transparent border-transparent" : "bg-zinc-100/50 dark:bg-zinc-900/50 border border-zinc-200/50 dark:border-zinc-800/50 p-3"
          )}>
            <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-primary to-blue-400 p-[2px] flex-shrink-0">
              {user?.image ? (
                <img
                  src={user.image}
                  alt={displayName}
                  className="h-full w-full rounded-full object-cover"
                />
              ) : (
                <div className="h-full w-full rounded-full bg-background flex items-center justify-center font-bold text-sm">
                  {initials}
                </div>
              )}
            </div>
            <motion.div 
              initial={false}
              animate={{ 
                opacity: collapsed ? 0 : 1,
                width: collapsed ? 0 : "auto",
                marginLeft: collapsed ? 0 : 12,
              }}
              transition={{ duration: 0.15 }}
              className="flex flex-col min-w-0 overflow-hidden"
            >
              <span className="text-xs font-semibold truncate uppercase tracking-widest text-zinc-900 dark:text-zinc-200">
                {displayName}
              </span>
              <span className="text-[10px] text-muted-foreground truncate">
                {user?.email || ""}
              </span>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.aside>
  );
};

export default DashboardNav;
