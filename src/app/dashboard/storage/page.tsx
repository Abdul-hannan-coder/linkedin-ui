"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Upload, 
  Filter, 
  Image as ImageIcon, 
  Video as VideoIcon, 
  ExternalLink,
  ChevronDown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

type MediaType = "all" | "image" | "video";

const mediaItems = [
  { id: 1, type: "image", name: "693dd0f15901f_1765658865.jpg", size: "26.52 KB", date: "Dec 13, 2025, 08:47 PM", status: "uploaded", url: "/define-your-audience.jpg" },
  { id: 2, type: "video", name: "693dc7e245e89_1765656546.webm", size: "4.88 MB", date: "Dec 13, 2025, 08:09 PM", status: "uploaded", url: "/hero-section.png" }, // Mock video with hero image
  { id: 3, type: "image", name: "693b23315a1fd_1765483313.jpg", size: "59.29 KB", date: "Dec 11, 2025, 08:01 PM", status: "posted", url: "/create-your-campaign.jpg" },
  { id: 4, type: "image", name: "693b231777e38_1765483287.jpg", size: "19.64 KB", date: "Dec 11, 2025, 08:01 PM", status: "posted", url: "/launch-automate.jpg" },
  { id: 5, type: "image", name: "69386a2091538_1765304864.jpg", size: "126.73 KB", date: "Dec 9, 2025, 06:27 PM", status: "posted", url: "/analyze-optimize.jpg" },
  { id: 6, type: "video", name: "693694d158cc7_1765184721.mp4", size: "1.94 MB", date: "Dec 8, 2025, 09:05 AM", status: "uploaded", url: "/hero-section.png" },
  { id: 7, type: "image", name: "69367943453d6_1765177667.jpg", size: "37.04 KB", date: "Dec 8, 2025, 07:07 AM", status: "posted", url: "/Empowering-Professionals.jpg" },
];

export default function StoragePage() {
  const [filter, setFilter] = useState<MediaType>("all");
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const router = useRouter();

  const filteredItems = mediaItems.filter(item => filter === "all" || item.type === filter);

  return (
    <div className="p-4 md:p-10 max-w-[1400px] mx-auto min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 mb-2 tracking-tight">Storage</h1>
          <p className="text-sm md:text-base text-slate-500 font-bold">Showing {filteredItems.length} of {mediaItems.length} media items</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <button 
              onClick={() => setShowFilterDropdown(!showFilterDropdown)}
              className="h-12 px-5 bg-white rounded-xl border-2 border-slate-100 flex items-center gap-3 font-bold text-slate-600 hover:border-primary/30 transition-all shadow-sm"
            >
              <Filter className="w-4 h-4" />
              {filter === "all" ? "All Media" : filter.charAt(0).toUpperCase() + filter.slice(1) + "s"}
              <ChevronDown className={cn("w-4 h-4 transition-transform", showFilterDropdown ? "rotate-180" : "")} />
            </button>
            
            <AnimatePresence>
              {showFilterDropdown && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute top-full mt-2 right-0 w-48 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 overflow-hidden"
                >
                  {["all", "image", "video"].map((type) => (
                    <button 
                      key={type}
                      onClick={() => {
                        setFilter(type as MediaType);
                        setShowFilterDropdown(false);
                      }}
                      className={cn(
                        "w-full px-5 py-3 text-left font-bold text-sm transition-colors",
                        filter === type ? "bg-primary text-white" : "text-slate-600 hover:bg-primary/5"
                      )}
                    >
                      {type === "all" ? "All Media" : type.charAt(0).toUpperCase() + type.slice(1) + "s"}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <Button className="h-12 px-8 rounded-xl gap-3 font-black shadow-xl shadow-primary/20">
            <Upload className="w-5 h-5" />
            Upload
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredItems.map((item) => (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              key={item.id}
              className="bg-white rounded-[2rem] border border-slate-100 shadow-xl shadow-primary/5 overflow-hidden group flex flex-col h-full"
            >
              {/* Media Preview */}
              <div className="relative aspect-[4/3] bg-slate-50 overflow-hidden">
                {item.type === "video" ? (
                  <div className="w-full h-full flex flex-col">
                    <div className="flex-1 relative bg-black flex items-center justify-center">
                       <Image src={item.url} alt="" fill className="object-cover opacity-50" />
                       <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/30">
                             <VideoIcon className="w-6 h-6 fill-current" />
                          </div>
                       </div>
                    </div>
                    <div className="h-10 bg-black flex items-center px-3 gap-2">
                       <VideoIcon className="w-3.5 h-3.5 text-white/60" />
                       <div className="h-1 flex-1 bg-white/20 rounded-full">
                          <div className="h-full w-1/3 bg-primary rounded-full" />
                       </div>
                       <span className="text-[10px] font-bold text-white/60">0:00 / 1:00</span>
                    </div>
                  </div>
                ) : (
                  <Image src={item.url} alt={item.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                )}
                
                {/* Overlay Badge */}
                <div className="absolute top-4 left-4 px-3 py-1 bg-black/40 backdrop-blur-md rounded-full border border-white/20 flex items-center gap-2">
                  {item.type === "image" ? <ImageIcon className="w-3 h-3 text-white" /> : <VideoIcon className="w-3 h-3 text-white" />}
                  <span className="text-[10px] font-black text-white uppercase tracking-widest">{item.type}</span>
                </div>

                {/* Use in Post Button Overlay */}
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Button 
                    onClick={() => router.push("/dashboard/post")}
                    size="sm" 
                    className="h-8 rounded-lg bg-primary gap-2 text-[10px] font-black shadow-lg"
                  >
                    <ExternalLink className="w-3 h-3" />
                    Use in Post
                  </Button>
                </div>
              </div>

              {/* Media Info */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-xs font-black text-slate-900 truncate mb-1">{item.name}</h3>
                  <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 mb-4 uppercase tracking-wider">
                    <span>{item.size}</span>
                    <span>{item.date}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className={cn(
                    "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border",
                    item.status === "uploaded" ? "bg-green-50 text-green-600 border-green-100" : "bg-primary/10 text-primary border-primary/20"
                  )}>
                    {item.status}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
