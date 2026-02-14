import { useEffect, useRef } from 'react';
import { useMapContext } from '../context/MapContext';

export function SearchBar() {
  const {
    searchOpen, setSearchOpen, searchQuery, setSearchQuery,
    searchMatches, searchIndex, setSearchIndex,
    setSelectedId, lo, setVx, setVy, zoom,
  } = useMapContext();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [searchOpen]);

  useEffect(() => {
    if (searchMatches.length > 0 && searchMatches[searchIndex]) {
      const nodeId = searchMatches[searchIndex];
      setSelectedId(nodeId);
      const ln = lo[nodeId];
      if (ln) {
        setVx(window.innerWidth / 2 - ln._x * zoom);
        setVy(window.innerHeight / 2 - ln._y * zoom);
      }
    }
  }, [searchIndex, searchMatches]);

  if (!searchOpen) return null;

  const goNext = () => {
    if (searchMatches.length) setSearchIndex((searchIndex + 1) % searchMatches.length);
  };
  const goPrev = () => {
    if (searchMatches.length) setSearchIndex((searchIndex - 1 + searchMatches.length) % searchMatches.length);
  };

  return (
    <div className="search-bar">
      <div className="search-inner">
        <span className="search-icon">🔍</span>
        <input
          ref={inputRef}
          className="search-input"
          placeholder="ノードを検索..."
          value={searchQuery}
          onChange={e => { setSearchQuery(e.target.value); setSearchIndex(0); }}
          onKeyDown={e => {
            if (e.key === 'Enter') { e.shiftKey ? goPrev() : goNext(); }
            if (e.key === 'Escape') { setSearchOpen(false); setSearchQuery(''); }
          }}
        />
        {searchMatches.length > 0 && (
          <span className="search-count">{searchIndex + 1}/{searchMatches.length}</span>
        )}
        <button className="search-nav" onClick={goPrev} title="前へ">▲</button>
        <button className="search-nav" onClick={goNext} title="次へ">▼</button>
        <button className="search-close" onClick={() => { setSearchOpen(false); setSearchQuery(''); }}>✕</button>
      </div>
    </div>
  );
}
