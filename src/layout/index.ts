import type { MindNode, LayoutNode, LayoutType } from '../types';
import { radialLayout } from './radial';
import { treeLayout } from './tree';
import { orgChartLayout } from './orgChart';

const engines: Record<LayoutType, (nodes: MindNode[], rootId: string) => Record<string, LayoutNode>> = {
  radial: radialLayout,
  tree: treeLayout,
  orgChart: orgChartLayout,
};

export function computeLayout(
  nodes: MindNode[],
  rootId: string,
  layout: LayoutType = 'tree'
): Record<string, LayoutNode> {
  const engine = engines[layout] || engines.tree;
  return engine(nodes, rootId);
}
