# 熊出没マップ（React + TypeScript + MapLibre GL）

OpenStreetMap のタイルを背景に、GeoJSON 化した **熊の出没情報** を MapLibre GL で描画する Web アプリです。  
React + TypeScript + Vite で構築し、**関数ヘッダ/主要処理のコメントは必ず日本語**で記述するポリシーを採用しています。

---

## ✅ 主な機能

- `data/bears.geojson` をフェッチし、**MapLibre GL** 上に `public/icon/*.svg` のカスタムマーカーを表示（未定義アイコンは `bear.svg` へフォールバック）
- マーカーをクリック/Enter/Space で **詳細モーダル** を開き、日時・場所・状況・アイコンを表示
- フローティングの **フィルタボタン（`icon/filter.svg`）** からモーダルを開き、**年（2017〜2025）/ 月（1〜12）/ アイコン種別** の AND 条件で絞り込み  
  ヘッダの「フィルタ解除」またはモーダル内「クリア」で全件表示へ戻す
- ヘッダ左上の 3 点メニュー（`HeaderMenu`）から **「このサイトについて」ページ** へ pushState ベースで遷移（`VITE_ROOT_DIR` を base として考慮）
- About ページでは機能概要・アイコンの優先順位・データ出典・使い方に加えて、**メール / X / Facebook / GitHub のリンクと QR コード付き問い合わせ先** を掲載
- フッターに OpenStreetMap / CC BY 4.0（札幌市オープンデータ）のクレジットを常時表示し、データ取得中/失敗時はステータスバッジで通知

---

## 🧰 技術スタック

- React 18 + TypeScript
- Vite 5（`VITE_ROOT_DIR` を base URL として使用）
- MapLibre GL JS（`maplibre-gl`）
- ESLint（typescript-eslint） + Prettier
- gh-pages（`npm run deploy` で GitHub Pages へ配信可能）

---

## 📁 ディレクトリ構成（抜粋）

```
.
├─ index.html                  # Vite エントリ（GTAG の読み込み含む）
├─ public/
│  ├─ icon/
│  │  ├─ bear.svg / like-bear.svg / excrement.svg / footprint.svg
│  │  ├─ camera.svg / voice.svg / other.svg / filter.svg / menu.svg
│  │  └─ ...（MapLibre マーカーや UI ボタン用）
│  └─ qr/
│     ├─ qr_sqare_mail_nifty.png
│     ├─ qr_sqare_x_murakami77mm.png
│     ├─ qr_sqare_facebook_masashi0923.png
│     └─ qr_sqare_github_murakami0923.png
├─ data/                       # Git 管理外。bears.geojson を配置する
├─ src/
│  ├─ app/
│  │  ├─ App.tsx               # 簡易ルーティングとフッター
│  │  └─ main.tsx
│  ├─ components/
│  │  ├─ MapView.tsx / BearMarker.tsx / FilterButton.tsx
│  │  ├─ FilterModal.tsx / DetailsModal.tsx
│  │  ├─ HeaderMenu.tsx        # 3 点メニュー
│  │  └─ AboutPage.tsx         # お問い合わせ情報付き
│  ├─ hooks/ (useBearData.ts)
│  ├─ lib/ (geojson.ts)        # バリデーションとフィルタ
│  ├─ styles/ (index.css)
│  └─ types/ (bears.d.ts)
├─ AGENTS.md / README.md
└─ vite.config.ts / package.json / tsconfig*.json / .eslintrc.cjs / .prettierrc
```

---

## 🚀 セットアップ手順

1. 依存インストール
   ```bash
   npm install
   ```
2. 必須アセットを配置
   - `data/bears.geojson`（リポジトリ外で用意）
   - `public/icon/*.svg`（マーカー/フィルタ/メニュー用）
   - `public/qr/*.png`（メール/X/Facebook/GitHub の各 QR コード）
3. `.env` などで `VITE_ROOT_DIR` を設定  
   GitHub Pages で `/bear-map-web-sapporo/` などサブディレクトリ公開する場合は、そのパスを指定。ローカル開発は `/` 推奨。

開発サーバは `npm run dev`、本番ビルドは `npm run build`、プレビューは `npm run preview` です。

---

## 🗂️ GeoJSON 仕様

```json
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "geometry": { "type": "Point", "coordinates": [141.3545, 43.0621] },
      "properties": {
        "id": "unique-id",
        "datetime": "2024-09-01T09:30:00+09:00",
        "location": "札幌市中央区○○",
        "status": "クマを目撃",
        "icon": "bear.svg",
        "year": 2024,
        "month": 9
      }
    }
  ]
}
```

- `coordinates` は `[longitude, latitude]`
- `year`: 2017〜2025 / `month`: 1〜12（`lib/geojson.ts` でバリデーション。欠落行は除外）
- `icon`: `public/icon/` 配下のファイル名（`bear.svg`, `like-bear.svg`, `excrement.svg`, `footprint.svg`, `camera.svg`, `voice.svg`, `other.svg` のいずれか。無効値はフォールバック）
- `datetime`, `location`, `status` などの追加フィールドは詳細モーダルでテーブル表示されます

`useBearData` フックでフェッチ・正規化後、`filterFeatures` が AND 条件で抽出します。

---

## 🔎 フィルタ仕様

- 条件：`year`, `month`, `icon`
- `FilterModal` で選択した値のみが `BearFilter` に渡り、未入力はフィールドごとに削除（ワイルドカード扱い）
- `BearMarker` は `properties.icon` をサニタイズして描画。未定義/空文字は `bear.svg`
- ヘッダ右の「フィルタ解除」またはモーダル内「クリア」で全件表示に戻す

---

## 📜 利用スクリプト

```bash
npm run dev        # 開発サーバ
npm run build      # TypeScript 型チェック + Vite build
npm run preview    # ビルド成果物のローカル確認
npm run lint       # ESLint
npm run deploy     # dist を gh-pages へ公開
```

JavaScript 生成物を掃除するユーティリティとして `npm run ls-js` / `npm run clean-js` も用意しています。

---

## 🧪 テスト観点

- `useBearData`：HTTP エラーや壊れた GeoJSON を検知し、ローディング/エラーのステータスバッジを表示できるか
- フィルタ：全件／年のみ／年月／年月＋アイコンなど、未指定をワイルドカード扱いにできているか
- モーダル：フォーカストラップ、ESC で閉じる、キーボード操作でのマーカー選択
- ルーティング：`/` ↔ `/about` を pushState で遷移し、`VITE_ROOT_DIR` 付きでもリロードや戻る操作で表示が維持されるか
- About ページ：メール/X/Facebook/GitHub のリンクと QR コード（`public/qr`）が崩れず表示されるか

---

## 🔒 出典とクレジット

- 地図タイル：OpenStreetMap、ODbL ライセンス
- データ：札幌市オープンデータ「札幌市内のヒグマ出没情報」（CC BY 4.0）  
  本アプリでは CSV を GeoJSON へ変換して利用しています。

詳細な実装ガイドラインやコメント規約、受け入れ基準は **AGENTS.md** を参照してください。
