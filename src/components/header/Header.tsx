import  { useState } from 'react';
import { 
  Users, 
  Share2, 
  Download, 
  Upload, 
  Undo2, 
  Redo2,
  Grid3x3,
  ZoomIn,
  ZoomOut,
  Move3D,
  PenLine
} from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { useCanvasStore } from '../../stores/canvas-store';
import { generateId } from '../../lib/utils';
import { stageRefGlobal } from "../canvas/Canvas";

interface HeaderProps {
  roomId: string;
  onRoomChange: (roomId: string) => void;
}

export function Header({ roomId, onRoomChange }: HeaderProps) {
  const [newRoomId, setNewRoomId] = useState('');
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  
  const { 
    users, 
    currentUser, 
    canvas, 
    scale, 
    position,
    showGrid,
    setScale, 
    setPosition, 
    resetView,
    undo,
    redo,
    history,
    historyIndex
  } = useCanvasStore();

  const handleCreateRoom = () => {
    const id = newRoomId.trim() || generateId();
    onRoomChange(id);
    setNewRoomId('');
  };

  const handleExportPNG = () => {
    if (!stageRefGlobal.current) return;
    const uri = stageRefGlobal.current.toDataURL();
    const link = document.createElement("a");
    link.download = `whiteboard-${roomId}.png`;
    link.href = uri;
    link.click();
  };

 const handleExportSVG = () => {
   if (!stageRefGlobal.current) return;
   const uri = stageRefGlobal.current.toDataURL({ mimeType: "image/svg+xml" });
   const link = document.createElement("a");
   link.download = `whiteboard-${roomId}.svg`;
   link.href = uri;
   link.click();
 };

 const handleExportPDF = () => {
   if (!stageRefGlobal.current) return;
   const uri = stageRefGlobal.current.toDataURL({ pixelRatio: 2 });

   // use jsPDF
   import("jspdf").then(({ jsPDF }) => {
     const pdf = new jsPDF();
     pdf.addImage(uri, "PNG", 10, 10, 180, 160);
     pdf.save(`whiteboard-${roomId}.pdf`);
   });
 };

  const handleExportJSON = () => {
    const data = JSON.stringify(canvas, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `whiteboard-${roomId}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

const { clearCanvas } = useCanvasStore();


  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-2">
      <div className="flex items-center justify-between">
        {/* Left section */}
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            <PenLine className="inline-block h-6 w-6 mr-1" /> SketchbookV2
          </h1>
          
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <span>Room:</span>
            <code className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs font-mono">
              {roomId}
            </code>
          </div>

          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                Change Room
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Join or Create Room</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Input
                    placeholder="Enter room ID (leave empty for random)"
                    value={newRoomId}
                    onChange={(e) => setNewRoomId(e.target.value)}
                  />
                </div>
                <Button onClick={handleCreateRoom} className="w-full">
                  {newRoomId.trim() ? 'Join Room' : 'Create New Room'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Center section - Controls */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={undo}
            disabled={historyIndex < 0}
            title="Undo (Ctrl+Z)"
          >
            <Undo2 className="h-4 w-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={redo}
            disabled={historyIndex >= history.length - 1}
            title="Redo (Ctrl+Shift+Z)"
          >
            <Redo2 className="h-4 w-4" />
          </Button>

          <div className="w-px h-6 bg-gray-200 dark:bg-gray-700 mx-2" />

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setScale(scale * 0.9)}
            title="Zoom Out"
          >
            <ZoomOut className="h-4 w-4" />
          </Button>

          <span className="text-sm text-gray-600 dark:text-gray-400 min-w-[3rem] text-center">
            {Math.round(scale * 100)}%
          </span>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setScale(scale * 1.1)}
            title="Zoom In"
          >
            <ZoomIn className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={resetView}
            title="Reset View"
          >
            <Move3D className="h-4 w-4" />
          </Button>

          <div className="w-px h-6 bg-gray-200 dark:bg-gray-700 mx-2" />

          <Button
            variant="ghost"
            size="icon"
            title="Toggle Grid"
          >
            <Grid3x3 className="h-4 w-4" />
          </Button>

          <Button size="sm"
  className='bg-red-500 text-white hover:bg-red-600'
  onClick={() => { clearCanvas();}}
>
  Clear Canvas
</Button>
        </div>

        {/* Right section */}
        <div className="flex items-center gap-2">
          {/* Active users */}
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-gray-500" />
            <div className="flex -space-x-2">
              {currentUser && (
                <div
                  className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-medium"
                  style={{ backgroundColor: currentUser.color }}
                  title={`${currentUser.name} (You)`}
                >
                  {currentUser.name.charAt(0).toUpperCase()}
                </div>
              )}
              {Array.from(users.values()).map(user => (
                <div
                  key={user.id}
                  className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-medium"
                  style={{ backgroundColor: user.color }}
                  title={user.name}
                >
                  {user.name.charAt(0).toUpperCase()}
                </div>
              ))}
            </div>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {(users.size + (currentUser ? 1 : 0))} online
            </span>
          </div>

          {/* Share */}
          <Dialog open={isShareOpen} onOpenChange={setIsShareOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Share Whiteboard</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Room Link</label>
                  <div className="flex gap-2 mt-1">
                    <Input
                      value={`${window.location.origin}?room=${roomId}`}
                      readOnly
                      className="font-mono text-sm"
                    />
                    <Button
                      variant="outline"
                      onClick={() => {
                        navigator.clipboard.writeText(`${window.location.origin}?room=${roomId}`);
                      }}
                    >
                      Copy
                    </Button>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {/* Export */}
          <Dialog open={isExportOpen} onOpenChange={setIsExportOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Export Whiteboard</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" onClick={handleExportPNG}>
                  <Download className="h-4 w-4 mr-2" />
                  PNG Image
                </Button>
                <Button variant="outline" onClick={handleExportSVG}>
                  <Download className="h-4 w-4 mr-2" />
                  SVG Vector
                </Button>
                <Button variant="outline" onClick={handleExportPDF}>
                  <Download className="h-4 w-4 mr-2" />
                  PDF Document
                </Button>
                <Button variant="outline" onClick={handleExportJSON}>
                  <Download className="h-4 w-4 mr-2" />
                  JSON Data
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          {/* Import */}
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Upload className="h-4 w-4 mr-2" />
                Import
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Import Whiteboard</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Import JSON File</label>
                  <Input
                    type="file"
                    accept=".json"
                    className="mt-1"
                  />
                </div>
                <Button className="w-full">
                  Import Whiteboard
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </header>
  );
}