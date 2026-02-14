import { useMapContext } from '../context/MapContext';

export function ToastContainer() {
  const { toasts } = useMapContext();

  if (!toasts.length) return null;

  return (
    <div className="tc">
      {toasts.map(t => (
        <div key={t.id} className="ts">{t.message}</div>
      ))}
    </div>
  );
}
