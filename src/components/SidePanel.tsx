import { useRef, useCallback } from 'react';
import { useMapContext } from '../context/MapContext';
import { COLS, ICONS } from '../constants';
import type { ThemeName } from '../types';

const THEMES: { name: ThemeName; label: string; color: string }[] = [
  { name: 'dark', label: 'ダーク', color: '#0a0a0f' },
  { name: 'light', label: 'ライト', color: '#f5f5f7' },
  { name: 'colorful', label: 'カラフル', color: '#1a1025' },
  { name: 'minimal', label: 'ミニマル', color: '#fafafa' },
  { name: 'ocean', label: 'オーシャン', color: '#0c1929' },
  { name: 'forest', label: 'フォレスト', color: '#0f1a0f' },
];

export function SidePanel() {
  const { panelOpen, setPanelOpen, selectedNode, updateNode, theme, setTheme } = useMapContext();
  const fileRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedNode) return;
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        updateNode({
          ...selectedNode,
          image: { url: reader.result as string, width: img.width, height: img.height },
        });
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  }, [selectedNode, updateNode]);

  if (!panelOpen || !selectedNode) return null;

  return (
    <div className="sp op">
      <div className="sph">
        <h3>ノード編集</h3>
        <button className="spc" onClick={() => setPanelOpen(false)}>✕</button>
      </div>

      {/* Label */}
      <div className="sps">
        <div className="spl">ラベル</div>
        <input
          className="spi"
          value={selectedNode.label}
          onChange={e => updateNode({ ...selectedNode, label: e.target.value })}
        />
      </div>

      {/* Notes */}
      <div className="sps">
        <div className="spl">メモ</div>
        <textarea
          className="spta"
          value={selectedNode.notes || ''}
          placeholder="ノートを追加..."
          onChange={e => updateNode({ ...selectedNode, notes: e.target.value })}
        />
      </div>

      {/* URL */}
      <div className="sps">
        <div className="spl">URL</div>
        <input
          className="spi"
          value={selectedNode.url || ''}
          placeholder="https://..."
          onChange={e => updateNode({ ...selectedNode, url: e.target.value })}
        />
        {selectedNode.url && (
          <button className="sp-link-btn" onClick={() => window.open(selectedNode.url, '_blank')}>
            🔗 開く
          </button>
        )}
      </div>

      {/* Color */}
      <div className="sps">
        <div className="spl">カラー</div>
        <div className="cg">
          {COLS.map(c => (
            <div
              key={c}
              className={`cw ${selectedNode.color === c ? 'at' : ''}`}
              style={{ background: c }}
              onClick={() => updateNode({ ...selectedNode, color: c })}
            />
          ))}
        </div>
      </div>

      {/* Icon */}
      <div className="sps">
        <div className="spl">アイコン</div>
        <div className="ig">
          <button
            className={`ib ${!selectedNode.icon ? 'at' : ''}`}
            onClick={() => updateNode({ ...selectedNode, icon: '' })}
          >✕</button>
          {ICONS.map(ic => (
            <button
              key={ic}
              className={`ib ${selectedNode.icon === ic ? 'at' : ''}`}
              onClick={() => updateNode({ ...selectedNode, icon: ic })}
            >{ic}</button>
          ))}
        </div>
      </div>

      {/* Priority */}
      <div className="sps">
        <div className="spl">優先度</div>
        <div className="sp-priority">
          {(['low', 'medium', 'high'] as const).map(p => (
            <button
              key={p}
              className={`sp-pri-btn ${selectedNode.priority === p ? 'at' : ''}`}
              data-priority={p}
              onClick={() => updateNode({ ...selectedNode, priority: selectedNode.priority === p ? undefined : p })}
            >
              {p === 'high' ? '🔴 高' : p === 'medium' ? '🟡 中' : '🟢 低'}
            </button>
          ))}
        </div>
      </div>

      {/* Status */}
      <div className="sps">
        <div className="spl">ステータス</div>
        <div className="sp-priority">
          {(['todo', 'doing', 'done'] as const).map(s => (
            <button
              key={s}
              className={`sp-pri-btn ${selectedNode.status === s ? 'at' : ''}`}
              onClick={() => updateNode({ ...selectedNode, status: selectedNode.status === s ? undefined : s })}
            >
              {s === 'todo' ? '📋 TODO' : s === 'doing' ? '🔄 進行中' : '✅ 完了'}
            </button>
          ))}
        </div>
      </div>

      {/* Due Date */}
      <div className="sps">
        <div className="spl">期限</div>
        <input
          className="spi"
          type="date"
          value={selectedNode.dueDate || ''}
          onChange={e => updateNode({ ...selectedNode, dueDate: e.target.value || undefined })}
        />
        {selectedNode.dueDate && new Date(selectedNode.dueDate) < new Date() && (
          <div className="sp-overdue">⚠️ 期限切れ</div>
        )}
      </div>

      {/* Image */}
      <div className="sps">
        <div className="spl">画像</div>
        <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImageUpload} />
        <button className="sp-img-btn" onClick={() => fileRef.current?.click()}>
          📷 画像をアップロード
        </button>
        {selectedNode.image && (
          <div className="sp-img-preview">
            <img src={selectedNode.image.url} alt="" />
            <button className="sp-img-remove" onClick={() => updateNode({ ...selectedNode, image: undefined })}>✕</button>
          </div>
        )}
      </div>

      {/* Theme (global) */}
      <div className="sps">
        <div className="spl">テーマ</div>
        <div className="sp-themes">
          {THEMES.map(t => (
            <button
              key={t.name}
              className={`sp-theme-btn ${theme === t.name ? 'at' : ''}`}
              onClick={() => setTheme(t.name)}
            >
              <span className="sp-theme-dot" style={{ background: t.color }} />
              {t.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
