"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams } from "next/navigation";
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
  X,
  Loader2,
  AlertCircle,
  CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/input";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { usePost, PostType, Visibility } from "@/hooks/posts";
import { createImagePost, createVideoPost } from "@/hooks/posts/api";
import { useLinkedInProfile } from "@/hooks/linkedin";
import { useAuth } from "@/hooks/auth";

export default function PostPage() {
  const searchParams = useSearchParams();
  const [postType, setPostType] = useState<PostType>("text");
  const [content, setContent] = useState("");
  const [visibility, setVisibility] = useState<Visibility>("public");
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [storedFiles, setStoredFiles] = useState<File[]>([]);
  const [preSelectedMediaId, setPreSelectedMediaId] = useState<string | null>(null);
  const [preSelectedMediaType, setPreSelectedMediaType] = useState<'image' | 'video' | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { createPost, isPosting, isUploading, error, success, clearError, resetPost } = usePost();
  const { profile, fetchProfile } = useLinkedInProfile();
  const { user } = useAuth();

  // Fetch profile on mount
  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  // Handle pre-selected media from storage page
  useEffect(() => {
    const mediaId = searchParams.get('media_id');
    const mediaType = searchParams.get('media_type');
    const mediaUrl = searchParams.get('media_url');

    if (mediaId && mediaType && mediaUrl) {
      // Set pre-selected media
      setPreSelectedMediaId(mediaId);
      setPreSelectedMediaType(mediaType as 'image' | 'video');
      
      // Set post type based on media type
      if (mediaType === 'image') {
        setPostType('image');
      } else if (mediaType === 'video') {
        setPostType('video');
      }
      
      // Set preview URL
      setPreviewUrls([mediaUrl]);
      
      // Clear URL params to avoid re-triggering
      window.history.replaceState({}, '', '/dashboard/post');
    }
  }, [searchParams]);

  // Get display name and avatar
  const displayName = profile?.name || user?.full_name || 'User';
  const profilePicture = profile?.picture || null;
  
  // Get initials for avatar fallback
  const getInitials = (name: string) => {
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const newUrls = files.map(file => URL.createObjectURL(file));
      
      if (postType === "multiple") {
        setPreviewUrls(prev => [...prev, ...newUrls].slice(0, 20));
        setStoredFiles(prev => [...prev, ...files].slice(0, 20));
      } else {
        setPreviewUrls(newUrls.slice(0, 1));
        setStoredFiles(files.slice(0, 1));
      }
    }
    
    // Reset input value to allow selecting the same file again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeFile = (index: number) => {
    // Revoke object URL to free memory (only for blob URLs)
    if (previewUrls[index]?.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrls[index]);
    }
    
    // If removing pre-selected media, clear the state
    if (index === 0 && preSelectedMediaId && previewUrls.length === 1) {
      setPreSelectedMediaId(null);
      setPreSelectedMediaType(null);
    }
    
    setPreviewUrls(prev => prev.filter((_, i) => i !== index));
    setStoredFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    // Clear any previous errors
    clearError();
    
    // Validate content (allow empty if using pre-selected media)
    if (!content.trim() && !preSelectedMediaId) {
      return;
    }

    // Validate files based on post type (unless using pre-selected media)
    if (!preSelectedMediaId) {
      if (postType !== "text" && storedFiles.length === 0) {
        return;
      }

      if (postType === "multiple" && storedFiles.length < 2) {
        return;
      }
    }

    try {
      let result;
      
      // If using pre-selected media, use media_id directly
      if (preSelectedMediaId && preSelectedMediaType) {
        if (preSelectedMediaType === 'image') {
          result = await createImagePost({
            image_id: preSelectedMediaId,
            text: content.trim() || '',
            visibility,
          });
        } else if (preSelectedMediaType === 'video') {
          result = await createVideoPost({
            video_id: preSelectedMediaId,
            text: content.trim() || '',
            title: content.split('\n')[0] || 'Video Post',
            visibility,
          });
        } else {
          throw new Error('Invalid media type');
        }
      } else {
        // Use normal flow with file upload
        result = await createPost(postType, content, storedFiles, visibility);
      }
      
      if (result.success) {
        // Reset form on success
        setContent('');
        setPreviewUrls([]);
        setStoredFiles([]);
        setPreSelectedMediaId(null);
        setPreSelectedMediaType(null);
        
        // Reset post state after a delay
        setTimeout(() => {
          resetPost();
        }, 3000);
      }
    } catch (error) {
      // Error is handled by usePost hook or shown directly
      console.error('Failed to create post:', error);
    }
  };

  const handlePostTypeChange = (newType: PostType) => {
    setPostType(newType);
    // Clear files and pre-selected media when changing post type
    previewUrls.forEach(url => {
      if (url.startsWith('blob:')) {
        URL.revokeObjectURL(url);
      }
    });
    setPreviewUrls([]);
    setStoredFiles([]);
    setPreSelectedMediaId(null);
    setPreSelectedMediaType(null);
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
                    onClick={() => handlePostTypeChange(type.id as PostType)}
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

            <section className="w-full md:w-auto space-y-4">
              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-bold text-red-900">{error}</p>
                    <button
                      onClick={clearError}
                      className="text-xs text-red-600 hover:text-red-800 underline mt-1"
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              )}
              
              {success && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <p className="text-sm font-bold text-green-900">Post created successfully!</p>
                </div>
              )}
              
              <Button 
                onClick={handleSubmit}
                disabled={isPosting || isUploading || (!content.trim() && !preSelectedMediaId) || (postType !== "text" && storedFiles.length === 0 && !preSelectedMediaId)}
                className="w-full h-14 rounded-2xl text-base font-black gap-3 shadow-xl shadow-primary/20 px-10 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isPosting || isUploading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    {isUploading ? "Uploading..." : "Posting..."}
                  </>
                ) : (
                  <>
                    <Check className="w-5 h-5" />
                    Post to LinkedIn
                  </>
                )}
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
                  <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 font-bold overflow-hidden relative">
                    {profilePicture ? (
                      <Image 
                        src={profilePicture} 
                        alt={displayName}
                        width={48}
                        height={48}
                        className="w-full h-full object-cover rounded-full"
                        unoptimized
                      />
                    ) : (
                      <span>{getInitials(displayName)}</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-1">
                      <span className="font-black text-slate-900 text-sm">{displayName}</span>
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
