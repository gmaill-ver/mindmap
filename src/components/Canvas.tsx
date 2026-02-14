import { useRef, useCallback, type MouseEvent, type WheelEvent } from 'react';
import { useMapContext } from '../context/MapContext';
import { Connection } from './Connection';
import { MindMapNodes } from './Node';
import { RelationshipLines } from './Relationship';

export function Canvas() {
  const {
    vx, vy, zoom, setVx, setVy, setZoom,
    setSelectedId, setPanelOpen, setContextMenu,
    dragNodeId, setDragNodeId, dropTargetId, reparentNode, setDropTargetId,
    lo, nodes, updateNode, svgRef,
    focusRootId, focusBreadcrumbs, setFocusRootId,
    relationshipMode,
  } = useMapContext();

  const panning = useRef(false);
  const panStart = useRef({ x: 0, y: 0, vx: 0, vy: 0 });
  const dragStart = useRef({ x: 0, y: 0, nx: 0, ny: 0 });
  const contRef = useRef<HTMLDivElement>(null);

  const onMouseDown = useCallback((e: MouseEvent) => {
    if ((e.target as HTMLElement).closest('.node') || (e.target as HTMLElement).closest('.ncb')) return;
    panning.current = true;
    panStart.current = { x: e.clientX, y: e.clientY, vx, vy };
    setContextMenu(null);
    setSelectedId(null);
    setPanelOpen(false);
  }, [vx, vy, setContextMenu, setSelectedId, setPanelOpen]);

  const onMouseMove = useCallback((e: MouseEvent) => {
    if (panning.current) {
      setVx(panStart.current.vx + (e.clientX - panStart.current.x));
      setVy(panStart.current.vy + (e.clientY - panStart.current.y));
    }
    if (dragNodeId) {
      const ln = lo[dragNodeId];
      if (ln) {
        if (dragStart.current.nx === 0 && dragStart.current.ny === 0) {
          dragStart.current = { x: e.clientX, y: e.clientY, nx: ln._x, ny: ln._y };
        }
        const dx = (e.clientX - dragStart.current.x) / zoom;
        const dy = (e.clientY - dragStart.current.y) / zoom;
        const nd = nodes.find(n => n.id === dragNodeId);
        if (nd) updateNode({ ...nd, mx: dragStart.current.nx + dx, my: dragStart.current.ny + dy });
      }
    }
  }, [dragNodeId, lo, zoom, nodes, updateNode, setVx, setVy]);

  const onMouseUp = useCallback(() => {
    panning.current = false;
    if (dragNodeId && dropTargetId) {
      reparentNode(dragNodeId, dropTargetId);
    }
    if (dragNodeId) {
      setDragNodeId(null);
      setDropTargetId(null);
      dragStart.current = { x: 0, y: 0, nx: 0, ny: 0 };
    }
  }, [dragNodeId, dropTargetId, reparentNode, setDragNodeId, setDropTargetId]);

  const onWheel = useCallback((e: WheelEvent) => {
    e.preventDefault();
    const d = e.deltaY > 0 ? 0.9 : 1.1;
    const nz = Math.max(0.2, Math.min(3, zoom * d));
    const rc = contRef.current!.getBoundingClientRect();
    const mx = e.clientX - rc.left;
    const my = e.clientY - rc.top;
    setVx(prev => mx - (mx - prev) * (nz / zoom));
    setVy(prev => my - (my - prev) * (nz / zoom));
    setZoom(nz);
  }, [zoom, setVx, setVy, setZoom]);

  return (
    <div
      ref={contRef}
      className={`cv ${panning.current ? 'pn' : ''} ${dragNodeId ? 'nd' : ''} ${relationshipMode ? 'rel-mode' : ''}`}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
      onWheel={onWheel}
    >
      {/* Focus breadcrumbs */}
      {focusRootId && (
        <div className="breadcrumbs">
          {focusBreadcrumbs.map((bc, i) => (
            <span key={bc.id}>
              {i > 0 && <span className="bc-sep"> › </span>}
              <button
                className={`bc-btn ${i === focusBreadcrumbs.length - 1 ? 'bc-current' : ''}`}
                onClick={() => {
                  if (i === 0) setFocusRootId(null);
                  else setFocusRootId(bc.id);
                }}
              >
                {bc.icon && <span>{bc.icon} </span>}
                {bc.label}
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Relationship mode indicator */}
      {relationshipMode && (
        <div className="rel-indicator">
          関連線の接続先を選択してください (Escでキャンセル)
        </div>
      )}

      <svg ref={svgRef} className="ms">
        <defs>
          <marker id="arrowhead" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
            <polygon points="0 0, 8 3, 0 6" fill="rgba(139,92,246,0.5)" />
          </marker>
        </defs>
        <g transform={`translate(${vx},${vy}) scale(${zoom})`}>
          <Connection />
          <RelationshipLines />
          <MindMapNodes />
        </g>
      </svg>
    </div>
  );
}
