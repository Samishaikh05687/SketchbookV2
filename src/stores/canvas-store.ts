import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { CanvasObject, CanvasState, Tool, User, HistoryAction, Point } from '../types/canvas';
import { generateId } from '../lib/utils';

interface CanvasStore {
  // Canvas state
  canvas: CanvasState;
  selectedTool: Tool;
  selectedObjects: string[];
  isDrawing: boolean;

  // View state
  scale: number;
  position: Point;
  showGrid: boolean;
  showMiniMap: boolean;

  // Style state
  currentStyle: {
    fill: string;
    stroke: string;
    strokeWidth: number;
    opacity: number;
    fontSize: number;
  };

  // Collaboration state
  users: Map<string, User>;
  currentUser: User | null;

  // History state
  history: CanvasState[];
  historyIndex: number;

  // Actions
  setTool: (tool: Tool) => void;
  setCanvas: (canvas: CanvasState) => void;
  addObject: (object: CanvasObject) => void;
  updateObject: (id: string, updates: Partial<CanvasObject>) => void;
  deleteObject: (id: string) => void;
  selectObjects: (ids: string[]) => void;
  clearSelection: () => void;
  clearCanvas: () => void; // <-- New action

  // View actions
  setScale: (scale: number) => void;
  setPosition: (position: Point) => void;
  resetView: () => void;

  // Style actions
  setStyle: (style: Partial<CanvasStore['currentStyle']>) => void;

  // Collaboration actions
  setUsers: (users: User[]) => void;
  addUser: (user: User) => void;
  removeUser: (userId: string) => void;
  updateUserCursor: (userId: string, cursor: Point) => void;
  setCurrentUser: (user: User) => void;

  // History actions
  addToHistory: () => void;
  undo: () => void;
  redo: () => void;
  clearHistory: () => void;
}

export const useCanvasStore = create<CanvasStore>()(
  subscribeWithSelector((set, get) => ({
    // Initial state
    canvas: {
      objects: [],
      background: '#ffffff',
      gridSize: 20,
      snapToGrid: false,
    },
    selectedTool: 'select',
    selectedObjects: [],
    isDrawing: false,

    scale: 1,
    position: { x: 0, y: 0 },
    showGrid: true,
    showMiniMap: true,

    currentStyle: {
      fill: '#3B82F6',
      stroke: '#000000',
      strokeWidth: 2,
      opacity: 1,
      fontSize: 16,
    },

    users: new Map(),
    currentUser: null,

    history: [],
    historyIndex: -1,

    // Actions
    setTool: (tool) => set({ selectedTool: tool }),
    setCanvas: (canvas) => set({ canvas }),
    
    addObject: (object) => {
      const state = get();
      const newObjects = [...state.canvas.objects, object];
      set({
        canvas: { ...state.canvas, objects: newObjects },
      });
       get().addToHistory();  
    },
    
    updateObject: (id, updates) => {
      const state = get();
      const newObjects = state.canvas.objects.map(obj =>
        obj.id === id ? { ...obj, ...updates } : obj
      );
      set({
        canvas: { ...state.canvas, objects: newObjects },
      });
       get().addToHistory();  
    },
    
    deleteObject: (id) => {
      const state = get();
      const newObjects = state.canvas.objects.filter(obj => obj.id !== id);
      set({
        canvas: { ...state.canvas, objects: newObjects },
        selectedObjects: state.selectedObjects.filter(objId => objId !== id),
      });
       get().addToHistory();  
    },
    
    selectObjects: (ids) => set({ selectedObjects: ids }),
    clearSelection: () => set({ selectedObjects: [] }),

    // Clear the entire canvas
    clearCanvas: () => {
      const state = get();
      set({
        canvas: { ...state.canvas, objects: [] },
        selectedObjects: [],
        history: [],
        historyIndex: -1,
      });
    },

    setScale: (scale) => set({ scale: Math.max(0.1, Math.min(5, scale)) }),
    setPosition: (position) => set({ position }),
    resetView: () => set({ scale: 1, position: { x: 0, y: 0 } }),

    setStyle: (style) => {
      const state = get();
      set({ currentStyle: { ...state.currentStyle, ...style } });
    },

    setUsers: (users) => {
      const userMap = new Map();
      users.forEach(user => userMap.set(user.id, user));
      set({ users: userMap });
    },

    addUser: (user) => {
      const state = get();
      const newUsers = new Map(state.users);
      newUsers.set(user.id, user);
      set({ users: newUsers });
    },

    removeUser: (userId) => {
      const state = get();
      const newUsers = new Map(state.users);
      newUsers.delete(userId);
      set({ users: newUsers });
    },

    updateUserCursor: (userId, cursor) => {
      const state = get();
      const user = state.users.get(userId);
      if (user) {
        const newUsers = new Map(state.users);
        newUsers.set(userId, { ...user, cursor });
        set({ users: newUsers });
      }
    },

    setCurrentUser: (user) => set({ currentUser: user }),

 addToHistory: () => {
  const state = get();
  const snapshot = JSON.parse(JSON.stringify(state.canvas)); // deep clone

  const newHistory = state.history.slice(0, state.historyIndex + 1);
  newHistory.push(snapshot);

  set({
    history: newHistory,
    historyIndex: newHistory.length - 1,
  });
},

undo: () => {
  const state = get();
  if (state.historyIndex > 0) {
    const prevIndex = state.historyIndex - 5 ;
    set({
      historyIndex: prevIndex,
      canvas: JSON.parse(JSON.stringify(state.history[prevIndex])),
    });
  }
},

redo: () => {
  const state = get();
  if (state.historyIndex < state.history.length - 1) {
    const nextIndex = state.historyIndex + 5;
    set({
      historyIndex: nextIndex,
      canvas: JSON.parse(JSON.stringify(state.history[nextIndex])),
    });
  }
},


    clearHistory: () => set({ history: [], historyIndex: -1 }),
  }))
);
