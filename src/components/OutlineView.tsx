import { useMapContext } from '../context/MapContext';
import type { MindNode } from '../types';

function OutlineItem({ node, depth, nodes }: { node: MindNode; depth: number; nodes: MindNode[] }) {
  const { selectedId, setSelectedId, updateNode, toggleCollapse, lo, setVx, setVy, zoom } = useMapContext();
  const children = nodes.filter(n => n.parentId === node.id);
  const isSel = node.id === selectedId;

  const focusNode = () => {
    setSelectedId(node.id);
    const ln = lo[node.id];
    if (ln) {
      setVx(window.innerWidth / 2 - ln._x * zoom);
      setVy(window.innerHeight / 2 - ln._y * zoom);
    }
  };

  return (
    <div className="outline-item">
      <div
        className={`outline-row ${isSel ? 'outline-sel' : ''}`}
        style={{ paddingLeft: depth * 20 + 8 }}
        onClick={focusNode}
      >
        {children.length > 0 && (
          <button className="outline-toggle" onClick={e => { e.stopPropagation(); toggleCollapse(node.id); }}>
            {node.collapsed ? '▶' : '▼'}
          </button>
        )}
        <span className="outline-icon">{node.icon}</span>
        <input
          className="outline-label"
          value={node.label}
          onChange={e => updateNode({ ...node, label: e.target.value })}
          onClick={e => e.stopPropagation()}
        />
        {node.priority && (
          <span className={`outline-badge priority-${node.priority}`}>
            {node.priority === 'high' ? '🔴' : node.priority === 'medium' ? '🟡' : '🟢'}
          </span>
        )}
        {node.status === 'done' && <span className="outline-badge">✅</span>}
      </div>
      {!node.collapsed && children.map(child => (
        <OutlineItem key={child.id} node={child} depth={depth + 1} nodes={nodes} />
      ))}
    </div>
  );
}

export function OutlineView() {
  const { showOutline, setShowOutline, nodes, rootId } = useMapContext();

  if (!showOutline || !rootId) return null;

  const root = nodes.find(n => n.id === rootId);
  if (!root) return null;

  return (
    <div className="outline-panel">
      <div className="outline-header">
        <h3>アウトライン</h3>
        <button className="spc" onClick={() => setShowOutline(false)}>✕</button>
      </div>
      <div className="outline-content">
        <OutlineItem node={root} depth={0} nodes={nodes} />
      </div>
    </div>
  );
}
