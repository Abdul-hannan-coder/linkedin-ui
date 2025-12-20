"use client";

import { motion } from "framer-motion";
import { RefreshCw, Mail, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ProfilePage() {
  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-primary rounded-3xl md:rounded-[2.5rem] p-6 md:p-10 text-white relative overflow-hidden shadow-2xl shadow-primary/20 mb-6 md:mb-10"
      >
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4 md:gap-6">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-white/20 rounded-full flex items-center justify-center relative border-4 border-white/30 shrink-0">
               <div className="w-full h-full rounded-full bg-white flex items-center justify-center text-primary text-2xl md:text-3xl font-bold">
                 MU
               </div>
               <div className="absolute -top-1 -left-1 w-5 h-5 md:w-6 md:h-6 bg-white rounded-full flex items-center justify-center">
                 <div className="w-2 h-2 md:w-2.5 md:h-2.5 bg-primary rounded-full animate-pulse" />
               </div>
            </div>
            <div className="min-w-0">
              <h1 className="text-2xl md:text-4xl font-black mb-1 md:mb-2 tracking-tight truncate">Muhammad Uzair Yasin</h1>
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-1.5 text-white/80 font-bold text-xs md:text-sm truncate">
                  <Mail className="w-4 h-4 shrink-0" />
                  uzairyasin83@gmail.com
                </div>
                <div className="px-2.5 py-0.5 md:px-3 md:py-1 bg-white/10 rounded-full border border-white/20 text-[9px] md:text-xs font-black uppercase tracking-widest flex items-center gap-1.5 shrink-0">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Verified
                </div>
              </div>
            </div>
          </div>
          <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20 gap-2 h-10 md:h-12 px-4 md:px-6 rounded-xl md:rounded-2xl font-bold text-xs md:text-sm">
            <RefreshCw className="w-3.5 h-3.5" />
            Refresh
          </Button>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-48 h-48 md:w-64 md:h-64 bg-white/5 blur-[60px] md:blur-[80px] rounded-full -translate-y-1/2 translate-x-1/2" />
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-3xl md:rounded-[2.5rem] p-6 md:p-10 shadow-2xl shadow-primary/5 border border-slate-100"
      >
        <h2 className="text-xl md:text-2xl font-black text-slate-900 mb-6 md:mb-10 pb-4 border-b border-slate-100">
          Profile Information
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-10">
          <div className="space-y-2 md:space-y-4">
            <label className="text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-widest ml-1">First Name</label>
            <div className="h-12 md:h-16 bg-slate-50 rounded-xl md:rounded-2xl border border-slate-100 flex items-center px-4 md:px-6 text-base md:text-xl font-bold text-slate-900">
              Muhammad Uzair
            </div>
          </div>
          <div className="space-y-2 md:space-y-4">
            <label className="text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Last Name</label>
            <div className="h-12 md:h-16 bg-slate-50 rounded-xl md:rounded-2xl border border-slate-100 flex items-center px-4 md:px-6 text-base md:text-xl font-bold text-slate-900">
              Yasin
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
