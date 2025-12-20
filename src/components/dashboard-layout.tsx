'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Upload,
  Settings,
  LogOut,
  Menu,
  X,
  BarChart3,
} from 'lucide-react';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();

  const menuItems = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/dashboard/analytics', label: 'Analytics', icon: BarChart3 },
    { href: '/dashboard/upload', label: 'Upload', icon: Upload },
    { href: '/dashboard/settings', label: 'Settings', icon: Settings },
  ];

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === '/dashboard';
    }
    return pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white border-b border-gray-200 px-3 sm:px-4 py-3 sm:py-4 flex items-center justify-between sticky top-0 z-50 shadow-sm">
        <Link href="/" className="flex items-center space-x-2 sm:space-x-2.5 touch-manipulation" onClick={() => setIsSidebarOpen(false)}>
          <div className="w-8 h-8 sm:w-9 sm:h-9 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center shadow-lg shadow-purple-300/40">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-4 w-4 sm:h-5 sm:w-5 text-white fill-current">
              <path d="M22 12c0-5.522-4.477-10-10-10S2 6.478 2 12c0 5 3.657 9.127 8.438 9.876v-6.987h-2.54V12h2.54v-1.555c0-2.507 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.463H15.61c-1.234 0-1.619.766-1.619 1.553V12h2.754l-.44 2.889h-2.314v6.987C18.343 21.127 22 17 22 12"/>
            </svg>
          </div>
          <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Postsiva
          </span>
        </Link>
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2.5 sm:p-3 rounded-lg hover:bg-gray-100 active:bg-gray-200 transition-colors touch-manipulation min-h-[44px] min-w-[44px] flex items-center justify-center"
          aria-label="Toggle menu"
          aria-expanded={isSidebarOpen}
        >
          {isSidebarOpen ? <X size={24} className="text-gray-700" /> : <Menu size={24} className="text-gray-700" />}
        </button>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`
            fixed lg:sticky top-0 left-0 z-40 h-screen w-72 sm:w-80 lg:w-64 bg-white border-r border-gray-200 transition-transform duration-300 ease-in-out shadow-xl lg:shadow-none
            ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          `}
        >
          <div className="h-full flex flex-col overflow-hidden">
            {/* Mobile Logo */}
            <div className="lg:hidden flex items-center justify-between px-4 sm:px-5 py-4 sm:py-5 border-b border-gray-200 shrink-0">
              <Link href="/" className="flex items-center space-x-2 sm:space-x-2.5" onClick={() => setIsSidebarOpen(false)}>
                <div className="w-8 h-8 sm:w-9 sm:h-9 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center shadow-lg shadow-purple-300/40">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-4 w-4 sm:h-5 sm:w-5 text-white fill-current">
                    <path d="M22 12c0-5.522-4.477-10-10-10S2 6.478 2 12c0 5 3.657 9.127 8.438 9.876v-6.987h-2.54V12h2.54v-1.555c0-2.507 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.463H15.61c-1.234 0-1.619.766-1.619 1.553V12h2.754l-.44 2.889h-2.314v6.987C18.343 21.127 22 17 22 12"/>
                  </svg>
                </div>
                <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Postsiva
                </span>
              </Link>
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="p-2 sm:p-2.5 rounded-lg hover:bg-gray-100 active:bg-gray-200 transition-colors touch-manipulation min-h-[44px] min-w-[44px] flex items-center justify-center lg:hidden"
                aria-label="Close menu"
              >
                <X size={20} className="text-gray-700" />
              </button>
            </div>

            {/* Desktop Logo */}
            <div className="hidden lg:flex items-center space-x-2 p-6 border-b border-gray-200 shrink-0">
              <Link href="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center shadow-lg shadow-purple-300/40">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-4 w-4 text-white fill-current">
                    <path d="M22 12c0-5.522-4.477-10-10-10S2 6.478 2 12c0 5 3.657 9.127 8.438 9.876v-6.987h-2.54V12h2.54v-1.555c0-2.507 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.463H15.61c-1.234 0-1.619.766-1.619 1.553V12h2.754l-.44 2.889h-2.314v6.987C18.343 21.127 22 17 22 12"/>
                  </svg>
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Postsiva
                </span>
              </Link>
            </div>

            {/* Navigation - Scrollable */}
            <nav className="flex-1 p-3 sm:p-4 lg:p-4 space-y-1 sm:space-y-2 overflow-y-auto overscroll-contain min-h-0">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsSidebarOpen(false)}
                    className={`
                      flex items-center space-x-3 px-3 sm:px-4 py-3 sm:py-3 rounded-lg transition-all duration-200 touch-manipulation
                      min-h-[44px] sm:min-h-[48px]
                      ${
                        active
                          ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-purple-300/40'
                          : 'text-gray-700 hover:bg-gray-100 active:bg-gray-200'
                      }
                    `}
                  >
                    <Icon size={20} className="shrink-0" />
                    <span className="font-medium text-sm sm:text-base">{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Footer - Always Visible at Bottom */}
            <div className="p-3 sm:p-4 lg:p-4 border-t border-gray-200 shrink-0 bg-white">
              <button 
                onClick={() => setIsSidebarOpen(false)}
                className="w-full flex items-center justify-center space-x-3 px-3 sm:px-4 py-3 sm:py-3 rounded-lg text-red-600 hover:bg-red-50 active:bg-red-100 transition touch-manipulation min-h-[44px] sm:min-h-[48px] font-medium text-sm sm:text-base"
              >
                <LogOut size={20} className="shrink-0" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </aside>

        {/* Overlay for mobile */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-30 lg:hidden backdrop-blur-sm transition-opacity duration-300"
            onClick={() => setIsSidebarOpen(false)}
            aria-hidden="true"
          />
        )}

        {/* Main Content */}
        <main className="flex-1 min-h-screen">
          <div className="p-4 sm:p-6 lg:p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

