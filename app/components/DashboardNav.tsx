"use client";
import React from "react";
import Logo from "./Logo";
import {
  ChartColumn,
  House,
  LogOut,
  NotepadText,
  Plus,
  Settings,
} from "lucide-react";
import Link from "next/link";

const DashboardNav = () => {
  return (
    <div className="fixed top-0 left-0 w-3/20 h-screen p-2 bg-[#FAFAFA] flex flex-col items-start justify-between">
      <div className=" w-full flex flex-col justify-center">
        <Logo className="w-16 h-16 lg:w-18 lg:h-18 transition-all duration-500 group-hover:scale-110 group-hover:drop-shadow-[0_0_15px_rgba(59,130,246,0.3)] dark:group-hover:drop-shadow-[0_0_15px_rgba(59,130,246,0.5)] cursor-pointer" />

        <Link href="/dashboard">
          <button className="w-full p-4 text-[#868686] flex items-center justify-start gap-2 cursor-pointer hover:bg-white hover:text-black">
            <House />
            <div>Dashboard</div>
          </button>
        </Link>

        <Link href="/dashboard/practice">
          <button className="w-full p-4 text-[#868686] flex items-center justify-start gap-2 cursor-pointer hover:bg-white hover:text-black">
            <Plus />
            <div>Practice Essay</div>
          </button>
        </Link>

        <Link href="/dashboard/history">
          <button className="w-full p-4 text-[#868686] flex items-center justify-start gap-2 cursor-pointer hover:bg-white hover:text-black">
            <NotepadText />
            <div>Essay History</div>
          </button>
        </Link>
        <Link href="/dashboard/analytics">
          <button className="w-full p-4 text-[#868686] flex items-center justify-start gap-2 cursor-pointer hover:bg-white hover:text-black">
            <ChartColumn />
            <div>Error Analytics</div>
          </button>
        </Link>

        <Link href="/dashboard/settings">
          <button className="w-full p-4 text-[#868686] flex items-center justify-start gap-2 cursor-pointer hover:bg-white hover:text-black">
            <Settings />
            <div>Settings</div>
          </button>
        </Link>
      </div>

      <div className="w-full flex items-start justify-center">
        <button className="w-full p-4 flex items-center justify-start gap-2 cursor-pointer hover:bg-white hover:text-black">
          <LogOut />
          <div>Sign Out</div>
        </button>
      </div>
    </div>
  );
};

export default DashboardNav;
