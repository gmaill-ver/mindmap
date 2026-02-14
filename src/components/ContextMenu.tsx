import { useEffect, useRef } from 'react';
import { useMapContext } from '../context/MapContext';

export function ContextMenu() {
  const { contextMenu, setContextMenu } = useMapContext();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!contextMenu) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setContextMenu(null);
      }
    };
    setTimeout(() => document.addEventListener('mousedown', handler), 0);
    return () => document.removeEventListener('mousedown', handler);
  }, [contextMenu, setContextMenu]);

  if (!contextMenu) return null;

  return (
    <div ref={ref} className="cm" style={{ left: contextMenu.x, top: contextMenu.y }}>
      {contextMenu.items.map((item, i) =>
        item.d ? (
          <div key={i} className="cdv" />
        ) : (
          <button
            key={i}
            className={`ci ${item.dg ? 'dg' : ''}`}
            onClick={() => { item.action?.(); setContextMenu(null); }}
          >
            <span>{item.icon || ''}</span>
            <span>{item.label}</span>
            {item.sc && <span className="ck">{item.sc}</span>}
          </button>
        )
      )}
    </div>
  );
}
