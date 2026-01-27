import React from "react";
import { Twitter, Facebook, Linkedin, Instagram, Github } from "lucide-react";
import Link from "next/link";
import Logo from "./Logo";

const Footer = () => {
  return (
    <footer className="w-full bg-slate-50 dark:bg-zinc-950 border-t border-slate-200 dark:border-zinc-900 transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-6 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {/* Logo & Description */}
          <div className="flex flex-col space-y-6">
            <Logo className="w-20 h-20 lg:w-24 lg:h-24" />
            <p className="text-slate-500 dark:text-zinc-400 text-sm leading-relaxed max-w-xs">
              The ultimate IELTS writing practice platform with real exam
              simulation and AI-powered feedback. Achieve your target band score with precision.
            </p>
            <div className="flex items-center space-x-4">
              <Link href="#" className="p-2 rounded-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all hover:shadow-md">
                <Twitter size={18} />
              </Link>
              <Link href="#" className="p-2 rounded-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all hover:shadow-md">
                <Github size={18} />
              </Link>
              <Link href="#" className="p-2 rounded-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all hover:shadow-md">
                <Linkedin size={18} />
              </Link>
              <Link href="#" className="p-2 rounded-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all hover:shadow-md">
                <Instagram size={18} />
              </Link>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="text-slate-900 dark:text-zinc-100 font-bold mb-6">Products</h3>
            <ul className="space-y-4">
              {["Features", "Pricing", "API Documentation", "Changelog"].map((item) => (
                <li key={item}>
                  <Link href="#" className="text-slate-500 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-sm font-medium">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h3 className="text-slate-900 dark:text-zinc-100 font-bold mb-6">Resources</h3>
            <ul className="space-y-4">
              {["Blog", "IELTS Tips", "Sample Essays", "FAQ"].map((item) => (
                <li key={item}>
                  <Link href="#" className="text-slate-500 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-sm font-medium">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-slate-900 dark:text-zinc-100 font-bold mb-6">Company</h3>
            <ul className="space-y-4">
              {["About Us", "Contact", "Privacy Policy", "Terms of Service"].map((item) => (
                <li key={item}>
                  <Link href="#" className="text-slate-500 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-sm font-medium">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 lg:mt-16 pt-8 border-t border-slate-200 dark:border-zinc-900 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 dark:text-zinc-500 text-sm font-medium text-center md:text-left">
            © 2024 <span className="text-slate-900 dark:text-zinc-200">IELTSly</span>. All rights reserved.
          </p>
          <p className="text-slate-400 dark:text-zinc-600 text-xs font-bold uppercase tracking-widest whitespace-nowrap">
            Ultimate Practice Platform
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
