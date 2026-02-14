import type { MindNode, LayoutNode, ThemeName } from '../types';
import { measureText } from './text';

const THEME_BG: Record<ThemeName, string> = {
  dark: '#0a0a0f',
  light: '#f5f5f7',
  colorful: '#1a1025',
  minimal: '#fafafa',
  ocean: '#0c1929',
  forest: '#0f1a0f',
};

export function exportJSON(
  id: string,
  title: string,
  rootId: string,
  nodes: MindNode[],
  theme: ThemeName,
  layout: string
) {
  const d = { id, title, rootId, nodes, theme, layout, exportedAt: new Date().toISOString() };
  const b = new Blob([JSON.stringify(d, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(b);
  a.download = `${title || 'mindmap'}.json`;
  a.click();
  URL.revokeObjectURL(a.href);
}

export function exportPNG(
  svgEl: SVGSVGElement,
  lo: Record<string, LayoutNode>,
  vis: Set<string>,
  rootId: string,
  title: string,
  theme: ThemeName
) {
  const lns = Object.values(lo).filter(n => vis.has(n.id));
  if (!lns.length) return;

  const pad = 100;
  let mnX = Infinity, mnY = Infinity, mxX = -Infinity, mxY = -Infinity;
  lns.forEach(n => {
    const w = Math.max(measureText(n.label, n.id === rootId ? 16 : 14) + 40, 80);
    mnX = Math.min(mnX, n._x - w / 2);
    mxX = Math.max(mxX, n._x + w / 2);
    mnY = Math.min(mnY, n._y - 24);
    mxY = Math.max(mxY, n._y + 24);
  });

  const W = mxX - mnX + pad * 2;
  const H = mxY - mnY + pad * 2;
  const cl = svgEl.cloneNode(true) as SVGSVGElement;
  cl.setAttribute('width', String(W));
  cl.setAttribute('height', String(H));
  cl.setAttribute('viewBox', `${mnX - pad} ${mnY - pad} ${W} ${H}`);
  const g = cl.querySelector('g');
  if (g) g.setAttribute('transform', '');

  const sd = new XMLSerializer().serializeToString(cl);
  const cvs = document.createElement('canvas');
  cvs.width = W * 2;
  cvs.height = H * 2;
  const c = cvs.getContext('2d')!;
  c.scale(2, 2);
  c.fillStyle = THEME_BG[theme] || THEME_BG.dark;
  c.fillRect(0, 0, W, H);

  const img = new Image();
  img.onload = () => {
    c.drawImage(img, 0, 0, W, H);
    const l = document.createElement('a');
    l.download = `${title || 'mindmap'}.png`;
    l.href = cvs.toDataURL();
    l.click();
  };
  img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(sd)));
}

export function exportSVG(
  svgEl: SVGSVGElement,
  lo: Record<string, LayoutNode>,
  vis: Set<string>,
  rootId: string,
  title: string
) {
  const lns = Object.values(lo).filter(n => vis.has(n.id));
  if (!lns.length) return;

  const pad = 100;
  let mnX = Infinity, mnY = Infinity, mxX = -Infinity, mxY = -Infinity;
  lns.forEach(n => {
    const w = Math.max(measureText(n.label, n.id === rootId ? 16 : 14) + 40, 80);
    mnX = Math.min(mnX, n._x - w / 2);
    mxX = Math.max(mxX, n._x + w / 2);
    mnY = Math.min(mnY, n._y - 24);
    mxY = Math.max(mxY, n._y + 24);
  });

  const W = mxX - mnX + pad * 2;
  const H = mxY - mnY + pad * 2;
  const cl = svgEl.cloneNode(true) as SVGSVGElement;
  cl.setAttribute('width', String(W));
  cl.setAttribute('height', String(H));
  cl.setAttribute('viewBox', `${mnX - pad} ${mnY - pad} ${W} ${H}`);
  const g = cl.querySelector('g');
  if (g) g.setAttribute('transform', '');

  const sd = new XMLSerializer().serializeToString(cl);
  const b = new Blob([sd], { type: 'image/svg+xml' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(b);
  a.download = `${title || 'mindmap'}.svg`;
  a.click();
  URL.revokeObjectURL(a.href);
}

export function exportMarkdown(
  nodes: MindNode[],
  rootId: string,
  title: string
) {
  const nodeMap = new Map<string, MindNode>();
  nodes.forEach(n => nodeMap.set(n.id, n));

  const childrenOf = (pid: string) => nodes.filter(n => n.parentId === pid);

  function render(id: string, depth: number): string {
    const node = nodeMap.get(id);
    if (!node) return '';
    const indent = '  '.repeat(depth);
    const prefix = depth === 0 ? '# ' : '- ';
    let line = `${indent}${prefix}${node.icon ? node.icon + ' ' : ''}${node.label}\n`;
    if (node.notes) {
      line += `${indent}  > ${node.notes}\n`;
    }
    if (node.url) {
      line += `${indent}  [Link](${node.url})\n`;
    }
    childrenOf(id).forEach(child => {
      line += render(child.id, depth + 1);
    });
    return line;
  }

  const md = render(rootId, 0);
  const b = new Blob([md], { type: 'text/markdown' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(b);
  a.download = `${title || 'mindmap'}.md`;
  a.click();
  URL.revokeObjectURL(a.href);
}
