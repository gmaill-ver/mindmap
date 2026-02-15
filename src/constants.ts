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
  const nodes: MindNode[] = [];
  const n = (label: string, parentId: string | null, color: string): string => {
    const id = uid();
    nodes.push({ id, label, parentId, color, icon: '', collapsed: false, notes: '' });
    return id;
  };

  // Root
  nodes.push({ id: rootId, label: '憲法', parentId: null, color: COLS[0], icon: '', collapsed: false, notes: '' });

  // ===== I. 憲法と前文 =====
  const c1 = n('I. 憲法と前文', rootId, COLS[1]);

  const c1_1 = n('1. 憲法の概念', c1, COLS[2]);
  n('形式的憲法 - 最高法規として機能する法形式', c1_1, COLS[3]);
  n('実質的意味の憲法 - 国家組織・統治機構に関する基本事項', c1_1, COLS[3]);
  n('固有の意味の憲法 - 国民の基本的権利に関する規定', c1_1, COLS[3]);
  n('立憲的意味の憲法 - 権力制限機能を持つ憲法', c1_1, COLS[3]);

  const c1_2 = n('2. 憲法専門護憲義務', c1, COLS[2]);
  n('国家権力を拘束 → 要請受けるのは権力担当者', c1_2, COLS[3]);

  const c1_3 = n('3. 前文', c1, COLS[2]);
  n('法の表題のすぐ後に付される文', c1_3, COLS[3]);
  n('法規範性が認められる', c1_3, COLS[3]);
  n('解釈指針、根拠としては裁判不可', c1_3, COLS[3]);

  const c1_4 = n('4. 国民主権と象徴天皇', c1, COLS[2]);
  n('国民主権', c1_4, COLS[3]);
  n('天皇の地位', c1_4, COLS[3]);
  n('天皇の国事行為', c1_4, COLS[3]);

  const c1_5 = n('5. 人権総論', c1, COLS[2]);
  n('人権とは何か', c1_5, COLS[3]);
  n('人権の性質', c1_5, COLS[3]);
  n('人権の制約', c1_5, COLS[3]);

  const c1_6 = n('6. 法の下の平等', c1, COLS[2]);
  n('憲法14条1項の平等', c1_6, COLS[3]);
  n('不合理な差別', c1_6, COLS[3]);
  n('平等選挙', c1_6, COLS[3]);

  const c1_7 = n('7. 幸福追求権', c1, COLS[2]);
  n('幸福追求権', c1_7, COLS[3]);
  n('プライバシーの権利', c1_7, COLS[3]);

  const c1_8 = n('8. 思想・信教の自由', c1, COLS[2]);
  n('思想及び良心の自由', c1_8, COLS[3]);
  n('信教の自由', c1_8, COLS[3]);
  n('政教分離原則', c1_8, COLS[3]);

  // ===== II. 表現の自由 =====
  const c2 = n('II. 表現の自由', rootId, COLS[4]);
  const c2_1 = n('多次元的な自由保障', c2, COLS[5]);
  n('表現の自由の価値 - なぜ保護されるのか', c2_1, COLS[6]);
  n('表現の自由の法規制 - 規制のあり方', c2_1, COLS[6]);
  n('表現事前抑制と検閲の禁止 - 事前規制の禁止', c2_1, COLS[6]);
  n('報道、取材の自由 - ジャーナリズムの自由', c2_1, COLS[6]);
  n('法定でメモを取る自由 - 情報記録の自由', c2_1, COLS[6]);
  n('閲読の自由 - 情報アクセスの自由', c2_1, COLS[6]);
  n('選挙運動の自由 - 政治的表現の自由', c2_1, COLS[6]);
  n('公務員の政治的行為 - 公務員の制限', c2_1, COLS[6]);
  n('ビラ貼り、ビラ配り - 具体的表現行為', c2_1, COLS[6]);

  // ===== III. 学問の自由と教育を受ける権利 =====
  const c3 = n('III. 学問の自由と教育を受ける権利', rootId, COLS[7]);

  const c3_1 = n('1. 学問の自由と教育', c3, COLS[8]);
  n('学問の自由 - 研究の自由', c3_1, COLS[9]);
  n('大学の自治 - 高等教育機関の独立性', c3_1, COLS[9]);
  n('教育を受ける権利 - 国民の学習権', c3_1, COLS[9]);

  const c3_2 = n('2. 経済的自由、人身の自由', c3, COLS[8]);
  n('職業の自由、財産権 - 経済活動の自由', c3_2, COLS[9]);
  n('居住、移転の自由 - 移動の自由', c3_2, COLS[9]);
  n('人身の自由 - 身体の自由', c3_2, COLS[9]);

  const c3_3 = n('3. 生存権と労働基本権', c3, COLS[8]);
  n('生存権 - 最低限度の文化的生活', c3_3, COLS[9]);
  n('労働基本権 - 労働三権', c3_3, COLS[9]);

  const c3_4 = n('4. 代表民主制と参政権', c3, COLS[8]);
  n('代表民主制 - 間接民主制', c3_4, COLS[9]);
  n('参政権 - 政治参加権', c3_4, COLS[9]);

  const c3_5 = n('5. 国会', c3, COLS[8]);
  n('会期制と参議院の緊急集会 - 立法機関の会議体制', c3_5, COLS[9]);
  n('議事、表決 - 議決要件', c3_5, COLS[9]);
  n('衆参両議院の権能 - 各議院の機能分化', c3_5, COLS[9]);
  n('議員 - 国会議員の地位', c3_5, COLS[9]);

  const c3_6 = n('6. 内閣', c3, COLS[8]);
  n('内閣の構成 - 閣僚の編成', c3_6, COLS[9]);
  n('内閣の権能 - 行政権の行使', c3_6, COLS[9]);
  n('内閣総理大臣の権能 - 首相の権限', c3_6, COLS[9]);
  n('内閣の責任 - 国会への責任', c3_6, COLS[9]);
  n('内閣不信任決議 - 内閣退陣事由', c3_6, COLS[9]);
  n('内閣の総辞職 - 内閣の終焉', c3_6, COLS[9]);

  // ===== IV. 司法権 =====
  const c4 = n('IV. 司法権', rootId, COLS[10]);
  const c4_1 = n('1. 司法権の構造', c4, COLS[11]);
  n('司法権の帰属 - 最高裁判所に属する', c4_1, COLS[12]);
  n('司法権の限界 - 司法権の範囲', c4_1, COLS[12]);
  n('違憲審査権 - 法令憲法適合性の審査', c4_1, COLS[12]);

  // ===== V. 裁判官 =====
  const c5 = n('V. 裁判官', rootId, COLS[13]);
  const c5_1 = n('1. 裁判官の制度', c5, COLS[14]);
  n('最高裁判所の裁判官 - 最高裁判事の地位', c5_1, COLS[15]);
  n('下級裁判所の裁判官 - 地方裁判所等の裁判官', c5_1, COLS[15]);
  n('裁判官の身分保障 - 身分保障規定', c5_1, COLS[15]);

  // ===== VI. 財政 =====
  const c6 = n('VI. 財政', rootId, COLS[0]);
  const c6_1 = n('1. 財政制度', c6, COLS[1]);
  n('財政民主主義 - 国会統制', c6_1, COLS[2]);
  n('租税法律主義 - 法律による課税', c6_1, COLS[2]);
  n('予算、決算 - 財政管理', c6_1, COLS[2]);

  // ===== VII. 地方自治 =====
  const c7 = n('VII. 地方自治', rootId, COLS[3]);
  const c7_1 = n('1. 地方自治制度', c7, COLS[4]);
  n('地方自治の本旨 - 団体自治と住民自治', c7_1, COLS[5]);
  n('条例制定権 - 地方立法権', c7_1, COLS[5]);
  n('地方特別法 - 特定地域に関する法律', c7_1, COLS[5]);

  // ===== VIII. 憲法改正 =====
  const c8 = n('VIII. 憲法改正', rootId, COLS[6]);
  const c8_1 = n('1. 改正手続きと限界', c8, COLS[7]);
  n('憲法改正手続き - 改正の手順', c8_1, COLS[8]);
  n('憲法改正の限界 - 改正できない事項', c8_1, COLS[8]);

  // ===== 体系的特徴 =====
  const c9 = n('体系的特徴', rootId, COLS[9]);

  const c9_1 = n('大きな分類', c9, COLS[10]);
  n('基本的人権 - 第3章（権利・自由・義務）', c9_1, COLS[11]);
  n('統治機構 - 第4～7章（国会・内閣・司法・財政・地方自治）', c9_1, COLS[11]);
  n('改正と最高法規性 - 第9~10章', c9_1, COLS[11]);

  const c9_2 = n('人権の多層性', c9, COLS[10]);
  n('精神的自由（表現・思想・信教）', c9_2, COLS[11]);
  n('経済的自由（職業・財産）', c9_2, COLS[11]);
  n('人身の自由（身体の自由）', c9_2, COLS[11]);
  n('参政権（政治参加）', c9_2, COLS[11]);
  n('社会権（生存権・労働権・教育権）', c9_2, COLS[11]);

  const c9_3 = n('権力構造', c9, COLS[10]);
  n('国会（立法）→ 二院制（衆参）', c9_3, COLS[11]);
  n('内閣（行政）→ 国会に対し責任', c9_3, COLS[11]);
  n('最高裁判所（司法）→ 違憲審査権', c9_3, COLS[11]);

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
