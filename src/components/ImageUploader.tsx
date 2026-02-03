import * as React from "react";
import { Upload, Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageUploaderProps {
  onUpload: (files: FileList | null) => void;
}

export function ImageUploader({ onUpload }: ImageUploaderProps) {
  const [isDragging, setIsDragging] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onUpload(e.dataTransfer.files);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onUpload(e.target.files);
    }
  };

  return (
    <div
      onClick={handleClick}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={cn(
        "relative flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-xl cursor-pointer transition-colors",
        isDragging
          ? "border-brand-indigo bg-brand-indigo/5"
          : "border-gray-300 hover:border-brand-indigo hover:bg-gray-50"
      )}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        multiple
        accept="image/png, image/jpeg, image/webp, image/gif"
      />
      <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center px-4">
        <div className="p-4 bg-white rounded-full shadow-sm mb-4">
          <Upload className="w-8 h-8 text-brand-indigo" />
        </div>
        <p className="mb-2 text-lg font-medium text-brand-black">
          <span className="font-semibold">Click to upload</span> or drag and drop
        </p>
        <p className="text-sm text-gray-500">
          PNG, JPG, WEBP or GIF (max 10MB each)
        </p>
      </div>
    </div>
  );
}
