"use client";

import { motion } from "framer-motion";
import { Mail, MessageSquare, Phone, Send } from "lucide-react";
import { Button } from "./ui/button";
import { Input, Textarea } from "./ui/input";

export default function ContactUs() {
  return (
    <section id="contact" className="py-20 bg-slate-50 relative overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-15" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-12">
            {/* Left Side: Info */}
            <div className="flex-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                  Get in <span className="text-primary">Touch</span>
                </h2>
                <p className="text-lg text-slate-600 mb-8">
                  Ready to amplify your LinkedIn presence? Our team is here to help you get started with Postsiva.
                </p>

                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900 uppercase tracking-wider">Email Us</div>
                      <div className="text-slate-600 text-sm">hello@postsiva.com</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                      <MessageSquare className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900 uppercase tracking-wider">Live Chat</div>
                      <div className="text-slate-600 text-sm">Available Mon-Fri, 9am-6pm EST</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900 uppercase tracking-wider">Call Us</div>
                      <div className="text-slate-600 text-sm">+1 (555) 000-0000</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Right Side: Form */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="flex-1"
            >
              <div className="bg-white p-6 md:p-8 rounded-[2rem] shadow-xl shadow-primary/5 border border-slate-100">
                <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-900 ml-1">First Name</label>
                      <Input placeholder="John" className="h-12 text-sm" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-900 ml-1">Last Name</label>
                      <Input placeholder="Doe" className="h-12 text-sm" />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-900 ml-1">Email Address</label>
                    <Input type="email" placeholder="john@company.com" className="h-12 text-sm" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-900 ml-1">Message</label>
                    <Textarea placeholder="How can we help you grow?" className="min-h-[100px] text-sm" />
                  </div>
                  <Button className="w-full h-14 text-base rounded-xl group relative overflow-hidden">
                    <span className="relative z-10 flex items-center gap-2">
                      Send Message
                      <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </span>
                  </Button>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
