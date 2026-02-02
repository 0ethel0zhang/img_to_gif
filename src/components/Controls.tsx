import * as React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Settings, Play, Download, Loader2 } from "lucide-react";

interface GifSettings {
  width: number;
  height: number;
  delay: number;
  quality: number;
  repeat: number; // 0 for infinite, -1 for no loop (gif.js uses 0 for infinite)
}

interface ControlsProps {
  settings: GifSettings;
  onSettingsChange: (settings: GifSettings) => void;
  onGenerate: () => void;
  isGenerating: boolean;
  progress: number;
  hasImages: boolean;
}

export function Controls({
  settings,
  onSettingsChange,
  onGenerate,
  isGenerating,
  progress,
  hasImages,
}: ControlsProps) {
  const handleChange = (key: keyof GifSettings, value: number) => {
    onSettingsChange({ ...settings, [key]: value });
  };

  return (
    <Card className="p-6 space-y-6 h-fit sticky top-6">
      <div className="flex items-center gap-2 pb-4 border-b border-gray-100">
        <Settings className="w-5 h-5 text-brand-orange" />
        <h2 className="font-semibold text-lg">Settings</h2>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Width (px)</label>
            <Input
              type="number"
              value={settings.width}
              onChange={(e) => handleChange("width", parseInt(e.target.value) || 0)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Height (px)</label>
            <Input
              type="number"
              value={settings.height}
              onChange={(e) => handleChange("height", parseInt(e.target.value) || 0)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 flex justify-between">
            <span>Frame Delay (ms)</span>
            <span className="text-gray-500 font-mono">{settings.delay}ms</span>
          </label>
          <input
            type="range"
            min="20"
            max="2000"
            step="10"
            value={settings.delay}
            onChange={(e) => handleChange("delay", parseInt(e.target.value))}
            className="w-full accent-brand-orange h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 flex justify-between">
            <span>Quality</span>
            <span className="text-gray-500 font-mono">{settings.quality}</span>
          </label>
          <input
            type="range"
            min="1"
            max="30"
            step="1"
            value={settings.quality}
            onChange={(e) => handleChange("quality", parseInt(e.target.value))}
            className="w-full accent-brand-orange h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <p className="text-xs text-gray-500">Lower is better quality, but slower.</p>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="loop"
            checked={settings.repeat === 0}
            onChange={(e) => handleChange("repeat", e.target.checked ? 0 : -1)}
            className="w-4 h-4 text-brand-orange border-gray-300 rounded focus:ring-brand-orange"
          />
          <label htmlFor="loop" className="text-sm font-medium text-gray-700">
            Loop Forever
          </label>
        </div>
      </div>

      <div className="pt-4 border-t border-gray-100">
        <Button
          className="w-full"
          size="lg"
          onClick={onGenerate}
          disabled={!hasImages || isGenerating}
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              {Math.round(progress * 100)}%
            </>
          ) : (
            <>
              <Play className="w-5 h-5 mr-2" />
              Generate GIF
            </>
          )}
        </Button>
      </div>
    </Card>
  );
}
