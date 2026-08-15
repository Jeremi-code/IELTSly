"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./ThemeToggle";
import Logo from "./Logo";
import { Menu, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
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

  const navItems = ["Features", "How It Works"]; //pricing and FAQ page are needed.

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? "bg-white/70 dark:bg-zinc-950/70 backdrop-blur-xl border-b border-zinc-200/50 dark:border-zinc-800/50"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="group flex items-center gap-2">
            <Logo className="w-16 h-16 lg:w-18 lg:h-18 transition-all duration-500 group-hover:scale-110 group-hover:drop-shadow-[0_0_15px_rgba(59,130,246,0.3)] dark:group-hover:drop-shadow-[0_0_15px_rgba(59,130,246,0.5)] cursor-pointer" />
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

          {/* Actions */}
          <div className="hidden lg:flex items-center gap-4">
            <ThemeToggle />
            {isPending ? (
              <div className="w-24 h-9 rounded-full bg-zinc-100 dark:bg-zinc-800 animate-pulse" />
            ) : isAuthenticated ? (
              <Button
                variant="blue"
                className="rounded-full px-6 font-semibold text-sm shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/40 transition-all duration-300 hover:-translate-y-0.5"
                onClick={() => router.push("/dashboard")}
              >
                <LayoutDashboard className="mr-2 h-4 w-4" />
                Dashboard
              </Button>
            ) : (
              <>
                <Button
                  variant="ghost"
                  className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 hover:text-primary dark:hover:text-primary hover:bg-primary/5 dark:hover:bg-primary/10 transition-all duration-300 rounded-full px-5"
                  onClick={() => router.push("/signin")}
                >
                  Sign In
                </Button>
                <Button
                  variant="blue"
                  className="rounded-full px-6 font-semibold text-sm shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/40 transition-all duration-300 hover:-translate-y-0.5"
                  onClick={() => router.push("/signin?mode=signup")}
                >
                  Get Started
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu */}
          <div className="flex lg:hidden items-center gap-3">
            <ThemeToggle />
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="w-full sm:w-[400px] bg-white dark:bg-zinc-950 border-l border-zinc-200 dark:border-zinc-800"
              >
                <div className="flex flex-col gap-8 mt-12">
                  {/* Mobile Nav */}
                  {navItems.map((item) => (
                    <button
                      key={item}
                      onClick={() =>
                        scrollToSection(item.toLowerCase().replace(/\s+/g, "-"))
                      }
                      className="text-2xl font-semibold text-zinc-700 dark:text-zinc-300 hover:text-primary dark:hover:text-primary transition-colors duration-200 text-left bg-transparent border-none p-0"
                    >
                      {item}
                    </button>
                  ))}

                  <div className="flex flex-col gap-4 mt-8 pt-8 border-t border-zinc-200 dark:border-zinc-800">
                    {isAuthenticated ? (
                      <Button
                        variant="blue"
                        className="w-full justify-center rounded-full font-semibold text-base shadow-lg shadow-primary/25"
                        onClick={() => {
                          setIsMobileMenuOpen(false);
                          router.push("/dashboard");
                        }}
                      >
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        Dashboard
                      </Button>
                    ) : (
                      <>
                        <Button
                          variant="ghost"
                          className="w-full justify-center text-base font-semibold"
                          onClick={() => {
                            setIsMobileMenuOpen(false);
                            router.push("/signin");
                          }}
                        >
                          Sign In
                        </Button>
                        <Button
                          variant="blue"
                          className="w-full justify-center rounded-full font-semibold text-base shadow-lg shadow-primary/25"
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
