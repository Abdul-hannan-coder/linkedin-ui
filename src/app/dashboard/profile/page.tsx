"use client";

import { motion } from "framer-motion";
import { RefreshCw, Mail, CheckCircle2, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLinkedInProfile } from "@/hooks/linkedin";
import { useAuth } from "@/hooks/auth";
import { useEffect } from "react";
import Image from "next/image";

export default function ProfilePage() {
  const { user } = useAuth();
  const { profile, isLoading, error, fetchProfile, clearError } = useLinkedInProfile();

  // Fetch profile on mount
  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleRefresh = async () => {
    await fetchProfile();
  };

  // Get initials for avatar fallback
  const getInitials = (name?: string) => {
    if (!name) return 'U';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  // Use LinkedIn profile data if available, fallback to auth user data
  const displayName = profile?.name || user?.full_name || 'User';
  const displayEmail = profile?.email || user?.email || '';
  const displayFirstName = profile?.given_name || user?.full_name?.split(' ')[0] || '';
  const displayLastName = profile?.family_name || user?.full_name?.split(' ').slice(1).join(' ') || '';
  const profilePicture = profile?.picture || null;
  const isEmailVerified = profile?.email_verified || false;
  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-primary rounded-3xl md:rounded-[2.5rem] p-6 md:p-10 text-white relative overflow-hidden shadow-2xl shadow-primary/20 mb-6 md:mb-10"
      >
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4 md:gap-6">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-white/20 rounded-full flex items-center justify-center relative border-4 border-white/30 shrink-0 overflow-hidden">
              {profilePicture ? (
                <Image 
                  src={profilePicture} 
                  alt={displayName}
                  width={80}
                  height={80}
                  className="w-full h-full object-cover rounded-full"
                  unoptimized
                />
              ) : (
                <div className="w-full h-full rounded-full bg-white flex items-center justify-center text-primary text-2xl md:text-3xl font-bold">
                  {getInitials(displayName)}
                </div>
              )}
              <div className="absolute -top-1 -left-1 w-5 h-5 md:w-6 md:h-6 bg-white rounded-full flex items-center justify-center">
                <div className="w-2 h-2 md:w-2.5 md:h-2.5 bg-primary rounded-full animate-pulse" />
              </div>
            </div>
            <div className="min-w-0">
              <h1 className="text-2xl md:text-4xl font-black mb-1 md:mb-2 tracking-tight truncate">
                {isLoading ? 'Loading...' : displayName}
              </h1>
              <div className="flex flex-wrap items-center gap-3">
                {displayEmail && (
                  <div className="flex items-center gap-1.5 text-white/80 font-bold text-xs md:text-sm truncate">
                    <Mail className="w-4 h-4 shrink-0" />
                    {displayEmail}
                  </div>
                )}
                {isEmailVerified && (
                  <div className="px-2.5 py-0.5 md:px-3 md:py-1 bg-white/10 rounded-full border border-white/20 text-[9px] md:text-xs font-black uppercase tracking-widest flex items-center gap-1.5 shrink-0">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Verified
                  </div>
                )}
              </div>
            </div>
          </div>
          <Button 
            variant="outline" 
            className="bg-white/10 border-white/20 text-white hover:bg-white/20 gap-2 h-10 md:h-12 px-4 md:px-6 rounded-xl md:rounded-2xl font-bold text-xs md:text-sm"
            onClick={handleRefresh}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <RefreshCw className="w-3.5 h-3.5" />
            )}
            Refresh
          </Button>
        </div>
        
        {error && (
          <div className="mt-4 p-3 bg-red-500/20 border border-red-500/30 rounded-xl flex items-center gap-2 text-red-100 text-sm">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
            <button 
              onClick={clearError}
              className="ml-auto text-red-200 hover:text-white underline text-xs"
            >
              Dismiss
            </button>
          </div>
        )}
        
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
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin text-slate-400" />
              ) : (
                displayFirstName || 'N/A'
              )}
            </div>
          </div>
          <div className="space-y-2 md:space-y-4">
            <label className="text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Last Name</label>
            <div className="h-12 md:h-16 bg-slate-50 rounded-xl md:rounded-2xl border border-slate-100 flex items-center px-4 md:px-6 text-base md:text-xl font-bold text-slate-900">
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin text-slate-400" />
              ) : (
                displayLastName || 'N/A'
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
