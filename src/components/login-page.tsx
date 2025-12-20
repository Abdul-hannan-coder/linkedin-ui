"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Github, Chrome, ArrowLeft } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/auth";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const { login, isLoading, error, isAuthenticated, clearError, loginWithGoogle, isGoogleOAuthLoading } = useAuth();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard/profile");
    }
  }, [isAuthenticated, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    const result = await login({ email, password });
    
    if (result.success) {
      router.push("/dashboard/profile");
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-6 overflow-hidden">
      {/* Background with Grid and Glow */}
      <div className="absolute inset-0 grid-bg opacity-40" />
      <div className="glow-effect top-0 left-0 w-[800px] h-[800px] opacity-60" />
      <div className="glow-effect bottom-0 right-0 w-[800px] h-[800px] opacity-60" />

      <Link 
        href="/" 
        className="absolute top-10 left-10 z-20 flex items-center gap-2 text-slate-500 hover:text-primary transition-colors font-bold group"
      >
        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        Back to Home
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[460px] relative z-10"
      >
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex items-center gap-2 mb-8">
            <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-lg shadow-primary/30">
              P
            </div>
            <span className="text-3xl font-bold tracking-tight text-slate-900">
              Post<span className="text-primary">siva</span>
            </span>
          </Link>
          <h1 className="text-4xl font-black text-slate-900 mb-3">Welcome Back</h1>
          <p className="text-slate-500 font-medium">Continue your growth journey with Postsiva</p>
        </div>

        <div className="bg-white/80 backdrop-blur-xl p-8 md:p-10 rounded-[2.5rem] shadow-2xl shadow-primary/10 border border-white/60">
          <form className="space-y-6" onSubmit={handleLogin}>
            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="p-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-xs font-bold"
              >
                {error}
              </motion.div>
            )}
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-900 ml-1 uppercase tracking-wider">Email Address</label>
              <Input 
                type="email" 
                placeholder="test@gmail.com" 
                className="bg-white/50" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-sm font-bold text-slate-900 uppercase tracking-wider">Password</label>
                <Link href="#" className="text-xs font-bold text-primary hover:underline">Forgot password?</Link>
              </div>
              <Input 
                type="password" 
                placeholder="••••••••" 
                className="bg-white/50" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button 
              type="submit"
              disabled={isLoading}
              className="w-full h-16 rounded-2xl text-lg font-bold mt-2 shadow-xl shadow-primary/20"
            >
              {isLoading ? "Signing In..." : "Sign In"}
            </Button>
          </form>

          <div className="relative my-10">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white/0 px-4 text-slate-400 font-bold tracking-widest">Or continue with</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Button 
              variant="outline" 
              className="h-14 rounded-2xl gap-3 font-bold bg-white/50 border-slate-200 hover:border-primary disabled:opacity-50"
              onClick={() => loginWithGoogle()}
              disabled={isLoading || isGoogleOAuthLoading}
            >
              <Chrome className="w-5 h-5" />
              {isGoogleOAuthLoading ? 'Connecting...' : 'Google'}
            </Button>
            <Button variant="outline" className="h-14 rounded-2xl gap-3 font-bold bg-white/50 border-slate-200 hover:border-primary">
              <Github className="w-5 h-5" />
              Github
            </Button>
          </div>
        </div>

        <p className="text-center mt-10 text-slate-500 font-medium">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-primary font-bold hover:underline">
            Create an account
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
