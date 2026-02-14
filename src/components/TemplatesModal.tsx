import { useMapContext } from '../context/MapContext';
import { TEMPLATES } from '../constants';

export function TemplatesModal() {
  const { showTemplates, setShowTemplates, newMap } = useMapContext();

  if (!showTemplates) return null;

  return (
    <div className="mo" onClick={() => setShowTemplates(false)}>
      <div className="mdl" onClick={e => e.stopPropagation()}>
        <h2>📋 テンプレートを選択</h2>
        <div className="template-grid">
          {TEMPLATES.map((t, i) => (
            <button
              key={i}
              className="template-card"
              onClick={() => {
                const { rootId, nodes } = t.create();
                newMap(rootId, nodes);
                setShowTemplates(false);
              }}
            >
              <div className="template-icon">{t.icon}</div>
              <div className="template-name">{t.name}</div>
              <div className="template-desc">{t.description}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
