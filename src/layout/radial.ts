import type { MindNode, LayoutNode } from '../types';
import { measureText } from '../utils/text';

function nodeWidth(n: MindNode, isRoot: boolean): number {
  const tw = measureText(n.label, isRoot ? 16 : 14);
  const iw = n.icon ? 22 : 0;
  return Math.max(tw + iw + 36, isRoot ? 140 : 80);
}

export function radialLayout(nodes: MindNode[], rootId: string): Record<string, LayoutNode> {
  const nm: Record<string, LayoutNode> = {};
  nodes.forEach(n => nm[n.id] = { ...n, _ch: [], _x: 0, _y: 0, _w: nodeWidth(n, n.id === rootId) });
  if (!nm[rootId]) return nm;

  nodes.forEach(n => {
    if (n.parentId && nm[n.parentId]) nm[n.parentId]._ch.push(n.id);
  });

  function countVisible(id: string): number {
    const n = nm[id];
    if (!n || n.collapsed) return 0;
    let c = n._ch.length;
    n._ch.forEach(i => { c += countVisible(i); });
    return c;
  }

  function lay(id: string, cx: number, cy: number, sa: number, ea: number, d: number) {
    const n = nm[id];
    if (!n) return;
    n._x = n.mx != null ? n.mx : cx;
    n._y = n.my != null ? n.my : cy;
    if (n.collapsed || !n._ch.length) return;

    const tw = n._ch.reduce((s, c) => s + 1 + countVisible(c) * 0.5, 0);
    const rad = (d === 0 ? 147 : 120) + Math.min(d * 13, 40);
    let ca = sa;

    n._ch.forEach(cid => {
      const w = 1 + countVisible(cid) * 0.5;
      const a = (ea - sa) * (w / tw);
      const ma = ca + a / 2;
      lay(cid, cx + Math.cos(ma) * rad, cy + Math.sin(ma) * rad, ca, ca + a, d + 1);
      ca += a;
    });
  }

  const r = nm[rootId];
  r._x = r.mx != null ? r.mx : 0;
  r._y = r.my != null ? r.my : 0;
  lay(rootId, r._x, r._y, 0, Math.PI * 2, 0);
  return nm;
}
