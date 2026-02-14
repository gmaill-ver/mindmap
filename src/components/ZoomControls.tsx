import { useMapContext } from '../context/MapContext';

export function ZoomControls() {
  const { zoom, setZoom, centerView } = useMapContext();

  return (
    <div className="zc">
      <button className="zb" onClick={() => setZoom(z => Math.min(3, z * 1.2))}>+</button>
      <div className="zl">{Math.round(zoom * 100)}%</div>
      <button className="zb" onClick={() => setZoom(z => Math.max(0.2, z / 1.2))}>−</button>
      <div style={{ height: 1, background: 'var(--bd)', margin: '2px 4px' }} />
      <button className="zb" onClick={centerView} title="中央に戻る">⊙</button>
    </div>
  );
}
