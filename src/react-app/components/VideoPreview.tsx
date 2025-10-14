import { useState } from "react";
import { Play, X } from "lucide-react";

interface VideoPreviewProps {
  src: string;
  title?: string;
  className?: string;
}

export default function VideoPreview({ src, title = "Video", className = "" }: VideoPreviewProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <>
      {/* Video thumbnail/preview */}
      <div className={`relative cursor-pointer group ${className}`} onClick={openModal}>
        <video
          src={src}
          className="w-full h-full object-cover rounded-lg"
          preload="metadata"
          muted
        />
        <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-40 transition-all duration-200 rounded-lg flex items-center justify-center">
          <div className="w-12 h-12 bg-white bg-opacity-90 rounded-full flex items-center justify-center transform group-hover:scale-110 transition-transform duration-200">
            <Play className="w-6 h-6 text-gray-800 ml-1" />
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
          <div className="relative w-full max-w-4xl max-h-[90vh] bg-black rounded-lg overflow-hidden">
            {/* Close button */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 z-10 w-10 h-10 bg-black bg-opacity-50 hover:bg-opacity-75 rounded-full flex items-center justify-center text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Video player */}
            <video
              src={src}
              controls
              autoPlay
              className="w-full h-full"
              style={{ maxHeight: 'calc(90vh - 2rem)' }}
            >
              Your browser does not support the video tag.
            </video>

            {/* Video title */}
            {title && (
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
                <h3 className="text-white text-lg font-medium">{title}</h3>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
