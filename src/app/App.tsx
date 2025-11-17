import { useCallback, useEffect, useState } from 'react';
import MapView from '../components/MapView';
import AboutPage from '../components/AboutPage';
import '../styles/index.css';

/**
 * 末尾のスラッシュを調整し、ルーティング判定用の整形済み文字列を返す。
 *
 * @param {string} value 調整対象のパス
 * @returns {string} 末尾スラッシュが 1 つだけになるよう整形した文字列
 */
const trimTrailingSlash = (value: string): string => {
  if (value.length > 1 && value.endsWith('/')) {
    return value.slice(0, -1);
  }
  return value;
};

/**
 * 先頭にスラッシュを補完し、ルート相対パスとして扱いやすくする。
 *
 * @param {string} value 調整したいパス
 * @returns {string} 先頭スラッシュを付与した文字列
 */
const ensureLeadingSlash = (value: string): string => {
  if (!value.startsWith('/')) {
    return `/${value}`;
  }
  return value;
};

const BASE_URL = import.meta.env.BASE_URL ?? '/';
const BASE_PREFIX = BASE_URL === '/' ? '/' : trimTrailingSlash(BASE_URL);

/**
 * 現在の URL からアプリ基準の相対パスを取得する。
 *
 * @returns {string} ルート（"/"）基準の現在パス
 */
const getRelativePath = (): string => {
  const normalizedPath = trimTrailingSlash(window.location.pathname) || '/';
  if (BASE_PREFIX !== '/' && normalizedPath.startsWith(BASE_PREFIX)) {
    const remainder = normalizedPath.slice(BASE_PREFIX.length);
    return remainder === '' ? '/' : ensureLeadingSlash(remainder);
  }
  return normalizedPath === '' ? '/' : normalizedPath;
};

/**
 * 相対パスをアプリの公開ディレクトリに合わせた絶対パスへ変換する。
 *
 * @param {string} relativePath "/" から始まる相対パス
 * @returns {string} pushState 用の絶対パス
 */
const buildAbsolutePath = (relativePath: string): string => {
  const normalizedRelative = ensureLeadingSlash(relativePath === '' ? '/' : relativePath);
  if (BASE_PREFIX === '/') {
    return normalizedRelative;
  }
  if (normalizedRelative === '/') {
    return BASE_URL;
  }
  const prefix = trimTrailingSlash(BASE_PREFIX);
  return `${prefix}${normalizedRelative}`;
};

/**
 * アプリ全体のレイアウトと簡易ルーティングを担い、
 * マップ表示と「このサイトについて」ページを切り替える。
 *
 * @returns {JSX.Element} ルートアプリケーションの JSX
 */
const App = (): JSX.Element => {
  const [currentPath, setCurrentPath] = useState<string>(() => getRelativePath());

  useEffect(() => {
    /**
     * 戻る/進む操作で表示を同期させるためのハンドラ。
     */
    const handlePopstate = () => {
      setCurrentPath(getRelativePath());
    };
    window.addEventListener('popstate', handlePopstate);
    return () => {
      window.removeEventListener('popstate', handlePopstate);
    };
  }, []);

  /**
   * 指定されたパスに pushState で遷移し、現在のビューを更新する。
   *
   * @param {string} nextPath 遷移先の相対パス
   */
  const navigate = useCallback(
    (nextPath: string) => {
      const normalizedNext = ensureLeadingSlash(nextPath === '' ? '/' : nextPath);
      if (normalizedNext === currentPath) {
        return;
      }
      const absolutePath = buildAbsolutePath(normalizedNext);
      window.history.pushState({}, '', absolutePath);
      setCurrentPath(normalizedNext);
    },
    [currentPath],
  );

  /**
   * マップ画面へ遷移するためのショートカット。
   */
  const handleNavigateHome = useCallback(() => {
    navigate('/');
  }, [navigate]);

  /**
   * 「このサイトについて」ページへの遷移をまとめたショートカット。
   */
  const handleNavigateAbout = useCallback(() => {
    navigate('/about');
  }, [navigate]);

  const isAboutRoute = currentPath === '/about';

  return (
    <div className="app-root">
      <main>
        {isAboutRoute ? (
          <AboutPage onNavigateHome={handleNavigateHome} />
        ) : (
          <MapView onNavigateAbout={handleNavigateAbout} />
        )}
      </main>
      <footer className="app-footer">
        <p>
          地図データ：
          <a href="https://www.openstreetmap.org/" target="_blank" rel="noopener noreferrer">
            OpenStreetMap
          </a>{' '}
          &copy;{' '}
          <a
            href="https://www.openstreetmap.org/copyright"
            target="_blank"
            rel="noopener noreferrer"
          >
            OpenStreetMap contributors
          </a>{' '}
          （
          <a href="https://opendatacommons.org/licenses/odbl/" target="_blank" rel="noopener noreferrer">
            ODbL
          </a>{' '}
          ライセンス）
        </p>
        <p>
          出典：
          <a
            href="https://ckan.pf-sapporo.jp/dataset/sapporo_bear_appearance"
            target="_blank"
            rel="noopener noreferrer"
          >
            札幌市オープンデータ「札幌市内のヒグマ出没情報」
          </a>
          <br />
          このアプリケーションでは、元データ（CSV形式）を加工（GeoJSON形式へ変換）して利用しています。
          <br />
          当該データは{' '}
          <a
            href="https://creativecommons.org/licenses/by/4.0/deed.ja"
            target="_blank"
            rel="noopener noreferrer"
          >
            クリエイティブ・コモンズ 表示 4.0 国際ライセンス（CC BY 4.0）
          </a>{' '}
          の下で提供されています。
          <br />
          © 札幌市, CC BY 4.0
        </p>
      </footer>
    </div>
  );
};

export default App;
