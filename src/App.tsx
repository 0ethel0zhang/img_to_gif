import { useState, useEffect, useRef } from "react";
import { ImageUploader } from "@/components/ImageUploader";
import { ImageGrid } from "@/components/ImageGrid";
import { Controls } from "@/components/Controls";
import { GifPreview } from "@/components/GifPreview";
import GIF from "gif.js";
import { motion } from "motion/react";

// Simple ID generator since I didn't install uuid
const generateId = () => Math.random().toString(36).substring(2, 9);

interface ImageItem {
  id: string;
  file: File;
  preview: string;
}

interface GifSettings {
  width: number;
  height: number;
  delay: number;
  quality: number;
  repeat: number;
}

// Worker script as a string to avoid external file dependencies
// This is the content of gif.worker.js from gif.js repo (simplified/minified version usually works)
// However, gif.js requires the worker to be a separate file or a Blob URL.
// I will fetch the worker from a CDN and create a Blob URL.

const WORKER_URL = "https://cdnjs.cloudflare.com/ajax/libs/gif.js/0.2.0/gif.worker.js";

export default function App() {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [settings, setSettings] = useState<GifSettings>({
    width: 500,
    height: 500,
    delay: 200,
    quality: 10,
    repeat: 0,
  });
  const [generatedGif, setGeneratedGif] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [workerBlobUrl, setWorkerBlobUrl] = useState<string | null>(null);

  // Load worker blob on mount
  useEffect(() => {
    fetch(WORKER_URL)
      .then((r) => r.blob())
      .then((blob) => {
        const url = URL.createObjectURL(blob);
        setWorkerBlobUrl(url);
      })
      .catch((err) => console.error("Failed to load GIF worker:", err));
      
    return () => {
      if (workerBlobUrl) URL.revokeObjectURL(workerBlobUrl);
    };
  }, []);

  const handleUpload = (files: FileList | null) => {
    if (!files) return;
    const newImages: ImageItem[] = Array.from(files).map((file) => ({
      id: generateId(),
      file,
      preview: URL.createObjectURL(file),
    }));

    setImages((prev) => {
      const updated = [...prev, ...newImages];
      // Set default dimensions based on first image if not set
      if (prev.length === 0 && newImages.length > 0) {
        const img = new Image();
        img.onload = () => {
          setSettings((s) => ({ ...s, width: img.width, height: img.height }));
        };
        img.src = newImages[0].preview;
      }
      return updated;
    });
  };

  const handleRemove = (id: string) => {
    setImages((prev) => {
      const newImages = prev.filter((img) => img.id !== id);
      // Revoke URL to avoid memory leaks
      const removed = prev.find((img) => img.id === id);
      if (removed) URL.revokeObjectURL(removed.preview);
      return newImages;
    });
  };

  const handleGenerate = async () => {
    if (!workerBlobUrl || images.length === 0) return;

    setIsGenerating(true);
    setProgress(0);
    setGeneratedGif(null);

    const gif = new GIF({
      workers: 2,
      quality: settings.quality,
      width: settings.width,
      height: settings.height,
      workerScript: workerBlobUrl,
      repeat: settings.repeat,
    });

    // Load all images and add to GIF
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = settings.width;
    canvas.height = settings.height;

    if (!ctx) {
      setIsGenerating(false);
      return;
    }

    // Process images sequentially
    for (const imageItem of images) {
      await new Promise<void>((resolve) => {
        const img = new Image();
        img.crossOrigin = "Anonymous";
        img.onload = () => {
          // Clear canvas
          ctx.fillStyle = "#ffffff"; // White background for transparency handling if needed
          ctx.fillRect(0, 0, settings.width, settings.height);
          
          // Draw image centered/contain
          // Calculate aspect ratio to fit
          const scale = Math.min(
            settings.width / img.width,
            settings.height / img.height
          );
          const w = img.width * scale;
          const h = img.height * scale;
          const x = (settings.width - w) / 2;
          const y = (settings.height - h) / 2;
          
          ctx.drawImage(img, x, y, w, h);
          
          gif.addFrame(ctx, { copy: true, delay: settings.delay });
          resolve();
        };
        img.src = imageItem.preview;
      });
    }

    gif.on("progress", (p: number) => {
      setProgress(p);
    });

    gif.on("finished", (blob: Blob) => {
      setGeneratedGif(URL.createObjectURL(blob));
      setIsGenerating(false);
    });

    gif.render();
  };

  return (
    <div className="min-h-screen p-4 md:p-8 max-w-7xl mx-auto space-y-8">
      <header className="flex items-center gap-3 pb-6 border-b border-gray-200">
        <div className="w-10 h-10 bg-brand-orange rounded-lg flex items-center justify-center text-white font-bold text-xl">
          G
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">GifForge</h1>
          <p className="text-sm text-gray-500">Create animated GIFs from images instantly</p>
        </div>
      </header>

      <main className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <ImageUploader onUpload={handleUpload} />
          <ImageGrid 
            images={images} 
            onRemove={handleRemove} 
            onReorder={setImages} 
          />
        </div>

        <div className="lg:col-span-1 space-y-6">
          <Controls
            settings={settings}
            onSettingsChange={setSettings}
            onGenerate={handleGenerate}
            isGenerating={isGenerating}
            progress={progress}
            hasImages={images.length > 0}
          />
          
          {generatedGif && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <GifPreview gifUrl={generatedGif} onClear={() => setGeneratedGif(null)} />
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
}
