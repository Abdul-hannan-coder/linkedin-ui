"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FileText, 
  Image as ImageIcon, 
  Copy, 
  Video, 
  Check, 
  Upload, 
  MoreHorizontal, 
  ThumbsUp, 
  MessageSquare, 
  Repeat2, 
  Send as SendIcon,
  Globe,
  Users,
  Sparkles,
  Database,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/input";
import Image from "next/image";
import { cn } from "@/lib/utils";

type PostType = "text" | "image" | "multiple" | "video";
type Visibility = "public" | "connections";

export default function PostPage() {
  const [postType, setPostType] = useState<PostType>("text");
  const [content, setContent] = useState("");
  const [visibility, setVisibility] = useState<Visibility>("public");
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const newUrls = files.map(file => URL.createObjectURL(file));
      
      if (postType === "multiple") {
        setPreviewUrls(prev => [...prev, ...newUrls].slice(0, 20));
      } else {
        setPreviewUrls(newUrls.slice(0, 1));
      }
    }
  };

  const removeFile = (index: number) => {
    setPreviewUrls(prev => prev.filter((_, i) => i !== index));
  };

  const postTypes = [
    { id: "text", title: "Text Post", sub: "Share text", icon: FileText },
    { id: "image", title: "Image Post", sub: "Post with image", icon: ImageIcon },
    { id: "multiple", title: "Multiple Images", sub: "2-20 images", icon: Copy },
    { id: "video", title: "Video Post", sub: "Post with video", icon: Video },
  ];

  return (
    <div className="p-4 md:p-8 max-w-[1200px] mx-auto min-h-screen">
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-black text-slate-900 mb-1">Create Post</h1>
        <p className="text-xs md:text-sm text-slate-500 font-bold">Create and publish a new LinkedIn post</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_400px] gap-6 md:gap-10 items-start">
        {/* Editor Side */}
        <div className="space-y-8">
          <section>
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 ml-1">Select Post Type</h3>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {postTypes.map((type) => {
                const isActive = postType === type.id;
                return (
                  <button
                    key={type.id}
                    onClick={() => {
                      setPostType(type.id as PostType);
                      setPreviewUrls([]);
                    }}
                    className={cn(
                      "flex flex-col items-center gap-2 p-4 rounded-3xl border-2 transition-all duration-300 text-center relative overflow-hidden group",
                      isActive 
                        ? "bg-primary/5 border-primary shadow-sm" 
                        : "bg-white border-slate-100 hover:border-primary/30"
                    )}
                  >
                    <div className={cn(
                      "w-10 h-10 rounded-2xl flex items-center justify-center transition-colors",
                      isActive ? "bg-primary text-white" : "bg-slate-50 text-slate-400 group-hover:bg-primary/10 group-hover:text-primary"
                    )}>
                      <type.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className={cn("font-black text-xs", isActive ? "text-slate-900" : "text-slate-500")}>{type.title}</h4>
                      <p className="text-[9px] font-bold text-slate-400 tracking-tight">{type.sub}</p>
                    </div>
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

          <section className="space-y-4">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
              {postType === "text" ? "Post Content" : "Caption"}
            </h3>
            <div className="bg-white rounded-[2.5rem] p-8 shadow-2xl shadow-primary/5 border border-slate-100">
              <Textarea 
                placeholder={postType === "text" ? "What do you want to share?" : "Add a caption for your post..."}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="min-h-[180px] text-lg border-none focus-visible:ring-0 p-0 resize-none"
              />
              <div className="flex justify-between items-center mt-6 pt-6 border-t border-slate-100">
                <span className="text-[10px] font-black text-slate-300 tracking-widest uppercase">{content.length}/3000 characters</span>
                <Button variant="ghost" className="text-primary gap-1.5 font-bold rounded-xl h-9 text-xs px-4">
                  <Sparkles className="w-3.5 h-3.5" />
                  AI Assist
                </Button>
              </div>
            </div>
          </section>

          {(postType !== "text") && (
            <section className="space-y-4">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Media Upload</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button className="flex items-center gap-4 h-32 px-6 rounded-[2rem] border-2 border-dashed border-slate-200 bg-slate-50 text-slate-500 font-bold hover:border-primary/50 hover:bg-primary/5 transition-all group">
                   <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center border border-slate-100 shadow-sm">
                    <Database className="w-6 h-6 text-slate-400 group-hover:text-primary" />
                   </div>
                   <div className="text-left">
                    <p className="font-black text-slate-900 text-sm">Storage</p>
                    <p className="text-[10px] text-slate-400">Select from media</p>
                   </div>
                </button>
                
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="relative h-32 rounded-[2rem] border-2 border-dashed border-slate-200 bg-white flex items-center px-6 gap-4 group hover:border-primary transition-all overflow-hidden cursor-pointer"
                >
                  <input 
                    ref={fileInputRef}
                    type="file" 
                    className="hidden"
                    onChange={handleFileChange}
                    multiple={postType === "multiple"}
                    accept={postType === "video" ? "video/*" : "image/*"}
                  />
                  <div className="w-12 h-12 bg-primary/5 rounded-2xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                    <Upload className="w-6 h-6" />
                  </div>
                  <div className="text-left">
                    <p className="font-black text-slate-900 text-sm">Click to upload</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">{postType === 'video' ? 'MP4 / WEBM' : 'JPG, PNG, GIF'}</p>
                  </div>
                </div>
              </div>
            </section>
          )}

          <div className="flex flex-col md:flex-row gap-6 items-end">
            <section className="flex-1 w-full space-y-4">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Visibility</h3>
              <div className="relative group">
                <select 
                  value={visibility}
                  onChange={(e) => setVisibility(e.target.value as Visibility)}
                  className="w-full h-14 bg-white rounded-2xl border-2 border-slate-100 px-6 text-sm font-bold text-slate-900 outline-none appearance-none focus:border-primary transition-all cursor-pointer shadow-sm"
                >
                  <option value="public">Public - Anyone on LinkedIn</option>
                  <option value="connections">Connections - Only your connections</option>
                </select>
                <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none">
                  <MoreHorizontal className="w-5 h-5 text-slate-400 rotate-90" />
                </div>
              </div>
            </section>

            <section className="w-full md:w-auto">
              <Button className="w-full h-14 rounded-2xl text-base font-black gap-3 shadow-xl shadow-primary/20 px-10">
                <Check className="w-5 h-5" />
                Post to LinkedIn
              </Button>
            </section>
          </div>
        </div>

        {/* Preview Side */}
        <div className="w-full">
          <div className="xl:sticky xl:top-24 space-y-6">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 ml-1">Live Preview</h3>
            <div className="bg-white rounded-[2rem] border border-slate-100 shadow-2xl overflow-hidden">
               {/* LinkedIn Post Header */}
               <div className="p-4 flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 font-bold">MU</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-1">
                      <span className="font-black text-slate-900 text-sm">Muhammad Uzair Yasin</span>
                      <span className="text-slate-400 text-xs font-medium">• Just now</span>
                    </div>
                    <div className="flex items-center gap-1 text-slate-400">
                      {visibility === "public" ? <Globe className="w-3 h-3" /> : <Users className="w-3 h-3" />}
                      <span className="text-[10px] font-bold uppercase tracking-wider">{visibility === "public" ? "Anyone" : "Connections"}</span>
                    </div>
                  </div>
                  <MoreHorizontal className="w-5 h-5 text-slate-400" />
               </div>

               {/* Post Content */}
               <div className="px-4 pb-4">
                 <p className={cn(
                   "text-slate-900 text-sm leading-relaxed break-words whitespace-pre-wrap min-h-[4rem]",
                   content ? "" : "text-slate-300 italic"
                 )}>
                   {content || "Start typing to see preview..."}
                 </p>
               </div>

               {/* Media Previews */}
               <AnimatePresence>
                 {previewUrls.length > 0 && (
                   <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="relative"
                   >
                     {postType === "video" ? (
                       <div className="bg-black aspect-video flex items-center justify-center relative">
                          <video 
                            src={previewUrls[0]} 
                            className="w-full h-full object-contain" 
                            controls 
                          />
                       </div>
                     ) : postType === "multiple" ? (
                       <div className={cn(
                         "grid gap-1 bg-slate-100 px-4",
                         previewUrls.length === 1 ? "grid-cols-1" : "grid-cols-2"
                       )}>
                          {previewUrls.slice(0, 4).map((url, i) => (
                            <div key={i} className="aspect-square relative overflow-hidden group first:rounded-tl-xl last:rounded-br-xl even:rounded-tr-xl odd:rounded-bl-xl">
                              <Image src={url} alt="" fill className="object-cover rounded-lg" />
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removeFile(i);
                                }}
                                className="absolute top-2 right-2 w-6 h-6 bg-black/60 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10 hover:bg-red-500"
                              >
                                <X className="w-4 h-4" />
                              </button>
                              {i === 3 && previewUrls.length > 4 && (
                                <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white font-black text-2xl rounded-lg">
                                  +{previewUrls.length - 3}
                                </div>
                              )}
                            </div>
                          ))}
                       </div>
                     ) : (
                       <div className="aspect-video relative bg-slate-50 group border-y border-slate-100">
                         <Image src={previewUrls[0]} alt="" fill className="object-cover" />
                         <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              setPreviewUrls([]);
                            }}
                            className="absolute top-4 right-4 w-8 h-8 bg-black/60 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10 hover:bg-red-500"
                          >
                            <X className="w-5 h-5" />
                          </button>
                       </div>
                     )}
                   </motion.div>
                 )}
               </AnimatePresence>

               {/* Interaction Buttons */}
               <div className="px-2 py-1 border-t border-slate-50 flex items-center justify-between">
                  {[{icon: ThumbsUp, label: "Like"}, {icon: MessageSquare, label: "Comment"}, {icon: Repeat2, label: "Repost"}, {icon: SendIcon, label: "Send"}].map((btn, i) => (
                    <button key={i} className="flex flex-1 items-center justify-center gap-2 p-3 text-slate-500 font-bold text-[11px] hover:bg-slate-50 rounded-xl transition-colors">
                      <btn.icon className="w-4 h-4" />
                      {btn.label}
                    </button>
                  ))}
               </div>
            </div>
            
            <div className="bg-primary/5 p-6 rounded-[2rem] border border-primary/10">
               <p className="text-xs font-black text-primary flex items-center gap-2 mb-2">
                 <Sparkles className="w-4 h-4" />
                 Pro Tip
               </p>
               <p className="text-xs text-slate-600 leading-relaxed font-medium">
                 Posts with images get <span className="text-primary font-black">2x more engagement</span>. Use our AI tool to optimize your professional voice!
               </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
