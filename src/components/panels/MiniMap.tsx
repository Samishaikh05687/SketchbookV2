import { useRef, useEffect, useState } from 'react';
import { Stage, Layer, Rect, Circle, Line } from 'react-konva';
import { useCanvasStore } from '../../stores/canvas-store';
import Draggable, { DraggableData, DraggableEvent } from 'react-draggable';

export function MiniMap() {
  const stageRef = useRef<any>(null);
  const { canvas, scale, position, showMiniMap } = useCanvasStore();

  if (!showMiniMap) return null;

  const miniMapScale = 0.1;
  const miniMapSize = { width: 200, height: 150 };

  // Load saved position from localStorage
  const [pos, setPos] = useState<{ x: number; y: number }>(() => {
    const saved = localStorage.getItem('miniMapPos');
    return saved ? JSON.parse(saved) : { x: window.innerWidth - miniMapSize.width - 16, y: window.innerHeight - miniMapSize.height - 16 };
  });

  // Save position on change
  const handleDragStop = (_: DraggableEvent, data: DraggableData) => {
    let newX = data.x;
    let newY = data.y;

    // Snap to edges if within 20px
    if (newX < 20) newX = 0;
    if (newY < 20) newY = 0;
    if (newX + miniMapSize.width + 20 > window.innerWidth) newX = window.innerWidth - miniMapSize.width;
    if (newY + miniMapSize.height + 20 > window.innerHeight) newY = window.innerHeight - miniMapSize.height;

    const snappedPos = { x: newX, y: newY };
    setPos(snappedPos);
    localStorage.setItem('miniMapPos', JSON.stringify(snappedPos));
  };

  // Calculate viewport rectangle
  const viewportRect = {
    x: -position.x * miniMapScale / scale,
    y: -position.y * miniMapScale / scale,
    width: window.innerWidth * miniMapScale / scale,
    height: window.innerHeight * miniMapScale / scale
  };

  const renderMiniObject = (obj: any) => {
    const commonProps = {
      key: obj.id,
      x: obj.x * miniMapScale,
      y: obj.y * miniMapScale,
      fill: obj.fill,
      stroke: obj.stroke,
      strokeWidth: (obj.strokeWidth || 1) * miniMapScale,
      opacity: 0.8
    };

    switch (obj.type) {
      case 'line':
        const scaledPoints = (obj.points || []).map((p: number) => p * miniMapScale);
        return <Line {...commonProps} points={scaledPoints} />;
      case 'rectangle':
        return <Rect {...commonProps} width={obj.width * miniMapScale} height={obj.height * miniMapScale} />;
      case 'circle':
        return <Circle {...commonProps} radius={Math.max(obj.width || 0, obj.height || 0) * miniMapScale / 2} />;
      default:
        return null;
    }
  };

  return (
    <Draggable position={pos} onStop={handleDragStop} bounds="parent">
      <div className="fixed z-50 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-2 cursor-move">
        <div className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">Mini Map</div>
        <div className="relative">
          <Stage width={miniMapSize.width} height={miniMapSize.height} ref={stageRef}>
            <Layer>
              {/* Canvas background */}
              <Rect
                width={miniMapSize.width}
                height={miniMapSize.height}
                fill="#F9FAFB"
                stroke="#E5E7EB"
              />
              
              {/* Canvas objects */}
              {canvas.objects.map(renderMiniObject)}
              
              {/* Viewport indicator */}
              <Rect
                {...viewportRect}
                fill="transparent"
                stroke="#3B82F6"
                strokeWidth={2}
                opacity={0.7}
              />
            </Layer>
          </Stage>
        </div>
      </div>
    </Draggable>
  );
}
