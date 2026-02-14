import { AuthProvider } from './context/AuthContext';
import { MapProvider } from './context/MapContext';
import { AppContent } from './AppContent';
import './App.css';

export default function App() {
  return (
    <AuthProvider>
      <MapProvider>
        <AppContent />
      </MapProvider>
    </AuthProvider>
  );
}
