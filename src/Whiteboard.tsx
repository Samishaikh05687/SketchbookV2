import { useEffect, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TooltipProvider } from './components/ui/tooltip';
import { Header } from './components/header/Header';
import { Toolbar } from './components/toolbar/Toolbar';
import { Canvas } from './components/canvas/Canvas';
import { StylePanel } from './components/panels/StylePanel';
import { MiniMap } from './components/panels/MiniMap';
import { useCanvasStore } from './stores/canvas-store';
import { generateColor, generateId } from './lib/utils';

const queryClient = new QueryClient();

export default function Whiteboard() {
  const [roomId, setRoomId] = useState<string>('');
  const { currentUser, setCurrentUser } = useCanvasStore();

  useEffect(() => {
    // Get room ID from URL or generate new one
    const urlParams = new URLSearchParams(window.location.search);
    const roomFromUrl = urlParams.get('room');
    const newRoomId = roomFromUrl || generateId();
    setRoomId(newRoomId);

    // Update URL without refresh
    if (!roomFromUrl) {
      const newUrl = `${window.location.origin}?room=${newRoomId}`;
      window.history.replaceState({}, '', newUrl);
    }

    // Initialize current user
    if (!currentUser) {
      const userName = prompt('Enter your name:') || 'Anonymous';
      setCurrentUser({
        id: generateId(),
        name: userName,
        color: generateColor()
      });
    }
  }, [currentUser, setCurrentUser]);

  const handleRoomChange = (newRoomId: string) => {
    setRoomId(newRoomId);
    const newUrl = `${window.location.origin}?room=${newRoomId}`;
    window.history.pushState({}, '', newUrl);
  };

  if (!roomId || !currentUser) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Initializing whiteboard...</p>
        </div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden">
          <Header roomId={roomId} onRoomChange={handleRoomChange} />
          <Toolbar />
          <StylePanel />
          <MiniMap />
          <div className="pt-16">
            <Canvas roomId={roomId} />
          </div>
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

