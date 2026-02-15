import { useMapContext } from '../context/MapContext';

const SHORTCUTS = [
  ['子ノード追加', 'Tab'],
  ['兄弟ノード追加', 'Enter'],
  ['ノード削除', 'Del / Backspace'],
  ['名前を編集', 'F2 / ダブルクリック'],
  ['折りたたみ/展開', 'Space'],
  ['元に戻す', 'Ctrl+Z'],
  ['やり直す', 'Ctrl+Shift+Z'],
  ['検索', 'Ctrl+F'],
  ['選択解除', 'Escape'],
  ['中央に戻る', 'Ctrl+0'],
  ['ズームイン', 'Ctrl++'],
  ['ズームアウト', 'Ctrl+-'],
  ['保存', 'Ctrl+S'],
  ['ショートカット', '?'],
];

export function ShortcutsModal() {
  const { showShortcuts, setShowShortcuts } = useMapContext();

  if (!showShortcuts) return null;

  return (
    <div className="mo" onClick={() => setShowShortcuts(false)}>
      <div className="mdl" onClick={e => e.stopPropagation()}>
        <h2>⌨️ キーボードショートカット</h2>
        {SHORTCUTS.map(([label, key], i) => (
          <div key={i} className="skr">
            <span>{label}</span>
            <span className="skk"><kbd>{key}</kbd></span>
          </div>
        ))}
      </div>
    </div>
  );
}
