"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";
import { motion } from "framer-motion";

function GoogleAuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("Processing Google authentication...");

  useEffect(() => {
    // Check if we're in a popup window
    const isPopup = window.opener !== null;

    // Get redirect_uri from URL params or default to /dashboard
    const redirectUri = searchParams.get("redirect_uri") || "/dashboard";
    const error = searchParams.get("error");
    const code = searchParams.get("code");

    if (error) {
      // OAuth error
      setStatus("error");
      setMessage("Authentication failed. Please try again.");
      
      if (isPopup) {
        // Notify parent window of error
        window.opener?.postMessage(
          { type: "GOOGLE_OAUTH_ERROR", error },
          window.location.origin
        );
        // Close popup after a delay
        setTimeout(() => {
          window.close();
        }, 2000);
      } else {
        // Not in popup, redirect to login
        setTimeout(() => {
          router.replace("/login");
        }, 2000);
      }
      return;
    }

    if (code) {
      // OAuth code received - backend should have processed it
      setStatus("success");
      setMessage("Authentication successful! Redirecting...");

      if (isPopup) {
        // We're in a popup - notify parent window
        window.opener?.postMessage(
          { type: "GOOGLE_OAUTH_SUCCESS", code },
          window.location.origin
        );
        
        // Close popup after short delay
        setTimeout(() => {
          window.close();
        }, 1000);
      } else {
        // Not in popup - redirect directly
        setTimeout(() => {
          router.replace(redirectUri);
        }, 1500);
      }
    } else {
      // No code or error - might still be processing
      // Check if token exists in localStorage (backend might have set it)
      const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;
      
      if (token) {
        setStatus("success");
        setMessage("Authentication successful! Redirecting...");
        
        if (isPopup) {
          window.opener?.postMessage(
            { type: "GOOGLE_OAUTH_SUCCESS" },
            window.location.origin
          );
          setTimeout(() => {
            window.close();
          }, 1000);
        } else {
          setTimeout(() => {
            router.replace(redirectUri);
          }, 1500);
        }
      } else {
        // Wait a bit more for backend to process
        setTimeout(() => {
          const finalToken = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;
          if (finalToken) {
            setStatus("success");
            setMessage("Authentication successful! Redirecting...");
            
            if (isPopup) {
              window.opener?.postMessage(
                { type: "GOOGLE_OAUTH_SUCCESS" },
                window.location.origin
              );
              setTimeout(() => {
                window.close();
              }, 1000);
            } else {
              setTimeout(() => {
                router.replace(redirectUri);
              }, 1500);
            }
          } else {
            // Still no token - might be an error
            setStatus("error");
            setMessage("Authentication failed. Please try again.");
            
            if (isPopup) {
              window.opener?.postMessage(
                { type: "GOOGLE_OAUTH_ERROR", error: "No token received" },
                window.location.origin
              );
              setTimeout(() => {
                window.close();
              }, 2000);
            } else {
              setTimeout(() => {
                router.replace("/login");
              }, 2000);
            }
          }
        }, 2000);
      }
    }
  }, [router, searchParams]);

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

