"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" className="rounded-full">
        <div className="h-5 w-5" />
      </Button>
    );
  }

  const toggleTheme = (event: React.MouseEvent) => {
    const isAppearanceTransition =
      document.startViewTransition !== undefined &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!isAppearanceTransition) {
      setTheme(theme === "dark" ? "light" : "dark");
      return;
    }

    // Get click position for radial animation origin
    const x = event.clientX;
    const y = event.clientY;

    // Calculate the maximum distance to any corner for full coverage
    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y),
    );

    const transition = document.startViewTransition(async () => {
      setTheme(theme === "dark" ? "light" : "dark");
    });

    transition.ready.then(() => {
      // Modern radial expansion with ink-drop effect
      const newThemeAnimation = document.documentElement.animate(
        {
          clipPath: [
            `circle(0px at ${x}px ${y}px)`,
            `circle(${endRadius}px at ${x}px ${y}px)`,
          ],
        },
        {
          duration: 700,
          easing: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
          pseudoElement: "::view-transition-new(root)",
        },
      );

      // Add subtle scale and fade effect to old theme
      document.documentElement.animate(
        {
          transform: ["scale(1)", "scale(1.05)"],
          opacity: [1, 0],
        },
        {
          duration: 350,
          easing: "cubic-bezier(0.4, 0, 1, 1)",
          pseudoElement: "::view-transition-old(root)",
        },
      );
    });
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="relative rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
    >
      <AnimatePresence mode="wait">
        {theme === "dark" ? (
          <motion.div
            key="moon"
            initial={{ y: 20, opacity: 0, rotate: 40 }}
            animate={{ y: 0, opacity: 1, rotate: 0 }}
            exit={{ y: -20, opacity: 0, rotate: -40 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <Moon className="h-5 w-5 text-primary" />
          </motion.div>
        ) : (
          <motion.div
            key="sun"
            initial={{ y: 20, opacity: 0, rotate: 40 }}
            animate={{ y: 0, opacity: 1, rotate: 0 }}
            exit={{ y: -20, opacity: 0, rotate: -40 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <Sun className="h-5 w-5 text-orange-500" />
          </motion.div>
        )}
      </AnimatePresence>
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
