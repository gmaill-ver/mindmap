import { useEffect } from 'react';
import { useMapContext } from '../context/MapContext';
import { exportJSON, exportPNG } from '../utils/export';

export function useKeyboard() {
  const {
    selectedId, editId, editText, finishEdit, cancelEdit,
    addChild, addSibling, deleteNode, toggleCollapse, startEdit,
    undo, redo, centerView, setZoom,
    showShortcuts, setShowShortcuts, setShowMapList, setSelectedId, setPanelOpen,
    setContextMenu, setSearchOpen,
    focusRootId, setFocusRootId, setRelationshipMode,
    rootId, nodes, currentMapId, title, theme, layout, lo, vis,
    svgRef, toast,
  } = useMapContext();

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      // When editing inline
      if (editId) {
        if (e.key === 'Enter') { finishEdit(); e.preventDefault(); }
        if (e.key === 'Escape') { cancelEdit(); e.preventDefault(); }
        return;
      }

      // Shortcuts modal
      if (e.key === '?' && !e.ctrlKey && !e.metaKey) {
        setShowShortcuts(!showShortcuts);
        e.preventDefault();
        return;
      }

      // Escape
      if (e.key === 'Escape') {
        if (focusRootId) { setFocusRootId(null); return; }
        setSelectedId(null); setPanelOpen(false); setShowShortcuts(false);
        setShowMapList(false); setContextMenu(null); setSearchOpen(false);
        setRelationshipMode(false);
        return;
      }

      const ct = e.ctrlKey || e.metaKey;

      // Search
      if (ct && e.key === 'f') { setSearchOpen(true); e.preventDefault(); return; }

      // Undo/Redo
      if (ct && e.key === 'z' && !e.shiftKey) { undo(); e.preventDefault(); return; }
      if (ct && ((e.key === 'z' && e.shiftKey) || e.key === 'Z')) { redo(); e.preventDefault(); return; }

      // Zoom
      if (ct && e.key === '0') { centerView(); e.preventDefault(); return; }
      if (ct && (e.key === '=' || e.key === '+')) { setZoom(z => Math.min(3, z * 1.2)); e.preventDefault(); return; }
      if (ct && e.key === '-') { setZoom(z => Math.max(0.2, z / 1.2)); e.preventDefault(); return; }

      // Save
      if (ct && e.key === 's') { toast('💾 保存しました'); e.preventDefault(); return; }

      // Export
      if (ct && e.key === 'e' && !e.shiftKey) {
        exportJSON(currentMapId!, title, rootId!, nodes, theme, layout);
        toast('📄 JSONエクスポート完了');
        e.preventDefault();
        return;
      }
      if (ct && ((e.key === 'e' && e.shiftKey) || e.key === 'E')) {
        if (svgRef.current) {
          exportPNG(svgRef.current, lo, vis, rootId!, title, theme);
          toast('🖼 PNGエクスポート完了');
        }
        e.preventDefault();
        return;
      }

      // Node operations (require selection)
      if (!selectedId) return;

      if (e.key === 'Tab') { addChild(selectedId); e.preventDefault(); }
      else if (e.key === 'Enter') { addSibling(selectedId); e.preventDefault(); }
      else if (e.key === 'Delete' || e.key === 'Backspace') { deleteNode(selectedId); e.preventDefault(); }
      else if (e.key === 'F2') { startEdit(selectedId); e.preventDefault(); }
      else if (e.key === ' ') { toggleCollapse(selectedId); e.preventDefault(); }
    }

    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [
    selectedId, editId, editText, finishEdit, cancelEdit,
    addChild, addSibling, deleteNode, toggleCollapse, startEdit,
    undo, redo, centerView, setZoom, showShortcuts, setShowShortcuts, setShowMapList,
    setSelectedId, setPanelOpen, setContextMenu, setSearchOpen,
    focusRootId, setFocusRootId, setRelationshipMode,
    rootId, nodes, currentMapId, title, theme, layout, lo, vis, svgRef, toast,
  ]);
}
