import { useMapContext } from '../context/MapContext';

export function StatusBar() {
  const { saving, vis, nodes, zoom, layout } = useMapContext();

  const layoutLabel = layout === 'radial' ? '放射状' : layout === 'tree' ? 'ツリー' : '組織図';

  return (
    <div className="sb">
      <div className="sbi">
        <div className={`sbd ${saving ? 'sv' : ''}`} />
        {saving ? '保存中...' : '保存済み'}
      </div>
      <div className="sbi">ノード: {vis.size}/{nodes.length}</div>
      <div className="sbi">レイアウト: {layoutLabel}</div>
      <div className="sbi">ズーム: {Math.round(zoom * 100)}%</div>
    </div>
  );
}
