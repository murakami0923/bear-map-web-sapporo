import MapView from '../components/MapView';
import '../styles/index.css?ts=20251106-0100';

/**
 * アプリ全体のレイアウトを構築し、地図コンポーネントとフッターを配置する。
 *
 * @returns {JSX.Element} ルートアプリケーションの JSX
 */
const App = (): JSX.Element => {
  return (
    <div className="app-root">
      <main>
        <MapView />
      </main>
      <footer className="app-footer">
        <p>
          地図データ：
          <a
            href="https://www.openstreetmap.org/"
            target="_blank"
            rel="noopener noreferrer"
          >
            OpenStreetMap
          </a>{" "}
          &copy; <a
            href="https://www.openstreetmap.org/copyright"
            target="_blank"
            rel="noopener noreferrer"
          >
            OpenStreetMap contributors
          </a>{" "}
          （<a
            href="https://opendatacommons.org/licenses/odbl/"
            target="_blank"
            rel="noopener noreferrer"
          >
          ODbL
          </a> ライセンス）
        </p>
        <p>
          出典：
          <a
            href="https://ckan.pf-sapporo.jp/dataset/sapporo_bear_appearance"
            target="_blank"
            rel="noopener noreferrer"
          >
            札幌市オープンデータ「熊の出没情報」
          </a>
          <br />
          このアプリケーションでは、元データ（CSV形式）を加工（GeoJSON形式へ変換）して利用しています。
          <br />
          当該データは{" "}
          <a
            href="https://creativecommons.org/licenses/by/4.0/deed.ja"
            target="_blank"
            rel="noopener noreferrer"
          >
            クリエイティブ・コモンズ 表示 4.0 国際ライセンス（CC BY 4.0）
          </a>{" "}
          の下で提供されています。
          <br />
          © 札幌市, CC BY 4.0
        </p>
      </footer>
    </div>
  );
};

export default App;
