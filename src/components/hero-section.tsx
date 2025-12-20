"use client";

import { motion } from "framer-motion";
import { Button } from "./ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

const Particle = ({ delay, duration, left }: { delay: number; duration: number; left: string }) => (
  <motion.div
    initial={{ y: -20, opacity: 0 }}
    animate={{ y: "100vh", opacity: [0, 1, 1, 0] }}
    transition={{
      duration,
      repeat: Infinity,
      delay,
      ease: "linear",
    }}
    style={{ left }}
    className="absolute top-0 w-1 h-1 bg-primary/40 rounded-full blur-[1px]"
  />
);

export default function HeroSection() {
  const [particles, setParticles] = useState<{ id: number; left: string; delay: number; duration: number }[]>([]);

  useEffect(() => {
    setParticles(
      Array.from({ length: 25 }).map((_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        delay: Math.random() * 5,
        duration: 8 + Math.random() * 12,
      }))
    );
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-24 pb-16">
      {/* Background Grid */}
      <div className="absolute inset-0 grid-bg opacity-50" />
      
      {/* Light Sprinkle Particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {particles.map((p) => (
          <Particle key={p.id} left={p.left} delay={p.delay} duration={p.duration} />
        ))}
      </div>

      {/* Floating Glow Effects */}
      <div className="glow-effect top-1/4 -left-20 w-[500px] h-[500px]" />
      <div className="glow-effect bottom-1/4 -right-20 w-[500px] h-[500px]" />

      <div className="container mx-auto px-6 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold mb-8 shadow-sm"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Next-Generation LinkedIn Power</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 mb-6 leading-[1.1] tracking-tight"
        >
          Linkedin Automation for <br />
          <span className="text-transparent bg-clip-text bg-linear-to-r from-primary via-[#82C3FF] to-primary">
            Faster Smarter Growth
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="max-w-2xl mx-auto text-base md:text-lg text-slate-600 mb-10 leading-relaxed"
        >
          Scale your reach, automate your engagement, and close more deals. 
          The ultimate platform for modern founders and high-performing teams.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
        >
          <Button size="md" className="group h-14 px-10 rounded-xl text-base">
            Start Free Trial
            <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Button>
          <Button variant="outline" size="md" className="h-14 px-10 rounded-xl text-base bg-white/50 backdrop-blur-sm">
            Watch Video
          </Button>
        </motion.div>

        {/* Hero Visual Mockup */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6, ease: "easeOut" }}
          className="relative max-w-4xl mx-auto"
        >
          <div className="absolute inset-0 bg-primary/20 blur-[100px] rounded-full -z-10" />
          <div className="bg-white/40 backdrop-blur-3xl rounded-4xl p-3 border border-white/60 shadow-xl overflow-hidden">
            <div className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-lg relative aspect-video">
              <Image
                src="/hero-section.png"
                alt="Postsiva LinkedIn Automation Dashboard"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
          
          <motion.div 
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-6 -right-6 w-16 h-16 bg-white rounded-2xl shadow-lg flex items-center justify-center z-20 border border-slate-100"
          >
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
              <Sparkles className="w-5 h-5" />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
