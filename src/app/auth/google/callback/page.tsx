"use client";

import { useEffect, useState, Suspense, useRef } from "react";
import { useRouter } from "next/navigation";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";
import { motion } from "framer-motion";
import { extractGoogleOAuthTokenFromUrl } from "@/hooks/auth/googleOAuth";
import { useLinkedIn } from "@/hooks/linkedin";

function GoogleAuthCallbackContent() {
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("Processing Google authentication...");
  const { isConnected, isLoading: linkedInLoading, checkConnection } = useLinkedIn();
  const linkedInCheckedRef = useRef(false);
  const redirectingRef = useRef(false);
  const tokenExtractedRef = useRef(false);
  const tokenExtractionSuccessfulRef = useRef(false);

  // Extract token from URL and check LinkedIn connection
  useEffect(() => {
    if (tokenExtractedRef.current) return; // Only extract once
    tokenExtractedRef.current = true;

    const result = extractGoogleOAuthTokenFromUrl();

    if (result.success && result.token) {
      tokenExtractionSuccessfulRef.current = true;
      setStatus("success");
      setMessage("Authentication successful! Checking LinkedIn connection...");
      
      // Check LinkedIn connection after authentication (similar to login page)
      if (!linkedInCheckedRef.current) {
        linkedInCheckedRef.current = true;
        checkConnection();
      }
    } else {
      // Error case - backend should have redirected with error parameter if there was an issue
      setStatus("error");
      setMessage("Authentication failed. Please try again.");

      setTimeout(() => {
        router.replace("/login");
      }, 2000);
    }
  }, [checkConnection, router]);

  // Redirect based on LinkedIn connection status (similar to login page)
  useEffect(() => {
    // Only redirect if token was successfully extracted and we haven't redirected yet
    if (!tokenExtractionSuccessfulRef.current || redirectingRef.current) return;

    // Wait for LinkedIn check to complete
    if (linkedInLoading || !linkedInCheckedRef.current) return;

    redirectingRef.current = true;
    setMessage("Redirecting...");

    // Redirect based on LinkedIn connection status (just like in simple auth)
    // If isConnected is true, go to dashboard/profile; if false, go to LinkedIn connect
    if (isConnected) {
      router.replace("/dashboard/profile");
    } else {
      router.replace("/linkedin-connect");
    }
  }, [isConnected, linkedInLoading, router]);

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

