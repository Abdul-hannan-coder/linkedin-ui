"use client";

import { useState, useRef, useEffect } from "react";
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
  Send as SendIcon,
  Loader2,
  AlertCircle,
  Database,
  Trash2,
  Upload as UploadIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useScheduling } from "@/hooks/scheduling";
import { uploadMedia } from "@/hooks/posts/api";
import { MediaSelectorModal } from "@/components/media-selector-modal";
import Image from "next/image";
import { useLinkedInProfile } from "@/hooks/linkedin";
import { useAuth } from "@/hooks/auth";

type PostType = "text" | "image" | "carousel" | "video";

export default function ScheduledPage() {
  const [showModal, setShowModal] = useState(false);
  const [postType, setPostType] = useState<PostType>("text");
  const [content, setContent] = useState("");
  const [visibility, setVisibility] = useState<"public" | "connections">("public");
  const [scheduledTime, setScheduledTime] = useState("");
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [storedFiles, setStoredFiles] = useState<File[]>([]);
  const [preSelectedMediaIds, setPreSelectedMediaIds] = useState<string[]>([]);
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const {
    scheduledPosts,
    isLoading,
    isCreating,
    error,
    createScheduledPost,
    cancelScheduledPostItem,
    clearError,
  } = useScheduling();
  
  


  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      const newUrls = files.map(file => URL.createObjectURL(file));
      
      if (postType === "carousel") {
        setPreviewUrls(prev => [...prev, ...newUrls].slice(0, 20));
        setStoredFiles(prev => [...prev, ...files].slice(0, 20));
      } else {
        setPreviewUrls(newUrls.slice(0, 1));
        setStoredFiles(files.slice(0, 1));
      }
    }
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleMediaSelect = (mediaId: string, mediaType: 'image' | 'video', mediaUrl: string) => {
    if (postType === "carousel") {
      setPreSelectedMediaIds(prev => [...prev, mediaId].slice(0, 20));
      setPreviewUrls(prev => [...prev, mediaUrl].slice(0, 20));
    } else {
      setPreSelectedMediaIds([mediaId]);
      setPreviewUrls([mediaUrl]);
      
      // Set post type based on media type if not already set
      if (mediaType === 'image' && postType === 'text') {
        setPostType('image');
      } else if (mediaType === 'video' && postType === 'text') {
        setPostType('video');
      }
    }
  };

  const removeFile = (index: number) => {
    if (previewUrls[index]?.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrls[index]);
    }
    
    setPreviewUrls(prev => prev.filter((_, i) => i !== index));
    setStoredFiles(prev => prev.filter((_, i) => i !== index));
    setPreSelectedMediaIds(prev => prev.filter((_, i) => i !== index));
  };

  const handleSchedulePost = async () => {
    clearError();
    
    if (!content.trim() && !preSelectedMediaIds.length && !storedFiles.length) {
      return;
    }

    if (!scheduledTime) {
      return;
    }

    try {
      let mediaIds: string[] = [];
      
      // Upload files if provided, otherwise use pre-selected media IDs
      if (storedFiles.length > 0) {
        setIsUploading(true);
        const uploadPromises = storedFiles.map(file => {
          const mediaType = file.type.startsWith('video/') ? 'video' : 'image';
          return uploadMedia(file, mediaType);
        });
        mediaIds = await Promise.all(uploadPromises);
        setIsUploading(false);
      } else if (preSelectedMediaIds.length > 0) {
        mediaIds = preSelectedMediaIds;
      }

      await createScheduledPost({
        text: content.trim() || '',
        visibility,
        scheduled_time: scheduledTime,
        post_type: postType,
        media_ids: mediaIds.length > 0 ? mediaIds : undefined,
        title: postType === 'video' ? content.split('\n')[0] || 'Video Post' : undefined,
      });

      // Reset form
      setContent('');
      setPreviewUrls([]);
      setStoredFiles([]);
      setPreSelectedMediaIds([]);
      setScheduledTime('');
      setShowModal(false);
    } catch {
      // Error handled by hook
    }
  };

  const handleTimeSlotClick = (date: Date, timeStr: string) => {
    const [time, period] = timeStr.split(' ');
    const [hours, minutes] = time.split(':').map(Number);
    
    const scheduledDateTime = new Date(date);
    scheduledDateTime.setHours(
      period === 'PM' && hours !== 12 ? hours + 12 : 
      period === 'AM' && hours === 12 ? 0 : hours,
      minutes
    );

    setScheduledTime(scheduledDateTime.toISOString());
    setShowModal(true);
  };

  const formatScheduledTime = (timeStr: string) => {
    return new Date(timeStr).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatTimeUntil = (timeStr: string) => {
    const now = new Date();
    const scheduled = new Date(timeStr);
    const diff = scheduled.getTime() - now.getTime();
    
    if (diff < 0) return 'Past';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  // Generate next 7 days with time slots
  const generateDaysWithSlots = () => {
    const days = [];
    const timeSlots = ["9:00 AM", "12:00 PM", "3:00 PM", "6:00 PM", "9:00 PM"];
    
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      date.setHours(0, 0, 0, 0);
      
      days.push({
        date,
        slots: timeSlots,
      });
    }
    
    return days;
  };

  const daysWithSlots = generateDaysWithSlots();
  
  const getMediaFilter = (): 'all' | 'image' | 'video' => {
    if (postType === 'image' || postType === 'carousel') return 'image';
    if (postType === 'video') return 'video';
    return 'all';
  };

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
        {/* Your Scheduled Posts */}
        <section>
          <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-6 ml-1 flex items-center gap-2">
            Your Scheduled Posts
          </h3>
          
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
              <span className="text-sm font-bold text-red-600 flex-1">{error}</span>
              <button onClick={clearError} className="text-red-600 hover:text-red-800">
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {isLoading ? (
            <div className="bg-white rounded-[2rem] p-12 shadow-xl shadow-primary/5 border border-slate-100 flex items-center justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : scheduledPosts.length === 0 ? (
            <div className="bg-white rounded-[2rem] p-12 shadow-xl shadow-primary/5 border border-slate-100 flex flex-col items-center justify-center text-center">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                <Clock className="w-10 h-10 text-slate-300" />
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-2">No scheduled posts found</h3>
              <p className="text-slate-400 font-bold text-sm">Schedule a post to see it here</p>
            </div>
          ) : (
            <div className="space-y-4">
              {scheduledPosts.map((post) => (
                <div key={post.scheduled_post_id} className="bg-white rounded-2xl p-6 shadow-xl shadow-primary/5 border border-slate-100">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-1 bg-primary/10 text-primary text-xs font-black rounded-full uppercase">
                          {post.post_type}
                        </span>
                        <span className="px-2 py-1 bg-green-50 text-green-600 text-xs font-black rounded-full uppercase">
                          {post.status}
                        </span>
                      </div>
                      <p className="text-sm text-slate-600 font-medium line-clamp-2 mb-2">
                        {post.post_data.text}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-slate-400 font-bold">
                        <span>📅 {formatScheduledTime(post.scheduled_time_local)}</span>
                        <span>⏰ {formatTimeUntil(post.scheduled_time)}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        if (confirm('Are you sure you want to cancel this scheduled post?')) {
                          cancelScheduledPostItem(post.scheduled_post_id);
                        }
                      }}
                      className="text-red-400 hover:text-red-600 p-2 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  
                  {post.media && post.media.media_urls.length > 0 && (
                    <div className="flex gap-2 mt-4">
                      {post.media.media_urls.slice(0, 3).map((media, idx) => (
                        <div key={idx} className="w-16 h-16 rounded-lg overflow-hidden bg-slate-100 relative">
                          <Image
                            src={media.public_url}
                            alt={media.filename}
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        </div>
                      ))}
                      {post.media.media_count > 3 && (
                        <div className="w-16 h-16 bg-slate-100 rounded-lg flex items-center justify-center text-xs font-bold text-slate-500">
                          +{post.media.media_count - 3}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Schedule New Post Section */}
        <section>
          <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-8 ml-1">Quick Schedule</h3>
          
          <div className="space-y-12">
            {daysWithSlots.map((day, dIdx) => (
              <div key={dIdx} className="space-y-6">
                <div className="flex items-center gap-4">
                  <h4 className="text-lg font-black text-slate-900">
                    {day.date.toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </h4>
                  <div className="h-px flex-1 bg-slate-100" />
                </div>
                
                <div className="grid grid-cols-1 gap-3">
                  {day.slots.map((timeStr, sIdx) => (
                    <div 
                      key={sIdx}
                      className="group bg-white rounded-2xl p-4 border border-slate-100 shadow-sm hover:shadow-md hover:border-primary/20 transition-all flex items-center justify-between"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 font-bold text-xs group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                          {timeStr.split(' ')[0]}
                        </div>
                        <span className="font-bold text-slate-600 uppercase text-xs tracking-widest">{timeStr}</span>
                      </div>
                      
                      <button 
                        onClick={() => handleTimeSlotClick(day.date, timeStr)}
                        className="h-10 px-5 rounded-lg border bg-white border-slate-100 text-primary hover:border-primary hover:bg-primary/5 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        New
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
              onClick={(e) => {
                e.stopPropagation();
                setShowModal(false);
                // Reset form when closing
                setContent('');
                setPreviewUrls([]);
                setStoredFiles([]);
                setPreSelectedMediaIds([]);
                setScheduledTime('');
                setPostType('text');
              }}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-5xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              {/* Header */}
              <div className="p-6 md:p-8 border-b border-slate-100 flex items-center justify-between">
                <h2 className="text-2xl font-black text-slate-900">Create Post</h2>
                <button 
                  onClick={() => {
                    setShowModal(false);
                    // Reset form when closing
                    setContent('');
                    setPreviewUrls([]);
                    setStoredFiles([]);
                    setPreSelectedMediaIds([]);
                    setScheduledTime('');
                    setPostType('text');
                  }}
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
                        onChange={(e) => setVisibility(e.target.value as "public" | "connections")}
                        className="w-full h-12 bg-slate-50/50 rounded-xl border-2 border-slate-100 px-4 text-sm font-bold text-slate-900 outline-none"
                      >
                        <option value="public">Public - Anyone on LinkedIn</option>
                        <option value="connections">Connections - Only your connections</option>
                      </select>
                    </section>

                    {/* Media Upload */}
                    {(postType !== "text") && (
                      <section>
                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 ml-1">Media</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <button 
                            onClick={() => setIsMediaModalOpen(true)}
                            className="flex items-center gap-4 h-32 px-6 rounded-[2rem] border-2 border-dashed border-slate-200 bg-slate-50 text-slate-500 font-bold hover:border-primary/50 hover:bg-primary/5 transition-all group"
                          >
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
                              multiple={postType === "carousel"}
                              accept={postType === "video" ? "video/*" : "image/*"}
                            />
                            <UploadIcon className="w-8 h-8 text-slate-400 group-hover:text-primary" />
                            <div className="text-left">
                              <p className="font-black text-slate-900 text-sm">Upload</p>
                              <p className="text-[10px] text-slate-400">Choose files</p>
                            </div>
                          </div>
                        </div>

                        {/* Media Previews */}
                        {previewUrls.length > 0 && (
                          <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-4">
                            {previewUrls.map((url, index) => (
                              <div key={index} className="relative aspect-square rounded-xl overflow-hidden group">
                                {postType === "video" ? (
                                  <video src={url} className="w-full h-full object-cover" />
                                ) : (
                                  <Image src={url} alt="" fill className="object-cover" unoptimized />
                                )}
                                <button
                                  onClick={() => removeFile(index)}
                                  className="absolute top-2 right-2 w-6 h-6 bg-black/60 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10 hover:bg-red-500"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </section>
                    )}

                    {/* Scheduled Time */}
                    <section>
                      <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 ml-1 flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5" />
                        Scheduled Time
                      </h3>
                      <input
                        type="datetime-local"
                        value={scheduledTime ? new Date(scheduledTime).toISOString().slice(0, 16) : ''}
                        onChange={(e) => {
                          if (e.target.value) {
                            setScheduledTime(new Date(e.target.value).toISOString());
                          }
                        }}
                        className="w-full h-12 bg-slate-50/50 rounded-xl border-2 border-slate-100 px-4 text-sm font-bold text-slate-900 outline-none focus:border-primary/30"
                        min={new Date().toISOString().slice(0, 16)}
                      />
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
                  onClick={() => {
                    setShowModal(false);
                    // Reset form when closing
                    setContent('');
                    setPreviewUrls([]);
                    setStoredFiles([]);
                    setPreSelectedMediaIds([]);
                    setScheduledTime('');
                    setPostType('text');
                  }}
                  className="h-12 px-8 rounded-xl font-bold border-slate-200 text-slate-500 hover:bg-slate-100"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleSchedulePost}
                  disabled={isCreating || isUploading || (!content.trim() && !preSelectedMediaIds.length && !storedFiles.length) || !scheduledTime || (postType !== "text" && storedFiles.length === 0 && preSelectedMediaIds.length === 0)}
                  className="h-12 px-8 rounded-xl font-black gap-2 shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {(isCreating || isUploading) ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      {isUploading ? "Uploading..." : "Scheduling..."}
                    </>
                  ) : (
                    <>
                      <Calendar className="w-4 h-4" />
                      Schedule Post
                    </>
                  )}
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Media Selector Modal */}
      <MediaSelectorModal
        isOpen={isMediaModalOpen}
        onClose={() => setIsMediaModalOpen(false)}
        onSelect={handleMediaSelect}
        filter={getMediaFilter()}
      />
    </div>
  );
}
