# GEMINI.md - プロジェクト概要と開発ガイド

このプロジェクトは、北海道札幌市の**熊出没情報（2017〜2025年）**を MapLibre GL JS を使用して可視化する React + TypeScript アプリケーションです。

## 📋 プロジェクト概要

- **目的**: 札幌市のオープンデータ（CSV）を GeoJSON に変換したものを読み込み、OpenStreetMap 上にプロットして出没地点を可視化・検索・フィルタリングする。
- **主な技術スタック**:
  - **フロントエンド**: React 18 (TypeScript)
  - **ビルドツール**: Vite 5
  - **地図ライブラリ**: MapLibre GL JS (OSM ラスタタイル)
  - **デプロイ**: GitHub Pages (`gh-pages`)
  - **静的解析**: ESLint (typescript-eslint), Prettier

## 🚀 構築と実行

### セットアップ
```bash
npm install
```

### 開発・ビルド
- **開発サーバ起動**: `npm run dev`
- **プロダクションビルド**: `npm run build`
- **ビルド成果物のプレビュー**: `npm run preview`
- **リンター実行**: `npm run lint`

### デプロイ
- **GitHub Pages へのデプロイ**: `npm run deploy`
  - 注意: `vite.config.ts` で `base` に `VITE_ROOT_DIR` を設定しており、GitHub Pages のサブディレクトリ配信（`/bear-map-web-sapporo/` など）に対応しています。

## 🌲 主要なディレクトリ構成

```
.
├── public/                # 静的アセット（アイコン、QRコードなど）
│   ├── icon/              # 熊の種類に応じた SVG マーカー
│   └── qr/                # 問い合わせ用の QR 画像
├── data/                  # 取得元データ（Git 管理外、bears.geojson を配置）
├── src/
│   ├── app/               # エントリポイント (main.tsx, App.tsx) とルーティング
│   ├── components/        # MapView, 各種 Modal, Marker などの UI コンポーネント
│   ├── hooks/             # useBearData (GeoJSON のフェッチ・フィルタリング)
│   ├── lib/               # geojson.ts (検証・パース・ユーティリティ)
│   ├── types/             # 型定義 (bears.d.ts)
│   └── styles/            # CSS スタイル
├── AGENTS.md              # 開発者・AI エージェント向けのガイドライン
└── vite.config.ts         # Vite 設定ファイル
```

## 🛠 開発ルールと規約（重要）

- **言語**: **プロンプト、生成、コメントはすべて日本語**で行う。
- **コメント規約**:
  - 関数ヘッダには JSDoc 形式で日本語の目的、引数、戻り値を記述する。
  - 主要な処理ブロックには「なぜその処理が必要か」を含めた日本語の行内コメントを記述する。
- **データバリデーション**:
  - `data/bears.geojson` は `Point` 座標、`year` (2017-2025)、`month` (1-12) を必須とする。
  - `icon` は指定された 7 種類（`bear.svg` 等）のみ許可し、不正値は `bear.svg` にフォールバックする。
- **ルーティング**: `App.tsx` にて `window.history.pushState` を利用した簡易ルーティングを実装している。
- **環境変数**: `VITE_ROOT_DIR` を使用して、アセットやデータのパスを解決する。ローカル開発時は `/`、GitHub Pages 等ではサブディレクトリを指定する。

## 🧪 テストと品質管理

- 現時点で自動テスト（Vitest）は導入されていないが、以下の観点での手動検証が推奨される：
  - 年・月・アイコンによる AND 条件フィルタの挙動。
  - モーダルのアクセシビリティ（ESCキーでの閉鎖、フォーカストラップ）。
  - レスポンシブ対応（地図の `map.resize()` 処理）。
  - ブラウザの「戻る」「進む」ボタンへの追従。

詳細は `README.md` および `AGENTS.md` を参照してください。
