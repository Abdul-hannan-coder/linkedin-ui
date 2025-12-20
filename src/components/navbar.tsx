"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import Link from "next/link";
import { useEffect, useState } from "react";

export const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 py-4",
        scrolled ? "bg-white/80 backdrop-blur-md shadow-sm py-2" : "bg-transparent"
      )}
    >
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-primary/30">
            P
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900">
            Post<span className="text-primary">siva</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
          <Link href="/features" className="hover:text-primary transition-colors">Features</Link>
          <Link href="/#how-it-works" className="hover:text-primary transition-colors">How it Works</Link>
          <Link href="/about" className="hover:text-primary transition-colors">About Us</Link>
          <Link href="/#contact" className="hover:text-primary transition-colors">Contact Us</Link>
        </div>

        <div className="flex items-center gap-4">
          <Link href="/login" className="text-sm font-semibold text-slate-600 hover:text-primary transition-colors">
            Log in
          </Link>
          <Button size="sm" className="h-9 px-4 text-xs rounded-lg">Get Started</Button>
        </div>
      </div>
    </motion.nav>
  );
};
