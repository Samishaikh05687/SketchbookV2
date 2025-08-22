import  { useRef, useEffect, useState, useCallback } from 'react';
import { Stage, Layer, Rect, Circle, Line, Text, Arrow, RegularPolygon, Group } from 'react-konva';
import { KonvaEventObject } from 'konva/lib/Node';
import Konva from 'konva';
import { useCanvasStore } from '../../stores/canvas-store';
import { useSocket } from '../../hooks/use-socket';
import { CanvasObject, Point } from '../../types/canvas';
import { generateId } from '../../lib/utils';
import { CanvasGrid } from './CanvasGrid';
import { UserCursors } from './UserCursors';

// Define proper type for stageRefGlobal
export const stageRefGlobal = { current: null as Konva.Stage | null };

interface CanvasProps {
  roomId: string;
}

export function Canvas({ roomId }: CanvasProps) {
  const stageRef = useRef<Konva.Stage>(null);
  const [stageSize, setStageSize] = useState({ width: window.innerWidth, height: window.innerHeight });
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentPath, setCurrentPath] = useState<number[]>([]);
  const [isPanning, setIsPanning] = useState(false);
  const [editingTextId, setEditingTextId] = useState<string | null>(null);
  const [originalText, setOriginalText] = useState<string>('');
  const [eraserMarks, setEraserMarks] = useState<{x: number, y: number}[]>([]);
  const panStart = useRef<Point>({ x: 0, y: 0 });

  stageRefGlobal.current = stageRef.current;

  const {
    canvas,
    selectedTool,
    
    scale,
    position,
    showGrid,
    currentStyle,
    addObject,
    updateObject,
    deleteObject, // Added deleteObject
    selectObjects,
    clearSelection,
    setPosition,
    setScale,
  } = useCanvasStore();

  const { emitCanvasUpdate, emitCursorMove } = useSocket(roomId);

  // Resize stage on window resize
  useEffect(() => {
    const handleResize = () => setStageSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);


  // Handle double-click to open modal
  const handleDoubleClick = useCallback(
  (e: KonvaEventObject<MouseEvent>) => {
    const stage = e.target.getStage();
    if (!stage) return;
    const point = stage.getPointerPosition();
    if (!point) return; // Null check
    const intersected = stage.getIntersection(point);
    if (intersected && ['text', 'sticky-note'].includes(intersected.getAttr('type'))) {
      const id = intersected.getAttr('id');
      const obj = canvas.objects.find((o) => o.id === id);
      if (obj) {
        setEditingTextId(id);
        setOriginalText(obj.text || '');
      }
    }
  },
  [canvas.objects]
);

  // Handle text change
  const handleTextChange = useCallback(
    (id: string, newText: string) => {
      updateObject(id, { text: newText });
      emitCanvasUpdate(canvas); // Real-time sync
    },
    [updateObject, canvas, emitCanvasUpdate]
  );

  // Handle modal close
  const handleCloseModal = useCallback(
    (revert: boolean) => {
      if (editingTextId && revert) {
        updateObject(editingTextId, { text: originalText }); // Revert to original text
        emitCanvasUpdate(canvas);
      }
      setEditingTextId(null);
      setOriginalText('');
    },
    [editingTextId, originalText, updateObject, canvas, emitCanvasUpdate]
  );

  // Mouse down for drawing or panning
  const handleMouseDown = useCallback(
    (e: KonvaEventObject<MouseEvent>) => {
      const stage = e.target.getStage();
      if (!stage) return;
      const point = stage.getPointerPosition();
      if (!point) return;

      // Right-click for panning
      if (e.evt.button === 2) {
        setIsPanning(true);
        panStart.current = { x: point.x - position.x, y: point.y - position.y };
        return;
      }

      if (selectedTool === 'select') {
        // Don't return here, allow selection and drawing with select tool
        // Only clear selection if we're not clicking on an object
        const clickedObject = canvas.objects.find(obj => {
          // More accurate hit detection using Konva's getIntersection
          const stage = e.target.getStage();
          if (!stage) return false;
          const intersected = stage.getIntersection(point);
          return intersected && intersected.getAttr('id') === obj.id;
        });
        
        if (!clickedObject) {
          clearSelection();
        }
        // Continue with the rest of the function to allow drawing with select tool
      }

      const adjustedPoint = {
        x: (point.x - position.x) / scale,
        y: (point.y - position.y) / scale,
      };

      setIsDrawing(true);

      switch (selectedTool) {
        case 'pencil':
        case 'brush':
          const newPath = [adjustedPoint.x, adjustedPoint.y];
          setCurrentPath(newPath);
          const newObject: CanvasObject = {
            id: generateId(),
            type: 'line',
            x: 0,
            y: 0,
            points: newPath,
            stroke: currentStyle.stroke,
            strokeWidth: selectedTool === 'brush' ? currentStyle.strokeWidth * 2 : currentStyle.strokeWidth,
            opacity: currentStyle.opacity,
            fill: undefined,
          };
          addObject(newObject);
          break;

        case 'line':
          addObject({
            id: generateId(),
            type: 'line',
            x: adjustedPoint.x,
            y: adjustedPoint.y,
            points: [adjustedPoint.x, adjustedPoint.y, adjustedPoint.x, adjustedPoint.y],
            stroke: currentStyle.stroke,
            strokeWidth: currentStyle.strokeWidth,
            opacity: currentStyle.opacity,
            fill: undefined,
          });
          break;

        case 'rectangle':
          addObject({
            id: generateId(),
            type: 'rectangle',
            x: adjustedPoint.x,
            y: adjustedPoint.y,
            width: 0,
            height: 0,
            fill: currentStyle.fill,
            stroke: currentStyle.stroke,
            strokeWidth: currentStyle.strokeWidth,
            opacity: currentStyle.opacity,
          });
          break;

        case 'circle':
          addObject({
            id: generateId(),
            type: 'circle',
            x: adjustedPoint.x,
            y: adjustedPoint.y,
            width: 0,
            height: 0,
            fill: currentStyle.fill,
            stroke: currentStyle.stroke,
            strokeWidth: currentStyle.strokeWidth,
            opacity: currentStyle.opacity,
          });
          break;

        case 'arrow':
          addObject({
            id: generateId(),
            type: 'arrow',
            x: 0,
            y: 0,
            points: [adjustedPoint.x, adjustedPoint.y, adjustedPoint.x, adjustedPoint.y],
            stroke: currentStyle.stroke,
            strokeWidth: currentStyle.strokeWidth,
            opacity: currentStyle.opacity,
            fill: currentStyle.stroke,
          });
          break;

        case 'triangle':
          addObject({
            id: generateId(),
            type: 'triangle',
            x: adjustedPoint.x,
            y: adjustedPoint.y,
            width: 0,
            height: 0,
            fill: currentStyle.fill,
            stroke: currentStyle.stroke,
            strokeWidth: currentStyle.strokeWidth,
            opacity: currentStyle.opacity,
          });
          break;

        case 'diamond':
          addObject({
            id: generateId(),
            type: 'diamond',
            x: adjustedPoint.x,
            y: adjustedPoint.y,
            width: 0,
            height: 0,
            fill: currentStyle.fill,
            stroke: currentStyle.stroke,
            strokeWidth: currentStyle.strokeWidth,
            opacity: currentStyle.opacity,
          });
          break;

        case 'star':
          addObject({
            id: generateId(),
            type: 'star',
            x: adjustedPoint.x,
            y: adjustedPoint.y,
            width: 0,
            height: 0,
            fill: currentStyle.fill,
            stroke: currentStyle.stroke,
            strokeWidth: currentStyle.strokeWidth,
            opacity: currentStyle.opacity,
            numPoints: 5,
            innerRadius: 0,
            outerRadius: 0,
          });
          break;

        case 'text':
          addObject({
            id: generateId(),
            type: 'text',
            x: adjustedPoint.x,
            y: adjustedPoint.y,
            text: 'Double-click to edit',
            fill: currentStyle.stroke,
            stroke: undefined,
            strokeWidth: 0,
            opacity: currentStyle.opacity,
            style: {
              fontSize: currentStyle.fontSize || 16,
              fontFamily: 'Arial',
            },
          });
          setIsDrawing(false);
          emitCanvasUpdate(canvas);
          break;
          
          
        case 'sticky-note':
          addObject({
            id: generateId(),
            type: 'sticky-note',
            x: adjustedPoint.x,
            y: adjustedPoint.y,
            width: 150,
            height: 100,
            fill: currentStyle.fill || '#ffeb3b',
            stroke: currentStyle.stroke || '#f57c00',
            strokeWidth: currentStyle.strokeWidth || 2,
            opacity: currentStyle.opacity,
            text: 'Double-click to edit',
            style: {
              fontSize: currentStyle.fontSize || 14,
              fontFamily: 'Arial',
              padding: 10,
            },
          });
          setIsDrawing(false);
          emitCanvasUpdate(canvas);
          break;

        case 'pan':
          setIsDrawing(false);
          break;

        case 'eraser':
          break;
      }
    },
    [selectedTool, position, scale, currentStyle, addObject, clearSelection, canvas, emitCanvasUpdate]
  );

  // Mouse move for drawing or panning
  const handleMouseMove = useCallback(
    (e: KonvaEventObject<MouseEvent>) => {
      const stage = e.target.getStage();
      if (!stage) return;
      const point = stage.getPointerPosition();
      if (!point) return;

      emitCursorMove(point);

      if (isPanning) {
        setPosition({ x: point.x - panStart.current.x, y: point.y - panStart.current.y });
        return;
      }

      if (!isDrawing) return;

      const adjustedPoint = { x: (point.x - position.x) / scale, y: (point.y - position.y) / scale };
      const lastObject = canvas.objects[canvas.objects.length - 1];

      switch (selectedTool) {
        case 'pencil':
        case 'brush':
          const newPath = [...currentPath, adjustedPoint.x, adjustedPoint.y];
          setCurrentPath(newPath);
          if (lastObject) {
            updateObject(lastObject.id, { points: newPath });
            emitCanvasUpdate(canvas); // Real-time update
          }
          break;

        case 'line':
        case 'arrow':
          if (lastObject) {
            const points = [lastObject.x || 0, lastObject.y || 0, adjustedPoint.x, adjustedPoint.y];
            updateObject(lastObject.id, { points });
            emitCanvasUpdate(canvas); // Real-time update
          }
          break;

        case 'rectangle':
        case 'triangle':
        case 'diamond':
        case 'circle':
          if (lastObject) {
            const width = adjustedPoint.x - lastObject.x;
            const height = adjustedPoint.y - lastObject.y;
            updateObject(lastObject.id, { width, height });
            emitCanvasUpdate(canvas); // Real-time update
          }
          break;

        case 'star':
          if (lastObject) {
            const width = adjustedPoint.x - lastObject.x;
            const height = adjustedPoint.y - lastObject.y;
            const radius = Math.max(Math.abs(width), Math.abs(height)) / 2;
            updateObject(lastObject.id, {
              width: radius * 2,
              height: radius * 2,
              outerRadius: radius,
              innerRadius: radius * 0.5,
            });
            emitCanvasUpdate(canvas); // Real-time update
          }
          break;

      case "eraser":
        // Brush-style eraser using globalCompositeOperation
        if (point) {
          // Only add a mark if the mouse has moved a certain distance
          if (eraserMarks.length === 0 ||
              Math.sqrt(Math.pow(point.x - eraserMarks[eraserMarks.length - 1].x, 2) +
                       Math.pow(point.y - eraserMarks[eraserMarks.length - 1].y, 2)) > 5) {
            setEraserMarks(prev => [...prev, {x: point.x, y: point.y}]);
          }
        }
        break;

      }
    },
    [isDrawing, isPanning, currentPath, position, scale, selectedTool, canvas, updateObject, deleteObject, emitCursorMove, setPosition, emitCanvasUpdate, setEraserMarks]
  );

  // Mouse up
  const handleMouseUp = useCallback(() => {
    if (isDrawing) {
      setIsDrawing(false);
      setCurrentPath([]);
      emitCanvasUpdate(canvas);
    }
    if (isPanning) setIsPanning(false);
    // Clear eraser marks when done erasing
    if (selectedTool === 'eraser') {
      setEraserMarks([]);
    }
  }, [isDrawing, isPanning, canvas, emitCanvasUpdate, selectedTool, setEraserMarks]);

  // Wheel zoom
  const handleWheel = useCallback(
    (e: KonvaEventObject<WheelEvent>) => {
      e.evt.preventDefault();
      const stage = e.target.getStage();
      if (!stage) return;

      const oldScale = scale;
      const pointer = stage.getPointerPosition();
      if (!pointer) return;

      const mousePointTo = { x: (pointer.x - position.x) / oldScale, y: (pointer.y - position.y) / oldScale };
      let direction = e.evt.deltaY > 0 ? -1 : 1;
      if (e.evt.ctrlKey) direction = -direction;

      const newScale = Math.max(0.1, Math.min(5, oldScale * (1 + direction * 0.1)));
      const newPos = { x: pointer.x - mousePointTo.x * newScale, y: pointer.y - mousePointTo.y * newScale };
      setScale(newScale);
      setPosition(newPos);
    },
    [scale, position, setScale, setPosition]
  );

  



  // Render objects
  const renderObject = useCallback(
    (obj: CanvasObject) => {
      const commonProps = {
        key: obj.id,
        id: obj.id, // Ensure id is passed for hit detection
        x: obj.x,
        y: obj.y,
        fill: obj.fill,
        stroke: obj.stroke,
        strokeWidth: obj.strokeWidth,
        opacity: obj.opacity,
        rotation: obj.rotation || 0,
        scaleX: obj.scaleX || 1,
        scaleY: obj.scaleY || 1,
        draggable: true,
        type: obj.type, // Store type for double-click detection
        onClick: () => selectedTool === 'select' && selectObjects([obj.id]),
        onDblClick: () => {
          if (['text', 'sticky-note'].includes(obj.type)) {
            setEditingTextId(obj.id);
            setOriginalText(obj.text || '');
          }
        },
        onDragEnd: (e: KonvaEventObject<DragEvent>) => {
          const node = e.target;
          updateObject(obj.id, {
            x: (node.x() - position.x) / scale,
            y: (node.y() - position.y) / scale,
          });
          emitCanvasUpdate(canvas);
        },
        onTransformEnd: (e: KonvaEventObject<Event>) => {
          const node = e.target;
          updateObject(obj.id, {
            scaleX: node.scaleX(),
            scaleY: node.scaleY(),
            rotation: node.rotation(),
          });
          emitCanvasUpdate(canvas);
        },
      };

      switch (obj.type) {
        case 'line':
          return <Line {...commonProps} points={obj.points || []} />;
        case 'rectangle':
          return <Rect {...commonProps} width={obj.width} height={obj.height} />;
        case 'circle':
          return <Circle {...commonProps} radius={Math.max(obj.width || 0, obj.height || 0) / 2} />;
        case 'arrow':
          return <Arrow {...commonProps} points={obj.points || []} />;
        case 'triangle':
          return (
            <RegularPolygon
              {...commonProps}
              sides={3}
              radius={Math.max(obj.width || 0, obj.height || 0) / 2}
            />
          );
        case 'diamond':
          return (
            <RegularPolygon
              {...commonProps}
              sides={4}
              radius={Math.max(obj.width || 0, obj.height || 0) / 2}
              rotation={55}
            />
          );
        case 'star':
          return (
            <RegularPolygon
              {...commonProps}
              sides={obj.numPoints || 5}
              radius={obj.outerRadius || 20}
              innerRadius={obj.innerRadius || 10}
            />
          );
        case 'text':
          return (
            <Text
              {...commonProps}
              text={obj.text || ''}
              fontSize={obj.style?.fontSize || 16}
              fontFamily={obj.style?.fontFamily || 'Arial'}
            />
          );
        case 'sticky-note':
          return (
            <Group {...commonProps}>
              <Rect
                width={obj.width || 150}
                height={obj.height || 100}
                fill={obj.fill || '#ffeb3b'}
                stroke={obj.stroke || '#f57c00'}
                strokeWidth={obj.strokeWidth || 2}
              />
              <Text
                x={obj.style?.padding || 10}
                y={obj.style?.padding || 10}
                width={(obj.width || 150) - (obj.style?.padding || 10) * 2}
                height={(obj.height || 100) - (obj.style?.padding || 10) * 2}
                text={obj.text || ''}
                fontSize={obj.style?.fontSize || 14}
                fontFamily={obj.style?.fontFamily || 'Arial'}
                fill={obj.stroke || '#000'}
                wrap="word"
              />
            </Group>
          );
        default:
          return null;
      }
    },
    [selectedTool, selectObjects, position, scale, updateObject, canvas, emitCanvasUpdate, editingTextId, handleTextChange]
  );

 return (
    <div className="relative w-full h-full bg-gray-50 dark:bg-gray-900 overflow-hidden">
      <Stage
        ref={stageRef}
        width={stageSize.width}
        height={stageSize.height}
        x={position.x}
        y={position.y}
        scaleX={scale}
        scaleY={scale}
        onMouseDown={handleMouseDown}
        draggable={selectedTool === 'select'}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onWheel={handleWheel}
        onDblClick={handleDoubleClick}
        onContextMenu={(e) => e.evt.preventDefault()}
        style={{ background: '#fff' }}
      >
        <Layer>
          {showGrid && <CanvasGrid />}
          {canvas.objects.map(renderObject)}
        </Layer>
      </Stage>
      <UserCursors />
      {editingTextId && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          role="dialog"
          aria-labelledby="edit-text-modal"
        >
          <div className="bg-white p-6 rounded-lg shadow-lg min-w-96">
            <h3 id="edit-text-modal" className="text-lg font-semibold mb-4">
              Edit Text
            </h3>
            <textarea
              value={canvas.objects.find((obj) => obj.id === editingTextId)?.text || ''}
              onChange={(e) => {
                if (editingTextId) {
                  handleTextChange(editingTextId, e.target.value);
                }
              }}
              onKeyDown={(e) => {
                if (e.key === 'Escape') {
                  handleCloseModal(true); // Revert on Escape
                }
              }}
              className="w-full h-32 p-3 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              style={{
                fontSize:
                  canvas.objects.find((obj) => obj.id === editingTextId)?.style?.fontSize ||
                  currentStyle.fontSize ||
                  14,
                fontFamily:
                  canvas.objects.find((obj) => obj.id === editingTextId)?.style?.fontFamily ||
                  'Arial',
                color:
                  canvas.objects.find((obj) => obj.id === editingTextId)?.fill ||
                  currentStyle.fill ||
                  '#000',
              }}
              autoFocus
              aria-label="Edit canvas text"
            />
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => handleCloseModal(true)} // Revert on Cancel
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={() => handleCloseModal(false)} // Save without reverting
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}