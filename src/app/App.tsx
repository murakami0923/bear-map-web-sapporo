import MapView from '../components/MapView';
import '../styles/index.css';

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
          地図データ {' '}
          <a href="https://www.openstreetmap.org/" target="_blank" rel="noopener noreferrer">
            &copy; OpenStreetMap
          </a>
        </p>
        <p>
          ヒグマ出没データ {' '}
          <a href="https://ckan.pf-sapporo.jp/dataset/sapporo_bear_appearance" target='_blank' rel="noopener noreferrer">
            &copy; 	札幌市環境局環境都市推進部環境管理担当課
          </a>
          (<a href="https://creativecommons.org/licenses/by/4.0/deed.ja">
            クリエイティブ・コモンズ・ライセンス（表示4.0 国際）
          </a>)を改変して作成
        </p>
      </footer>
    </div>
  );
};

export default App;
