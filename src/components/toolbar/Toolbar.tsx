import React, { useState } from 'react';
import {
  MousePointer,
  Pencil,
  Paintbrush,
  Eraser,
  Minus,
  Square,
  Circle,
  ArrowRight,
  Triangle,
  Diamond,
  Star,
  Type,
  StickyNote,
  Link,
  Hand,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Button } from '../ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../ui/tooltip';
import { useCanvasStore } from '../../stores/canvas-store';
import { Tool } from '../../types/canvas';
import { cn } from '../../lib/utils';

const tools: Array<{ tool: Tool; icon: React.ComponentType; label: string; shortcut?: string }> = [
  { tool: 'select', icon: MousePointer, label: 'Select', shortcut: 'V' },
  { tool: 'pencil', icon: Pencil, label: 'Pencil', shortcut: 'P' },
  { tool: 'brush', icon: Paintbrush, label: 'Brush', shortcut: 'B' },
  { tool: 'eraser', icon: Eraser, label: 'Eraser', shortcut: 'E' },
  { tool: 'line', icon: Minus, label: 'Line', shortcut: 'L' },
  { tool: 'rectangle', icon: Square, label: 'Rectangle', shortcut: 'R' },
  { tool: 'circle', icon: Circle, label: 'Circle', shortcut: 'O' },
  { tool: 'arrow', icon: ArrowRight, label: 'Arrow', shortcut: 'A' },
  { tool: 'triangle', icon: Triangle, label: 'Triangle', shortcut: 'T' },
  { tool: 'diamond', icon: Diamond, label: 'Diamond', shortcut: 'D' },
  { tool: 'star', icon: Star, label: 'Star', shortcut: 'S' },
  { tool: 'text', icon: Type, label: 'Text', shortcut: 'X' },
  { tool: 'sticky-note', icon: StickyNote, label: 'Sticky Note', shortcut: 'N' },
  { tool: 'connector', icon: Link, label: 'Connector', shortcut: 'C' },
  { tool: 'pan', icon: Hand, label: 'Pan', shortcut: 'Space' },
];

export function Toolbar() {
  const { selectedTool, setTool } = useCanvasStore();
  const [open, setOpen] = useState(true);

  const handleToolSelect = (tool: Tool) => {
    setTool(tool);
  };

  return (
    <TooltipProvider>
      <div className="fixed flex left-4 top-1/2 -translate-y-1/2 z-50">

        <div
          className={cn(
            'bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-2 flex',
            open ? 'flex-col' : 'items-center hidden '
          )}
        >
          {open && (
            <div className="grid grid-cols-2 gap-2 mb-2">
              {tools.map(({ tool, icon: Icon, label, shortcut }) => (
                <Tooltip key={tool}>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className={cn(
                        'h-10 w-10 transition-all duration-200',
                        selectedTool === tool
                          ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 shadow-sm'
                          : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                      )}
                      onClick={() => handleToolSelect(tool)}
                    >
                      <Icon />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    <div className="flex items-center gap-2">
                      <span>{label}</span>
                      {shortcut && (
                        <kbd className="px-2 py-0.5 text-xs bg-gray-100 dark:bg-gray-700 rounded">
                          {shortcut}
                        </kbd>
                      )}
                    </div>
                  </TooltipContent>
                </Tooltip>
              ))}
            </div>
          )}
           {/* Toggle Button */}
         

         
        </div>
         <Button
            variant="ghost"
            size="icon"
            onClick={() => setOpen(!open)}
            className="self-center border border-gray-200 bg-white  dark:bg-gray-800 py-2 px-2"
          >
            {open ? <ChevronLeft /> : <ChevronRight />}
          </Button>
      </div>
    </TooltipProvider>
  );
}
