import React from 'react';
import { useCanvasStore } from '../../stores/canvas-store';
import { MousePointer } from 'lucide-react';

export function UserCursors() {
  const { users, currentUser } = useCanvasStore();

  return (
    <div className="absolute inset-0 pointer-events-none z-10">
      {Array.from(users.values())
        .filter(user => user.id !== currentUser?.id && user.cursor)
        .map(user => (
          <div
            key={user.id}
            className="absolute transition-all duration-100 ease-out"
            style={{
              left: user.cursor!.x,
              top: user.cursor!.y,
              color: user.color
            }}
          >
            <MousePointer className="h-4 w-4" />
            <div 
              className="absolute top-4 left-2 px-2 py-1 text-xs text-white rounded whitespace-nowrap"
              style={{ backgroundColor: user.color }}
            >
              {user.name}
            </div>
          </div>
        ))}
    </div>
  );
}