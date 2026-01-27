"use client";

import React, { useState, useEffect, Suspense } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Logo from "../components/Logo";
import InteractiveGridBackground from "../components/InteractiveGridBackground";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, Github } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

const SignInContent = () => {
  const searchParams = useSearchParams();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
  const [activeTab, setActiveTab] = useState("signin");

  useEffect(() => {
    const mode = searchParams.get("mode");
    if (mode === "signup") {
      setActiveTab("signup");
    } else {
      setActiveTab("signin");
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50 dark:bg-zinc-950 relative overflow-hidden">
      <Navbar />
      
      {/* Background Pattern */}
      <InteractiveGridBackground />

      <main className="flex-1 flex items-center justify-center p-4 relative z-10 pt-20">
        <div className="w-full max-w-md animate-in fade-in zoom-in-95 duration-500">
          <div className="text-center mb-4 space-y-1">
            <Logo className="w-20 h-20 mx-auto mb-4 transition-transform hover:scale-110 duration-500" />
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              {activeTab === "signin" ? "Welcome Back" : "Create an Account"}
            </h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              {activeTab === "signin" ? "Sign in to continue your IELTS journey" : "Start your journey to success today"}
            </p>
          </div>

          <Card className="border-zinc-200/80 dark:border-zinc-800/60 bg-white/80 dark:bg-zinc-900/70 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-2xl">
            <CardContent className="p-4 pb-2">
              <Tabs defaultValue="signin" value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-4 h-10 bg-zinc-100/80 dark:bg-zinc-800/50 p-1">
                  <TabsTrigger value="signin" className="rounded-sm font-semibold text-xs h-full data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-950 data-[state=active]:shadow-sm data-[state=active]:text-zinc-900 dark:data-[state=active]:text-zinc-50 transition-all">
                    Sign In
                  </TabsTrigger>
                  <TabsTrigger value="signup" className="rounded-sm font-semibold text-xs h-full data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-950 data-[state=active]:shadow-sm data-[state=active]:text-zinc-900 dark:data-[state=active]:text-zinc-50 transition-all">
                    Sign Up
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="signin" className="space-y-3 focus-visible:outline-none focus-visible:ring-0">
                  <div className="space-y-1.5">
                    <Label htmlFor="email" className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Email</Label>
                    <div className="relative group">
                      <Mail className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400 group-focus-within:text-blue-500 transition-colors" />
                      <Input id="email" type="email" placeholder="name@example.com" className="pl-9 h-9 text-sm bg-white dark:bg-zinc-950/50 border-zinc-200 dark:border-zinc-800 focus:ring-2 focus:ring-blue-500/20 transition-all shadow-sm" />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password" className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Password</Label>
                      <Link href="#" className="text-[10px] font-semibold text-blue-600 hover:text-blue-500 transition-colors">
                        Forgot password?
                      </Link>
                    </div>
                    <div className="relative group">
                      <Lock className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400 group-focus-within:text-blue-500 transition-colors" />
                      <Input 
                        id="password" 
                        type={isPasswordVisible ? "text" : "password"} 
                        className="pl-9 pr-9 h-9 text-sm bg-white dark:bg-zinc-950/50 border-zinc-200 dark:border-zinc-800 focus:ring-2 focus:ring-blue-500/20 transition-all shadow-sm" 
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                        className="absolute right-3 top-2.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 focus:outline-none transition-colors"
                      >
                        {isPasswordVisible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  <Button 
                    variant="blue"
                    className="w-full h-11 rounded-full font-bold text-sm shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-300 hover:-translate-y-0.5 mt-1"
                  >
                    Sign In <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </TabsContent>

                <TabsContent value="signup" className="space-y-3 focus-visible:outline-none focus-visible:ring-0">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1.5">
                      <Label htmlFor="signup-name" className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Full Name</Label>
                      <div className="relative group">
                        <User className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400 group-focus-within:text-blue-500 transition-colors" />
                        <Input id="signup-name" type="text" placeholder="John Doe" className="pl-9 h-9 text-sm bg-white dark:bg-zinc-950/50 border-zinc-200 dark:border-zinc-800 focus:ring-2 focus:ring-blue-500/20 transition-all shadow-sm" />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="signup-email" className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Email</Label>
                      <div className="relative group">
                        <Mail className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400 group-focus-within:text-blue-500 transition-colors" />
                        <Input id="signup-email" type="email" placeholder="name@ex.com" className="pl-9 h-9 text-sm bg-white dark:bg-zinc-950/50 border-zinc-200 dark:border-zinc-800 focus:ring-2 focus:ring-blue-500/20 transition-all shadow-sm" />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="signup-password" className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Password</Label>
                    <div className="relative group">
                      <Lock className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400 group-focus-within:text-blue-500 transition-colors" />
                      <Input 
                        id="signup-password" 
                        type={isPasswordVisible ? "text" : "password"} 
                        className="pl-9 pr-9 h-9 text-sm bg-white dark:bg-zinc-950/50 border-zinc-200 dark:border-zinc-800 focus:ring-2 focus:ring-blue-500/20 transition-all shadow-sm" 
                        placeholder="Create a password"
                      />
                      <button
                        type="button"
                        onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                        className="absolute right-3 top-2.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 focus:outline-none transition-colors"
                      >
                        {isPasswordVisible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="signup-confirm" className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Confirm Password</Label>
                    <div className="relative group">
                      <Lock className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400 group-focus-within:text-blue-500 transition-colors" />
                      <Input 
                        id="signup-confirm" 
                        type={isConfirmPasswordVisible ? "text" : "password"} 
                        className="pl-9 pr-9 h-9 text-sm bg-white dark:bg-zinc-950/50 border-zinc-200 dark:border-zinc-800 focus:ring-2 focus:ring-blue-500/20 transition-all shadow-sm" 
                        placeholder="Confirm password"
                      />
                      <button
                        type="button"
                        onClick={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)}
                        className="absolute right-3 top-2.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 focus:outline-none transition-colors"
                      >
                        {isConfirmPasswordVisible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  <Button 
                    variant="blue"
                    className="w-full h-11 rounded-full font-bold text-sm shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-300 hover:-translate-y-0.5 mt-1"
                  >
                    Create Account <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </TabsContent>
              </Tabs>

              <div className="relative my-3">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-zinc-200 dark:border-zinc-800" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white dark:bg-zinc-950 px-2 text-zinc-500 text-[10px] tracking-wider font-semibold">
                    Or continue with
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1">
                <Button 
                  variant="outline" 
                  className="w-full h-11 rounded-full border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900 bg-white dark:bg-zinc-950/50 backdrop-blur-sm text-sm font-semibold shadow-sm transition-all duration-300 hover:shadow-md flex items-center justify-center gap-2"
                >
                  <img src="/google.png" alt="Google" className="h-4 w-4" />
                  Continue with Google
                </Button>
              </div>
            </CardContent>
            <CardFooter className="px-8 pb-3 pt-1 bg-zinc-50/50 dark:bg-zinc-900/50 border-t border-zinc-200/50 dark:border-zinc-800/50 flex justify-center">
              <p className="text-xs text-center text-zinc-500 max-w-xs leading-relaxed">
                By clicking "Continue", you agree to our <Link href="#" className="underline underline-offset-2 hover:text-blue-600 transition-colors">Terms of Service</Link> and <Link href="#" className="underline underline-offset-2 hover:text-blue-600 transition-colors">Privacy Policy</Link>.
              </p>
            </CardFooter>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

const SignInPage = () => {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-16 h-16 bg-zinc-200 dark:bg-zinc-800 rounded-2xl" />
          <div className="h-4 w-24 bg-zinc-200 dark:bg-zinc-800 rounded" />
        </div>
      </div>
    }>
      <SignInContent />
    </Suspense>
  );
};

export default SignInPage;
