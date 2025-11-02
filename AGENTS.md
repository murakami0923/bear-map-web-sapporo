# AGENTS.md — 開発/生成ガイド（React TypeScript + OpenStreetMap）

このリポジトリは「OpenStreetMap の地図を背景に、熊の出没情報をプロットする」Webアプリケーション（React TypeScript）を対象とします。  
**プロンプト・生成はすべて日本語**で行い、**関数のヘッダと処理内容のコメントは必ず日本語**で記述してください。

---

## 1. 目的とスコープ

- data/bears.geojson（開発者設置）を読み込み、出没地点に **icon/bear.svg** を用いたアイコンを表示します。
- アイコンのクリック/タップで **モーダルダイアログ** を表示し、GeoJSON の `properties` を整形して見やすく表示します。
- 左上に **フィルタアイコン（icon/filter.svg）** を配置し、クリックで **検索条件入力モーダル** を表示します。
  - 検索条件：年（2017〜2025）、月（1〜12）、状況（`クマを目撃` / `ヒグマらしき動物を目撃` / `フンを確認` / `足跡を確認` / `その他`）
  - 「絞り込む」を押すと、GeoJSON から条件一致のデータのみ表示します。
- ページ下部に OpenStreetMap のクレジットを表示（ https://openstreetmap/ へのリンク）。

---

## 2. 想定ディレクトリ構成

```
.
├─ public/
│  ├─ index.html
│  └─ icon/
│     ├─ bear.svg         # 開発者が配置
│     └─ filter.svg       # 開発者が配置
├─ data/
│  └─ bears.geojson       # 開発者が配置（本番はAPI化しても可）
├─ src/
│  ├─ app/
│  │  ├─ App.tsx
│  │  └─ main.tsx
│  ├─ components/
│  │  ├─ MapView.tsx
│  │  ├─ FilterButton.tsx
│  │  ├─ FilterModal.tsx
│  │  ├─ BearMarker.tsx
│  │  └─ DetailsModal.tsx
│  ├─ hooks/
│  │  └─ useBearData.ts    # bears.geojson ロード/フィルタ
│  ├─ lib/
│  │  └─ geojson.ts        # 型定義やユーティリティ
│  ├─ styles/
│  │  └─ index.css
│  └─ types/
│     └─ bears.d.ts
├─ .eslintrc.cjs
├─ .prettierrc
├─ index.html (Vite を使う場合は public/index.html ではなくルート直下になることも)
├─ package.json
├─ tsconfig.json
└─ README.md
```

> ビルドツールは **Vite** を推奨（`react` + `typescript` テンプレート）。地図は **Leaflet + react-leaflet** を推奨。

---

## 3. 技術スタック・主要ライブラリ

- **React 18 + TypeScript**
- **Vite**（開発/ビルド）
- **Leaflet** と **react-leaflet**
- **ESLint**（`typescript-eslint`）+ **Prettier**
- **Vitest**（任意）

---

## 4. 型・データ仕様

### 4.1 GeoJSON（Point のみ想定）
- `FeatureCollection` / `Feature<Point>` 構造。
- `properties` に最低限以下を含むことを期待：
  - `year`: number（2017〜2025）
  - `month`: number（1〜12）
  - `status`: string（`クマを目撃` / `ヒグマらしき動物を目撃` / `フンを確認` / `足跡を確認` / `その他`）
  - `title` / `note` など自由項目（任意）

### 4.2 TypeScript 型（例）
```ts
// src/types/bears.d.ts
export type BearStatus =
  | "クマを目撃"
  | "ヒグマらしき動物を目撃"
  | "フンを確認"
  | "足跡を確認"
  | "その他";

export interface BearProps {
  year: number;
  month: number;
  status: BearStatus;
  title?: string;
  note?: string;
  [key: string]: unknown;
}
```

---

## 5. コンポーネント責務

### MapView.tsx
- **関数ヘッダに日本語コメント必須**。処理の各所にも日本語コメント。
- 役割：
  - Leaflet マップの初期化と表示
  - `BearMarker` 群の配置
  - 左上に `FilterButton` を配置
  - クリックで `FilterModal` を開く制御

### BearMarker.tsx
- 役割：
  - `icon/bear.svg` をカスタムアイコンとして使用し、座標ごとに `Marker` を表示
  - クリック/タップで `DetailsModal` を開くコールバックを呼び出し

### FilterButton.tsx
- 役割：
  - 左上固定のフィルタアイコンボタン（`icon/filter.svg`）
  - 押下でモーダル開閉トグル

### FilterModal.tsx
- 役割：
  - 年/月/状況の 3 条件フォーム
  - 「絞り込む」ボタンで親に条件を返す
- UI要件：
  - キーボード操作/フォーカストラップ/ESC 閉じ対応（可能な範囲でアクセシビリティ配慮）

### DetailsModal.tsx
- 役割：
  - `BearMarker` から受け取った `properties` を整形して表示
  - 例：テーブル表示（ラベル: 値）

### hooks/useBearData.ts
- 役割：
  - `data/bears.geojson` をフェッチ
  - 現在のフィルタ条件に基づき、表示対象の Feature を返却
  - フィルタ条件の変更 API を提供

---

## 6. 関数コメント規約（必須）

- **関数ヘッダ直上**に JSDoc 風の**日本語コメント**を記載：
  - 目的（何をする関数か）
  - 入力パラメータの説明
  - 戻り値の説明
  - 例外/注意点
- 本文中の主要な処理ブロックにも**日本語の行内コメント**を記載：なぜそうしているのか、前提条件、境界値の扱いなど。

---

## 7. フィルタロジック（詳細）

- 年/月/状況の **AND 条件** でフィルタ。
- 未選択項目は **ワイルドカード**（全件通過）として扱う。
- 型安全のため、入力の検証（範囲外値の除外）を実施。
- パフォーマンス：件数が多い場合はメモ化やタイル化を検討（初期は単純フィルタで可）。

---

## 8. スタイル・UI

- ベースはシンプルな CSS（または Tailwind など任意）。
- 左上のフィルタボタンは地図 UI と干渉しないよう `position: absolute`。
- 著作権表記はフッターに固定。

---

## 9. ビルド/実行/検証

- **開発**: `npm run dev`
- **ビルド**: `npm run build`
- **プレビュー**: `npm run preview`
- **リンタ**: `npm run lint`
- **テスト**: `npm run test`（任意）

---

## 10. 受け入れ基準（サンプル）

1. `data/bears.geojson` を配置すると地図上に熊アイコンが表示される。
2. アイコンをクリックすると `properties` の詳細をモーダルで閲覧できる。
3. フィルタモーダルで年/月/状況を指定し「絞り込む」を押すと表示が更新される。
4. 日本語コメント規約が関数ヘッダ・主要処理に順守されている。
5. ページ下部に OpenStreetMap クレジットが表示され、リンクが機能する。

---

## 11. テストの観点（例）

- フィルタ：全部未選択／一部選択／全条件選択で結果が期待通りになる
- モーダル：開閉、フォーカス移動、ESC で閉じる
- GeoJSON：不正値（年=2030、月=0 など）を無視
- 表示：アイコンの重なり、ズーム/パン動作
- アクセシビリティ：キーボード操作、ラベル、aria属性

---

## 12. 追加指針

- 国土地理院や別タイルを使う場合は、出典表記の要件を確認。
- 将来的に API 提供に切り替える場合、`useBearData` でフェッチ先を切り替え可能に。
- 画像/SVG のパスはビルド環境に合わせて `new URL()` などで安全に参照。
