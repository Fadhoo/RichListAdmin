import { useState, useRef } from "react";
import { Upload, X, Play, AlertCircle } from "lucide-react";
import { uploadImageToCloud } from "../api/imageUploud";

interface VideoUploadProps {
  value?: string;
  onChange: (url: string) => void;
  className?: string;
  disabled?: boolean;
}

export default function VideoUpload({ value, onChange, className = '', disabled = false }: VideoUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (file: File) => {
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('video/')) {
      setError('Please select a valid video file');
      return;
    }

    // Validate file size (max 100MB)
    const maxSize = 100 * 1024 * 1024; // 100MB
    if (file.size > maxSize) {
      setError('Video file size must be less than 100MB');
      return;
    }

    setError(null);
    setUploading(true);

    // Validate video duration (max 15 seconds)
    const url = URL.createObjectURL(file);
    const video = document.createElement('video');
    video.preload = 'metadata';
    video.src = url;

    const validateAndUpload = async () => {
      try {
        await new Promise<void>((resolve, reject) => {
          video.onloadedmetadata = () => {
            if (video.duration > 15) {
              setError('Video duration must be 15 seconds or less');
              setUploading(false);
              URL.revokeObjectURL(url);
              reject();
            } else {
              resolve();
            }
          };
          video.onerror = () => {
            setError('Failed to load video metadata');
            setUploading(false);
            URL.revokeObjectURL(url);
            reject();
          };
        });

        // Upload using shared function
        const response = await uploadImageToCloud(file);
        const data = response.data;
        onChange(data.url);
      } catch (err) {
        if (!error) {
          setError('Upload failed');
        }
      } finally {
        setUploading(false);
        URL.revokeObjectURL(url);
      }
    };

    validateAndUpload();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);

    if (disabled || uploading) return;

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleBrowse = () => {
    if (disabled || uploading) return;
    fileInputRef.current?.click();
  };

  const handleRemove = () => {
    if (disabled || uploading) return;
    onChange('');
    setError(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled && !uploading) {
      setDragOver(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  return (
    <div className={`w-full ${className}`}>
      <input
        ref={fileInputRef}
        type="file"
        accept="video/*"
        onChange={handleFileInput}
        className="hidden"
        disabled={disabled || uploading}
      />

      {value ? (
        <div className="relative">
          <div className="bg-gray-100 rounded-xl p-4 border border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <Play className="w-5 h-5 text-purple-600" />
                <span className="text-sm font-medium text-gray-700">Video uploaded</span>
              </div>
              {!disabled && (
                <button
                  type="button"
                  onClick={handleRemove}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                  disabled={uploading}
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            
            <video
              src={value}
              controls
              className="w-full rounded-lg max-h-48 bg-black"
              preload="metadata"
            >
              Your browser does not support the video tag.
            </video>
            
            <div className="mt-2 text-xs text-gray-500 break-all">
              {value}
            </div>
          </div>
        </div>
      ) : (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`
            relative border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer
            ${dragOver ? 'border-purple-400 bg-purple-50' : 'border-gray-300 hover:border-gray-400'}
            ${disabled || uploading ? 'opacity-50 cursor-not-allowed' : ''}
          `}
          onClick={handleBrowse}
        >
          {uploading ? (
            <div className="flex flex-col items-center space-y-3">
              <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
              <div className="text-sm font-medium text-gray-700">Uploading video...</div>
              <div className="text-xs text-gray-500">Please wait while we process your video</div>
            </div>
          ) : (
            <div className="flex flex-col items-center space-y-3">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <Upload className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <div className="text-sm font-medium text-gray-700 mb-1">
                  Drop your video here, or click to browse
                </div>
                <div className="text-xs text-gray-500">
                  Supports MP4, MOV, AVI, WebM • Max 100MB
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {error && (
        <div className="mt-3 flex items-center space-x-2 text-red-600 text-sm">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
