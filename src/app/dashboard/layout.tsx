"use client";

import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { useAuth } from "@/hooks/auth";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const redirectingRef = useRef(false);
  const lastPathnameRef = useRef(pathname);

  // Reset redirect flag when pathname changes
  useEffect(() => {
    if (lastPathnameRef.current !== pathname) {
      redirectingRef.current = false;
      lastPathnameRef.current = pathname;
    }
  }, [pathname]);

  useEffect(() => {
    // Don't redirect if already redirecting or still loading
    if (redirectingRef.current || isLoading || !pathname?.startsWith("/dashboard")) return;
    
    // Check localStorage as source of truth
    const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
    const hasToken = !!token;
    
    // If no token and not authenticated, redirect to login
    if (!hasToken && !isAuthenticated) {
      redirectingRef.current = true;
      router.replace("/login");
    }
  }, [isLoading, isAuthenticated, pathname, router]);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#F4F9FF]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render dashboard if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex h-screen bg-[#F4F9FF] overflow-hidden">
      <DashboardSidebar />
      <main className="flex-1 overflow-y-auto relative custom-scrollbar">
        {children}
      </main>
    </div>
  );
}
