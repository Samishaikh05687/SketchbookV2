import { useState } from 'react';
import { HexColorPicker } from 'react-colorful';
import { Slider } from '../ui/slider';
import { Input } from '../ui/input';
import { useCanvasStore } from '../../stores/canvas-store';
import {
  Palette,
  Droplet,
  Minus,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Button } from '../ui/button';
import { cn } from '../../lib/utils';

const presetColors = [
  '#000000','#FFFFFF','#EF4444','#F97316','#F59E0B',
  '#EAB308','#84CC16','#22C55E','#10B981','#14B8A6',
  '#06B6D4','#0EA5E9','#3B82F6','#6366F1','#8B5CF6',
  '#A855F7','#D946EF','#EC4899','#F43F5E'
];

export function StylePanel() {
  const { currentStyle, setStyle } = useCanvasStore();
  const [open, setOpen] = useState(true);

  return (
    <div className="fixed flex right-4 top-[50%] -translate-y-1/2 z-50 ">
      <Button
          variant="ghost"
          size="icon"
          onClick={() => setOpen(!open)}
          className="self-center mt-2 bg-white border border-gray-200 py-2 px-2"
        >
          {open ? <ChevronRight /> : <ChevronLeft /> }
        </Button>
      <div
        className={cn(
          'overflow-y-auto max-h-[70vh] bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-3 flex',
          open ? 'flex-col w-64' : 'items-center hidden'
        )}
      >
        
        {open && (
          
          <div className="space-y-4">
            {/* Fill Color */}
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                <Droplet className="h-4 w-4" /> Fill
              </label>
              <div className="space-y-2">
                <div className="flex flex-wrap gap-1">
                  {presetColors.map((color) => (
                    <button
                      key={color}
                      className="w-6 h-6 rounded border-2 border-gray-200 hover:border-gray-400 transition-colors"
                      style={{ backgroundColor: color }}
                      onClick={() => setStyle({ fill: color })}
                    />
                  ))}
                </div>
                <HexColorPicker
                  color={currentStyle.fill}
                  onChange={(color) => setStyle({ fill: color })}
                  style={{ width: '100%', height: '120px' }}
                />
                <Input
                  type="text"
                  value={currentStyle.fill}
                  onChange={(e) => setStyle({ fill: e.target.value })}
                  className="h-8 text-sm"
                />
              </div>
            </div>

            {/* Stroke Color */}
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                <Palette className="h-4 w-4" /> Stroke
              </label>
              <div className="space-y-2">
                <div className="flex flex-wrap gap-1">
                  {presetColors.map((color) => (
                    <button
                      key={color}
                      className="w-6 h-6 rounded border-2 border-gray-200 hover:border-gray-400 transition-colors"
                      style={{ backgroundColor: color }}
                      onClick={() => setStyle({ stroke: color })}
                    />
                  ))}
                </div>
                <Input
                  type="text"
                  value={currentStyle.stroke}
                  onChange={(e) => setStyle({ stroke: e.target.value })}
                  className="h-8 text-sm"
                />
              </div>
            </div>

            {/* Stroke Width */}
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                <Minus className="h-4 w-4" /> Stroke Width: {currentStyle.strokeWidth}px
              </label>
              <Slider
                value={[currentStyle.strokeWidth]}
                onValueChange={([value]) => setStyle({ strokeWidth: value })}
                min={1}
                max={50}
                step={1}
                className="w-full"
              />
            </div>

            {/* Opacity */}
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                <MoreHorizontal className="h-4 w-4" /> Opacity:{' '}
                {Math.round(currentStyle.opacity * 100)}%
              </label>
              <Slider
                value={[currentStyle.opacity]}
                onValueChange={([value]) => setStyle({ opacity: value })}
                min={0.1}
                max={1}
                step={0.1}
                className="w-full"
              />
            </div>

            {/* Font Size */}
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Font Size: {currentStyle.fontSize}px
              </label>
              <Slider
                value={[currentStyle.fontSize]}
                onValueChange={([value]) => setStyle({ fontSize: value })}
                min={8}
                max={72}
                step={1}
                className="w-full bg-white"
              />
            </div>
          </div>
        )}

        {/* Toggle Button */}
        
      </div>
    </div>
  );
}
