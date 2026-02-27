"use client";

import React, { MouseEvent, useState } from "react";
import DashboardNav from "@/app/components/DashboardNav";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Settings, User, Bell, Shield, Key } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import SidePopUp from "@/app/components/SidePopUp";
import PaginationNav from "@/app/components/PaginationNav";

const achievements = [
  {
    id: 1,
    category: "Score",
    message:
      "Congratulations! You achieved a score of 6.5. To get a better result, please exercise more.",
    status: "success",
  },
  {
    id: 2,
    category: "Streak",
    message:
      "Amazing! You've logged in for 7 days straight. Consistency is the key to mastering new skills.",
    status: "info",
  },
  {
    id: 3,
    category: "Reminder",
    message:
      "Your subscription is expiring in 3 days. Renew now to keep your progress synced.",
    status: "warning",
  },
  {
    id: 4,
    category: "Milestone",
    message:
      "You completed the 'Advanced Grammar' module with an 85% accuracy rate. Level up!",
    status: "success",
  },
  {
    id: 5,
    category: "Feedback",
    message:
      "Your tutor left a comment: 'Great job on the essay, but watch your punctuation in complex sentences.'",
    status: "neutral",
  },
  {
    id: 6,
    category: "System",
    message:
      "Maintenance scheduled for Saturday at 2:00 AM UTC. Expect brief interruptions.",
    status: "error",
  },
  {
    id: 7,
    category: "Badge",
    message:
      "New Badge Unlocked: 'Vocabulary Voyager' for learning 500 unique words this month.",
    status: "success",
  },
  {
    id: 8,
    category: "Goal",
    message:
      "You are only 200 points away from reaching the Platinum Tier. Keep pushing!",
    status: "info",
  },
  {
    id: 9,
    category: "Challenge",
    message:
      "Weekend Warrior challenge is live! Complete 3 mock tests to earn double XP.",
    status: "warning",
  },
  {
    id: 10,
    category: "Score",
    message:
      "Diagnostic test complete. Your current level is estimated at B2 (Upper Intermediate).",
    status: "neutral",
  },
];

const SettingsPage = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeButton, setActiveButton] = useState(0);
  const clickHandler = (index: number) => {
    setActiveButton(index);
  };

  return (
    <div className="flex min-h-screen bg-linear-to-br from-[#E4EEFF] via-[#FFFFFF] to-[#E4EEFF] dark:from-zinc-950 dark:via-zinc-950 dark:to-zinc-900 text-foreground relative transition-colors duration-500">
      <DashboardNav collapsed={isCollapsed} onToggle={setIsCollapsed} />

      <main
        className={cn(
          "flex-1 transition-all duration-300 p-6 lg:p-10",
          isCollapsed ? "pl-20" : "pl-64",
        )}
      >
        <div className="max-w-4xl mx-auto space-y-8">
          <header>
            <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
            <p className="text-muted-foreground">
              Manage your account preferences and API connections.
            </p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <aside className="space-y-2">
              {[
                { icon: User, label: "Profile" },
                {
                  icon: Key,
                  label: "API Configuration",
                },
                {
                  icon: Bell,
                  label: "Notifications",
                },
                { icon: Shield, label: "Security" },
              ].map((item, idx) => (
                <Button
                  key={idx}
                  variant={idx === activeButton ? "default" : "ghost"}
                  className={`w-full ${idx === activeButton ? "" : "hover:bg-zinc-300/50 "} cursor-pointer justify-start gap-3`}
                  onClick={() => clickHandler(idx)}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Button>
              ))}
            </aside>

            {activeButton === 0 ? (
              <div className="md:col-span-2 space-y-6">
                <Card className="border-border/50 dark:border-zinc-800/50 bg-white/70 dark:bg-zinc-900/40 backdrop-blur-xl">
                  <CardHeader>
                    <CardTitle>Gemini API Configuration</CardTitle>
                    <CardDescription>
                      Enter your Gemini API key to enable AI writing
                      evaluations.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="api-key">API Key</Label>
                      <Input
                        id="api-key"
                        type="password"
                        placeholder="sk-..."
                        className="bg-white/50 dark:bg-zinc-900/50"
                      />
                    </div>
                    <Button className="w-full md:w-auto cursor-pointer">
                      Save Connection
                    </Button>
                    <Separator />
                    <p className="text-xs text-muted-foreground">
                      Don't have an API key?{" "}
                      <a href="#" className="text-primary hover:underline">
                        Get one for free from Google AI Studio.
                      </a>
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-border/50 dark:border-zinc-800/50 bg-white/70 dark:bg-zinc-900/40 backdrop-blur-xl opacity-50">
                  <CardHeader>
                    <CardTitle>Profile Details</CardTitle>
                    <CardDescription>
                      Your personal information is synced with your account.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>First Name</Label>
                        <Input disabled value="Jeremi" />
                      </div>
                      <div className="space-y-2">
                        <Label>Last Name</Label>
                        <Input disabled value="Doe" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : activeButton === 1 ? (
              <Card className="col-span-2 border-border/50 dark:border-zinc-800/50 bg-white/70 dark:bg-zinc-900/40 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle>Gemini API Configuration</CardTitle>
                  <CardDescription>
                    Enter your Gemini API key to enable AI writing evaluations.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="api-key">API Key</Label>
                    <Input
                      id="api-key"
                      type="password"
                      placeholder="sk-..."
                      className="bg-white/50 dark:bg-zinc-900/50"
                    />
                  </div>
                  <Button className="w-full md:w-auto cursor-pointer">
                    Save Connection
                  </Button>
                  <Separator />
                  <p className="text-xs text-muted-foreground">
                    Don't have an API key?{" "}
                    <a href="#" className="text-primary hover:underline">
                      Get one for free from Google AI Studio.
                    </a>
                  </p>
                </CardContent>
              </Card>
            ) : activeButton === 2 ? (
              <div className="col-span-2">
                <Table>
                  {/* <TableCaption>A list of your recent invoices.</TableCaption> */}
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-25"></TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Message</TableHead>
                      <TableHead className="text-right"></TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {achievements.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell key={item.id} className="font-medium">
                          {item.id}
                        </TableCell>
                        <TableCell>{item.category}</TableCell>
                        <TableCell>
                          <p className="w-48 truncate">{item.message}</p>
                        </TableCell>
                        <TableCell className="text-right">
                          <SidePopUp item={item} />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                <PaginationNav />
              </div>
            ) : (
              <div>This is the settings page</div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default SettingsPage;
