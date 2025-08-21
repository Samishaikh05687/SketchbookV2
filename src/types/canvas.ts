export interface Point {
  x: number;
  y: number;
}

export interface CanvasObject {
  id: string;
  type: 'line' | 'rectangle' | 'circle' | 'text' | 'arrow' | 'triangle' | 'diamond' | 'star' | 'sticky-note';
  x: number;
  y: number;
  width?: number;
  height?: number;
  points?: number[];
  text?: string;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  opacity?: number;
  rotation?: number;
  scaleX?: number;
  scaleY?: number;
  locked?: boolean;
  layer?: number;
  groupId?: string;
  // Star-specific properties
  numPoints?: number;
  innerRadius?: number;
  outerRadius?: number;
  style?: {
    lineDash?: number[];
    fontSize?: number;
    fontFamily?: string;
    textAlign?: string;
    verticalAlign?: string;
    padding?: number;
  };
}

export interface User {
  id: string;
  name: string;
  color: string;
  cursor?: Point;
}

export interface CanvasState {
  objects: CanvasObject[];
  background: string;
  gridSize: number;
  snapToGrid: boolean;
}

export interface HistoryAction {
  type: 'add' | 'update' | 'delete' | 'batch';
  objectId?: string;
  object?: CanvasObject;
  objects?: CanvasObject[];
  timestamp: number;
  userId?: string;
}

export type Tool = 
  | 'select'
  | 'pencil' 
  | 'brush'
  | 'eraser'
  | 'line'
  | 'rectangle'
  | 'circle'
  | 'arrow'
  | 'triangle'
  | 'diamond'
  | 'star'
  | 'text'
  | 'sticky-note'
  | 'connector'
  | 'pan';