"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./ThemeToggle";
import Logo from "./Logo";
import { Menu, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useSession } from "@/lib/auth-client";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, isPending } = useSession();

  const isAuthenticated = !!session?.user;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    setIsMobileMenuOpen(false);
    const targetId = id.toLowerCase().replace(/\s+/g, "-");

    if (pathname !== "/") {
      router.push(`/#${targetId}`);
      return;
    }

    const element = document.getElementById(targetId);
    if (element) {
      const offset = 80; // Navbar height
      const elementPosition =
        element.getBoundingClientRect().top + window.pageYOffset - offset;

      window.scrollTo({
        top: elementPosition,
        behavior: "smooth",
      });
    } else {
      router.push(`/#${targetId}`);
    }
  };

  const navItems = ["Features", "How It Works"];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? "bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-200/50 dark:border-zinc-800/50 shadow-xs"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="group flex items-center gap-2.5 cursor-pointer">
            <Logo className="h-9 w-9 sm:h-10 sm:w-10 shrink-0 transition-transform duration-300 group-hover:scale-105" />
            <span className="text-xl font-black tracking-tight text-zinc-900 dark:text-zinc-50">
              IELTSly
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {navItems.map((item) => (
              <button
                key={item}
                onClick={() =>
                  scrollToSection(item.toLowerCase().replace(/\s+/g, "-"))
                }
                className="text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-primary dark:hover:text-primary transition-all duration-300 relative group cursor-pointer bg-transparent border-none p-0 flex flex-col items-center"
              >
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary dark:bg-primary transition-all duration-500 group-hover:w-full" />
              </button>
            ))}
          </div>

          {/* Actions (Desktop) */}
          <div className="hidden lg:flex items-center gap-4">
            <ThemeToggle />
            {isPending ? (
              <div className="w-24 h-9 rounded-full bg-zinc-100 dark:bg-zinc-800 animate-pulse" />
            ) : isAuthenticated ? (
              <Button
                variant="blue"
                className="rounded-full px-6 font-semibold text-sm shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/40 transition-all duration-300 hover:-translate-y-0.5 cursor-pointer"
                onClick={() => router.push("/dashboard")}
              >
                <LayoutDashboard className="mr-2 h-4 w-4" />
                Dashboard
              </Button>
            ) : (
              <>
                <Button
                  variant="ghost"
                  className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 hover:text-primary dark:hover:text-primary hover:bg-primary/5 dark:hover:bg-primary/10 transition-all duration-300 rounded-full px-5 cursor-pointer"
                  onClick={() => router.push("/signin")}
                >
                  Sign In
                </Button>
                <Button
                  variant="blue"
                  className="rounded-full px-6 font-semibold text-sm shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/40 transition-all duration-300 hover:-translate-y-0.5 cursor-pointer"
                  onClick={() => router.push("/signin?mode=signup")}
                >
                  Get Started
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Trigger & Sheet */}
          <div className="flex lg:hidden items-center gap-2">
            <ThemeToggle />
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 rounded-full shrink-0 flex items-center justify-center p-0 text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer"
                  aria-label="Toggle Navigation Menu"
                >
                  <Menu className="h-5 w-5 size-5 shrink-0" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="w-full sm:w-[380px] bg-white dark:bg-zinc-950 border-l border-zinc-200/80 dark:border-zinc-800/80 p-6 flex flex-col justify-between"
              >
                <div>
                  <SheetHeader className="pb-5 border-b border-zinc-100 dark:border-zinc-850 p-0 flex flex-row items-center justify-between text-left">
                    <Link
                      href="/"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-2.5"
                    >
                      <Logo className="h-8 w-8 shrink-0" />
                      <span className="text-xl font-black tracking-tight text-zinc-900 dark:text-zinc-50">
                        IELTSly
                      </span>
                    </Link>
                    <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                    <SheetDescription className="sr-only">
                      Main website navigation links and account entry points
                    </SheetDescription>
                  </SheetHeader>

                  {/* Mobile Navigation Links */}
                  <div className="flex flex-col gap-6 mt-8">
                    {navItems.map((item) => (
                      <button
                        key={item}
                        onClick={() =>
                          scrollToSection(item.toLowerCase().replace(/\s+/g, "-"))
                        }
                        className="text-xl font-bold text-zinc-800 dark:text-zinc-200 hover:text-primary dark:hover:text-primary transition-colors text-left bg-transparent border-none p-0 cursor-pointer"
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Mobile Drawer Bottom Action Buttons */}
                <div className="pt-6 border-t border-zinc-200/60 dark:border-zinc-800/60 flex flex-col gap-3">
                  {isAuthenticated ? (
                    <Button
                      variant="blue"
                      className="w-full justify-center rounded-xl font-bold text-base shadow-lg shadow-primary/25 h-12 cursor-pointer"
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        router.push("/dashboard");
                      }}
                    >
                      <LayoutDashboard className="mr-2 h-5 w-5" />
                      Dashboard
                    </Button>
                  ) : (
                    <>
                      <Button
                        variant="ghost"
                        className="w-full justify-center text-base font-bold h-11 rounded-xl cursor-pointer"
                        onClick={() => {
                          setIsMobileMenuOpen(false);
                          router.push("/signin");
                        }}
                      >
                        Sign In
                      </Button>
                      <Button
                        variant="blue"
                        className="w-full justify-center rounded-xl font-bold text-base shadow-lg shadow-primary/25 h-12 cursor-pointer"
                        onClick={() => {
                          setIsMobileMenuOpen(false);
                          router.push("/signin?mode=signup");
                        }}
                      >
                        Get Started
                      </Button>
                    </>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
