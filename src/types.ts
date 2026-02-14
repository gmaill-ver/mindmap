export interface MindNode {
  id: string;
  parentId: string | null;
  label: string;
  color: string;
  icon: string;
  collapsed: boolean;
  notes: string;
  mx?: number;
  my?: number;
  url?: string;
  relationships?: Relationship[];
  image?: { url: string; width: number; height: number };
  priority?: 'low' | 'medium' | 'high';
  dueDate?: string;
  status?: 'todo' | 'doing' | 'done';
  comments?: Comment[];
}

export interface Relationship {
  targetId: string;
  label?: string;
}

export interface MindComment {
  id: string;
  text: string;
  createdAt: number;
}

export interface MindMap {
  id: string;
  title: string;
  rootId: string;
  nodes: MindNode[];
  theme: ThemeName;
  layout: LayoutType;
  createdAt: number;
  updatedAt: number;
}

export type LayoutType = 'radial' | 'tree' | 'orgChart';
export type ThemeName = 'dark' | 'light' | 'colorful' | 'minimal' | 'ocean' | 'forest';

export interface LayoutNode extends MindNode {
  _x: number;
  _y: number;
  _ch: string[];
  _dir?: 1 | -1;   // 1 = right, -1 = left (for horizontal tree)
  _w?: number;      // computed node width
}

export interface ContextMenuItem {
  icon?: string;
  label?: string;
  sc?: string;
  action?: () => void;
  dg?: boolean;
  d?: boolean;
}

export interface ContextMenuState {
  x: number;
  y: number;
  items: ContextMenuItem[];
}

export interface Toast {
  id: string;
  message: string;
}

export interface Template {
  name: string;
  icon: string;
  description: string;
  create: () => { nodes: MindNode[]; rootId: string };
}
