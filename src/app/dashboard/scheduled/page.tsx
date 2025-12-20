"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Clock, 
  Calendar, 
  Plus, 
  FileText, 
  X, 
  Image as ImageIcon, 
  Copy, 
  Video, 
  Check, 
  Globe, 
  ThumbsUp,
  MessageSquare,
  Repeat2,
  Send as SendIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type PostType = "text" | "image" | "carousel" | "video";

export default function ScheduledPage() {
  const [showModal, setShowModal] = useState(false);
  const [postType, setPostType] = useState<PostType>("text");
  const [content, setContent] = useState("");
  const [visibility, setVisibility] = useState("public");

  const timeSlots = [
    { time: "9:00 AM", status: "empty" },
    { time: "12:00 PM", status: "empty" },
    { time: "3:00 PM", status: "empty" },
    { time: "6:00 PM", status: "empty" },
    { time: "9:00 PM", status: "string" },
    { time: "Custom Time", status: "empty" },
  ];

  const days = [
    { day: "Tuesday, November 4", slots: timeSlots },
    { day: "Thursday, November 6", slots: timeSlots },
  ];

  return (
    <div className="p-4 md:p-10 max-w-[1400px] mx-auto min-h-screen pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 mb-2 tracking-tight">Scheduled Posts</h1>
          <p className="text-sm md:text-base text-slate-500 font-bold">Manage your scheduled LinkedIn posts</p>
        </div>
        <Button 
          onClick={() => setShowModal(true)}
          className="h-12 px-8 rounded-xl gap-3 font-black shadow-xl shadow-primary/20"
        >
          <Plus className="w-5 h-5" />
          New
        </Button>
      </div>

      <div className="space-y-12">
        {/* Your Scheduled Posts Empty State */}
        <section>
          <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-6 ml-1 flex items-center gap-2">
            Your Scheduled Posts
          </h3>
          <div className="bg-white rounded-[2rem] p-12 shadow-xl shadow-primary/5 border border-slate-100 flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
              <Clock className="w-10 h-10 text-slate-300" />
            </div>
            <h3 className="text-xl font-black text-slate-900 mb-2">No scheduled or failed posts found</h3>
            <p className="text-slate-400 font-bold text-sm">Schedule a post to see it here</p>
          </div>
        </section>

        {/* Schedule New Post Section */}
        <section>
          <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-8 ml-1">Schedule New Post</h3>
          
          <div className="space-y-12">
            {days.map((day, dIdx) => (
              <div key={dIdx} className="space-y-6">
                <div className="flex items-center gap-4">
                  <h4 className="text-lg font-black text-slate-900">{day.day}</h4>
                  <div className="h-px flex-1 bg-slate-100" />
                </div>
                
                <div className="grid grid-cols-1 gap-3">
                  {day.slots.map((slot, sIdx) => (
                    <div 
                      key={sIdx}
                      className="group bg-white rounded-2xl p-4 border border-slate-100 shadow-sm hover:shadow-md hover:border-primary/20 transition-all flex items-center justify-between"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 font-bold text-xs group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                          {slot.time.split(' ')[0]}
                        </div>
                        <span className="font-bold text-slate-600 uppercase text-xs tracking-widest">{slot.time}</span>
                      </div>
                      
                      <button 
                        onClick={() => setShowModal(true)}
                        className={cn(
                          "h-10 px-5 rounded-lg border flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all",
                          slot.status === "string" 
                            ? "bg-slate-100 border-slate-200 text-slate-400" 
                            : "bg-white border-slate-100 text-primary hover:border-primary hover:bg-primary/5"
                        )}
                      >
                        {slot.status === "string" ? "string" : (
                          <>
                            <Plus className="w-3.5 h-3.5" />
                            New
                          </>
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Create Post Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-5xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              {/* Header */}
              <div className="p-6 md:p-8 border-b border-slate-100 flex items-center justify-between">
                <h2 className="text-2xl font-black text-slate-900">Create Post</h2>
                <button 
                  onClick={() => setShowModal(false)}
                  className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-900 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Body */}
              <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar">
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-10 items-start">
                  <div className="space-y-8">
                    {/* Post Type */}
                    <section>
                      <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 ml-1">Post Type</h3>
                      <div className="grid grid-cols-2 gap-3">
                        {[
                          { id: "text", title: "Text", icon: FileText },
                          { id: "image", title: "Image", icon: ImageIcon },
                          { id: "carousel", title: "Carousel", icon: Copy },
                          { id: "video", title: "Video", icon: Video },
                        ].map((type) => {
                          const isActive = postType === type.id;
                          return (
                            <button
                              key={type.id}
                              onClick={() => setPostType(type.id as PostType)}
                              className={cn(
                                "flex items-center gap-3 p-4 rounded-xl border-2 transition-all duration-300 relative",
                                isActive 
                                  ? "bg-primary/5 border-primary shadow-sm" 
                                  : "bg-white border-slate-100 hover:border-primary/30"
                              )}
                            >
                              <type.icon className={cn("w-5 h-5", isActive ? "text-primary" : "text-slate-400")} />
                              <span className={cn("font-bold text-sm", isActive ? "text-slate-900" : "text-slate-500")}>{type.title}</span>
                              {isActive && (
                                <div className="absolute top-2 right-2 w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                                  <Check className="w-2.5 h-2.5 text-white" />
                                </div>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </section>

                    {/* Post Content */}
                    <section>
                      <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 ml-1">Post Content</h3>
                      <Textarea 
                        placeholder="What do you want to share?"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="min-h-[180px] text-lg rounded-2xl bg-slate-50/50 border-slate-100 focus:border-primary/30 p-6"
                      />
                      <div className="flex justify-between items-center mt-2 px-1">
                        <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{content.length}/3000 characters</span>
                      </div>
                    </section>

                    {/* Visibility */}
                    <section>
                      <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 ml-1">Visibility</h3>
                      <select 
                        value={visibility}
                        onChange={(e) => setVisibility(e.target.value)}
                        className="w-full h-12 bg-slate-50/50 rounded-xl border-2 border-slate-100 px-4 text-sm font-bold text-slate-900 outline-none"
                      >
                        <option value="public">Public - Anyone on LinkedIn</option>
                        <option value="connections">Connections - Only your connections</option>
                      </select>
                    </section>

                    {/* Scheduled Time */}
                    <section>
                      <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 ml-1 flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5" />
                        Scheduled Time
                      </h3>
                      <div className="h-12 bg-slate-50/50 rounded-xl border-2 border-slate-100 px-4 flex items-center justify-between">
                        <span className="font-bold text-sm text-slate-900">12/18/2025 10:04 PM</span>
                        <Calendar className="w-4 h-4 text-slate-400" />
                      </div>
                    </section>
                  </div>

                  {/* Preview Column */}
                  <div className="hidden lg:block space-y-6">
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 ml-1">Preview</h3>
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-xl overflow-hidden pointer-events-none opacity-80">
                       <div className="p-3 flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 font-bold text-xs">MU</div>
                          <div className="flex-1">
                            <div className="flex items-center gap-1">
                              <span className="font-black text-slate-900 text-[10px]">Muhammad Uzair Yasin</span>
                              <span className="text-slate-400 text-[8px]">• Just now</span>
                            </div>
                            <div className="flex items-center gap-1 text-slate-400">
                              <Globe className="w-2 h-2" />
                              <span className="text-[8px] font-bold uppercase tracking-wider">Anyone</span>
                            </div>
                          </div>
                       </div>
                       <div className="px-3 pb-3">
                         <p className="text-slate-900 text-[10px] leading-relaxed line-clamp-4">
                           {content || "Start typing to see preview..."}
                         </p>
                       </div>
                       <div className="px-2 py-1 border-t border-slate-50 flex items-center justify-between">
                          {[{icon: ThumbsUp, label: "Like"}, {icon: MessageSquare, label: "Comment"}, {icon: Repeat2, label: "Repost"}, {icon: SendIcon, label: "Send"}].map((btn, i) => (
                            <div key={i} className="flex flex-1 items-center justify-center gap-1.5 p-2 text-slate-400 font-bold text-[8px]">
                              <btn.icon className="w-3 h-3" />
                              {btn.label}
                            </div>
                          ))}
                       </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="p-6 md:p-8 border-t border-slate-100 flex items-center justify-end gap-4 bg-slate-50/30">
                <Button 
                  variant="outline" 
                  onClick={() => setShowModal(false)}
                  className="h-12 px-8 rounded-xl font-bold border-slate-200 text-slate-500 hover:bg-slate-100"
                >
                  Cancel
                </Button>
                <Button className="h-12 px-8 rounded-xl font-black gap-2 shadow-lg shadow-primary/20">
                  <Calendar className="w-4 h-4" />
                  Schedule Post
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
