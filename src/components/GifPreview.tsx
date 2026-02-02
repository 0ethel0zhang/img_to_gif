import * as React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Share2, Trash2 } from "lucide-react";

interface GifPreviewProps {
  gifUrl: string | null;
  onClear: () => void;
}

export function GifPreview({ gifUrl, onClear }: GifPreviewProps) {
  if (!gifUrl) return null;

  const handleDownload = () => {
    if (!gifUrl) return;
    const a = document.createElement("a");
    a.href = gifUrl;
    a.download = `gifforge-${Date.now()}.gif`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <Card className="p-6 space-y-4 bg-white border-brand-orange/20 shadow-lg ring-4 ring-brand-orange/5">
      <div className="flex items-center justify-between pb-2 border-b border-gray-100">
        <h2 className="font-semibold text-lg text-brand-orange">Result</h2>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={onClear} className="text-red-500 hover:text-red-600 hover:bg-red-50">
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
      
      <div className="flex justify-center bg-[url('https://www.transparenttextures.com/patterns/subtle-grey.png')] bg-gray-50 rounded-lg overflow-hidden border border-gray-200">
        <img src={gifUrl} alt="Generated GIF" className="max-w-full max-h-[500px] object-contain" />
      </div>

      <div className="flex gap-3 pt-2">
        <Button className="flex-1" onClick={handleDownload}>
          <Download className="w-4 h-4 mr-2" />
          Download GIF
        </Button>
      </div>
    </Card>
  );
}
