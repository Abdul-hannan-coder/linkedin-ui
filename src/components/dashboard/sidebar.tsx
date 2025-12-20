"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { 
  User, 
  FileText, 
  Database, 
  Clock, 
  LogOut,
  Menu,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

const menuItems = [
  {
    title: "My Profile",
    icon: User,
    href: "/dashboard/profile",
  },
  {
    title: "Post",
    icon: FileText,
    href: "/dashboard/post",
  },
  {
    title: "Storage",
    icon: Database,
    href: "/dashboard/storage",
  },
  {
    title: "Scheduled Posts",
    icon: Clock,
    href: "/dashboard/scheduled",
  },
];

export const DashboardSidebar = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile Menu Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 right-4 z-[60] lg:hidden w-10 h-10 bg-white rounded-xl shadow-lg border border-slate-100 flex items-center justify-center text-slate-600"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Overlay */}
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-[50] lg:hidden"
        />
      )}

      <div className={cn(
        "fixed inset-y-0 left-0 z-[55] w-64 bg-white border-r border-slate-100 flex flex-col p-5 transition-transform duration-300 lg:translate-x-0 lg:static lg:h-screen",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <Link href="/" className="flex items-center gap-2.5 mb-10 ml-1">
          <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-primary/30">
            P
          </div>
          <span className="text-xl font-black text-slate-900 tracking-tight">
            Post<span className="text-primary">siva</span>
          </span>
        </Link>

        <nav className="flex-1 space-y-1">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.href} 
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="block relative"
              >
                <div className={cn(
                  "flex items-center gap-3.5 px-4 py-3.5 rounded-xl transition-all duration-200 group",
                  isActive ? "bg-primary/10 text-primary" : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                )}>
                  <item.icon className={cn(
                    "w-5 h-5 transition-transform duration-200",
                    isActive ? "scale-110" : "group-hover:scale-110"
                  )} />
                  <span className="font-bold text-sm">{item.title}</span>
                  
                  {isActive && (
                    <motion.div 
                      layoutId="active-pill"
                      className="absolute left-0 w-1 h-6 bg-primary rounded-r-full"
                    />
                  )}
                </div>
              </Link>
            );
          })}
        </nav>

        <div className="pt-5 border-t border-slate-100">
          <button 
            onClick={() => window.location.href = "/login"}
            className="w-full flex items-center gap-3.5 px-4 py-3.5 rounded-xl text-red-500 hover:bg-red-50 transition-colors group"
          >
            <LogOut className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            <span className="font-bold text-sm">Logout</span>
          </button>
        </div>
      </div>
    </>
  );
};
