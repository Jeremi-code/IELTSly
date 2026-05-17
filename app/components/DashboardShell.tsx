import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface DashboardShellProps {
  children: ReactNode;
  className?: string;
}

const DashboardShell = ({ children, className }: DashboardShellProps) => {
  return <div className={cn("mx-auto w-full", className)}>{children}</div>;
};

export default DashboardShell;
