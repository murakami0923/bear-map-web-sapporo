# AGENTS.md — 開発/生成ガイド（React TypeScript + OpenStreetMap）

このリポジトリは「OpenStreetMap の地図タイルを MapLibre GL で表示し、熊の出没情報をプロットする」Webアプリケーション（React TypeScript）を対象とします。  
**プロンプト・生成はすべて日本語**で行い、**関数ヘッダと主要処理のコメントは必ず日本語**で記述してください。

---

## 1. 目的とスコープ

- `data/bears.geojson`（開発者設置）を `VITE_ROOT_DIR` 起点でフェッチし、`properties.icon` に応じて **public/icon/** 配下の SVG を MapLibre GL のマーカーとして表示します（無効値は `bear.svg` にフォールバック）。
- マーカーのクリック/タップ/Enter/Space で **DetailsModal** を表示し、GeoJSON の `properties`（日時・場所・状況など）を整形して見やすく表示します。
- 左上に **フィルタアイコン（icon/filter.svg）** を配置し、クリックで **検索条件入力モーダル** を表示します。
  - 検索条件：年（2017〜2025）、月（1〜12）、アイコン（`bear.svg` / `like-bear.svg` / `excrement.svg` / `footprint.svg` / `camera.svg` / `voice.svg` / `other.svg`）
  - 「絞り込む」で AND 条件フィルタ、モーダル内「クリア」またはヘッダの「フィルタ解除」で全件表示に戻す。
- ヘッダ左上に **メニューアイコン（icon/menu.svg）** を配置し、クリックで `/about` への遷移手段（`HeaderMenu`）を提供します（`VITE_ROOT_DIR` を考慮した pushState）。
- `/about` ではサイトの目的・機能・アイコンの優先順位・データ出典・更新履歴（表形式）・使い方および **お問い合わせ先（メール / X / Facebook / GitHub 各リンク + QR）** を掲載し、「マップへ戻る」導線を置きます。更新履歴は日付と更新内容の 2 列で最新順を想定。
- ページ下部に OpenStreetMap / 札幌市オープンデータのクレジットおよびリンクを固定表示し、データ取得中/失敗時はステータスバッジ（読み込み中/エラーメッセージ）で通知します。

---

## 2. 想定ディレクトリ構成

```
.
├─ index.html                  # Vite エントリ（GTAG 付き）
├─ public/
│  ├─ icon/
│  │  ├─ bear.svg / like-bear.svg / excrement.svg / footprint.svg / camera.svg / voice.svg / other.svg
│  │  ├─ filter.svg       # フィルタボタン
│  │  └─ menu.svg         # ヘッダメニュー
│  └─ qr/
│     ├─ qr_sqare_mail_nifty.png
│     ├─ qr_sqare_x_murakami77mm.png
│     ├─ qr_sqare_facebook_masashi0923.png
│     └─ qr_sqare_github_murakami0923.png
├─ data/                  # Git 管理外。bears.geojson を配置
├─ src/
│  ├─ app/
│  │  ├─ App.tsx          # ルーティングとフッター
│  │  └─ main.tsx
│  ├─ components/
│  │  ├─ MapView.tsx
│  │  ├─ HeaderMenu.tsx
│  │  ├─ FilterButton.tsx
│  │  ├─ FilterModal.tsx
│  │  ├─ BearMarker.tsx
│  │  ├─ DetailsModal.tsx
│  │  └─ AboutPage.tsx
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
├─ package.json
├─ tsconfig.json
└─ README.md
```

> ビルドツールは **Vite**（`react-ts` テンプレート）を使用。地図は **MapLibre GL JS** を採用し、OpenStreetMap のラスタタイルを表示します。

---

## 3. 技術スタック・主要ライブラリ

- **React 18 + TypeScript**
- **Vite**（開発/ビルド）
- **MapLibre GL JS**
- **ESLint**（`typescript-eslint`）+ **Prettier**
- **Vitest**（任意）

---

## 4. 型・データ仕様

### 4.1 GeoJSON（Point のみ想定）
- `FeatureCollection` / `Feature<Point>` 構造。
- `properties` は少なくとも `year` と `month`（年=2017〜2025、月=1〜12）が必須。範囲外または欠落 Feature は読み込み段階で除外。
- `icon` は `bear.svg` / `like-bear.svg` / `excrement.svg` / `footprint.svg` / `camera.svg` / `voice.svg` / `other.svg` のみ受理。無効値は `BearMarker` 側で `bear.svg` にフォールバック。
- `datetime`, `location`, `status`, `id` など任意の詳細は DetailsModal でテーブル表示（存在するもののみ）。
- 座標は `[longitude, latitude]` の配列で、`type: Point` 以外は無視する。

### 4.2 TypeScript 型（例）
```ts
export interface BearProps {
  year: number;
  month: number;
  icon?: BearIconName;
  [key: string]: unknown;
}
```

---

## 5. コンポーネント責務

### MapView.tsx
- **関数ヘッダに日本語コメント必須**。処理の各所にも日本語コメント。
- 役割：
  - MapLibre GL マップの初期化と表示
  - `BearMarker` 群の配置とフィルタによる再描画（描画後に `map.resize()` でレイアウト補正）
  - 左上に `FilterButton` を配置し、クリックで `FilterModal` を開閉
  - `HeaderMenu` や「フィルタ解除」ボタンの制御
  - `useBearData` の `isLoading` / `error` に応じたステータスバッジ表示（読み込み中/エラー文言）

### BearMarker.tsx
- 役割：
  - `properties.icon` をサニタイズし、`public/icon/*.svg` のカスタム `Marker` を表示（無効値は `bear.svg`）
  - クリック/タップ/Enter/Space で `DetailsModal` を開くコールバックを呼び出し（`tabIndex` 付与でキーボード操作対応）

### FilterButton.tsx
- 役割：
  - 左上固定のフィルタアイコンボタン（`icon/filter.svg`）
  - 押下でモーダル開閉トグル

### FilterModal.tsx
- 役割：
  - 年/月/アイコンの 3 条件フォーム（SVG ファイル名ベース）
  - 「絞り込む」ボタンで親に条件を返す
- UI要件：
  - キーボード操作/フォーカストラップ/ESC 閉じ対応（可能な範囲でアクセシビリティ配慮）
  - 「クリア」でフィルタとフォーム値を初期化する

### DetailsModal.tsx
- 役割：
  - `BearMarker` から受け取った `properties` を整形して表示
  - アイコン画像・日時・場所・状況などをテーブル表示し、ESC でも閉じる（開いたときに閉じるボタンへフォーカス）

### hooks/useBearData.ts
- 役割：
  - `data/bears.geojson` を `VITE_ROOT_DIR` 起点でフェッチ
  - `parseFeatureCollection` で FeatureCollection/Point/座標/年・月/アイコンを検証し、不正 Feature を除外
  - 現在のフィルタ条件に基づき表示対象の Feature を返却
  - フィルタ条件の変更 API（部分更新・ワイルドカード化・リセット）を提供
  - `isLoading` / `error` を UI に渡してステータスバッジ表示に使う

### HeaderMenu.tsx
- 役割：
  - ヘッダ左上の三点メニューボタン（`icon/menu.svg`）を表示
  - メニュー開閉を制御し、「このサイトについて」への遷移コールバックを呼び出す

### AboutPage.tsx
- 役割：
  - サイト概要・アイコン解説（優先順位の説明含む）・データ出典・更新履歴（表形式で日付/更新内容の 2 列）・使い方を表示
  - 「お問い合わせ先」でメール / X / Facebook / GitHub のリンク、`public/qr/` 配下の QR 画像を表示する
  - 「マップへ戻る」ボタンでトップへ戻す。更新履歴はページ上部に配置する

### App.tsx
- 役割：
  - `/`（Map）と `/about`（AboutPage）を pushState ベースで切り替える（`BASE_URL` = `VITE_ROOT_DIR` を考慮し、popstate も処理）
  - フッターに OpenStreetMap / CC BY 4.0 / 著作権表記を表示

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

- 年/月/アイコンの **AND 条件** でフィルタ。
- 未選択項目は **ワイルドカード**（全件通過）として扱う。
- 型安全のため、入力の検証（範囲外値の除外）を実施。`setFilter` 時に `undefined/''` は削除して保持。
- パフォーマンス：件数が多い場合はメモ化やタイル化を検討（初期は単純フィルタで可）。

---

## 8. スタイル・UI

- ベースはシンプルな CSS（または Tailwind など任意）。
- 左上のフィルタボタンは地図 UI と干渉しないよう `position: absolute`。
- 著作権表記はフッターに固定。
- ローディング/エラーのステータスバッジは地図上に重ならないよう配慮する。

---

## 9. ビルド/実行/検証

- **開発**: `npm run dev`
- **ビルド**: `npm run build`
- **プレビュー**: `npm run preview`
- **リンタ**: `npm run lint`
- **テスト**: 任意。必要に応じて Vitest などを追加
- **GitHub Pages デプロイ**: `npm run deploy`（`gh-pages` で `dist` を配信）

---

## 10. 受け入れ基準（サンプル）

1. `data/bears.geojson` を配置すると地図上に熊アイコンが表示される。
2. マーカーをクリックまたはキーボード操作すると `DetailsModal` で詳細を閲覧できる。
3. フィルタモーダルで年/月/アイコンを指定し「絞り込む」を押すと表示が更新される。
4. ヘッダメニューから `/about` へ遷移でき、メール / X / Facebook / GitHub（QR 付き）の問い合わせ先が表示される。
5. About ページ先頭に日付・更新内容の 2 列で更新履歴が表示される。
6. 日本語コメント規約が関数ヘッダ・主要処理に順守されている。
7. ページ下部に OpenStreetMap / CC BY 4.0 のクレジットが表示され、リンクが機能する。
8. `VITE_ROOT_DIR` を変えても `/` と `/about` の表示・遷移が正しく機能し、静的アセット（icon/qr/data）が正しく解決される。
9. データ取得中/失敗時にステータスバッジで状態を通知する。

---

## 11. テストの観点（例）

- フィルタ：全部未選択／一部選択／全条件選択で結果が期待通りになる
- モーダル：開閉、フォーカス移動、ESC で閉じる
- GeoJSON：不正値（年=2030、月=0、未定義アイコン、Point 以外、座標が非数）を無視
- 表示：アイコンの重なり、ズーム/パン動作、MapLibre のリサイズ処理
- アクセシビリティ：キーボード操作、ラベル、aria属性、ヘッダメニューの開閉
- About：先頭に更新履歴テーブルが表示され、QR 画像とメール/X/Facebook/GitHub リンクが崩れず表示される
- ステータスバッジ：データ取得中/失敗時に期待通り表示される

---

## 12. 追加指針

- 国土地理院や別タイルを使う場合は、出典表記の要件を確認。
- 将来的に API 提供に切り替える場合、`useBearData` でフェッチ先を切り替え可能に。
- 画像/SVG/QR/GeoJSON のパスは `VITE_ROOT_DIR` を通す（`import.meta.env.VITE_ROOT_DIR + 'icon/...` など）ことで GitHub Pages 配信時も壊れないようにする。
- `/about` の問い合わせ先は「メール + X + Facebook + GitHub + QR」を維持し、リンク先と画像ファイル名の整合性を確保する。
- `vite.config.ts` で `base` を `VITE_ROOT_DIR` にしているため、ルーティングや静的アセット参照時は必ず同変数を通す。
