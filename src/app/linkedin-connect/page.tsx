"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useLinkedIn } from "@/hooks/linkedin";
import { useAuth } from "@/hooks/auth";
import { Button } from "@/components/ui/button";
import { Linkedin, Loader2, CheckCircle2, XCircle } from "lucide-react";

export default function LinkedInConnectPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { isConnected, isLoading, error, connectLinkedIn, checkConnection } = useLinkedIn();
  const [isConnecting, setIsConnecting] = useState(false);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthenticated, router]);

  // Check connection status on mount
  useEffect(() => {
    if (isAuthenticated) {
      checkConnection();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]); // checkConnection is stable, safe to omit

  // Redirect to dashboard if already connected
  useEffect(() => {
    if (isConnected && !isLoading) {
      // Small delay to show success state
      const timer = setTimeout(() => {
        router.replace("/dashboard/profile");
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isConnected, isLoading, router]);

  const handleConnect = async () => {
    setIsConnecting(true);
    const result = await connectLinkedIn();
    
    if (result.success && result.authUrl) {
      // Open LinkedIn OAuth in popup
      const width = 600;
      const height = 700;
      const left = (window.screen.width - width) / 2;
      const top = (window.screen.height - height) / 2;

      const popup = window.open(
        result.authUrl,
        'linkedin-oauth',
        `width=${width},height=${height},left=${left},top=${top},toolbar=no,menubar=no,scrollbars=yes,resizable=yes,location=yes,status=yes`
      );

      if (!popup) {
        alert('Popup blocked. Please allow popups for this site.');
        setIsConnecting(false);
        return;
      }

      // Poll for popup closure and check connection
      const checkPopup = setInterval(() => {
        if (popup.closed) {
          clearInterval(checkPopup);
          setIsConnecting(false);
          // Check connection status after popup closes
          checkConnection();
        }
      }, 500);

      // Timeout after 5 minutes
      setTimeout(() => {
        if (!popup.closed) {
          popup.close();
          clearInterval(checkPopup);
          setIsConnecting(false);
        }
      }, 5 * 60 * 1000);
    } else {
      setIsConnecting(false);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center p-6 overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Background Effects */}
      <div className="absolute inset-0 grid-bg opacity-20" />
      <div className="glow-effect top-0 left-0 w-[800px] h-[800px] opacity-40" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[500px] relative z-10"
      >
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-[#0077b5] rounded-3xl mb-6 shadow-xl shadow-[#0077b5]/30">
            <Linkedin className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-4xl font-black text-slate-900 mb-3">
            {isConnected ? "LinkedIn Connected!" : "Connect LinkedIn"}
          </h1>
          <p className="text-slate-600 font-medium">
            {isConnected
              ? "Your LinkedIn account is successfully connected"
              : "Connect your LinkedIn account to start posting"}
          </p>
        </div>

        <div className="bg-white/90 backdrop-blur-xl p-8 md:p-10 rounded-[2.5rem] shadow-2xl border border-white/60">
          {isLoading && !isConnected ? (
            <div className="text-center py-12">
              <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
              <p className="text-slate-600 font-medium">Checking connection status...</p>
            </div>
          ) : isConnected ? (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center py-8"
            >
              <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Successfully Connected!</h3>
              <p className="text-slate-600 mb-6">
                Redirecting to dashboard...
              </p>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <motion.div
                  className="bg-green-500 h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 2, ease: "easeInOut" }}
                />
              </div>
            </motion.div>
          ) : (
            <div className="space-y-6">
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm font-medium flex items-center gap-2"
                >
                  <XCircle className="w-5 h-5 flex-shrink-0" />
                  {error}
                </motion.div>
              )}

              <div className="space-y-4">
                <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-2xl">
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-sm font-bold">1</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 mb-1">Authorize Access</h4>
                    <p className="text-sm text-slate-600">
                      Grant permission to post on your LinkedIn account
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-2xl">
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-sm font-bold">2</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 mb-1">Secure Connection</h4>
                    <p className="text-sm text-slate-600">
                      Your credentials are stored securely on our servers
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-2xl">
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-sm font-bold">3</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 mb-1">Start Posting</h4>
                    <p className="text-sm text-slate-600">
                      Create and schedule LinkedIn posts directly from your dashboard
                    </p>
                  </div>
                </div>
              </div>

              <Button
                onClick={handleConnect}
                disabled={isConnecting || isLoading}
                className="w-full h-16 rounded-2xl text-lg font-bold bg-[#0077b5] hover:bg-[#006399] text-white shadow-xl shadow-[#0077b5]/30 disabled:opacity-50"
              >
                {isConnecting ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  <>
                    <Linkedin className="w-5 h-5 mr-2" />
                    Connect LinkedIn Account
                  </>
                )}
              </Button>
            </div>
          )}
        </div>

        <p className="text-center mt-8 text-slate-500 text-sm">
          By connecting, you agree to our{" "}
          <a href="#" className="text-primary font-bold hover:underline">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="#" className="text-primary font-bold hover:underline">
            Privacy Policy
          </a>
        </p>
      </motion.div>
    </div>
  );
}

