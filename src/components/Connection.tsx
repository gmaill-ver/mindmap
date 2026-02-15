import { useMapContext } from '../context/MapContext';

export function Connection() {
  const { lo, vis, layout } = useMapContext();

  return (
    <>
      {Object.values(lo)
        .filter(n => n.parentId && vis.has(n.id) && vis.has(n.parentId!))
        .map(n => {
          const p = lo[n.parentId!];
          if (!p) return null;

          let d: string;

          if (layout === 'tree') {
            const dir = n._dir || 1;
            const pw = p._w || 80;
            const cw = n._w || 80;

            // Connect from parent's edge to child's edge
            let startX: number, endX: number;
            if (dir === 1) {
              startX = p._x + pw;  // parent right edge
              endX = n._x;         // child left edge
            } else {
              startX = p._x;       // parent left edge
              endX = n._x + cw;    // child right edge
            }
            const startY = p._y;
            const endY = n._y;
            const midX = (startX + endX) / 2;

            d = `M${startX},${startY} C${midX},${startY} ${midX},${endY} ${endX},${endY}`;
          } else {
            const dx = n._x - p._x;
            const dy = n._y - p._y;
            d = `M${p._x},${p._y}C${p._x + dx * 0.4},${p._y + dy * 0.1},${p._x + dx * 0.6},${n._y - dy * 0.1},${n._x},${n._y}`;
          }

          return (
            <path
              key={`c${n.id}`}
              className="cn"
              d={d}
              stroke={n.color || '#666'}
            />
          );
        })}
    </>
  );
}
