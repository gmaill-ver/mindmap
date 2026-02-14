import { useMapContext } from '../context/MapContext';
import { measureText } from '../utils/text';

export function InlineEdit() {
  const { editId, editText, editPos, setEditText, finishEdit, cancelEdit } = useMapContext();

  if (!editId) return null;

  return (
    <div className="ie" style={{ left: editPos.x - 60, top: editPos.y - 16 }}>
      <input
        autoFocus
        value={editText}
        onChange={e => setEditText(e.target.value)}
        onBlur={finishEdit}
        onKeyDown={e => {
          if (e.key === 'Enter') finishEdit();
          if (e.key === 'Escape') cancelEdit();
        }}
        style={{ width: Math.max(120, measureText(editText) + 40) }}
      />
    </div>
  );
}
