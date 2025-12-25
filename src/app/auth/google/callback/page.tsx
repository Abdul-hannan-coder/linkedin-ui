"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter } from "next/navigation";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";
import { motion } from "framer-motion";
import { extractGoogleOAuthTokenFromUrl } from "@/hooks/auth/googleOAuth";

function GoogleAuthCallbackContent() {
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("Processing Google authentication...");

  useEffect(() => {
    // According to the documented flow, backend redirects to frontend with:
    // ?token={JWT}&user={username}&email={email}&success=true
    
    const result = extractGoogleOAuthTokenFromUrl();

    if (result.success && result.token) {
      setStatus("success");
      setMessage("Authentication successful! Redirecting...");

      // According to the documented flow, backend redirects directly to redirect_path
      // But if we're on the callback page, redirect to dashboard
      setTimeout(() => {
        router.replace("/dashboard");
      }, 1500);
    } else {
      // Error case - backend should have redirected with error parameter if there was an issue
      setStatus("error");
      setMessage("Authentication failed. Please try again.");

      setTimeout(() => {
        router.replace("/login");
      }, 2000);
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-white to-primary/5 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 max-w-md w-full text-center"
      >
        {status === "loading" && (
          <>
            <div className="w-16 h-16 mx-auto mb-6 bg-primary/10 rounded-full flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
            <h2 className="text-2xl font-black text-slate-900 mb-2">Processing...</h2>
            <p className="text-slate-600 font-bold">{message}</p>
          </>
        )}

        {status === "success" && (
          <>
            <div className="w-16 h-16 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-black text-slate-900 mb-2">Success!</h2>
            <p className="text-slate-600 font-bold">{message}</p>
          </>
        )}

        {status === "error" && (
          <>
            <div className="w-16 h-16 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
              <XCircle className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-2xl font-black text-slate-900 mb-2">Error</h2>
            <p className="text-slate-600 font-bold">{message}</p>
          </>
        )}
      </motion.div>
    </div>
  );
}

export default function GoogleAuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-primary/5 via-white to-primary/5 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 max-w-md w-full text-center"
          >
            <div className="w-16 h-16 mx-auto mb-6 bg-primary/10 rounded-full flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
            <h2 className="text-2xl font-black text-slate-900 mb-2">Loading...</h2>
            <p className="text-slate-600 font-bold">Processing authentication...</p>
          </motion.div>
        </div>
      }
    >
      <GoogleAuthCallbackContent />
    </Suspense>
  );
}

