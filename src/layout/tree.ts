import type { MindNode, LayoutNode } from '../types';
import { measureText } from '../utils/text';

const NODE_HEIGHT = 40;
const VERTICAL_GAP = 16;

/** Horizontal gap decreases with depth: 200 → 180 → 160 → ... min 120 */
function hGap(depth: number): number {
  return Math.max(120, 200 - depth * 20);
}

/** Compute rendered node width (matches Node.tsx logic) */
function nodeWidth(n: MindNode, isRoot: boolean): number {
  const tw = measureText(n.label, isRoot ? 16 : 14);
  const iw = n.icon ? 22 : 0;
  return Math.max(tw + iw + 36, isRoot ? 140 : 80);
}

export function treeLayout(nodes: MindNode[], rootId: string): Record<string, LayoutNode> {
  const nm: Record<string, LayoutNode> = {};
  nodes.forEach(n => nm[n.id] = { ...n, _ch: [], _x: 0, _y: 0, _dir: 1, _w: 0 });
  if (!nm[rootId]) return nm;

  // Build children arrays
  nodes.forEach(n => {
    if (n.parentId && nm[n.parentId]) nm[n.parentId]._ch.push(n.id);
  });

  // Pre-compute widths
  Object.values(nm).forEach(n => {
    n._w = nodeWidth(n, n.id === rootId);
  });

  // --- Height calculation ---
  function getHeight(id: string): number {
    const n = nm[id];
    if (!n || n.collapsed || !n._ch.length) return NODE_HEIGHT;
    const childrenH = n._ch.reduce((sum, cid) => sum + getHeight(cid), 0);
    const gaps = (n._ch.length - 1) * VERTICAL_GAP;
    return Math.max(NODE_HEIGHT, childrenH + gaps);
  }

  // --- Split root children left / right ---
  const root = nm[rootId];
  const rootChildren = root._ch;
  const half = Math.ceil(rootChildren.length / 2);
  const rightChildren = rootChildren.slice(0, half);
  const leftChildren = rootChildren.slice(half);

  // Assign direction recursively
  function assignDir(id: string, dir: 1 | -1) {
    const n = nm[id];
    if (!n) return;
    n._dir = dir;
    n._ch.forEach(cid => assignDir(cid, dir));
  }
  rightChildren.forEach(cid => assignDir(cid, 1));
  leftChildren.forEach(cid => assignDir(cid, -1));

  // --- Layout a subtree ---
  function layoutSubtree(id: string, x: number, yStart: number, dir: 1 | -1, depth: number) {
    const n = nm[id];
    if (!n) return;
    const h = getHeight(id);

    // Manual position override
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
    const nextX = n._x + (nw / 2 + gap) * dir;

    let curY = yStart;
    n._ch.forEach(cid => {
      const childH = getHeight(cid);
      layoutSubtree(cid, nextX, curY, dir, depth + 1);
      curY += childH + VERTICAL_GAP;
    });
  }

  // --- Position root ---
  root._x = root.mx != null ? root.mx : 0;
  root._y = root.my != null ? root.my : 0;
  root._dir = undefined;

  // Right subtrees
  if (rightChildren.length) {
    const totalRightH = rightChildren.reduce((sum, cid) => sum + getHeight(cid), 0)
      + (rightChildren.length - 1) * VERTICAL_GAP;
    const rootNw = root._w || 140;
    const startX = root._x + rootNw / 2 + hGap(0);
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
    const rootNw = root._w || 140;
    const startX = root._x - rootNw / 2 - hGap(0);
    let curY = root._y - totalLeftH / 2;

    leftChildren.forEach(cid => {
      const childH = getHeight(cid);
      layoutSubtree(cid, startX, curY, -1, 1);
      curY += childH + VERTICAL_GAP;
    });
  }

  return nm;
}
