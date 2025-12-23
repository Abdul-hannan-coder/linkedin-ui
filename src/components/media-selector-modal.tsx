"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Image as ImageIcon, Video as VideoIcon, Loader2, AlertCircle } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useStorage, MediaFilter } from "@/hooks/storage";

interface MediaSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (mediaId: string, mediaType: 'image' | 'video', mediaUrl: string) => void;
  filter?: MediaFilter; // Optional filter to show only images or videos
}

export function MediaSelectorModal({ isOpen, onClose, onSelect, filter: filterProp = 'all' }: MediaSelectorModalProps) {
  const { media, isLoading, error, setFilter, clearError, loadMore, pagination } = useStorage();
  const [selectedFilter, setSelectedFilter] = useState<MediaFilter>(filterProp);

  // Set filter when prop changes or modal opens
  useEffect(() => {
    if (isOpen && filterProp !== selectedFilter) {
      setSelectedFilter(filterProp);
      setFilter(filterProp);
    }
  }, [isOpen, filterProp, selectedFilter, setFilter]);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleSelect = (mediaId: string, mediaType: 'image' | 'video', mediaUrl: string) => {
    onSelect(mediaId, mediaType, mediaUrl);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-white rounded-3xl shadow-2xl w-full max-w-6xl max-h-[90vh] flex flex-col overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-100">
            <h2 className="text-2xl font-black text-slate-900">Select Media</h2>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5 text-slate-600" />
            </button>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2 p-4 border-b border-slate-100 bg-slate-50">
            {(['all', 'image', 'video'] as MediaFilter[]).map((filterType) => (
              <button
                key={filterType}
                onClick={() => {
                  setSelectedFilter(filterType);
                  setFilter(filterType);
                }}
                className={cn(
                  "px-4 py-2 rounded-xl font-bold text-sm transition-all",
                  selectedFilter === filterType
                    ? "bg-primary text-white shadow-lg"
                    : "bg-white text-slate-600 hover:bg-slate-100"
                )}
              >
                {filterType === 'all' ? 'All Media' : filterType.charAt(0).toUpperCase() + filterType.slice(1) + 's'}
              </button>
            ))}
          </div>

          {/* Error Display */}
          {error && (
            <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
              <span className="text-sm font-bold text-red-600 flex-1">{error}</span>
              <button onClick={clearError} className="text-red-600 hover:text-red-800">
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Media Grid */}
          <div className="flex-1 overflow-y-auto p-6">
            {isLoading && media.length === 0 ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : media.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                  <ImageIcon className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-2">No media found</h3>
                <p className="text-sm text-slate-500 font-bold">
                  {filterProp === 'all' 
                    ? "Upload media to get started" 
                    : `No ${filterProp}s found. Try a different filter.`}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {media.map((item) => (
                  <motion.button
                    key={item.media_id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    onClick={() => handleSelect(item.media_id, item.media_type, item.public_url)}
                    className="group relative aspect-square rounded-2xl overflow-hidden bg-slate-100 border-2 border-transparent hover:border-primary transition-all cursor-pointer"
                  >
                    {item.media_type === "video" ? (
                      <video
                        src={item.public_url}
                        className="w-full h-full object-cover"
                        controls
                        preload="metadata"
                        playsInline
                        onClick={(e) => e.stopPropagation()}
                        onMouseEnter={(e) => {
                          e.currentTarget.controls = true;
                        }}
                      >
                        Your browser does not support the video tag.
                      </video>
                    ) : (
                      <Image
                        src={item.public_url}
                        alt={item.filename}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        unoptimized
                      />
                    )}

                    {/* Type Badge */}
                    <div className="absolute top-2 left-2 px-2 py-1 bg-black/60 backdrop-blur-md rounded-lg border border-white/20 flex items-center gap-1.5">
                      {item.media_type === "image" ? (
                        <ImageIcon className="w-3 h-3 text-white" />
                      ) : (
                        <VideoIcon className="w-3 h-3 text-white" />
                      )}
                      <span className="text-[9px] font-black text-white uppercase tracking-wider">
                        {item.media_type}
                      </span>
                    </div>

                    {/* File Info Overlay */}
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <p className="text-[10px] font-bold text-white truncate">{item.filename}</p>
                      <p className="text-[9px] font-bold text-white/80">{formatFileSize(item.file_size)}</p>
                    </div>
                  </motion.button>
                ))}
              </div>
            )}

            {/* Load More Button */}
            {pagination.hasMore && (
              <div className="flex justify-center mt-6">
                <button
                  onClick={loadMore}
                  disabled={isLoading}
                  className="px-6 py-2 rounded-xl bg-primary text-white font-bold hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin inline mr-2" />
                      Loading...
                    </>
                  ) : (
                    'Load More'
                  )}
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

