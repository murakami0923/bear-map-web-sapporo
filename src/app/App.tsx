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
          地図タイル:{' '}
          <a href="https://www.openstreetmap.org/" target="_blank" rel="noopener noreferrer">
            OpenStreetMap
          </a>
        </p>
      </footer>
    </div>
  );
};

export default App;
