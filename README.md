# 熊出没マップ（React + TypeScript + MapLibre GL）

北海道札幌市の **熊出没情報（2017〜2025）** を GeoJSON から読み込み、OpenStreetMap タイル上にプロットする Web アプリです。  
React + TypeScript + Vite で構築し、**関数ヘッダと主要処理のコメントは日本語**で記述する運用にしています。

---

## ✅ 主な機能

- `data/bears.geojson` を `VITE_ROOT_DIR` 起点でフェッチし、MapLibre GL 上に `public/icon/*.svg` のカスタムマーカーを表示（無効なアイコンは `bear.svg` へフォールバック）
- マーカーのクリック/Enter/Space で **詳細モーダル** を開き、日時・場所・状況・アイコンを確認可能
- 左上の **フィルタボタン（`icon/filter.svg`）** から年（2017〜2025）/月（1〜12）/アイコンを AND 条件で絞り込み  
  モーダル内「クリア」またはヘッダの「フィルタ解除」で全件表示に戻す
- ヘッダ左上の 3 点メニュー（`HeaderMenu`）から `/about` へ pushState で遷移し、機能説明・アイコン優先順位・データ出典・使い方・**メール/X/Facebook/GitHub + QR** の問い合わせ先を表示
- About ページ先頭に最新の **更新履歴テーブル**（日付・更新内容の 2 列）を掲載
- 取得中/失敗時はステータスバッジを表示し、フッターに OpenStreetMap / CC BY 4.0 のクレジットを常時固定

---

## 🧰 技術スタック

- React 18 + TypeScript
- Vite 5（`vite.config.ts` で `base` を `VITE_ROOT_DIR` に設定）
- MapLibre GL JS（`maplibre-gl`）
- ESLint（typescript-eslint） + Prettier
- gh-pages（`npm run deploy` で GitHub Pages 配信）

---

## 🚀 セットアップ

1. 依存インストール
   ```bash
   npm install
   ```
2. アセット配置（リポジトリ外管理）
   - `data/bears.geojson`
   - `public/icon/*.svg`（マーカー/フィルタ/メニュー用）
   - `public/qr/*.png`（メール/X/Facebook/GitHub の QR）
3. 環境変数を設定  
   `.env` などに `VITE_ROOT_DIR` を指定（例：`/bear-map-web-sapporo/`）。ローカル開発は `/` を推奨。

開発: `npm run dev` / ビルド: `npm run build` / プレビュー: `npm run preview`。

---

## 🌲 ディレクトリ構成（抜粋）

```
.
├─ index.html                  # Vite エントリ（GTAG 付き）
├─ public/
│  ├─ icon/                    # bear.svg などマーカー & UI アイコン
│  └─ qr/                      # 問い合わせ用 QR 画像
├─ data/                       # Git 管理外。bears.geojson を配置
├─ src/
│  ├─ app/ (App.tsx, main.tsx) # ルーティングとブートストラップ
│  ├─ components/              # MapView / FilterModal / DetailsModal など
│  ├─ hooks/ (useBearData.ts)  # フェッチとフィルタ管理
│  ├─ lib/ (geojson.ts)        # バリデーション & フィルタ
│  ├─ styles/ (index.css)
│  └─ types/ (bears.d.ts)
├─ AGENTS.md / README.md
└─ vite.config.ts ほか設定ファイル
```

---

## 🗂️ GeoJSON 仕様とバリデーション

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

- `geometry.type` は Point のみ、`coordinates` は `[longitude, latitude]`
- `year`: 2017〜2025 / `month`: 1〜12 を満たさない Feature は除外
- `icon`: `bear.svg` / `like-bear.svg` / `excrement.svg` / `footprint.svg` / `camera.svg` / `voice.svg` / `other.svg` のいずれか。無効値はマーカー描画時に `bear.svg` へフォールバック
- `datetime` / `location` / `status` など任意のフィールドは DetailsModal で表示（存在するもののみ）
- `lib/geojson.ts` の `parseFeatureCollection` が構造と座標を検証し、`useBearData` がフェッチとエラーハンドリングを行います。

---

## 🔎 フィルタとルーティングの挙動

- フィルタ条件は `year` / `month` / `icon` の AND。未指定はワイルドカード扱い
- `FilterModal` で選択した値のみを `BearFilter` に保持し、`resetFilter` で空オブジェクトへ戻す
- アイコンファイル名は入力値をサニタイズした上で描画し、空や無効値はデフォルトアイコン
- ルーティングは `App.tsx` が pushState で `/` ↔ `/about` を切り替え、`BASE_URL`（= `VITE_ROOT_DIR`）を考慮したパスを構築

---

## 🕒 更新履歴（About ページ表示内容）

- 2025/12/06: 12月5日に公開された熊出没情報を反映
- 2025/11/23: サイトを公開

---

## 📜 利用スクリプト

```bash
npm run dev        # 開発サーバ
npm run build      # TypeScript 型チェック + Vite build
npm run preview    # ビルド成果物のローカル確認
npm run lint       # ESLint
npm run deploy     # dist を gh-pages へ公開
npm run ls-js      # 生成された .js の洗い出し
npm run clean-js   # 生成された .js の削除
```

---

## 🧪 テスト観点

- フィルタ：全件／年のみ／年月／年月＋アイコンで期待通り絞り込めるか（未指定はワイルドカード）
- GeoJSON：Point 以外や範囲外の年/月・不正座標・未定義アイコンが除外されるか
- モーダル：FilterModal/DetailsModal の開閉、フォーカストラップ、ESC で閉じる挙動
- ルーティング：`/` ↔ `/about` を pushState で遷移し、`VITE_ROOT_DIR` 付きでもリロード・戻るで表示が維持されるか
- About：メール/X/Facebook/GitHub のリンクと `public/qr` の画像が崩れず表示されるか
- ステータスバッジ：読み込み中/エラー時に想定の文言が表示されるか

---

## 🔒 出典とクレジット

- 地図タイル：OpenStreetMap、ODbL ライセンス
- データ：札幌市オープンデータ「札幌市内のヒグマ出没情報」（CC BY 4.0）  
  本アプリでは CSV を GeoJSON へ変換して利用しています。

詳細な実装ガイドラインやコメント規約、受け入れ基準は **AGENTS.md** を参照してください。
