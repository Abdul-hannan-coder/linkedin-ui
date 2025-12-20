"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Github, Chrome, ArrowLeft, CheckCircle2 } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/hooks/auth";
import { useLinkedIn } from "@/hooks/linkedin";

export default function SignupPage() {
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const pathname = usePathname();
  const { signup, isLoading, error, isAuthenticated, clearError, loginWithGoogle, isGoogleOAuthLoading } = useAuth();
  const { isConnected, isLoading: linkedInLoading, checkConnection } = useLinkedIn();
  const redirectingRef = useRef(false);
  const lastPathnameRef = useRef(pathname);
  const linkedInCheckedRef = useRef(false);

  // Reset redirect flag when pathname changes
  useEffect(() => {
    if (lastPathnameRef.current !== pathname) {
      redirectingRef.current = false;
      linkedInCheckedRef.current = false;
      lastPathnameRef.current = pathname;
    }
  }, [pathname]);

  // Check LinkedIn connection when authenticated
  useEffect(() => {
    if (isAuthenticated && !isLoading && !linkedInCheckedRef.current) {
      linkedInCheckedRef.current = true;
      checkConnection();
    }
  }, [isAuthenticated, isLoading, checkConnection]);

  // Redirect based on LinkedIn connection status
  useEffect(() => {
    if (pathname !== "/signup" || redirectingRef.current || isLoading || linkedInLoading) return;
    
    // Check both state and localStorage as source of truth
    const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
    
    if ((isAuthenticated || token) && linkedInCheckedRef.current) {
      redirectingRef.current = true;
      // Redirect to LinkedIn connect if not connected, otherwise to dashboard
      if (!isConnected) {
        router.replace("/linkedin-connect");
      } else {
        router.replace("/dashboard/profile");
      }
    }
  }, [isAuthenticated, isLoading, isConnected, linkedInLoading, pathname, router]);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    // Don't redirect here - let the useEffect handle it after state updates
    await signup({
      full_name: fullName,
      username,
      email,
      password,
    });
  };
  return (
    <div className="min-h-screen relative flex items-center justify-center p-6 overflow-hidden">
      {/* Background with Grid and Glow */}
      <div className="absolute inset-0 grid-bg opacity-40" />
      <div className="glow-effect top-0 right-0 w-[800px] h-[800px] opacity-60" />
      <div className="glow-effect bottom-0 left-0 w-[800px] h-[800px] opacity-60" />

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
        className="w-full max-w-[500px] relative z-10"
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
          <h1 className="text-4xl font-black text-slate-900 mb-3">Create Account</h1>
          <p className="text-slate-500 font-medium">Start your 14-day free trial today.</p>
        </div>

        <div className="bg-white/80 backdrop-blur-xl p-8 md:p-10 rounded-[2.5rem] shadow-2xl shadow-primary/10 border border-white/60">
          <form className="space-y-6" onSubmit={handleSignup}>
            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="p-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-xs font-bold"
              >
                {error}
              </motion.div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-900 ml-1 uppercase tracking-wider">Full Name</label>
                <Input 
                  placeholder="John Doe" 
                  className="bg-white/50" 
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-900 ml-1 uppercase tracking-wider">Username</label>
                <Input 
                  placeholder="johndoe123" 
                  className="bg-white/50" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-900 ml-1 uppercase tracking-wider">Email Address</label>
              <Input 
                type="email" 
                placeholder="name@company.com" 
                className="bg-white/50" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-900 ml-1 uppercase tracking-wider">Password</label>
              <Input 
                type="password" 
                placeholder="••••••••" 
                className="bg-white/50" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-3 py-2">
              <div className="flex items-center gap-3 text-sm text-slate-600 font-medium">
                <div className="w-5 h-5 bg-primary/10 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                </div>
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-600 font-medium">
                <div className="w-5 h-5 bg-primary/10 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                </div>
                <span>Cancel anytime</span>
              </div>
            </div>

            <Button 
              type="submit"
              disabled={isLoading}
              className="w-full h-16 rounded-2xl text-lg font-bold mt-2 shadow-xl shadow-primary/20"
            >
              {isLoading ? "Creating Account..." : "Start Free Trial"}
            </Button>
          </form>

          <div className="relative my-10">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white/0 px-4 text-slate-400 font-bold tracking-widest">Or sign up with</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Button 
              variant="outline" 
              className="h-14 rounded-2xl gap-3 font-bold bg-white/50 border-slate-200 hover:border-primary disabled:opacity-50"
              onClick={() => loginWithGoogle('/dashboard')}
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

        <p className="text-center mt-10 text-slate-500 font-medium text-sm">
          By signing up, you agree to our{" "}
          <Link href="#" className="text-primary font-bold hover:underline">Terms</Link>
          {" "}and{" "}
          <Link href="#" className="text-primary font-bold hover:underline">Privacy Policy</Link>.
        </p>

        <p className="text-center mt-8 text-slate-500 font-medium">
          Already have an account?{" "}
          <Link href="/login" className="text-primary font-bold hover:underline">
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
