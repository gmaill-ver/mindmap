import { useMapContext } from '../context/MapContext';
import { useAuthContext } from '../context/AuthContext';
import type { LayoutType } from '../types';

const LAYOUT_ICONS: Record<LayoutType, string> = {
  tree: '↔️',
  radial: '🔵',
  orgChart: '🏢',
};

const LAYOUT_LABELS: Record<LayoutType, string> = {
  tree: '水平ツリー',
  radial: '放射状',
  orgChart: '組織図',
};

export function Toolbar() {
  const {
    title, setTitle, undo, redo, canUndo, canRedo,
    selectedId, rootId, addChild, setPanelOpen,
    theme, setTheme, layout, setLayout,
    setShowShortcuts, setShowMapList, setShowTemplates, setShowOutline,
    setSearchOpen, showOutline,
    focusRootId, setFocusRootId,
    setPresentationMode,
  } = useMapContext();
  const { user, signInWithGoogle, signOut } = useAuthContext();

  const cycleLayout = () => {
    const layouts: LayoutType[] = ['tree', 'radial', 'orgChart'];
    const idx = layouts.indexOf(layout);
    setLayout(layouts[(idx + 1) % layouts.length]);
  };

  const cycleTheme = () => {
    const themes = ['dark', 'light', 'colorful', 'minimal', 'ocean', 'forest'] as const;
    const idx = themes.indexOf(theme);
    setTheme(themes[(idx + 1) % themes.length]);
  };

  return (
    <div className="tb">
      <button className="bb" onClick={() => setShowMapList(true)} title="マップ一覧">📂</button>
      <button className="bb" onClick={() => setShowTemplates(true)} title="テンプレート">📋</button>
      <div className="dv" />
      <div className="ttl" title={title}>
        <input
          className="ttl-input"
          value={title}
          onChange={e => setTitle(e.target.value)}
          spellCheck={false}
        />
      </div>
      <div className="dv" />
      <button className="bb" onClick={undo} disabled={!canUndo} title="元に戻す (Ctrl+Z)">↩</button>
      <button className="bb" onClick={redo} disabled={!canRedo} title="やり直す">↪</button>
      <div className="dv" />
      <button className="bb" onClick={() => { selectedId ? addChild(selectedId) : addChild(rootId!); }} title="子ノード追加 (Tab)">➕</button>
      <button className="bb" onClick={() => { if (selectedId) setPanelOpen(true); }} title="編集パネル">🎨</button>
      <div className="dv" />
      <button className="bb" onClick={cycleLayout} title={`レイアウト: ${LAYOUT_LABELS[layout]}`}>
        {LAYOUT_ICONS[layout]}
      </button>
      <button className="bb" onClick={() => setSearchOpen(true)} title="検索 (Ctrl+F)">🔍</button>
      <button className={`bb ${showOutline ? 'ac' : ''}`} onClick={() => setShowOutline(!showOutline)} title="アウトライン">📃</button>
      {selectedId && selectedId !== rootId && (
        <button className="bb" onClick={() => setFocusRootId(selectedId)} title="フォーカスモード">🎯</button>
      )}
      {focusRootId && (
        <button className="bb" onClick={() => setFocusRootId(null)} title="フォーカス解除">🔙</button>
      )}
      <div className="dv" />
      <button className="bb" onClick={() => setPresentationMode(true)} title="プレゼンテーション">🎬</button>
      <button className="bb" onClick={cycleTheme} title={`テーマ: ${theme}`}>
        {theme === 'dark' ? '🌙' : theme === 'light' ? '☀️' : theme === 'colorful' ? '🎨' : theme === 'minimal' ? '⬜' : theme === 'ocean' ? '🌊' : '🌲'}
      </button>
      <button className="bb" onClick={() => setShowShortcuts(true)} title="ショートカット (?)">⌨</button>
      <div className="dv" />
      {user ? (
        <button
          className="bb auth-btn"
          onClick={signOut}
          title={`${user.displayName || user.email} (ログアウト)`}
        >
          {user.photoURL ? (
            <img src={user.photoURL} alt="" className="avatar" />
          ) : '👤'}
        </button>
      ) : (
        <button className="bb" onClick={signInWithGoogle} title="Googleでログイン">🔐</button>
      )}
    </div>
  );
}
