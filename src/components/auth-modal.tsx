'use client';

import { useState, useEffect } from 'react';
import { Mail, Lock, User, X, Chrome, Facebook, Github, Linkedin } from 'lucide-react';
import { useAuth } from '@/hooks/auth';
import { useRouter } from 'next/navigation';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    username: '',
    email: '',
    password: '',
  });
  const router = useRouter();
  const { login, signup, isLoading, error, isAuthenticated, clearError, loginWithGoogle, isGoogleOAuthLoading } = useAuth();

  // Close modal and redirect if authenticated
  useEffect(() => {
    if (isAuthenticated && !isLoading && isOpen) {
      onClose();
      router.replace('/dashboard/profile');
    }
  }, [isAuthenticated, isLoading, isOpen, onClose, router]);

  // Clear error when switching between login/signup
  useEffect(() => {
    clearError();
  }, [isLogin, clearError]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    if (isLogin) {
      await login({ email: formData.email, password: formData.password });
    } else {
      await signup({
        full_name: formData.full_name,
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      {/* Modal Container */}
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 min-h-full md:min-h-[600px]">
          
          {/* Left Section - Form */}
          <div className="p-8 md:p-10 flex flex-col justify-center order-2 md:order-1">
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition"
              aria-label="Close modal"
            >
              <X size={24} />
            </button>

            {/* Form Title */}
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              {isLogin ? 'Login' : 'Registration'}
            </h2>

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm font-medium">
                {error}
              </div>
            )}

            {/* Form Fields */}
            <form onSubmit={handleSubmit} className="space-y-4 mb-6">
              {!isLogin && (
                <>
                  <div className="relative">
                    <input
                      type="text"
                      name="full_name"
                      placeholder="Full Name"
                      value={formData.full_name}
                      onChange={handleInputChange}
                      className="w-full bg-gray-100 rounded-xl px-5 py-3 placeholder-gray-500 text-gray-900 outline-none focus:ring-2 focus:ring-blue-500 transition"
                      required
                    />
                    <User className="absolute right-4 top-3.5 text-gray-400" size={20} />
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      name="username"
                      placeholder="Username"
                      value={formData.username}
                      onChange={handleInputChange}
                      className="w-full bg-gray-100 rounded-xl px-5 py-3 placeholder-gray-500 text-gray-900 outline-none focus:ring-2 focus:ring-blue-500 transition"
                      required
                    />
                    <User className="absolute right-4 top-3.5 text-gray-400" size={20} />
                  </div>
                </>
              )}

              <div className="relative">
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full bg-gray-100 rounded-xl px-5 py-3 placeholder-gray-500 text-gray-900 outline-none focus:ring-2 focus:ring-blue-500 transition"
                  required
                />
                <Mail className="absolute right-4 top-3.5 text-gray-400" size={20} />
              </div>

              <div className="relative">
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full bg-gray-100 rounded-xl px-5 py-3 placeholder-gray-500 text-gray-900 outline-none focus:ring-2 focus:ring-blue-500 transition"
                  required
                />
                <Lock className="absolute right-4 top-3.5 text-gray-400" size={20} />
              </div>

              {isLogin && (
                <div className="text-right">
                  <a href="#" className="text-gray-600 hover:text-blue-600 text-sm font-medium transition">
                    Forgot Password?
                  </a>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold py-3 rounded-xl hover:shadow-lg hover:shadow-blue-500/40 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (isLogin ? 'Logging in...' : 'Creating account...') : (isLogin ? 'Login' : 'Register')}
              </button>
            </form>

            {/* Social Divider */}
            <div className="flex items-center gap-3 mb-6">
              <div className="flex-1 h-px bg-gray-200"></div>
              <span className="text-gray-500 text-sm">or {isLogin ? 'login' : 'register'} with other platforms</span>
              <div className="flex-1 h-px bg-gray-200"></div>
            </div>

            {/* Social Login Buttons */}
            <div className="grid grid-cols-4 gap-3 mb-6">
              <button 
                className="bg-white border-2 border-gray-300 rounded-xl p-3 hover:border-blue-400 hover:bg-blue-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => loginWithGoogle()}
                disabled={isLoading || isGoogleOAuthLoading}
                title="Sign in with Google"
              >
                <Chrome className="text-gray-800 mx-auto" size={24} />
              </button>
              <button className="bg-white border-2 border-gray-300 rounded-xl p-3 hover:border-blue-400 hover:bg-blue-50 transition">
                <Facebook className="text-gray-800 mx-auto" size={24} />
              </button>
              <button className="bg-white border-2 border-gray-300 rounded-xl p-3 hover:border-blue-400 hover:bg-blue-50 transition">
                <Github className="text-gray-800 mx-auto" size={24} />
              </button>
              <button className="bg-white border-2 border-gray-300 rounded-xl p-3 hover:border-blue-400 hover:bg-blue-50 transition">
                <Linkedin className="text-gray-800 mx-auto" size={24} />
              </button>
            </div>

            {/* Toggle Auth Mode */}
            <p className="text-center text-gray-600 text-sm">
              {isLogin ? "Don't have an account? " : 'Already have an account? '}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-blue-600 font-semibold hover:text-blue-700 transition"
              >
                {isLogin ? 'Register' : 'Login'}
              </button>
            </p>
          </div>

          {/* Right Section - Curved Gradient */}
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-8 md:p-10 flex flex-col justify-center items-center text-white rounded-full md:rounded-none order-1 md:order-2 relative overflow-hidden">
            {/* Decorative gradient circle */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-400 via-blue-500 to-purple-600 opacity-50"></div>
            
            <div className="relative z-10 text-center space-y-6">
              <h3 className="text-3xl font-bold leading-tight">
                {isLogin ? "Don't have an account?" : 'Hello, Welcome!'}
              </h3>
              <p className="text-blue-100 text-lg">
                {isLogin ? 'Join thousands of users managing their finances efficiently.' : 'Already have an account?'}
              </p>
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="inline-block px-8 py-3 border-2 border-white text-white font-semibold rounded-xl hover:bg-white hover:text-blue-600 transition duration-300"
              >
                {isLogin ? 'Register' : 'Login'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
