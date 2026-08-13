"use client";

import React, { useState, useEffect } from "react";
import DashboardShell from "../../components/DashboardShell";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  User,
  Bell,
  Shield,
  Key,
  Sparkles,
  Lock,
  Laptop,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import SidePopUp from "@/app/components/SidePopUp";
import PaginationNav from "@/app/components/PaginationNav";
import { useSession } from "@/lib/auth-client";
import {
  getAICredentials,
  saveAICredentials,
  deleteAICredentials,
} from "@/lib/api";
import type { AIProvider, AICredentialStatus } from "@/types/ai";

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
  const [activeButton, setActiveButton] = useState(0);
  const [aiProvider, setAiProvider] = useState<AIProvider>("gemini");
  const [apiKey, setApiKey] = useState("");
  const [showApiKey, setShowApiKey] = useState(false);
  const [credentialStatus, setCredentialStatus] =
    useState<AICredentialStatus | null>(null);
  const [isSavingApi, setIsSavingApi] = useState(false);
  const [isDeletingApi, setIsDeletingApi] = useState(false);
  const [apiSaveStatus, setApiSaveStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [apiErrorMessage, setApiErrorMessage] = useState("");
  const { data: session } = useSession();

  useEffect(() => {
    getAICredentials()
      .then((status) => {
        setCredentialStatus(status);
        if (status.provider) setAiProvider(status.provider);
      })
      .catch((err) => console.error("Failed to load AI credentials:", err));
  }, []);

  const handleSaveApiKey = async () => {
    const trimmed = apiKey.trim();
    const valid =
      aiProvider === "gemini"
        ? /^AIza[0-9A-Za-z_-]{20,}$/.test(trimmed)
        : /^sk-[0-9A-Za-z_-]{10,}$/.test(trimmed);
    if (!trimmed || !valid) {
      setApiErrorMessage(
        `Please enter a valid ${aiProvider === "gemini" ? "Google Gemini (starts with AIza...)" : "OpenAI (starts with sk-...)"} key.`,
      );
      setApiSaveStatus("error");
      return;
    }

    setIsSavingApi(true);
    setApiSaveStatus("idle");
    setApiErrorMessage("");
    try {
      const res = await saveAICredentials({
        provider: aiProvider,
        apiKey: trimmed,
      });
      setCredentialStatus(res);
      setApiKey("");
      setApiSaveStatus("success");
    } catch (err: any) {
      setApiErrorMessage(err.message || "Failed to securely save API key.");
      setApiSaveStatus("error");
    } finally {
      setIsSavingApi(false);
    }
  };

  const handleDeleteApiKey = async () => {
    if (
      !confirm(
        "Are you sure you want to disconnect and delete your stored API key?",
      )
    )
      return;
    setIsDeletingApi(true);
    try {
      await deleteAICredentials();
      setCredentialStatus({ isConnected: false });
      setApiSaveStatus("idle");
    } catch (err: any) {
      alert(err.message || "Failed to remove API key.");
    } finally {
      setIsDeletingApi(false);
    }
  };

  // Derive user info
  const user = session?.user;
  const displayName = user?.name || "User";
  const nameParts = displayName.trim().split(/\s+/);
  const firstName = nameParts[0] || "IELTSly";
  const lastName = nameParts.slice(1).join(" ") || "Student";

  return (
    <DashboardShell className="max-w-[1200px] p-6 lg:p-10 space-y-8">
      <header>
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
          Account <span className="text-primary italic">Settings</span>
        </h1>
        <p className="text-muted-foreground text-lg">
          Manage your account preferences, security configurations, and API
          keys.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Navigation Sidebar */}
        <aside className="space-y-1.5 lg:col-span-1">
          {[
            { icon: User, label: "Profile Details" },
            { icon: Key, label: "API Configuration" },
            { icon: Bell, label: "Notification Log" },
            { icon: Shield, label: "Security & Devices" },
          ].map((item, idx) => (
            <Button
              key={idx}
              variant={idx === activeButton ? "blue" : "ghost"}
              className={cn(
                "w-full justify-start gap-3 rounded-xl py-6 px-4 font-bold text-sm cursor-pointer transition-all",
                idx === activeButton
                  ? "shadow-md shadow-primary/10"
                  : "text-muted-foreground hover:bg-zinc-100 dark:hover:bg-zinc-900/50 hover:text-foreground",
              )}
              onClick={() => setActiveButton(idx)}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              {item.label}
            </Button>
          ))}
        </aside>

        {/* Content Pane */}
        <div className="lg:col-span-3 space-y-6">
          {/* PROFILE DETAILS */}
          {activeButton === 0 && (
            <Card className="border-border/50 dark:border-zinc-800/80 bg-white/70 dark:bg-zinc-950/40 backdrop-blur-xl shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl">Profile Details</CardTitle>
                <CardDescription>
                  Your profile details are synced securely with your active
                  authentication session.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Avatar Display */}
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-zinc-50/50 dark:bg-zinc-900/50 border border-border/10">
                  <div className="h-16 w-16 rounded-full bg-gradient-to-tr from-primary to-emerald-400 p-[2.5px]">
                    {user?.image ? (
                      <img
                        src={user.image}
                        alt={displayName}
                        className="h-full w-full rounded-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full rounded-full bg-background flex items-center justify-center font-bold text-xl uppercase">
                        {firstName[0]}
                        {lastName[0]}
                      </div>
                    )}
                  </div>
                  <div>
                    <h4 className="font-bold text-zinc-900 dark:text-zinc-100">
                      {displayName}
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      {user?.email}
                    </p>
                    <Badge className="mt-1 bg-green-500/10 text-green-500 border-green-500/20 hover:bg-green-500/20">
                      Active Session Verified
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground/80">
                      First Name
                    </Label>
                    <Input
                      disabled
                      value={firstName}
                      className="bg-zinc-50/50 dark:bg-zinc-900/50 text-muted-foreground cursor-not-allowed"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground/80">
                      Last Name
                    </Label>
                    <Input
                      disabled
                      value={lastName}
                      className="bg-zinc-50/50 dark:bg-zinc-900/50 text-muted-foreground cursor-not-allowed"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground/80">
                    Email Address
                  </Label>
                  <Input
                    disabled
                    value={user?.email || ""}
                    className="bg-zinc-50/50 dark:bg-zinc-900/50 text-muted-foreground cursor-not-allowed"
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* API CONFIGURATION */}
          {activeButton === 1 && (
            <Card className="border-border/50 dark:border-zinc-800/80 bg-white/70 dark:bg-zinc-950/40 backdrop-blur-xl shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl">AI API Key Connection</CardTitle>
                <CardDescription>
                  Connect your Google Gemini or OpenAI key to enable AI essay
                  evaluations. Keys are securely encrypted at rest using
                  AES-256-GCM on our backend and decrypted only in memory when
                  evaluating your work.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                {/* Active Connection Banner */}
                {credentialStatus?.isConnected && (
                  <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-emerald-500">
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="h-5 w-5 shrink-0" />
                      <div>
                        <div className="text-xs font-bold uppercase tracking-wider flex items-center gap-2">
                          <span>
                            Connected:{" "}
                            {credentialStatus.provider === "gemini"
                              ? "Google Gemini"
                              : "OpenAI"}
                          </span>
                          <span className="bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[10px] px-2 py-0.5 rounded-full font-mono font-normal">
                            AES-256 Encrypted
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground font-mono mt-0.5">
                          {credentialStatus.maskedKey || "Key configured"}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleDeleteApiKey}
                      disabled={isDeletingApi}
                      className="text-xs text-red-500 hover:text-red-600 border-red-500/30 hover:bg-red-500/10 cursor-pointer self-start sm:self-auto"
                    >
                      {isDeletingApi ? "Disconnecting..." : "Disconnect Key"}
                    </Button>
                  </div>
                )}

                {/* Alerts */}
                {apiSaveStatus === "success" && (
                  <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-3 text-emerald-500">
                    <CheckCircle2 className="h-5 w-5 shrink-0" />
                    <span className="text-xs font-bold">
                      API Key verified, encrypted, and saved successfully!
                    </span>
                  </div>
                )}
                {apiSaveStatus === "error" && (
                  <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-3 text-red-500">
                    <AlertCircle className="h-5 w-5 shrink-0" />
                    <span className="text-xs font-bold">
                      {apiErrorMessage ||
                        `Please enter a valid ${aiProvider === "gemini" ? "Gemini" : "OpenAI"} API key.`}
                    </span>
                  </div>
                )}

                {/* Provider Picker */}
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground/80">
                    Select Provider
                  </Label>
                  <div className="flex items-center p-1 bg-zinc-100/80 dark:bg-zinc-800/50 rounded-xl border border-border/50 dark:border-zinc-800/50 w-fit">
                    {(["gemini", "openai"] as AIProvider[]).map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setAiProvider(p)}
                        className={cn(
                          "px-5 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer capitalize",
                          aiProvider === p
                            ? "bg-primary text-primary-foreground shadow-sm"
                            : "text-muted-foreground hover:text-foreground",
                        )}
                      >
                        {p === "gemini" ? "Google Gemini" : "OpenAI"}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="api-key"
                    className="text-xs font-bold uppercase tracking-widest text-muted-foreground/80"
                  >
                    {credentialStatus?.isConnected
                      ? `Update ${aiProvider === "gemini" ? "Gemini" : "OpenAI"} API Key`
                      : `${aiProvider === "gemini" ? "Gemini" : "OpenAI"} API Key`}
                  </Label>
                  <div className="relative">
                    <Input
                      id="api-key"
                      type={showApiKey ? "text" : "password"}
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      placeholder={
                        aiProvider === "gemini" ? "AIzaSy..." : "sk-proj-..."
                      }
                      className="bg-white/50 dark:bg-zinc-900/50 pr-10 border-border/50 dark:border-zinc-800/80 rounded-xl font-mono text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => setShowApiKey(!showApiKey)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                    >
                      {showApiKey ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                <Button
                  variant="blue"
                  onClick={handleSaveApiKey}
                  disabled={isSavingApi}
                  className="w-full sm:w-auto px-6 cursor-pointer font-bold"
                >
                  {isSavingApi
                    ? "Encrypting & Saving..."
                    : credentialStatus?.isConnected
                      ? "Update & Save Key"
                      : "Save Encrypted Key"}
                </Button>

                <Separator />
                <div className="p-4 rounded-xl bg-primary/5 border border-primary/10 flex items-start gap-3">
                  <Sparkles className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Don't have an API key? Get a free one from{" "}
                    <a
                      href="https://aistudio.google.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline font-bold ml-1 inline-flex items-center gap-0.5"
                    >
                      Google AI Studio
                    </a>{" "}
                    or{" "}
                    <a
                      href="https://platform.openai.com/api-keys"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline font-bold inline-flex items-center gap-0.5"
                    >
                      OpenAI Platform.
                    </a>
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* NOTIFICATION LOG */}
          {activeButton === 2 && (
            <Card className="border-border/50 dark:border-zinc-800/80 bg-white/70 dark:bg-zinc-950/40 backdrop-blur-xl shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">Notification History</CardTitle>
                <CardDescription>
                  View achievements, system updates, and milestone alerts.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="overflow-x-auto rounded-xl border border-border/50 dark:border-zinc-800/50">
                  <Table>
                    <TableHeader className="bg-zinc-100/50 dark:bg-zinc-900/50">
                      <TableRow>
                        <TableHead className="w-12 text-center font-bold">
                          ID
                        </TableHead>
                        <TableHead className="w-24 font-bold">
                          Category
                        </TableHead>
                        <TableHead className="font-bold">Message</TableHead>
                        <TableHead className="w-20 text-right font-bold"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {achievements.map((item) => (
                        <TableRow
                          key={item.id}
                          className="hover:bg-zinc-100/30 dark:hover:bg-zinc-900/10"
                        >
                          <TableCell className="font-mono text-center text-xs text-muted-foreground">
                            {item.id}
                          </TableCell>
                          <TableCell>
                            <span
                              className={cn(
                                "text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border",
                                item.status === "success" &&
                                  "bg-green-500/10 text-green-500 border-green-500/20",
                                item.status === "info" &&
                                  "bg-primary/10 text-primary border-primary/20",
                                item.status === "warning" &&
                                  "bg-amber-500/10 text-amber-500 border-amber-500/20",
                                item.status === "error" &&
                                  "bg-red-500/10 text-red-500 border-red-500/20",
                                item.status === "neutral" &&
                                  "bg-zinc-500/10 text-zinc-500 border-zinc-500/20",
                              )}
                            >
                              {item.category}
                            </span>
                          </TableCell>
                          <TableCell className="text-sm font-medium">
                            <p
                              className="max-w-[320px] lg:max-w-[420px] truncate"
                              title={item.message}
                            >
                              {item.message}
                            </p>
                          </TableCell>
                          <TableCell className="text-right">
                            <SidePopUp item={item} />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                <PaginationNav />
              </CardContent>
            </Card>
          )}

          {/* SECURITY & DEVICES */}
          {activeButton === 3 && (
            <div className="space-y-6">
              {/* Reset Password Card */}
              <Card className="border-border/50 dark:border-zinc-800/80 bg-white/70 dark:bg-zinc-950/40 backdrop-blur-xl shadow-sm">
                <CardHeader>
                  <CardTitle className="text-xl flex items-center gap-2">
                    <Lock className="h-5 w-5 text-primary" />
                    Reset Password
                  </CardTitle>
                  <CardDescription>
                    Provide your credentials below to update your security keys.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground/80">
                      Current Password
                    </Label>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      className="bg-white/50 dark:bg-zinc-900/50 border-border/50 dark:border-zinc-800/80 rounded-xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground/80">
                      New Password
                    </Label>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      className="bg-white/50 dark:bg-zinc-900/50 border-border/50 dark:border-zinc-800/80 rounded-xl"
                    />
                  </div>
                  <Button
                    variant="blue"
                    className="w-full sm:w-auto font-bold cursor-pointer"
                  >
                    Update Password
                  </Button>
                </CardContent>
              </Card>

              {/* Connected Devices */}
              <Card className="border-border/50 dark:border-zinc-800/80 bg-white/70 dark:bg-zinc-950/40 backdrop-blur-xl shadow-sm">
                <CardHeader>
                  <CardTitle className="text-xl flex items-center gap-2">
                    <Laptop className="h-5 w-5 text-primary" />
                    Active Sessions
                  </CardTitle>
                  <CardDescription>
                    Devices currently signed into your IELTSly account.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-xl bg-zinc-50/50 dark:bg-zinc-900/50 border border-border/10">
                    <div className="flex items-center gap-3">
                      <Laptop className="h-10 w-10 text-muted-foreground shrink-0" />
                      <div>
                        <h4 className="font-bold text-sm">
                          Mac OS - Chrome Browser
                        </h4>
                        <p className="text-xs text-muted-foreground">
                          Istanbul, Turkey • Active Now
                        </p>
                      </div>
                    </div>
                    <Badge className="bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 border-emerald-500/20 font-bold">
                      Current
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </DashboardShell>
  );
};

export default SettingsPage;
