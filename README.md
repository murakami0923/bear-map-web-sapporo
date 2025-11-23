# 熊出没マップ（React + TypeScript + MapLibre GL）

OpenStreetMap のタイルを背景に、GeoJSON 化した **熊の出没情報** を MapLibre GL で描画する Web アプリです。  
React + TypeScript + Vite で構築し、**関数ヘッダ/主要処理のコメントは必ず日本語**で記述するポリシーを採用しています。

---

## ✅ 主な機能

- `data/bears.geojson` から出没データを読み込み、**MapLibre GL** 上にカスタム画像のマーカーをプロット
- マーカーをクリック/Enter/Space で **詳細モーダル** を開き、日時・場所・状況・使用アイコンをテーブル表示
- フローティングの **フィルタボタン（`icon/filter.svg`）** からモーダルを開き、**年（2017〜2025）/ 月（1〜12）/ アイコン種別** の AND 条件で絞り込み  
  （未指定の条件はワイルドカード扱い）
- ヘッダ左上の 3 点メニュー（`HeaderMenu`）から **「このサイトについて」ページ** へ遷移できる簡易ルーティングを実装
- About ページでは、機能概要・アイコンの意味・データ出典・利用方法に加えて、**メール / X（旧 Twitter）のリンクと QR コード付き問い合わせ先** を掲載
- フッターに OpenStreetMap / CC BY 4.0（札幌市オープンデータ）のクレジットとリンクを常時表示

---

## 🧰 技術スタック

- React 18 + TypeScript
- Vite 5（`VITE_ROOT_DIR` を base URL として利用）
- MapLibre GL JS（`maplibre-gl`）
- ESLint（typescript-eslint） + Prettier
- gh-pages（`npm run deploy` で GitHub Pages へ配信可能）

---

## 📁 ディレクトリ構成（抜粋）

```
.
├─ public/
│  ├─ icon/
│  │  ├─ bear.svg / like-bear.svg / excrement.svg / footprint.svg
│  │  ├─ camera.svg / voice.svg / other.svg / filter.svg / menu.svg
│  │  └─ ...（MapLibre マーカーや UI ボタン用）
│  └─ qr/
│     ├─ qr_sqare_mail_nifty.png
│     └─ qr_sqare_x_murakami77mm.png
├─ data/
│  └─ bears.geojson          # 札幌市オープンデータを加工した GeoJSON
├─ src/
│  ├─ app/
│  │  ├─ App.tsx             # ルーティングとフッター
│  │  └─ main.tsx
│  ├─ components/
│  │  ├─ MapView.tsx / BearMarker.tsx / FilterButton.tsx
│  │  ├─ FilterModal.tsx / DetailsModal.tsx
│  │  ├─ HeaderMenu.tsx      # 3 点メニュー
│  │  └─ AboutPage.tsx       # お問い合わせ情報付き
│  ├─ hooks/ (useBearData.ts)
│  ├─ lib/ (geojson.ts)      # フィルタ・バリデーション
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
   - `data/bears.geojson`
   - `public/icon/*.svg`（マーカー/フィルタ/メニュー）
   - `public/qr/*.png`（問い合わせ QR。デフォルトでは `qr_sqare_mail_nifty.png` と `qr_sqare_x_murakami77mm.png` を使用）
3. `.env` などで `VITE_ROOT_DIR` を設定  
   GitHub Pages で `/bear-map-web-sapporo/` などサブディレクトリ公開する場合は、そのパスを指定します。ローカル開発は `/` が推奨です。

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
- `year`: 2017〜2025 / `month`: 1〜12（`lib/geojson.ts` でバリデーション）
- `icon`: `public/icon/` 配下のファイル名（`bear.svg`, `like-bear.svg`, `excrement.svg`, `footprint.svg`, `camera.svg`, `voice.svg`, `other.svg` のいずれか）
- その他の `properties` はモーダル表示時にテーブル化されるため、`datetime`, `location`, `status` などの文字列を推奨

`useBearData` フックでフェッチ・正規化後、`filterFeatures` が AND 条件で抽出します。

---

## 🔎 フィルタ仕様

- 条件：`year`, `month`, `icon`
- `FilterModal` で選択した値のみが `BearFilter` に渡り、未入力はフィールドごとに削除される
- `BearMarker` は `properties.icon` を参照して各種アイコンを描画
- リセットボタン（ヘッダ右の「フィルタ解除」またはモーダル内「クリア」）で全件表示に戻す

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

- `useBearData`：HTTP エラーや壊れた GeoJSON を検知し、UI にエラーバッジを表示できるか
- フィルタ：全件／年のみ／年月／年月＋アイコンなど、未指定をワイルドカード扱いにできているか
- モーダル：フォーカストラップ、ESC で閉じる、キーボード操作でのマーカー選択
- ルーティング：`/` ↔ `/about` を pushState で遷移し、リロードや戻る操作でも表示が維持されるか
- About ページ：メール・X のリンクと QR コード（`public/qr`）が崩れず表示されるか

---

## 🔒 出典とクレジット

- 地図タイル：OpenStreetMap、ODbL ライセンス
- データ：札幌市オープンデータ「札幌市内のヒグマ出没情報」（CC BY 4.0）  
  本アプリでは CSV を GeoJSON へ変換して利用しています。

詳細な実装ガイドラインやコメント規約、受け入れ基準は **AGENTS.md** を参照してください。
