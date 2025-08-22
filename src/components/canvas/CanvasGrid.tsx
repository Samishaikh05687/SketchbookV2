// CanvasGrid.tsx
import { Line } from "react-konva";
import { useCanvasStore } from "../../stores/canvas-store";

export function CanvasGrid() {
  const { canvas, position, scale } = useCanvasStore();
  const gridSize = canvas.gridSize || 40; // default if not set

  const lines: JSX.Element[] = [];

  const stageWidth = window.innerWidth / scale;
  const stageHeight = window.innerHeight / scale;

  // Offset by position
  const offsetX = -position.x / scale;
  const offsetY = -position.y / scale;

  const startX = Math.floor(offsetX / gridSize) * gridSize;
  const startY = Math.floor(offsetY / gridSize) * gridSize;
  const endX = offsetX + stageWidth + gridSize;
  const endY = offsetY + stageHeight + gridSize;

  // Vertical lines
  for (let x = startX; x < endX; x += gridSize) {
    lines.push(
      <Line
        key={`v-${x}`}
        points={[x, startY, x, endY]}
        stroke="#E5E7EB"
        strokeWidth={1 / scale}
        opacity={0.4}
      />
    );
  }

  // Horizontal lines
  for (let y = startY; y < endY; y += gridSize) {
    lines.push(
      <Line
        key={`h-${y}`}
        points={[startX, y, endX, y]}
        stroke="#E5E7EB"
        strokeWidth={1 / scale}
        opacity={0.4}
      />
    );
  }

  return <>{lines}</>;
}
