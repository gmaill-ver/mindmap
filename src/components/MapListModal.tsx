import { useMapContext } from '../context/MapContext';

export function MapListModal() {
  const { showMapList, setShowMapList, maps, switchMap, delMap, setShowTemplates } = useMapContext();

  if (!showMapList) return null;

  const sorted = [...maps].sort((a, b) => b.updatedAt - a.updatedAt);

  return (
    <div className="mlo" onClick={() => setShowMapList(false)}>
      <div className="mlm" onClick={e => e.stopPropagation()}>
        <h2>📂 マインドマップ一覧</h2>
        <p>{maps.length} 件のマップ</p>
        {sorted.map(m => (
          <div key={m.id} className="mi" onClick={() => { switchMap(m.id); setShowMapList(false); }}>
            <div>
              <div className="mit">{m.title}</div>
              <div className="mid">
                {new Date(m.updatedAt).toLocaleDateString('ja-JP')}
                {' · '}
                {m.nodes?.length || 0}ノード
              </div>
            </div>
            <div>
              <button className="mdb" onClick={e => { e.stopPropagation(); delMap(m.id); }}>🗑</button>
            </div>
          </div>
        ))}
        <button className="nmb" onClick={() => { setShowMapList(false); setShowTemplates(true); }}>
          ＋ 新規マップ作成
        </button>
      </div>
    </div>
  );
}
