import { useMapContext } from '../context/MapContext';

export function Minimap() {
  const { lo, vis, rootId } = useMapContext();

  const all = Object.values(lo).filter(n => vis.has(n.id));
  if (!all.length) return null;

  let mnX = Infinity, mnY = Infinity, mxX = -Infinity, mxY = -Infinity;
  all.forEach(n => {
    mnX = Math.min(mnX, n._x);
    mxX = Math.max(mxX, n._x);
    mnY = Math.min(mnY, n._y);
    mxY = Math.max(mxY, n._y);
  });

  const sc = Math.min(180 / ((mxX - mnX + 120) || 200), 120 / ((mxY - mnY + 120) || 200));

  return (
    <div className="mmv">
      <svg width={180} height={120}>
        <g transform={`translate(${90 - ((mnX + mxX) / 2) * sc},${60 - ((mnY + mxY) / 2) * sc})`}>
          {all.map(n => (
            <circle
              key={n.id}
              cx={n._x * sc}
              cy={n._y * sc}
              r={n.id === rootId ? 4 : 2.5}
              fill={n.color || '#666'}
              opacity={0.8}
            />
          ))}
        </g>
      </svg>
    </div>
  );
}
