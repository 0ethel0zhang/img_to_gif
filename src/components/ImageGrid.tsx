import * as React from "react";
import { X, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion, Reorder } from "motion/react";

interface ImageItem {
  id: string;
  file: File;
  preview: string;
}

interface ImageGridProps {
  images: ImageItem[];
  onRemove: (id: string) => void;
  onReorder: (newOrder: ImageItem[]) => void;
}

export function ImageGrid({ images, onRemove, onReorder }: ImageGridProps) {
  if (images.length === 0) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Frames ({images.length})</h3>
        <span className="text-sm text-gray-500">Drag to reorder</span>
      </div>
      
      <Reorder.Group 
        axis="y" 
        values={images} 
        onReorder={onReorder} 
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4"
        as="div"
      >
        {images.map((image) => (
          <Reorder.Item
            key={image.id}
            value={image}
            className="relative group touch-none"
            as="div"
          >
            <Card className="overflow-hidden relative aspect-square group-hover:shadow-md transition-shadow">
              <img
                src={image.preview}
                alt="Frame"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
              
              <Button
                variant="danger"
                size="icon"
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity w-8 h-8"
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove(image.id);
                }}
              >
                <X className="w-4 h-4" />
              </Button>
              
              <div className="absolute top-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing">
                 <GripVertical className="w-3 h-3 inline mr-1" />
                 Move
              </div>
            </Card>
          </Reorder.Item>
        ))}
      </Reorder.Group>
    </div>
  );
}
