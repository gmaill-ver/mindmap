# MindFlow - マインドマップ PWA

MindMeisterの主要機能を備えたWebベースのマインドマップアプリケーション。

## 📦 フォルダ構成

```
mindmap/
├── index.html       # メインアプリ（React + SVG、全ロジック内包）
├── manifest.json    # PWA マニフェスト
├── sw.js           # Service Worker（オフライン対応）
└── README.md       # このファイル
```

## 🚀 実行方法

### 方法1: ローカルサーバー（推奨）
```bash
# Python
cd mindmap && python3 -m http.server 8080

# Node.js
npx serve mindmap

# PHP
cd mindmap && php -S localhost:8080
```
ブラウザで `http://localhost:8080` にアクセス。

### 方法2: Vite構成への移行
```bash
npm create vite@latest mindflow -- --template react-ts
cd mindflow
# index.html のスクリプト部分を各コンポーネントに分割
npm run dev
```

## 🗂 実装済み機能

### ノード操作
| 機能 | 操作 |
|------|------|
| 子ノード追加 | `Tab` / ツールバー ➕ |
| 兄弟ノード追加 | `Enter` |
| 削除 | `Delete` / `Backspace` |
| 名前編集 | `F2` / ダブルクリック |
| 折りたたみ | `Space` / ノード横の ± ボタン |
| ドラッグ移動 | マウスドラッグ |
| 色変更 | サイドパネル → カラー |
| アイコン追加 | サイドパネル → アイコン |
| メモ追加 | サイドパネル → メモ |
| 右クリックメニュー | 各ノードで右クリック |

### 表示操作
| 機能 | 操作 |
|------|------|
| ズームイン/アウト | マウスホイール / `Ctrl++` / `Ctrl+-` |
| パン移動 | キャンバスドラッグ |
| 中央に戻る | `Ctrl+0` / ズームコントロール ⊙ |
| 放射状自動レイアウト | 自動 |

### 保存・エクスポート
| 機能 | 操作 |
|------|------|
| 自動保存 (IndexedDB) | 800ms debounce |
| JSON エクスポート | `Ctrl+E` / ツールバー 💾 |
| PNG エクスポート | `Ctrl+Shift+E` / ツールバー 🖼 |

### UI/UX
- ダークモード / ライトモード切替
- ミニマップ（左下）
- ステータスバー（保存状態・ノード数・ズーム）
- 元に戻す / やり直す（50ステップ）
- マップ一覧・複数マップ管理
- トースト通知
- レスポンシブ対応

## 🏗 技術アーキテクチャ

```
┌─────────────────────────────────────────┐
│                  UI Layer               │
│  React 18 (ESM) + DM Sans / JetBrains  │
├─────────────────────────────────────────┤
│              Rendering Layer            │
│    SVG (paths + rects + text)           │
│    カスタム放射状レイアウトエンジン         │
├─────────────────────────────────────────┤
│               State Layer               │
│    React useState + useMemo             │
│    History (undo/redo stack, 50 steps)  │
├─────────────────────────────────────────┤
│            Persistence Layer            │
│    IndexedDB (MindFlowDB)               │
│    Auto-save (800ms debounce)           │
├─────────────────────────────────────────┤
│               PWA Layer                 │
│    Service Worker + manifest.json       │
│    Cache-first (app) / Network-first    │
└─────────────────────────────────────────┘
```

## 🔥 将来拡張設計

現在の設計は以下の拡張を前提としています：

### 1. Firebase共同編集
- **ノードデータ構造**: `id`, `parentId`, `label` 等のフラットなJSON
- **拡張方法**: `saveToDB()` を Firebase Realtime DB / Firestore に差し替え
- `nodes` 配列を `onSnapshot` でリアルタイム同期
- CRDT対応: ノード単位のタイムスタンプで楽観的ロック

### 2. AI自動マップ生成
- **拡張方法**: テキスト入力 → Claude/GPT API → ノードJSON生成
- `defMap()` と同じ形式の nodes 配列を返すだけで統合可能
- プロンプト例: "以下のテーマでマインドマップのJSON構造を生成してください"

### 3. マップ → Anki変換
- **拡張方法**: ノードツリーを走査 → 親子関係から Q/A ペア生成
- エクスポート: Anki互換 CSV / `.apkg` 形式
- 例: 親ノード = Question、子ノード = Answer

### 4. ノード内Markdown対応
- **拡張方法**: `notes` フィールドを Markdown レンダラ（marked.js）で描画
- サイドパネルのテキストエリアにプレビュー機能追加
- 将来的にはノードラベル自体もMarkdown対応可能

## ライセンス

MIT
