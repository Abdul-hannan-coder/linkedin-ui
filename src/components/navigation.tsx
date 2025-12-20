'use client';

import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import Link from 'next/link';
import AuthModal from '@/components/auth-modal';

export default function Navigation() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-md z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-3 sm:py-4 flex items-center justify-between">
          {/* Logo + Rounded Facebook Icon */}
          <div className="flex items-center space-x-2 sm:space-x-2.5">
            <Link
              href="/"
              className="w-8 h-8 sm:w-9 sm:h-9 md:w-8 md:h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center shadow-lg shadow-purple-300/40 hover:shadow-purple-300/60 transition-shadow touch-manipulation"
              aria-label="Postsiva"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-4 w-4 sm:h-5 sm:w-5 text-white fill-current">
                <path d="M22 12c0-5.522-4.477-10-10-10S2 6.478 2 12c0 5 3.657 9.127 8.438 9.876v-6.987h-2.54V12h2.54v-1.555c0-2.507 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.463H15.61c-1.234 0-1.619.766-1.619 1.553V12h2.754l-.44 2.889h-2.314v6.987C18.343 21.127 22 17 22 12"/>
              </svg>
            </Link>
            <span className="text-lg sm:text-xl md:text-xl lg:text-2xl font-bold shadow-2xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Postsiva
            </span>
          </div>

          {/* Medium Screen - Centered Links */}
          <div className="hidden md:flex lg:hidden items-center justify-center flex-1 gap-4 md:gap-5 mx-4 md:mx-6">
            <Link href="/features" className="text-gray-700 hover:text-blue-600 transition text-sm md:text-base font-medium py-1 px-2 rounded-lg hover:bg-gray-50 active:bg-gray-100 touch-manipulation min-h-[44px] flex items-center">
              Features
            </Link>
            <Link href="/about" className="text-gray-700 hover:text-blue-600 transition text-sm md:text-base font-medium py-1 px-2 rounded-lg hover:bg-gray-50 active:bg-gray-100 touch-manipulation min-h-[44px] flex items-center">
              About Us
            </Link>
            <Link href="/contact" className="text-gray-700 hover:text-blue-600 transition text-sm md:text-base font-medium py-1 px-2 rounded-lg hover:bg-gray-50 active:bg-gray-100 touch-manipulation min-h-[44px] flex items-center">
              Contact Us
            </Link>
          </div>

          {/* Desktop Links and CTA */}
          <div className="hidden lg:flex items-center gap-6 xl:gap-8">
            <Link href="/features" className="text-gray-700 hover:text-blue-600 transition text-sm xl:text-base font-medium py-1 px-2 rounded-lg hover:bg-gray-50 active:bg-gray-100">
              Features
            </Link>
            <Link href="/about" className="text-gray-700 hover:text-blue-600 transition text-sm xl:text-base font-medium py-1 px-2 rounded-lg hover:bg-gray-50 active:bg-gray-100">
              About Us
            </Link>
            <Link href="/contact" className="text-gray-700 hover:text-blue-600 transition text-sm xl:text-base font-medium py-1 px-2 rounded-lg hover:bg-gray-50 active:bg-gray-100">
              Contact Us
            </Link>
          </div>

          {/* CTA Button - Medium and Desktop */}
          <div className="hidden md:flex items-center ml-2 md:ml-4">
            <Link
              href="/login"
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 md:px-5 lg:px-6 py-2 md:py-2.5 rounded-lg hover:shadow-lg hover:shadow-purple-300/40 active:shadow-purple-300/50 transition-all font-medium text-xs sm:text-sm touch-manipulation min-h-[44px] flex items-center justify-center whitespace-nowrap"
            >
              Get a Demo
            </Link>
          </div>

          {/* Mobile Hamburger Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2.5 rounded-lg hover:bg-gray-100 active:bg-gray-200 transition-colors touch-manipulation min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Toggle menu"
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? (
              <X size={24} className="text-gray-700" />
            ) : (
              <Menu size={24} className="text-gray-700" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 sm:py-5 border-t border-gray-200">
            <nav className="flex flex-col space-y-3 sm:space-y-4 px-3 sm:px-4">
              <Link
                href="/features"
                className="text-gray-700 hover:text-blue-600 active:text-blue-700 pb-1.5 sm:pb-2 border-b-2 border-transparent hover:border-blue-600 active:border-blue-700 transition-all font-medium text-base sm:text-lg py-2 sm:py-2.5 min-h-[44px] sm:min-h-[48px] flex items-center touch-manipulation"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Features
              </Link>
              <Link
                href="/about"
                className="text-gray-700 hover:text-blue-600 active:text-blue-700 pb-1.5 sm:pb-2 border-b-2 border-transparent hover:border-blue-600 active:border-blue-700 transition-all font-medium text-base sm:text-lg py-2 sm:py-2.5 min-h-[44px] sm:min-h-[48px] flex items-center touch-manipulation"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                About Us
              </Link>
              <Link
                href="/contact"
                className="text-gray-700 hover:text-blue-600 active:text-blue-700 pb-1.5 sm:pb-2 border-b-2 border-transparent hover:border-blue-600 active:border-blue-700 transition-all font-medium text-base sm:text-lg py-2 sm:py-2.5 min-h-[44px] sm:min-h-[48px] flex items-center touch-manipulation"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Contact Us
              </Link>
              <div className="flex flex-col space-y-2.5 sm:space-y-3 pt-4 sm:pt-5 border-t border-gray-200">
                <Link
                  href="/login"
                  className="w-full border-2 border-gray-300 text-gray-700 hover:border-blue-600 hover:text-blue-600 active:border-blue-700 active:text-blue-700 px-4 sm:px-5 py-2.5 sm:py-3 rounded-lg transition-all text-base sm:text-lg font-medium text-center min-h-[44px] sm:min-h-[48px] flex items-center justify-center touch-manipulation"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 active:from-blue-800 active:to-purple-800 text-white px-4 sm:px-5 py-2.5 sm:py-3 rounded-lg hover:shadow-lg hover:shadow-purple-300/40 active:shadow-purple-300/50 transition-all text-base sm:text-lg font-medium text-center min-h-[44px] sm:min-h-[48px] flex items-center justify-center touch-manipulation"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </div>
            </nav>
          </div>
        )}
      </nav>

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </>
  );
}
