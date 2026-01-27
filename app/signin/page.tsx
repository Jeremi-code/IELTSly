"use client";
import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
  CircleUser,
  Eye,
  EyeOff,
  Lock,
  Mail,
  SquareCheckBig,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { form } from "framer-motion/client";

const page = () => {
  const [isSignIn, setIsSignIn] = useState(true);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isRegisterPasswordVisible, setIsRegisterPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);

  const changeSignIn = () => setIsSignIn(!isSignIn);
  const changePasswordVisibility = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setIsPasswordVisible(!isPasswordVisible);
  };
  const changeRegisterPasswordVisibility = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setIsRegisterPasswordVisible(!isRegisterPasswordVisible);
  };
  const changeConfirmPasswordVisibility = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setIsConfirmPasswordVisible(!isConfirmPasswordVisible);
  };

  return (
    <div>
      <Navbar />
      <div className="min-h-screen my-4 w-full flex items-center justify-center">
        <div className="md:w-1/2 w-9/10 md:h-180 rounded-2xl flex md:flex-row flex-col items-center justify-center shadow-lg">
          <div className="md:w-1/2 w-full h-full p-10 md:rounded-bl-2xl md:rounded-tl-2xl md:rounded-tr-none rounded-t-2xl bg-linear-to-br from-[#2662EB] to-[#4E47E5] flex flex-col items-start jusify-evenly gap-8">
            <img src="logo_signin.png" width="150" alt="logo" />
            <h2 className="text-3xl text-white text-justify font-bold">
              Master Your IELTS Writing Skills
            </h2>
            <h2 className="text-xl text-white text-justify">
              Practice in a real exam environment with AI-powered feedback
            </h2>

            <ul className="flex flex-col gap-4">
              <li>
                <div className="flex items-start justify-center gap-4">
                  <SquareCheckBig color="white" />
                  <div>
                    <h3 className="text-white text-lg font-bold">
                      Authentic Exam Simulation
                    </h3>
                    <p className="text-white text-lg">
                      Practice without autocorrect, just like the real test
                    </p>
                  </div>
                </div>
              </li>

              <li>
                <div className="flex items-start justify-center gap-4">
                  <SquareCheckBig color="white" />
                  <div>
                    <h3 className="text-white text-lg font-bold">
                      AI-Powered Analysis
                    </h3>
                    <p className="text-white text-lg">
                      Get detailed feedback based on IELTS standards
                    </p>
                  </div>
                </div>
              </li>

              <li>
                <div className="flex items-start justify-center gap-4">
                  <SquareCheckBig color="white" />
                  <div>
                    <h3 className="text-white text-lg font-bold">
                      Track Your Progress
                    </h3>
                    <p className="text-white text-lg">
                      Monitor improvement across all writing criteria
                    </p>
                  </div>
                </div>
              </li>
            </ul>
          </div>

          <div className="md:w-1/2 w-9/10 h-full p-10 rounded-br-2xl rounded-tr-2xl flex flex-col items-start justify-center gap-2">
            <h2 className="text-xl lg:text-3xl font-extrabold text-slate-900 dark:text-zinc-50 tracking-tight">
              Welcome Back
            </h2>

            <p className="text-slate-500 dark:text-zinc-400 text-lg lg:text-xl leading-relaxed">
              Sign in to continue your IELTS journey
            </p>

            <div className="w-full p-1 bg-[#F3F4F6] flex items-center justify-center rounded-lg">
              <button
                className={`p-2 w-1/2 flex items-center justify-center rounded-lg font-bold cursor-pointer ${isSignIn ? "bg-white text-blue-600" : "bg-[#F3F4F6] text-slate-500"}`}
                onClick={changeSignIn}
              >
                Sign In
              </button>
              <button
                className={`p-2 w-1/2 flex items-center justify-center rounded-lg font-bold cursor-pointer ${!isSignIn ? "bg-white text-blue-600" : "bg-[#F3F4F6] text-slate-500"}`}
                onClick={changeSignIn}
              >
                Sign Up
              </button>
            </div>

            {isSignIn ? (
              <form className="w-full mb-4">
                <div className="w-full my-2 flex flex-col items-start justify-center gap-2">
                  <label>Email Address</label>
                  <div className="w-full p-2 flex items-center justify-between gap-1 rounded-lg border-slate-500 border-2">
                    <Mail color="#62748e" />
                    <input
                      type="email"
                      placeholder="you@example.com"
                      className="w-9/10 outline-hidden"
                    />
                  </div>
                </div>

                <div className="w-full my-2 flex flex-col items-start justify-center gap-2">
                  <label>Password</label>
                  <div className="w-full p-2 flex items-center justify-between gap-1 rounded-lg border-slate-500 border-2">
                    <Lock color="#62748e" />
                    <input
                      type={isPasswordVisible ? "text" : "password"}
                      placeholder="••••••••"
                      className="w-9/10 outline-hidden"
                    />
                    <button onClick={changePasswordVisibility}>
                      {isPasswordVisible ? (
                        <Eye color="#62748e" className="cursor-pointer" />
                      ) : (
                        <EyeOff color="#62748e" className="cursor-pointer" />
                      )}
                    </button>
                  </div>
                </div>

                <p className="mb-2 text-blue-600 cursor-pointer hover:text-[#1D4ED8] text-center font-bold">
                  Forgot Password?
                </p>

                <Button
                  variant="blue"
                  className="w-full p-6 text-md rounded-lg"
                >
                  Sign In
                </Button>
              </form>
            ) : (
              <form className="w-full mb-4">
                <div className="w-full my-2 flex flex-col items-start justify-center gap-2">
                  <label>Full Name</label>
                  <div className="w-full p-2 flex items-center justify-between gap-1 rounded-lg border-slate-500 border-2">
                    <CircleUser color="#62748e" />
                    <input
                      type="text"
                      placeholder="Full Name"
                      className="w-9/10 outline-hidden"
                    />
                  </div>
                </div>

                <div className="w-full my-2 flex flex-col items-start justify-center gap-2">
                  <label>Email Address</label>
                  <div className="w-full p-2 flex items-center justify-between gap-1 rounded-lg border-slate-500 border-2">
                    <Mail color="#62748e" />
                    <input
                      type="email"
                      placeholder="you@example.com"
                      className="w-9/10 outline-hidden"
                    />
                  </div>
                </div>

                <div className="w-full my-2 flex flex-col items-start justify-center gap-2">
                  <label>Password</label>
                  <div className="w-full p-2 flex items-center justify-between gap-1 rounded-lg border-slate-500 border-2">
                    <Lock color="#62748e" />
                    <input
                      type={isRegisterPasswordVisible ? "text" : "password"}
                      placeholder="••••••••"
                      className="w-9/10 outline-hidden"
                    />
                    <button onClick={changeRegisterPasswordVisibility}>
                      {isRegisterPasswordVisible ? (
                        <Eye color="#62748e" className="cursor-pointer" />
                      ) : (
                        <EyeOff color="#62748e" className="cursor-pointer" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="w-full my-2 flex flex-col items-start justify-center gap-2">
                  <label>Confirm Password</label>
                  <div className="w-full p-2 flex items-center justify-between gap-1 rounded-lg border-slate-500 border-2">
                    <Lock color="#62748e" />
                    <input
                      type={isConfirmPasswordVisible ? "text" : "password"}
                      placeholder="••••••••"
                      className="w-9/10 outline-hidden"
                    />
                    <button onClick={changeConfirmPasswordVisibility}>
                      {isConfirmPasswordVisible ? (
                        <Eye color="#62748e" className="cursor-pointer" />
                      ) : (
                        <EyeOff color="#62748e" className="cursor-pointer" />
                      )}
                    </button>
                  </div>
                </div>

                <p className="mb-2 text-blue-600 cursor-pointer hover:text-[#1D4ED8] text-center font-bold">
                  Forgot Password?
                </p>

                <Button
                  variant="blue"
                  className="w-full p-6 text-md rounded-lg"
                >
                  Register
                </Button>
              </form>
            )}

            <div className="w-full flex items-center justify-center gap-2">
              <div className="w-3/10 h-px bg-slate-500"></div>
              <p className="text-center text-slate-500 dark:text-zinc-400 text-sm lg:text-lg">
                Or continue with
              </p>
              <div className="w-3/10 h-px bg-slate-500"></div>
            </div>

            <button className="w-full p-2 flex items-center justify-center gap-3 rounded-lg border-slate-500 border-2 cursor-pointer hover:scale-102">
              <img src="google.png" width={30} alt="google-logo" />
              <p className="text-md text-slate-500 font-bold">Google Account</p>
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default page;
