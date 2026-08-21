import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { DailyActivity } from "@/types/analytics";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Converts a raw score out of 40 for Listening/Reading to an official IELTS Band score.
 */
export function rawToBandScore(raw: number): number {
  if (raw >= 39) return 9.0;
  if (raw >= 37) return 8.5;
  if (raw >= 35) return 8.0;
  if (raw >= 32) return 7.5;
  if (raw >= 30) return 7.0;
  if (raw >= 26) return 6.5;
  if (raw >= 23) return 6.0;
  if (raw >= 18) return 5.5;
  if (raw >= 16) return 5.0;
  if (raw >= 13) return 4.5;
  if (raw >= 10) return 4.0;
  if (raw >= 7) return 3.5;
  if (raw >= 5) return 3.0;
  return 2.0;
}

/**
 * Calculates official IELTS overall band score from 4 module scores according to IELTS rounding rules.
 */
export function calculateOverallBand(
  listening: number,
  reading: number,
  writing: number,
  speaking: number
): number {
  const avg = (listening + reading + writing + speaking) / 4;
  const floor = Math.floor(avg);
  const frac = avg - floor;

  if (frac < 0.25) {
    return floor;
  } else if (frac < 0.75) {
    return floor + 0.5;
  } else {
    return floor + 1.0;
  }
}

/**
 * Formats seconds into human-readable duration (e.g., "45 mins" or "1h 15m")
 */
export function formatDuration(seconds: number): string {
  if (!seconds || seconds <= 0) return "0 mins";
  const mins = Math.round(seconds / 60);
  if (mins < 60) return `${mins} min${mins === 1 ? "" : "s"}`;
  const hours = Math.floor(mins / 60);
  const remMins = mins % 60;
  if (remMins === 0) return `${hours} hr${hours === 1 ? "" : "s"}`;
  return `${hours}h ${remMins}m`;
}

/**
 * Gets intensity level (0-4) for activity heatmap tile
 */
export function getIntensityLevel(activity?: DailyActivity): 0 | 1 | 2 | 3 | 4 {
  if (!activity || activity.count === 0) return 0;
  const durationMins = activity.durationSec / 60;
  if (durationMins >= 60 || activity.count >= 3) return 4;
  if (durationMins >= 35 || activity.count >= 2) return 3;
  if (durationMins >= 15 || activity.count >= 1) return 2;
  return 1;
}

/**
 * Returns band performance level description & CSS badge styling
 */
export function getBandLabel(band: number): { label: string; color: string } {
  if (band >= 8.5)
    return {
      label: "Expert / Near Native",
      color: "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    };
  if (band >= 7.5)
    return {
      label: "Very Good User",
      color: "text-blue-600 dark:text-blue-400 bg-blue-500/10 border-blue-500/20",
    };
  if (band >= 6.5)
    return {
      label: "Competent User",
      color: "text-primary bg-primary/10 border-primary/20",
    };
  if (band >= 5.5)
    return {
      label: "Modest User",
      color: "text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/20",
    };
  return {
    label: "Limited / Basic User",
    color: "text-red-600 dark:text-red-400 bg-red-500/10 border-red-500/20",
  };
}
