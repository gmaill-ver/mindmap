import { useCallback, type MouseEvent } from 'react';
import { useMapContext } from '../context/MapContext';
import { measureText } from '../utils/text';

export function MindMapNodes() {
  const {
    lo, vis, rootId, selectedId, setSelectedId, dragNodeId, setDragNodeId, dropTargetId, setDropTargetId,
    startEdit, toggleCollapse, countHidden, setContextMenu,
    addChild, addSibling, deleteNode, setPanelOpen, nodes,
    relationshipMode, relationshipSource, setRelationshipSource, addRelationship, setRelationshipMode,
    searchMatches, searchIndex, getDepth,
  } = useMapContext();

  const onMouseDown = useCallback((e: MouseEvent, nodeId: string) => {
    e.stopPropagation();
    if (relationshipMode && relationshipSource) {
      if (relationshipSource !== nodeId) addRelationship(relationshipSource, nodeId);
      setRelationshipMode(false);
      setRelationshipSource(null);
      return;
    }
    setSelectedId(nodeId);
    setDragNodeId(nodeId);
  }, [setSelectedId, setDragNodeId, relationshipMode, relationshipSource, addRelationship, setRelationshipMode, setRelationshipSource]);

  const onDoubleClick = useCallback((e: MouseEvent, nodeId: string) => {
    e.stopPropagation();
    startEdit(nodeId);
  }, [startEdit]);

  const onContextMenu = useCallback((e: MouseEvent, nodeId: string) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedId(nodeId);
    const isRoot = nodeId === rootId;
    const nd = nodes.find(n => n.id === nodeId);
    setContextMenu({
      x: e.clientX, y: e.clientY,
      items: [
        { icon: '➕', label: '子ノード追加', sc: 'Tab', action: () => addChild(nodeId) },
        ...(!isRoot ? [{ icon: '↔️', label: '兄弟ノード追加', sc: 'Enter', action: () => addSibling(nodeId) }] : []),
        { icon: '✏️', label: '名前を編集', sc: 'F2', action: () => startEdit(nodeId) },
        { icon: nd?.collapsed ? '📂' : '📁', label: nd?.collapsed ? '展開' : '折りたたみ', sc: 'Space', action: () => toggleCollapse(nodeId) },
        { d: true },
        { icon: '🔗', label: '関連線を追加', action: () => { setRelationshipMode(true); setRelationshipSource(nodeId); } },
        { icon: '🎨', label: '編集パネル', action: () => setPanelOpen(true) },
        ...(!isRoot ? [{ d: true }, { icon: '🗑', label: '削除', sc: 'Del', dg: true, action: () => deleteNode(nodeId) }] : []),
      ],
    });
  }, [rootId, nodes, setSelectedId, setContextMenu, addChild, addSibling, startEdit, toggleCollapse, deleteNode, setPanelOpen, setRelationshipMode, setRelationshipSource]);

  return (
    <>
      {Object.values(lo)
        .filter(n => vis.has(n.id))
        .map(n => {
          const isRoot = n.id === rootId;
          const depth = getDepth(n.id);

          // Font sizing by depth
          const fontSize = isRoot ? 20 : depth === 1 ? 15 : 14;
          const fontWeight = isRoot ? 700 : depth === 1 ? 600 : 500;

          const tw = measureText(n.label, fontSize);
          const iw = n.icon ? 20 : 0;
          const nw = n._w || (tw + iw + 16);
          const nh = 36;
          const pad = 8;

          const hasChildren = n._ch && n._ch.length > 0;
          const isSel = n.id === selectedId;
          const isDragOver = n.id === dropTargetId && dragNodeId && dragNodeId !== n.id;
          const isSearchMatch = searchMatches.includes(n.id);
          const isCurrentMatch = searchMatches[searchIndex] === n.id;
          const hasUrl = !!n.url;
          const hasPriority = !!n.priority;
          const hasStatus = n.status === 'done';

          const dir = n._dir;

          // Collapse button: outside the node edge
          const collapseX = dir === -1 ? -12 : nw + 12;

          // Background highlight color (branch color with low alpha)
          const bgAlpha = isSel ? 0.12 : isDragOver ? 0.15 : 0;
          const bgColor = n.color || '#8b5cf6';

          return (
            <g
              key={n.id}
              className={`node ${isSel ? 'sel' : ''}`}
              transform={`translate(${n._x},${n._y})`}
              onMouseDown={e => onMouseDown(e, n.id)}
              onDoubleClick={e => onDoubleClick(e, n.id)}
              onContextMenu={e => onContextMenu(e, n.id)}
              onMouseEnter={() => { if (dragNodeId && dragNodeId !== n.id) setDropTargetId(n.id); }}
              onMouseLeave={() => { if (dropTargetId === n.id) setDropTargetId(null); }}
            >
              {/* Hover/selected background (transparent by default) */}
              <rect
                className="node-bg"
                x={-4} y={-nh / 2}
                width={nw + 8} height={nh}
                rx={4} ry={4}
                fill={bgColor}
                opacity={bgAlpha}
              />

              {/* Priority badge */}
              {hasPriority && (
                <circle
                  cx={nw + 2} cy={-nh / 2 + 6} r={4}
                  fill={n.priority === 'high' ? '#f43f5e' : n.priority === 'medium' ? '#f59e0b' : '#22c55e'}
                />
              )}

              {/* Done check */}
              {hasStatus && (
                <text x={-14} y={4} fontSize={12} fill="#22c55e">✓</text>
              )}

              {/* Icon */}
              {n.icon ? (
                <text
                  x={pad} y={4}
                  fontSize={fontSize - 1}
                  dominantBaseline="central"
                >{n.icon}</text>
              ) : null}

              {/* Label text */}
              <text
                x={pad + (n.icon ? iw : 0)}
                y={4}
                fontSize={fontSize}
                fontWeight={fontWeight}
                fontFamily="var(--f)"
                fill="var(--tx)"
                dominantBaseline="central"
                textAnchor="start"
              >
                {n.label}
              </text>

              {/* Search highlight glow */}
              {(isSearchMatch || isCurrentMatch) && (
                <rect
                  x={-4} y={-nh / 2}
                  width={nw + 8} height={nh}
                  rx={4} ry={4}
                  fill="none"
                  stroke={isCurrentMatch ? '#ffeb3b' : '#ff9800'}
                  strokeWidth={2}
                  opacity={0.7}
                />
              )}

              {/* URL indicator */}
              {hasUrl && (
                <text
                  x={nw + 4} y={4} fontSize={11}
                  fill="var(--tx2)" dominantBaseline="central"
                  style={{ cursor: 'pointer' }}
                  onClick={e => { e.stopPropagation(); window.open(n.url, '_blank'); }}
                >🔗</text>
              )}

              {/* Image thumbnail */}
              {n.image && (
                <image
                  href={n.image.url}
                  x={0} y={nh / 2 + 10}
                  width={40} height={30}
                  preserveAspectRatio="xMidYMid slice"
                  clipPath="inset(0% round 4px)"
                />
              )}

              {/* Collapse button */}
              {hasChildren ? (
                <g
                  className="ncb"
                  transform={`translate(${collapseX},${0})`}
                  onMouseDown={e => { e.stopPropagation(); }}
                  onClick={e => { e.stopPropagation(); toggleCollapse(n.id); }}
                >
                  <circle r={9} />
                  <text y={1} fontSize={11}>{n.collapsed ? `+${countHidden(n.id)}` : '−'}</text>
                </g>
              ) : null}
            </g>
          );
        })}
    </>
  );
}
