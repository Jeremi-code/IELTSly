"use client";

import React, { useState } from "react";
import DashboardNav from "@/app/components/DashboardNav";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Settings, User, Bell, Shield, Key } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

const SettingsPage = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen bg-linear-to-br from-[#E4EEFF] via-[#FFFFFF] to-[#E4EEFF] dark:from-zinc-950 dark:via-zinc-950 dark:to-zinc-900 text-foreground relative transition-colors duration-500">
      <DashboardNav collapsed={isCollapsed} onToggle={setIsCollapsed} />
      
      <main className={cn(
        "flex-1 transition-all duration-300 p-6 lg:p-10",
        isCollapsed ? "pl-20" : "pl-64"
      )}>
        <div className="max-w-4xl mx-auto space-y-8">
          <header>
            <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
            <p className="text-muted-foreground">Manage your account preferences and API connections.</p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
             <aside className="space-y-2">
                {[
                  { icon: User, label: "Profile" },
                  { icon: Key, label: "API Configuration" },
                  { icon: Bell, label: "Notifications" },
                  { icon: Shield, label: "Security" },
                ].map((item, idx) => (
                  <Button key={idx} variant={idx === 1 ? "secondary" : "ghost"} className="w-full justify-start gap-3">
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </Button>
                ))}
             </aside>

             <div className="md:col-span-2 space-y-6">
                <Card className="border-border/50 dark:border-zinc-800/50 bg-white/70 dark:bg-zinc-900/40 backdrop-blur-xl">
                  <CardHeader>
                    <CardTitle>Gemini API Configuration</CardTitle>
                    <CardDescription>Enter your Gemini API key to enable AI writing evaluations.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="api-key">API Key</Label>
                      <Input id="api-key" type="password" placeholder="sk-..." className="bg-white/50 dark:bg-zinc-900/50" />
                    </div>
                    <Button className="w-full md:w-auto">Save Connection</Button>
                    <Separator />
                    <p className="text-xs text-muted-foreground">
                      Don't have an API key? <a href="#" className="text-primary hover:underline">Get one for free from Google AI Studio.</a>
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-border/50 dark:border-zinc-800/50 bg-white/70 dark:bg-zinc-900/40 backdrop-blur-xl opacity-50">
                  <CardHeader>
                    <CardTitle>Profile Details</CardTitle>
                    <CardDescription>Your personal information is synced with your account.</CardDescription>
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
          </div>
        </div>
      </main>
    </div>
  );
};

export default SettingsPage;
