"use client";

import React from "react";
import { Twitter, Facebook, Linkedin, Instagram, Github, Heart } from "lucide-react";
import Link from "next/link";
import Logo from "./Logo";
import { Button } from "@/components/ui/button";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { icon: Twitter, href: "#" },
    { icon: Github, href: "#" },
    { icon: Linkedin, href: "#" },
    { icon: Instagram, href: "#" },
  ];

  const footerGroups = [
    {
      title: "Product",
      links: ["Features", "Pricing", "Testimonials", "Changelog"],
    },
    {
      title: "Resources",
      links: ["Blog", "IELTS Tips", "Sample Essays", "FAQ"],
    },
    {
      title: "Company",
      links: ["About Us", "Careers", "Contact", "Privacy Policy"],
    },
    {
      title: "Legal",
      links: ["Terms of Service", "Cookie Policy", "Data Processing"],
    },
  ];

  return (
    <footer className="w-full bg-white dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-900 transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-6 py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12 lg:gap-8 mb-16">
          {/* Brand Column */}
          <div className="lg:col-span-2 flex flex-col space-y-6">
            <Logo className="w-24 h-24" />
            <p className="text-zinc-500 dark:text-zinc-400 text-base leading-relaxed max-w-sm">
              The ultimate IELTS writing practice platform with real exam simulation and AI-powered feedback. Achieve your target band score with precision.
            </p>
            <div className="flex items-center gap-3 pt-2">
              {socialLinks.map((social, index) => (
                <Link 
                  key={index} 
                  href={social.href}
                  className="p-2.5 rounded-full bg-zinc-50 dark:bg-zinc-900 text-zinc-500 dark:text-zinc-400 hover:text-primary dark:hover:text-primary hover:bg-primary/5 dark:hover:bg-primary/10 transition-all duration-300"
                >
                  <social.icon size={18} />
                </Link>
              ))}
            </div>
          </div>

          {/* Links Columns */}
          {footerGroups.map((group) => (
            <div key={group.title} className="flex flex-col space-y-6">
              <h4 className="text-zinc-900 dark:text-zinc-100 font-bold text-lg">{group.title}</h4>
              <ul className="space-y-4">
                {group.links.map((link) => (
                  <li key={link}>
                    <Link 
                      href="#" 
                      className="text-zinc-500 dark:text-zinc-400 hover:text-primary dark:hover:text-primary transition-colors duration-200 text-sm font-medium block hover:translate-x-1 transform"
                    >
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-zinc-200 dark:border-zinc-900 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-zinc-500 dark:text-zinc-500 text-sm font-medium">
            © {currentYear} <span className="text-zinc-900 dark:text-zinc-200 font-bold">IELTSly</span>. All rights reserved.
          </p>
          
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5 text-zinc-400 dark:text-zinc-600 text-sm font-medium group cursor-default">
              Made with <Heart className="w-4 h-4 text-red-500 fill-red-500 animate-pulse" /> for students
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
