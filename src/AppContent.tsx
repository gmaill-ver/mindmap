import { Canvas } from './components/Canvas';
import { Toolbar } from './components/Toolbar';
import { ZoomControls } from './components/ZoomControls';
import { Minimap } from './components/Minimap';
import { StatusBar } from './components/StatusBar';
import { SidePanel } from './components/SidePanel';
import { InlineEdit } from './components/InlineEdit';
import { ContextMenu } from './components/ContextMenu';
import { SearchBar } from './components/SearchBar';
import { OutlineView } from './components/OutlineView';
import { ShortcutsModal } from './components/ShortcutsModal';
import { MapListModal } from './components/MapListModal';
import { TemplatesModal } from './components/TemplatesModal';
import { PresentationMode } from './components/PresentationMode';
import { ToastContainer } from './components/Toast';
import { useKeyboard } from './hooks/useKeyboard';

export function AppContent() {
  useKeyboard();

  return (
    <>
      <Canvas />
      <Toolbar />
      <ZoomControls />
      <Minimap />
      <StatusBar />
      <SidePanel />
      <InlineEdit />
      <ContextMenu />
      <SearchBar />
      <OutlineView />
      <ShortcutsModal />
      <MapListModal />
      <TemplatesModal />
      <PresentationMode />
      <ToastContainer />
    </>
  );
}
