import { uid } from './utils/uid';
import type { MindNode, Template, ThemeName } from './types';

export const COLS = [
  '#8b5cf6', '#06b6d4', '#f43f5e', '#22c55e', '#f59e0b', '#ec4899',
  '#3b82f6', '#14b8a6', '#f97316', '#6366f1', '#84cc16', '#e11d48',
  '#0ea5e9', '#a855f7', '#10b981', '#ef4444',
];

export const ICONS = [
  '⭐', '💡', '🎯', '📌', '🔥', '💎', '🚀', '⚡',
  '📝', '✅', '❌', '⚠️', '💬', '🔗', '📊', '🎨',
  '🧠', '❤️', '👍', '🔑', '📁', '🏷️', '📅', '🔔',
];

export function colorByDepth(d: number): string {
  return d === 0 ? COLS[0] : COLS[d % COLS.length];
}

export function createDefaultMap() {
  const rootId = uid();
  const nodes: MindNode[] = [
    { id: rootId, label: 'メインテーマ', parentId: null, color: COLS[0], icon: '', collapsed: false, notes: '' },
  ];
  [
    { l: 'アイデア' },
    { l: 'タスク' },
    { l: 'リソース' },
    { l: 'メモ' },
  ].forEach((c, idx) => {
    nodes.push({
      id: uid(), label: c.l, parentId: rootId, color: COLS[(idx + 1) % COLS.length],
      icon: '', collapsed: false, notes: '',
    });
  });
  return { rootId, nodes };
}

export const TEMPLATES: Template[] = [
  {
    name: '空のマップ',
    icon: '',
    description: '空白のマインドマップ',
    create: () => {
      const rootId = uid();
      return {
        rootId,
        nodes: [{ id: rootId, label: 'メインテーマ', parentId: null, color: COLS[0], icon: '', collapsed: false, notes: '' }],
      };
    },
  },
  {
    name: 'デフォルト',
    icon: '',
    description: '基本的なマインドマップ',
    create: createDefaultMap,
  },
  {
    name: '会議メモ',
    icon: '',
    description: '会議の議事録を整理',
    create: () => {
      const rootId = uid();
      const nodes: MindNode[] = [
        { id: rootId, label: '会議メモ', parentId: null, color: '#8b5cf6', icon: '', collapsed: false, notes: '' },
      ];
      const topics = [
        { l: '議題', i: '', children: ['議題1', '議題2', '議題3'] },
        { l: '決定事項', i: '', children: ['決定1', '決定2'] },
        { l: 'アクションアイテム', i: '', children: ['担当者A', '担当者B'] },
        { l: '次回までに', i: '', children: ['TODO 1', 'TODO 2'] },
      ];
      topics.forEach((t, ti) => {
        const pid = uid();
        nodes.push({ id: pid, label: t.l, parentId: rootId, color: COLS[(ti + 1) % COLS.length], icon: t.i, collapsed: false, notes: '' });
        t.children.forEach(c => {
          nodes.push({ id: uid(), label: c, parentId: pid, color: COLS[(ti + 2) % COLS.length], icon: '', collapsed: false, notes: '' });
        });
      });
      return { rootId, nodes };
    },
  },
  {
    name: 'プロジェクト計画',
    icon: '',
    description: 'プロジェクトの計画を立てる',
    create: () => {
      const rootId = uid();
      const nodes: MindNode[] = [
        { id: rootId, label: 'プロジェクト名', parentId: null, color: '#3b82f6', icon: '', collapsed: false, notes: '' },
      ];
      const topics = [
        { l: '目的・ゴール', i: '', children: ['KPI 1', 'KPI 2'] },
        { l: 'スケジュール', i: '', children: ['Phase 1', 'Phase 2', 'Phase 3'] },
        { l: 'チーム', i: '', children: ['リーダー', 'メンバー'] },
        { l: 'リスク', i: '', children: ['リスク1', '対策'] },
        { l: 'リソース', i: '', children: ['予算', 'ツール'] },
      ];
      topics.forEach((t, ti) => {
        const pid = uid();
        nodes.push({ id: pid, label: t.l, parentId: rootId, color: COLS[(ti + 1) % COLS.length], icon: t.i, collapsed: false, notes: '' });
        t.children.forEach(c => {
          nodes.push({ id: uid(), label: c, parentId: pid, color: COLS[(ti + 2) % COLS.length], icon: '', collapsed: false, notes: '' });
        });
      });
      return { rootId, nodes };
    },
  },
  {
    name: 'SWOT分析',
    icon: '',
    description: '強み・弱み・機会・脅威を分析',
    create: () => {
      const rootId = uid();
      const nodes: MindNode[] = [
        { id: rootId, label: 'SWOT分析', parentId: null, color: '#8b5cf6', icon: '', collapsed: false, notes: '' },
      ];
      const swot = [
        { l: 'Strengths (強み)', i: '', c: '#22c55e', children: ['強み1', '強み2'] },
        { l: 'Weaknesses (弱み)', i: '', c: '#f43f5e', children: ['弱み1', '弱み2'] },
        { l: 'Opportunities (機会)', i: '', c: '#3b82f6', children: ['機会1', '機会2'] },
        { l: 'Threats (脅威)', i: '', c: '#f59e0b', children: ['脅威1', '脅威2'] },
      ];
      swot.forEach(s => {
        const pid = uid();
        nodes.push({ id: pid, label: s.l, parentId: rootId, color: s.c, icon: s.i, collapsed: false, notes: '' });
        s.children.forEach(child => {
          nodes.push({ id: uid(), label: child, parentId: pid, color: s.c, icon: '', collapsed: false, notes: '' });
        });
      });
      return { rootId, nodes };
    },
  },
  {
    name: 'KPT振り返り',
    icon: '',
    description: 'Keep / Problem / Try の振り返り',
    create: () => {
      const rootId = uid();
      const nodes: MindNode[] = [
        { id: rootId, label: 'KPT振り返り', parentId: null, color: '#8b5cf6', icon: '', collapsed: false, notes: '' },
      ];
      const kpt = [
        { l: 'Keep (続けること)', i: '', c: '#22c55e', children: ['良かったこと1', '良かったこと2'] },
        { l: 'Problem (問題点)', i: '', c: '#f43f5e', children: ['問題1', '問題2'] },
        { l: 'Try (試すこと)', i: '', c: '#3b82f6', children: ['改善案1', '改善案2'] },
      ];
      kpt.forEach(k => {
        const pid = uid();
        nodes.push({ id: pid, label: k.l, parentId: rootId, color: k.c, icon: k.i, collapsed: false, notes: '' });
        k.children.forEach(child => {
          nodes.push({ id: uid(), label: child, parentId: pid, color: k.c, icon: '', collapsed: false, notes: '' });
        });
      });
      return { rootId, nodes };
    },
  },
  {
    name: '週次計画',
    icon: '',
    description: '週のタスクを整理',
    create: () => {
      const rootId = uid();
      const nodes: MindNode[] = [
        { id: rootId, label: '今週の計画', parentId: null, color: '#8b5cf6', icon: '', collapsed: false, notes: '' },
      ];
      const days = ['月曜日', '火曜日', '水曜日', '木曜日', '金曜日'];
      days.forEach((day, i) => {
        const pid = uid();
        nodes.push({ id: pid, label: day, parentId: rootId, color: COLS[(i + 1) % COLS.length], icon: '', collapsed: false, notes: '' });
        ['タスク1', 'タスク2'].forEach(t => {
          nodes.push({ id: uid(), label: t, parentId: pid, color: COLS[(i + 2) % COLS.length], icon: '', collapsed: false, notes: '' });
        });
      });
      return { rootId, nodes };
    },
  },
];

export const THEME_VARS: Record<ThemeName, Record<string, string>> = {
  dark: {
    '--bg': '#0a0a0f', '--bg2': '#12121a', '--bg3': '#1a1a26', '--bg4': '#222233',
    '--tx': '#e8e8f0', '--tx2': '#8888a0', '--txM': '#55556a',
    '--ac': '#8b5cf6', '--acH': '#a78bfa', '--acD': 'rgba(139,92,246,.15)',
    '--bd': 'rgba(255,255,255,.06)', '--sh': '0 8px 32px rgba(0,0,0,.4)', '--shS': '0 2px 8px rgba(0,0,0,.3)',
  },
  light: {
    '--bg': '#f5f5f7', '--bg2': '#fff', '--bg3': '#e8e8ed', '--bg4': '#fff',
    '--tx': '#1a1a2e', '--tx2': '#666680', '--txM': '#9999aa',
    '--ac': '#8b5cf6', '--acH': '#a78bfa', '--acD': 'rgba(139,92,246,.12)',
    '--bd': 'rgba(0,0,0,.08)', '--sh': '0 8px 32px rgba(0,0,0,.1)', '--shS': '0 2px 8px rgba(0,0,0,.06)',
  },
  colorful: {
    '--bg': '#1a1025', '--bg2': '#221530', '--bg3': '#2d1d3d', '--bg4': '#3a2550',
    '--tx': '#f0e8ff', '--tx2': '#b088d0', '--txM': '#7a5a9a',
    '--ac': '#e040fb', '--acH': '#ea80fc', '--acD': 'rgba(224,64,251,.15)',
    '--bd': 'rgba(255,255,255,.08)', '--sh': '0 8px 32px rgba(0,0,0,.5)', '--shS': '0 2px 8px rgba(0,0,0,.3)',
  },
  minimal: {
    '--bg': '#fafafa', '--bg2': '#ffffff', '--bg3': '#f0f0f0', '--bg4': '#ffffff',
    '--tx': '#333333', '--tx2': '#888888', '--txM': '#bbbbbb',
    '--ac': '#333333', '--acH': '#555555', '--acD': 'rgba(51,51,51,.08)',
    '--bd': 'rgba(0,0,0,.06)', '--sh': '0 4px 16px rgba(0,0,0,.06)', '--shS': '0 1px 4px rgba(0,0,0,.04)',
  },
  ocean: {
    '--bg': '#0c1929', '--bg2': '#132238', '--bg3': '#1a2e4a', '--bg4': '#213a5c',
    '--tx': '#e0f0ff', '--tx2': '#7ba8d0', '--txM': '#4a7a9a',
    '--ac': '#00b4d8', '--acH': '#48cae4', '--acD': 'rgba(0,180,216,.15)',
    '--bd': 'rgba(255,255,255,.06)', '--sh': '0 8px 32px rgba(0,0,0,.4)', '--shS': '0 2px 8px rgba(0,0,0,.3)',
  },
  forest: {
    '--bg': '#0f1a0f', '--bg2': '#152015', '--bg3': '#1d2d1d', '--bg4': '#253a25',
    '--tx': '#e0f0e0', '--tx2': '#7ab87a', '--txM': '#4a7a4a',
    '--ac': '#4caf50', '--acH': '#66bb6a', '--acD': 'rgba(76,175,80,.15)',
    '--bd': 'rgba(255,255,255,.06)', '--sh': '0 8px 32px rgba(0,0,0,.4)', '--shS': '0 2px 8px rgba(0,0,0,.3)',
  },
};

export const NODE_SHAPES = ['rounded', 'ellipse', 'rectangle'] as const;
export type NodeShape = typeof NODE_SHAPES[number];
