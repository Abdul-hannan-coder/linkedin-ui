"use client";

import Link from "next/link";
import { Twitter, Linkedin, Mail, Github } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-white py-20 border-t border-slate-100">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white font-bold text-2xl shadow-lg shadow-primary/30">
                P
              </div>
              <span className="text-2xl font-bold tracking-tight text-slate-900">
                Post<span className="text-primary">siva</span>
              </span>
            </Link>
            <p className="text-slate-500 leading-relaxed max-w-xs">
              Automate and amplify your digital voice with the world&apos;s most advanced LinkedIn automation platform.
            </p>
            <div className="flex gap-4">
              {[Twitter, Github, Linkedin, Mail].map((Icon, i) => (
                <Link 
                  key={i} 
                  href="#" 
                  className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-primary/10 hover:text-primary transition-all"
                >
                  <Icon className="w-5 h-5" />
                </Link>
              ))}
            </div>
          </div>

          {/* Product */}
          <div className="space-y-6">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest">Product</h3>
            <ul className="space-y-4">
              {["Features", "Integrations", "Pricing", "Security", "Changelog"].map((item) => (
                <li key={item}>
                  <Link href={item === "Features" ? "/features" : "#"} className="text-slate-500 hover:text-primary transition-colors">{item}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div className="space-y-6">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest">Company</h3>
            <ul className="space-y-4">
              {["About Us", "Our Story", "Careers", "Press Kit", "Contact"].map((item) => (
                <li key={item}>
                  <Link href={item === "About Us" ? "/about" : "#"} className="text-slate-500 hover:text-primary transition-colors">{item}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-6">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest">Resources</h3>
            <ul className="space-y-4">
              {["Documentation", "API Reference", "Guides", "Support", "Status"].map((item) => (
                <li key={item}>
                  <Link href="#" className="text-slate-500 hover:text-primary transition-colors">{item}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-20 pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-slate-400 text-sm font-medium">
            © 2025 Postsiva Inc. All rights reserved.
          </p>
          <div className="flex gap-8">
            <Link href="#" className="text-slate-400 hover:text-primary text-sm font-medium transition-colors">Privacy Policy</Link>
            <Link href="#" className="text-slate-400 hover:text-primary text-sm font-medium transition-colors">Terms of Service</Link>
            <Link href="#" className="text-slate-400 hover:text-primary text-sm font-medium transition-colors">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
