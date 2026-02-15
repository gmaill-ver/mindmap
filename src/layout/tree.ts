import type { MindNode, LayoutNode } from '../types';
import { measureText } from '../utils/text';

const NODE_HEIGHT = 36;
const VERTICAL_GAP = 14;

function hGap(depth: number): number {
  return Math.max(120, 200 - depth * 20);
}

/** Text-only node width: icon + text + padding */
function nodeWidth(n: MindNode, isRoot: boolean, depth: number): number {
  const fontSize = isRoot ? 20 : depth === 1 ? 15 : 14;
  const tw = measureText(n.label, fontSize);
  const iw = n.icon ? 20 : 0;
  return tw + iw + 16; // 8px padding each side
}

export function treeLayout(nodes: MindNode[], rootId: string): Record<string, LayoutNode> {
  const nm: Record<string, LayoutNode> = {};
  nodes.forEach(n => nm[n.id] = { ...n, _ch: [], _x: 0, _y: 0, _dir: 1, _w: 0 });
  if (!nm[rootId]) return nm;

  nodes.forEach(n => {
    if (n.parentId && nm[n.parentId]) nm[n.parentId]._ch.push(n.id);
  });

  // Compute depth for each node
  function getDepth(id: string): number {
    let d = 0;
    let cur = nm[id];
    while (cur && cur.parentId && nm[cur.parentId]) { d++; cur = nm[cur.parentId]; }
    return d;
  }

  // Pre-compute widths
  Object.values(nm).forEach(n => {
    const d = getDepth(n.id);
    n._w = nodeWidth(n, n.id === rootId, d);
  });

  function getHeight(id: string): number {
    const n = nm[id];
    if (!n || n.collapsed || !n._ch.length) return NODE_HEIGHT;
    const childrenH = n._ch.reduce((sum, cid) => sum + getHeight(cid), 0);
    const gaps = (n._ch.length - 1) * VERTICAL_GAP;
    return Math.max(NODE_HEIGHT, childrenH + gaps);
  }

  const root = nm[rootId];
  const rootChildren = root._ch;
  const half = Math.ceil(rootChildren.length / 2);
  const rightChildren = rootChildren.slice(0, half);
  const leftChildren = rootChildren.slice(half);

  function assignDir(id: string, dir: 1 | -1) {
    const n = nm[id];
    if (!n) return;
    n._dir = dir;
    n._ch.forEach(cid => assignDir(cid, dir));
  }
  rightChildren.forEach(cid => assignDir(cid, 1));
  leftChildren.forEach(cid => assignDir(cid, -1));

  function layoutSubtree(id: string, x: number, yStart: number, dir: 1 | -1, depth: number) {
    const n = nm[id];
    if (!n) return;
    const h = getHeight(id);

    if (n.mx != null && n.my != null) {
      n._x = n.mx;
      n._y = n.my;
    } else {
      n._x = x;
      n._y = yStart + h / 2;
    }

    if (n.collapsed || !n._ch.length) return;

    const gap = hGap(depth);
    const nw = n._w || 80;
    // Next x: from the edge of this node + gap
    const nextX = dir === 1
      ? n._x + nw + gap
      : n._x - gap;

    let curY = yStart;
    n._ch.forEach(cid => {
      const childH = getHeight(cid);
      const childNw = nm[cid]._w || 80;
      // For left-dir children, position so their right edge is at nextX
      const childX = dir === 1 ? nextX : nextX - childNw;
      layoutSubtree(cid, childX, curY, dir, depth + 1);
      curY += childH + VERTICAL_GAP;
    });
  }

  // Position root (centered on 0,0, left-edge based)
  const rootW = root._w || 100;
  root._x = root.mx != null ? root.mx : -rootW / 2;
  root._y = root.my != null ? root.my : 0;
  root._dir = undefined;

  // Right subtrees
  if (rightChildren.length) {
    const totalRightH = rightChildren.reduce((sum, cid) => sum + getHeight(cid), 0)
      + (rightChildren.length - 1) * VERTICAL_GAP;
    const startX = root._x + rootW + hGap(0);
    let curY = root._y - totalRightH / 2;

    rightChildren.forEach(cid => {
      const childH = getHeight(cid);
      layoutSubtree(cid, startX, curY, 1, 1);
      curY += childH + VERTICAL_GAP;
    });
  }

  // Left subtrees
  if (leftChildren.length) {
    const totalLeftH = leftChildren.reduce((sum, cid) => sum + getHeight(cid), 0)
      + (leftChildren.length - 1) * VERTICAL_GAP;
    const startX = root._x - hGap(0);
    let curY = root._y - totalLeftH / 2;

    leftChildren.forEach(cid => {
      const childH = getHeight(cid);
      const childNw = nm[cid]._w || 80;
      layoutSubtree(cid, startX - childNw, curY, -1, 1);
      curY += childH + VERTICAL_GAP;
    });
  }

  return nm;
}
