import { createContext, useContext, useState, useRef, useCallback, useMemo, useEffect, type ReactNode } from 'react';
import type { MindNode, MindMap, LayoutNode, LayoutType, ThemeName, ContextMenuState, Toast } from '../types';
import { uid } from '../utils/uid';
import { colorByDepth, createDefaultMap, THEME_VARS } from '../constants';
import { saveMap, loadMaps, deleteMap } from '../db/indexedDB';
import { saveMapToCloud, loadMapsFromCloud, deleteMapFromCloud, subscribeMaps } from '../db/firestore';
import { useAuthContext } from './AuthContext';
import { computeLayout } from '../layout';

interface MapContextValue {
  // Map data
  maps: MindMap[];
  currentMapId: string | null;
  nodes: MindNode[];
  rootId: string | null;
  title: string;
  theme: ThemeName;
  layout: LayoutType;
  setTitle: (t: string) => void;
  setTheme: (t: ThemeName) => void;
  setLayout: (l: LayoutType) => void;

  // Selection
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
  selectedNode: MindNode | undefined;

  // Layout computation
  lo: Record<string, LayoutNode>;
  vis: Set<string>;

  // Focus mode
  focusRootId: string | null;
  setFocusRootId: (id: string | null) => void;
  focusBreadcrumbs: MindNode[];

  // Node operations
  addChild: (parentId: string) => void;
  addSibling: (nodeId: string) => void;
  deleteNode: (nodeId: string) => void;
  toggleCollapse: (nodeId: string) => void;
  updateNode: (node: MindNode) => void;
  getDepth: (id: string) => number;
  countHidden: (nodeId: string) => number;

  // Viewport
  vx: number;
  vy: number;
  zoom: number;
  setVx: React.Dispatch<React.SetStateAction<number>>;
  setVy: React.Dispatch<React.SetStateAction<number>>;
  setZoom: React.Dispatch<React.SetStateAction<number>>;
  centerView: () => void;

  // History
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;

  // Editing
  editId: string | null;
  editText: string;
  editPos: { x: number; y: number };
  startEdit: (nodeId: string) => void;
  finishEdit: () => void;
  setEditText: (t: string) => void;
  cancelEdit: () => void;

  // Panels / modals
  panelOpen: boolean;
  setPanelOpen: (open: boolean) => void;
  contextMenu: ContextMenuState | null;
  setContextMenu: (cm: ContextMenuState | null) => void;
  showShortcuts: boolean;
  setShowShortcuts: (show: boolean) => void;
  showMapList: boolean;
  setShowMapList: (show: boolean) => void;
  showTemplates: boolean;
  setShowTemplates: (show: boolean) => void;
  showOutline: boolean;
  setShowOutline: (show: boolean) => void;

  // Search
  searchOpen: boolean;
  setSearchOpen: (open: boolean) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  searchMatches: string[];
  searchIndex: number;
  setSearchIndex: (i: number) => void;

  // Drag
  dragNodeId: string | null;
  setDragNodeId: (id: string | null) => void;
  dropTargetId: string | null;
  setDropTargetId: (id: string | null) => void;
  reparentNode: (nodeId: string, newParentId: string) => void;

  // Relationship
  relationshipMode: boolean;
  setRelationshipMode: (m: boolean) => void;
  relationshipSource: string | null;
  setRelationshipSource: (id: string | null) => void;
  addRelationship: (sourceId: string, targetId: string, label?: string) => void;
  removeRelationship: (sourceId: string, targetId: string) => void;

  // Presentation
  presentationMode: boolean;
  setPresentationMode: (m: boolean) => void;

  // Map management
  newMap: (rootId?: string, nodes?: MindNode[]) => void;
  switchMap: (id: string) => void;
  delMap: (id: string) => void;

  // Toast
  toast: (message: string) => void;
  toasts: Toast[];

  // Saving state
  saving: boolean;

  // SVG ref
  svgRef: React.RefObject<SVGSVGElement | null>;
}

const MapContext = createContext<MapContextValue | null>(null);

export function MapProvider({ children }: { children: ReactNode }) {
  const { user } = useAuthContext();
  const [maps, setMaps] = useState<MindMap[]>([]);
  const [currentMapId, setCurrentMapId] = useState<string | null>(null);
  const [nodes, setNodes] = useState<MindNode[]>([]);
  const [rootId, setRootId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [theme, setTheme] = useState<ThemeName>('dark');
  const [layout, setLayout] = useState<LayoutType>('tree');

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [focusRootId, setFocusRootId] = useState<string | null>(null);

  const [vx, setVx] = useState(0);
  const [vy, setVy] = useState(0);
  const [zoom, setZoom] = useState(1);

  const [editId, setEditId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const [editPos, setEditPos] = useState({ x: 0, y: 0 });

  const [panelOpen, setPanelOpen] = useState(false);
  const [contextMenu, setContextMenu] = useState<ContextMenuState | null>(null);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [showMapList, setShowMapList] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [showOutline, setShowOutline] = useState(false);

  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchIndex, setSearchIndex] = useState(0);

  const [dragNodeId, setDragNodeId] = useState<string | null>(null);
  const [dropTargetId, setDropTargetId] = useState<string | null>(null);

  const [relationshipMode, setRelationshipMode] = useState(false);
  const [relationshipSource, setRelationshipSource] = useState<string | null>(null);

  const [presentationMode, setPresentationMode] = useState(false);

  const [toasts, setToasts] = useState<Toast[]>([]);
  const [saving, setSaving] = useState(false);

  const [hist, setHist] = useState<MindNode[][]>([]);
  const [hIdx, setHIdx] = useState(-1);
  const skipHist = useRef(false);
  const autoSaveTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const svgRef = useRef<SVGSVGElement | null>(null);

  const toast = useCallback((message: string) => {
    const id = uid();
    setToasts(prev => [...prev, { id, message }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000);
  }, []);

  // Apply theme
  useEffect(() => {
    const vars = THEME_VARS[theme];
    if (vars) {
      Object.entries(vars).forEach(([key, val]) => {
        document.documentElement.style.setProperty(key, val);
      });
    }
  }, [theme]);

  // Initialize: load from cloud if logged in, otherwise from IndexedDB
  useEffect(() => {
    (async () => {
      let all: MindMap[] = [];
      if (user) {
        try {
          all = await loadMapsFromCloud(user.uid);
        } catch (e) {
          console.error('Firestore load failed, falling back to IndexedDB:', e);
          all = await loadMaps();
        }
        // Migrate: if cloud is empty but IndexedDB has data, push to cloud
        if (!all.length) {
          const local = await loadMaps();
          if (local.length) {
            all = local;
            for (const m of local) {
              try { await saveMapToCloud(user.uid, m); } catch {}
            }
          }
        }
      } else {
        all = await loadMaps();
      }
      setMaps(all);
      if (all.length) {
        loadMapData(all.sort((a, b) => b.updatedAt - a.updatedAt)[0]);
      } else {
        const def = createDefaultMap();
        const mapData: MindMap = {
          id: uid(), title: '新しいマインドマップ', rootId: def.rootId,
          nodes: def.nodes, theme: 'dark', layout: 'tree',
          createdAt: Date.now(), updatedAt: Date.now(),
        };
        loadMapData(mapData);
        if (user) {
          try { await saveMapToCloud(user.uid, mapData); } catch {}
        }
        await saveMap(mapData);
        setMaps([mapData]);
      }
    })();
  }, [user]);

  // Real-time sync: subscribe to Firestore changes when logged in
  useEffect(() => {
    if (!user) return;
    const unsub = subscribeMaps(user.uid, cloudMaps => {
      setMaps(cloudMaps);
    });
    return unsub;
  }, [user]);

  function loadMapData(d: MindMap) {
    setCurrentMapId(d.id);
    setNodes(d.nodes);
    setRootId(d.rootId);
    setTitle(d.title);
    setTheme(d.theme || 'dark');
    setLayout(d.layout || 'tree');
    setSelectedId(null);
    setPanelOpen(false);
    setFocusRootId(null);
    setHist([d.nodes]);
    setHIdx(0);
    centerView();
  }

  function centerView() {
    setVx(window.innerWidth / 2);
    setVy(window.innerHeight / 2);
    setZoom(1);
  }

  // Auto-save (IndexedDB + Cloud)
  useEffect(() => {
    if (!currentMapId || !nodes.length) return;
    clearTimeout(autoSaveTimer.current);
    autoSaveTimer.current = setTimeout(async () => {
      setSaving(true);
      const d: MindMap = {
        id: currentMapId, title, rootId: rootId!, nodes, theme, layout,
        createdAt: Date.now(), updatedAt: Date.now(),
      };
      // Always save locally
      await saveMap(d);
      // Also save to cloud if logged in
      if (user) {
        try { await saveMapToCloud(user.uid, d); } catch {}
      }
      setMaps(prev => {
        const i = prev.findIndex(m => m.id === currentMapId);
        if (i >= 0) { const n = [...prev]; n[i] = d; return n; }
        return [...prev, d];
      });
      setSaving(false);
    }, 800);
  }, [nodes, title, currentMapId, rootId, theme, layout, user]);

  // History tracking
  useEffect(() => {
    if (skipHist.current) { skipHist.current = false; return; }
    if (!nodes.length) return;
    setHist(prev => {
      const n = prev.slice(0, hIdx + 1);
      n.push(JSON.parse(JSON.stringify(nodes)));
      if (n.length > 50) n.shift();
      return n;
    });
    setHIdx(prev => Math.min(prev + 1, 50));
  }, [nodes]);

  const undo = useCallback(() => {
    if (hIdx <= 0) return;
    skipHist.current = true;
    setHIdx(hIdx - 1);
    setNodes(JSON.parse(JSON.stringify(hist[hIdx - 1])));
    toast('↩ 元に戻しました');
  }, [hIdx, hist, toast]);

  const redo = useCallback(() => {
    if (hIdx >= hist.length - 1) return;
    skipHist.current = true;
    setHIdx(hIdx + 1);
    setNodes(JSON.parse(JSON.stringify(hist[hIdx + 1])));
    toast('↪ やり直しました');
  }, [hIdx, hist, toast]);

  const updateNode = useCallback((updated: MindNode) => {
    setNodes(prev => prev.map(n => n.id === updated.id ? updated : n));
  }, []);

  const getDepth = useCallback((id: string) => {
    let d = 0;
    let c = nodes.find(n => n.id === id);
    while (c && c.parentId) { d++; c = nodes.find(n => n.id === c!.parentId); }
    return d;
  }, [nodes]);

  const addChild = useCallback((parentId: string) => {
    const par = nodes.find(n => n.id === parentId);
    if (!par) return;
    const nn: MindNode = {
      id: uid(), label: '新しいノード', parentId,
      color: colorByDepth(getDepth(parentId) + 1),
      icon: '', collapsed: false, notes: '',
    };
    setNodes(prev => [...prev.map(n => n.id === parentId ? { ...n, collapsed: false } : n), nn]);
    setSelectedId(nn.id);
    setTimeout(() => startEdit(nn.id), 150);
  }, [nodes, getDepth]);

  const addSibling = useCallback((nodeId: string) => {
    const nd = nodes.find(n => n.id === nodeId);
    if (!nd || !nd.parentId) return;
    const nn: MindNode = {
      id: uid(), label: '新しいノード', parentId: nd.parentId,
      color: colorByDepth(getDepth(nodeId)),
      icon: '', collapsed: false, notes: '',
    };
    setNodes(prev => [...prev, nn]);
    setSelectedId(nn.id);
    setTimeout(() => startEdit(nn.id), 150);
  }, [nodes, getDepth]);

  const deleteNode = useCallback((nodeId: string) => {
    if (nodeId === rootId) { toast('ルートは削除不可'); return; }
    function desc(id: string): string[] {
      let ids = [id];
      nodes.filter(n => n.parentId === id).forEach(c => { ids = ids.concat(desc(c.id)); });
      return ids;
    }
    const toDelete = new Set(desc(nodeId));
    setNodes(prev => prev.filter(n => !toDelete.has(n.id)));
    if (selectedId === nodeId) setSelectedId(null);
    toast('🗑 削除しました');
  }, [rootId, nodes, selectedId, toast]);

  const toggleCollapse = useCallback((nodeId: string) => {
    setNodes(prev => prev.map(n => n.id === nodeId ? { ...n, collapsed: !n.collapsed } : n));
  }, []);

  const countHidden = useCallback((nodeId: string): number => {
    let t = 0;
    function count(id: string) {
      nodes.filter(n => n.parentId === id).forEach(n => { t++; count(n.id); });
    }
    count(nodeId);
    return t;
  }, [nodes]);

  // Layout & visibility computation
  const effectiveRootId = focusRootId || rootId;

  const lo = useMemo(() => {
    if (!effectiveRootId || !nodes.length) return {};
    if (focusRootId) {
      const focusDescendants = new Set<string>();
      function collectDesc(id: string) {
        focusDescendants.add(id);
        nodes.filter(n => n.parentId === id).forEach(c => collectDesc(c.id));
      }
      collectDesc(focusRootId);
      const focusNodes = nodes.filter(n => focusDescendants.has(n.id)).map(n =>
        n.id === focusRootId ? { ...n, parentId: null } : n
      );
      return computeLayout(focusNodes, focusRootId, layout);
    }
    return computeLayout(nodes, effectiveRootId, layout);
  }, [nodes, effectiveRootId, layout, focusRootId]);

  const vis = useMemo(() => {
    const v = new Set<string>();
    function walk(id: string) {
      const n = lo[id];
      if (!n) return;
      v.add(id);
      if (!n.collapsed) n._ch.forEach(c => walk(c));
    }
    if (effectiveRootId) walk(effectiveRootId);
    return v;
  }, [lo, effectiveRootId]);

  // Focus breadcrumbs
  const focusBreadcrumbs = useMemo(() => {
    if (!focusRootId || !rootId) return [];
    const crumbs: MindNode[] = [];
    let current = nodes.find(n => n.id === focusRootId);
    while (current) {
      crumbs.unshift(current);
      if (!current.parentId) break;
      current = nodes.find(n => n.id === current!.parentId);
    }
    return crumbs;
  }, [focusRootId, rootId, nodes]);

  // Search
  const searchMatches = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    return nodes
      .filter(n => n.label.toLowerCase().includes(q) || (n.notes || '').toLowerCase().includes(q))
      .map(n => n.id);
  }, [searchQuery, nodes]);

  // Inline edit
  function startEdit(nodeId: string) {
    const nd = nodes.find(n => n.id === nodeId);
    if (!nd) return;
    const ln = lo[nodeId];
    if (!ln) return;
    setEditId(nodeId);
    setEditText(nd.label);
    setEditPos({ x: ln._x * zoom + vx, y: ln._y * zoom + vy });
  }

  function finishEdit() {
    if (editId) {
      if (editText.trim()) {
        const nd = nodes.find(n => n.id === editId);
        if (nd) updateNode({ ...nd, label: editText.trim() });
      }
      setEditId(null);
    }
  }

  function cancelEdit() { setEditId(null); }

  const selectedNode = nodes.find(n => n.id === selectedId);

  // Drag reparent
  const reparentNode = useCallback((nodeId: string, newParentId: string) => {
    if (nodeId === newParentId) return;
    if (nodeId === rootId) return;
    // Check circular reference
    function isDescendant(id: string, ancestorId: string): boolean {
      let current = nodes.find(n => n.id === id);
      while (current) {
        if (current.id === ancestorId) return true;
        if (!current.parentId) return false;
        current = nodes.find(n => n.id === current!.parentId);
      }
      return false;
    }
    if (isDescendant(newParentId, nodeId)) {
      toast('循環参照は不可');
      return;
    }
    setNodes(prev => prev.map(n =>
      n.id === nodeId ? { ...n, parentId: newParentId } : n
    ));
    toast('ノードを移動しました');
  }, [nodes, rootId, toast]);

  // Relationships
  const addRelationship = useCallback((sourceId: string, targetId: string, label?: string) => {
    setNodes(prev => prev.map(n => {
      if (n.id === sourceId) {
        const rels = n.relationships || [];
        if (rels.some(r => r.targetId === targetId)) return n;
        return { ...n, relationships: [...rels, { targetId, label }] };
      }
      return n;
    }));
    toast('関連線を追加しました');
  }, [toast]);

  const removeRelationship = useCallback((sourceId: string, targetId: string) => {
    setNodes(prev => prev.map(n => {
      if (n.id === sourceId) {
        return { ...n, relationships: (n.relationships || []).filter(r => r.targetId !== targetId) };
      }
      return n;
    }));
    toast('関連線を削除しました');
  }, [toast]);

  // Map management
  function newMap(newRootId?: string, newNodes?: MindNode[]) {
    const def = newRootId && newNodes ? { rootId: newRootId, nodes: newNodes } : createDefaultMap();
    const mapData: MindMap = {
      id: uid(), title: '新しいマインドマップ', rootId: def.rootId,
      nodes: def.nodes, theme, layout,
      createdAt: Date.now(), updatedAt: Date.now(),
    };
    loadMapData(mapData);
    saveMap(mapData);
    if (user) { saveMapToCloud(user.uid, mapData).catch(() => {}); }
    setMaps(prev => [...prev, mapData]);
    toast('✨ 新規作成しました');
  }

  async function switchMap(id: string) {
    let all: MindMap[];
    if (user) {
      all = await loadMapsFromCloud(user.uid);
    } else {
      all = await loadMaps();
    }
    const target = all.find(m => m.id === id);
    if (target) loadMapData(target);
  }

  async function delMap(id: string) {
    await deleteMap(id);
    if (user) { await deleteMapFromCloud(user.uid, id).catch(() => {}); }
    setMaps(prev => prev.filter(m => m.id !== id));
    if (id === currentMapId) {
      const remaining = maps.filter(m => m.id !== id);
      if (remaining.length) loadMapData(remaining[0]);
      else newMap();
    }
    toast('🗑 削除しました');
  }

  const value: MapContextValue = {
    maps, currentMapId, nodes, rootId, title, theme, layout,
    setTitle, setTheme, setLayout,
    selectedId, setSelectedId, selectedNode,
    lo, vis,
    focusRootId, setFocusRootId, focusBreadcrumbs,
    addChild, addSibling, deleteNode, toggleCollapse, updateNode, getDepth, countHidden,
    vx, vy, zoom, setVx, setVy, setZoom, centerView,
    undo, redo, canUndo: hIdx > 0, canRedo: hIdx < hist.length - 1,
    editId, editText, editPos, startEdit, finishEdit, setEditText, cancelEdit,
    panelOpen, setPanelOpen,
    contextMenu, setContextMenu,
    showShortcuts, setShowShortcuts,
    showMapList, setShowMapList,
    showTemplates, setShowTemplates,
    showOutline, setShowOutline,
    searchOpen, setSearchOpen, searchQuery, setSearchQuery, searchMatches, searchIndex, setSearchIndex,
    dragNodeId, setDragNodeId, dropTargetId, setDropTargetId, reparentNode,
    relationshipMode, setRelationshipMode, relationshipSource, setRelationshipSource,
    addRelationship, removeRelationship,
    presentationMode, setPresentationMode,
    newMap, switchMap, delMap,
    toast, toasts, saving,
    svgRef,
  };

  return <MapContext.Provider value={value}>{children}</MapContext.Provider>;
}

export function useMapContext() {
  const ctx = useContext(MapContext);
  if (!ctx) throw new Error('useMapContext must be used within MapProvider');
  return ctx;
}
