import { useCallback, type MouseEvent } from 'react';
import { useMapContext } from '../context/MapContext';
import { measureText } from '../utils/text';

export function MindMapNodes() {
  const {
    lo, vis, rootId, selectedId, setSelectedId, dragNodeId, setDragNodeId, dropTargetId, setDropTargetId,
    startEdit, toggleCollapse, countHidden, setContextMenu,
    addChild, addSibling, deleteNode, setPanelOpen, nodes, layout,
    relationshipMode, relationshipSource, setRelationshipSource, addRelationship, setRelationshipMode,
    searchMatches, searchIndex,
  } = useMapContext();

  const onMouseDown = useCallback((e: MouseEvent, nodeId: string) => {
    e.stopPropagation();

    if (relationshipMode && relationshipSource) {
      if (relationshipSource !== nodeId) {
        addRelationship(relationshipSource, nodeId);
      }
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
      x: e.clientX,
      y: e.clientY,
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

  const isTree = layout === 'tree';

  return (
    <>
      {Object.values(lo)
        .filter(n => vis.has(n.id))
        .map(n => {
          const isRoot = n.id === rootId;
          const tw = measureText(n.label, isRoot ? 16 : 14);
          const iw = n.icon ? 22 : 0;
          const nw = n._w || Math.max(tw + iw + 36, isRoot ? 140 : 80);
          const nh = isRoot ? 48 : 38;
          const rx = nh / 2;
          const hasChildren = n._ch && n._ch.length > 0;
          const isSel = n.id === selectedId;
          const isDragOver = n.id === dropTargetId && dragNodeId && dragNodeId !== n.id;
          const isSearchMatch = searchMatches.includes(n.id);
          const isCurrentMatch = searchMatches[searchIndex] === n.id;
          const hasUrl = !!n.url;
          const hasPriority = !!n.priority;
          const hasStatus = n.status === 'done';

          // Direction for tree layout (root has no direction → center-aligned)
          const dir = n._dir;
          const useTreeAlign = isTree && !isRoot && dir != null;

          // Text positioning
          let textAnchor: 'start' | 'middle' | 'end';
          let textX: number;
          let iconX: number;
          if (useTreeAlign) {
            if (dir === 1) {
              // Right branch: left-align text inside node
              textAnchor = 'start';
              iconX = -nw / 2 + 12;
              textX = -nw / 2 + 12 + (n.icon ? iw : 0);
            } else {
              // Left branch: right-align text inside node
              textAnchor = 'end';
              iconX = nw / 2 - 12 - tw - (n.icon ? iw : 0);
              textX = nw / 2 - 12;
            }
          } else {
            // Centered (root, radial, orgChart)
            textAnchor = 'middle';
            textX = n.icon ? iw / 2 - 2 : 0;
            iconX = -tw / 2 - 4;
          }

          // Collapse button position
          const collapseDir = isTree ? (dir || 1) : 1;
          const collapseX = nw / 2 * collapseDir + 14 * collapseDir;

          return (
            <g
              key={n.id}
              className={`node ${isSel ? 'sel' : ''} na`}
              transform={`translate(${n._x},${n._y})`}
              onMouseDown={(e) => onMouseDown(e, n.id)}
              onDoubleClick={(e) => onDoubleClick(e, n.id)}
              onContextMenu={(e) => onContextMenu(e, n.id)}
              onMouseEnter={() => { if (dragNodeId && dragNodeId !== n.id) setDropTargetId(n.id); }}
              onMouseLeave={() => { if (dropTargetId === n.id) setDropTargetId(null); }}
            >
              {/* Shadow */}
              <rect x={-nw / 2 + 2} y={-nh / 2 + 2} width={nw} height={nh} rx={rx} ry={rx} fill="rgba(0,0,0,.2)" />
              {/* Body */}
              <rect
                x={-nw / 2} y={-nh / 2} width={nw} height={nh} rx={rx} ry={rx}
                fill={n.color || '#666'}
                stroke={isDragOver ? '#fff' : isCurrentMatch ? '#ffeb3b' : isSearchMatch ? '#ff9800' : isSel ? 'rgba(255,255,255,.5)' : 'rgba(255,255,255,.1)'}
                strokeWidth={isDragOver ? 3 : isSel || isSearchMatch ? 2.5 : 1}
              />
              {/* Priority badge */}
              {hasPriority && (
                <circle
                  cx={nw / 2 - 8} cy={-nh / 2 + 6}
                  r={5}
                  fill={n.priority === 'high' ? '#f43f5e' : n.priority === 'medium' ? '#f59e0b' : '#22c55e'}
                />
              )}
              {/* Done check */}
              {hasStatus && (
                <text x={-nw / 2 + 12} y={-nh / 2 + 12} fontSize={10} fill="#22c55e">✓</text>
              )}
              {/* Icon */}
              {n.icon ? <text className="ni" x={iconX} y={0}>{n.icon}</text> : null}
              {/* Label */}
              <text
                className={`nt ${isRoot ? 'rt' : ''}`}
                x={textX}
                y={0}
                textAnchor={textAnchor}
              >
                {n.label}
              </text>
              {/* URL indicator */}
              {hasUrl && (
                <text
                  x={nw / 2 - 18} y={nh / 2 - 6} fontSize={10}
                  fill="rgba(255,255,255,0.7)" style={{ cursor: 'pointer' }}
                  onClick={(e) => { e.stopPropagation(); window.open(n.url, '_blank'); }}
                >🔗</text>
              )}
              {/* Image thumbnail */}
              {n.image && (
                <image
                  href={n.image.url}
                  x={-20} y={nh / 2 + 4}
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
                  onClick={(e) => { e.stopPropagation(); toggleCollapse(n.id); }}
                >
                  <circle r={10} />
                  <text y={1}>{n.collapsed ? `+${countHidden(n.id)}` : '−'}</text>
                </g>
              ) : null}
            </g>
          );
        })}
    </>
  );
}
