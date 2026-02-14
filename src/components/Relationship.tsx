import { useMapContext } from '../context/MapContext';

export function RelationshipLines() {
  const { nodes, lo, vis } = useMapContext();

  const lines: { sourceId: string; targetId: string; label?: string }[] = [];

  nodes.forEach(n => {
    if (!vis.has(n.id)) return;
    (n.relationships || []).forEach(r => {
      if (vis.has(r.targetId)) {
        lines.push({ sourceId: n.id, targetId: r.targetId, label: r.label });
      }
    });
  });

  return (
    <>
      {lines.map(({ sourceId, targetId, label }) => {
        const s = lo[sourceId];
        const t = lo[targetId];
        if (!s || !t) return null;
        const mx = (s._x + t._x) / 2;
        const my = (s._y + t._y) / 2;
        return (
          <g key={`rel-${sourceId}-${targetId}`}>
            <path
              d={`M${s._x},${s._y}Q${mx},${my - 40},${t._x},${t._y}`}
              fill="none"
              stroke="rgba(139,92,246,0.5)"
              strokeWidth={2}
              strokeDasharray="6,4"
              markerEnd="url(#arrowhead)"
            />
            {label && (
              <text
                x={mx}
                y={my - 24}
                textAnchor="middle"
                fill="var(--tx2)"
                fontSize={11}
                fontFamily="var(--f)"
              >
                {label}
              </text>
            )}
          </g>
        );
      })}
    </>
  );
}
