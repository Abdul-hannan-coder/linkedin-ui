"use client";

import { motion } from "framer-motion";
import { Shield, Award, Sparkles, Globe } from "lucide-react";
import Image from "next/image";

const stats = [
  { label: "Active Users", value: "10k+", icon: Globe },
  { label: "Connections Made", value: "2M+", icon: Sparkles },
  { label: "Enterprise Trusted", value: "500+", icon: Shield },
  { label: "Award Winning", value: "12", icon: Award },
];

export default function AboutUs() {
  return (
    <section id="about" className="py-12 md:py-20 bg-white overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col lg:flex-row items-center gap-8 md:gap-12">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex-1 w-full"
          >
            <div className="inline-block px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold mb-4 md:mb-5">
              OUR MISSION
            </div>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-slate-900 mb-4 md:mb-6 leading-tight">
              Empowering Professionals with <span className="text-primary">Next-Gen</span> Automation
            </h2>
            <p className="text-base md:text-lg text-slate-600 mb-6 md:mb-8 leading-relaxed">
              At Postsiva, we believe that professional networking should be about building 
              relationships, not performing repetitive tasks. Our platform is built on 
              state-of-the-art AI to help you scale your LinkedIn presence safely and effectively.
            </p>
            
            <div className="grid grid-cols-2 gap-4 md:gap-6">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 * index }}
                  className="flex flex-col gap-1 md:gap-1.5"
                >
                  <div className="flex items-center gap-2 md:gap-2.5 text-primary">
                    <stat.icon className="w-3.5 h-3.5 md:w-4 md:h-4" />
                    <span className="text-xl md:text-2xl font-black text-slate-900">{stat.value}</span>
                  </div>
                  <span className="text-slate-500 font-medium text-[10px] md:text-xs uppercase tracking-wider">{stat.label}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex-1 w-full relative max-w-md mx-auto lg:max-w-none"
          >
            <div className="absolute inset-0 bg-primary/20 blur-[80px] md:blur-[100px] rounded-full opacity-50" />
            <div className="relative bg-white p-2 rounded-3xl md:rounded-4xl border border-slate-200 shadow-xl overflow-hidden rotate-0 md:rotate-2 hover:rotate-0 transition-transform duration-500">
              <div className="relative w-full aspect-[4/3] md:h-[400px] rounded-2xl md:rounded-3xl overflow-hidden">
                <Image
                  src="/Empowering-Professionals.jpg"
                  alt="Empowering Professionals with Next-Gen Automation"
                  fill
                  className="object-fill"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority={false}
                />
              </div>
            </div>
            
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute -bottom-4 -left-4 md:-bottom-6 md:-left-6 bg-white p-3 md:p-4 rounded-xl shadow-lg border border-slate-100 flex items-center gap-2 md:gap-3 z-10 max-w-[calc(100%-2rem)]"
            >
              <div className="w-8 h-8 md:w-10 md:h-10 bg-primary rounded-full flex items-center justify-center text-white shrink-0">
                <Shield className="w-4 h-4 md:w-5 md:h-5" />
              </div>
              <div className="min-w-0">
                <div className="text-[10px] md:text-xs font-bold text-slate-900 truncate">Enterprise Verified</div>
                <div className="text-[9px] md:text-[10px] text-slate-500 truncate">Bank-level Security</div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
