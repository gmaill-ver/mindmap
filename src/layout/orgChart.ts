import type { MindNode, LayoutNode } from '../types';
import { measureText } from '../utils/text';

function nodeWidth(n: MindNode, isRoot: boolean): number {
  const tw = measureText(n.label, isRoot ? 16 : 14);
  const iw = n.icon ? 22 : 0;
  return Math.max(tw + iw + 36, isRoot ? 140 : 80);
}

export function orgChartLayout(nodes: MindNode[], rootId: string): Record<string, LayoutNode> {
  const nm: Record<string, LayoutNode> = {};
  nodes.forEach(n => nm[n.id] = { ...n, _ch: [], _x: 0, _y: 0, _w: nodeWidth(n, n.id === rootId) });
  if (!nm[rootId]) return nm;

  nodes.forEach(n => {
    if (n.parentId && nm[n.parentId]) nm[n.parentId]._ch.push(n.id);
  });

  const hGap = 40;
  const vGap = 80;

  function subtreeWidth(id: string): number {
    const n = nm[id];
    if (!n || n.collapsed || !n._ch.length) return 160;
    return Math.max(160, n._ch.reduce((sum, cid) => sum + subtreeWidth(cid) + hGap, -hGap));
  }

  function lay(id: string, x: number, y: number) {
    const n = nm[id];
    if (!n) return;
    n._x = n.mx != null ? n.mx : x;
    n._y = n.my != null ? n.my : y;
    if (n.collapsed || !n._ch.length) return;

    const totalW = subtreeWidth(id);
    let curX = x - totalW / 2;

    n._ch.forEach(cid => {
      const w = subtreeWidth(cid);
      lay(cid, curX + w / 2, y + vGap);
      curX += w + hGap;
    });
  }

  const r = nm[rootId];
  r._x = r.mx != null ? r.mx : 0;
  r._y = r.my != null ? r.my : 0;
  lay(rootId, r._x, r._y);
  return nm;
}
