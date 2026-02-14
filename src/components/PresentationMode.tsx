import { useState, useEffect, useCallback } from 'react';
import { useMapContext } from '../context/MapContext';

export function PresentationMode() {
  const { presentationMode, setPresentationMode, nodes, rootId, lo } = useMapContext();
  const [currentIdx, setCurrentIdx] = useState(0);

  // Build DFS traversal order
  const traversal = useCallback(() => {
    if (!rootId) return [];
    const order: string[] = [];
    function dfs(id: string) {
      order.push(id);
      const n = lo[id];
      if (n && !n.collapsed) n._ch.forEach(c => dfs(c));
    }
    dfs(rootId);
    return order;
  }, [rootId, lo]);

  const order = traversal();
  const currentId = order[currentIdx];
  const currentNode = nodes.find(n => n.id === currentId);

  useEffect(() => {
    if (!presentationMode) return;
    setCurrentIdx(0);

    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setPresentationMode(false); return; }
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === ' ') {
        setCurrentIdx(prev => Math.min(prev + 1, order.length - 1));
        e.preventDefault();
      }
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        setCurrentIdx(prev => Math.max(prev - 1, 0));
        e.preventDefault();
      }
    };

    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [presentationMode, order.length, setPresentationMode]);

  if (!presentationMode || !currentNode) return null;

  // Get parent path
  const path: string[] = [];
  let p = currentNode;
  while (p) {
    path.unshift(p.label);
    if (!p.parentId) break;
    p = nodes.find(n => n.id === p!.parentId)!;
  }

  const children = nodes.filter(n => n.parentId === currentId);

  return (
    <div className="pres-overlay">
      <div className="pres-header">
        <div className="pres-path">{path.join(' › ')}</div>
        <div className="pres-progress">{currentIdx + 1} / {order.length}</div>
        <button className="pres-close" onClick={() => setPresentationMode(false)}>✕</button>
      </div>

      <div className="pres-content">
        <div className="pres-node-icon">{currentNode.icon || '💭'}</div>
        <h1 className="pres-node-label">{currentNode.label}</h1>
        {currentNode.notes && (
          <div className="pres-notes">{currentNode.notes}</div>
        )}
        {children.length > 0 && (
          <div className="pres-children">
            {children.map(c => (
              <div key={c.id} className="pres-child" style={{ borderLeftColor: c.color }}>
                {c.icon && <span>{c.icon} </span>}
                {c.label}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="pres-footer">
        <button
          className="pres-nav-btn"
          disabled={currentIdx === 0}
          onClick={() => setCurrentIdx(prev => Math.max(0, prev - 1))}
        >← 前へ</button>
        <div className="pres-progress-bar">
          <div className="pres-progress-fill" style={{ width: `${((currentIdx + 1) / order.length) * 100}%` }} />
        </div>
        <button
          className="pres-nav-btn"
          disabled={currentIdx >= order.length - 1}
          onClick={() => setCurrentIdx(prev => Math.min(order.length - 1, prev + 1))}
        >次へ →</button>
      </div>
    </div>
  );
}
