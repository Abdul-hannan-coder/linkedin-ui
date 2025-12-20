"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Upload, 
  Filter, 
  Image as ImageIcon, 
  Video as VideoIcon, 
  ExternalLink,
  ChevronDown,
  Trash2,
  Loader2,
  AlertCircle,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useStorage, MediaFilter } from "@/hooks/storage";

export default function StoragePage() {
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const {
    media,
    isLoading,
    isUploading,
    error,
    filter,
    pagination,
    setFilter,
    uploadFile,
    deleteMediaItem,
    clearError,
    loadMore,
  } = useStorage();

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      try {
        await uploadFile(Array.from(files));
      } catch {
        // Error is handled by the hook
      }
    }
    // Reset input value to allow selecting the same file again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDelete = async (mediaId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this media?')) {
      try {
        await deleteMediaItem(mediaId);
      } catch {
        // Error is handled by the hook
      }
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="p-4 md:p-10 max-w-[1400px] mx-auto min-h-screen">
      {/* Error Display */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3"
        >
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
          <span className="text-sm font-bold text-red-600 flex-1">{error}</span>
          <button
            onClick={clearError}
            className="text-red-600 hover:text-red-800"
          >
            <X className="w-4 h-4" />
          </button>
        </motion.div>
      )}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 mb-2 tracking-tight">Storage</h1>
          <p className="text-sm md:text-base text-slate-500 font-bold">
            Showing {media.length} of {pagination.total} media items
          </p>
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
                  {(["all", "image", "video"] as MediaFilter[]).map((type) => (
                    <button 
                      key={type}
                      onClick={() => {
                        setFilter(type);
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

          <Button 
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="h-12 px-8 rounded-xl gap-3 font-black shadow-xl shadow-primary/20"
          >
            {isUploading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Upload className="w-5 h-5" />
            )}
            {isUploading ? "Uploading..." : "Upload"}
          </Button>
          
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*,video/*"
            onChange={handleFileUpload}
            className="hidden"
          />
        </div>
      </div>

      {/* Loading State */}
      {isLoading && media.length === 0 && (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      )}

      {/* Media Grid */}
      {media.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence mode="popLayout">
            {media.map((item) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                key={item.media_id}
                className="bg-white rounded-[2rem] border border-slate-100 shadow-xl shadow-primary/5 overflow-hidden group flex flex-col h-full"
              >
                {/* Media Preview */}
                <div className="relative aspect-[4/3] bg-slate-50 overflow-hidden">
                  {item.media_type === "video" ? (
                    <div className="w-full h-full flex flex-col">
                      <div className="flex-1 relative bg-black flex items-center justify-center">
                        <Image 
                          src={item.public_url} 
                          alt={item.filename} 
                          fill 
                          className="object-cover opacity-50" 
                          unoptimized
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/30">
                            <VideoIcon className="w-6 h-6 fill-current" />
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <Image 
                      src={item.public_url} 
                      alt={item.filename} 
                      fill 
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      unoptimized
                    />
                  )}
                  
                  {/* Type Badge */}
                  <div className="absolute top-4 left-4 px-3 py-1 bg-black/40 backdrop-blur-md rounded-full border border-white/20 flex items-center gap-2">
                    {item.media_type === "image" ? (
                      <ImageIcon className="w-3 h-3 text-white" />
                    ) : (
                      <VideoIcon className="w-3 h-3 text-white" />
                    )}
                    <span className="text-[10px] font-black text-white uppercase tracking-widest">{item.media_type}</span>
                  </div>

                  {/* Action Buttons */}
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex gap-2">
                    <Button 
                      onClick={() => {
                        const params = new URLSearchParams({
                          media_id: item.media_id,
                          media_type: item.media_type,
                          media_url: item.public_url,
                        });
                        router.push(`/dashboard/post?${params.toString()}`);
                      }}
                      size="sm" 
                      className="h-8 rounded-lg bg-primary gap-2 text-[10px] font-black shadow-lg"
                    >
                      <ExternalLink className="w-3 h-3" />
                      Use
                    </Button>
                    <Button 
                      onClick={(e) => handleDelete(item.media_id, e)}
                      size="sm" 
                      className="h-8 rounded-lg gap-2 text-[10px] font-black shadow-lg bg-red-500 hover:bg-red-600 text-white"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>

                {/* Media Info */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xs font-black text-slate-900 truncate mb-1">{item.filename}</h3>
                    <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 mb-4 uppercase tracking-wider">
                      <span>{formatFileSize(item.file_size)}</span>
                      <span>{formatDate(item.uploaded_at)}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border",
                      item.status === "uploaded" 
                        ? "bg-green-50 text-green-600 border-green-100" 
                        : "bg-primary/10 text-primary border-primary/20"
                    )}>
                      {item.status}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : !isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
            <ImageIcon className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-xl font-black text-slate-900 mb-2">No media found</h3>
          <p className="text-sm text-slate-500 font-bold mb-6">
            {filter === "all" 
              ? "Upload your first media file to get started" 
              : `No ${filter}s found. Try a different filter.`}
          </p>
          <Button 
            onClick={() => fileInputRef.current?.click()}
            className="gap-2"
          >
            <Upload className="w-4 h-4" />
            Upload Media
          </Button>
        </div>
      ) : null}

      {/* Load More Button */}
      {pagination.hasMore && (
        <div className="flex justify-center mt-10">
          <Button 
            onClick={loadMore}
            disabled={isLoading}
            className="px-8 py-3 rounded-xl gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Loading...
              </>
            ) : (
              'Load More'
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
