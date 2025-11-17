import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
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
const trimTrailingSlash = (value) => {
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
const ensureLeadingSlash = (value) => {
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
const getRelativePath = () => {
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
const buildAbsolutePath = (relativePath) => {
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
const App = () => {
    const [currentPath, setCurrentPath] = useState(() => getRelativePath());
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
    const navigate = useCallback((nextPath) => {
        const normalizedNext = ensureLeadingSlash(nextPath === '' ? '/' : nextPath);
        if (normalizedNext === currentPath) {
            return;
        }
        const absolutePath = buildAbsolutePath(normalizedNext);
        window.history.pushState({}, '', absolutePath);
        setCurrentPath(normalizedNext);
    }, [currentPath]);
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
    return (_jsxs("div", { className: "app-root", children: [_jsx("main", { children: isAboutRoute ? (_jsx(AboutPage, { onNavigateHome: handleNavigateHome })) : (_jsx(MapView, { onNavigateAbout: handleNavigateAbout })) }), _jsxs("footer", { className: "app-footer", children: [_jsxs("p", { children: ["\u5730\u56F3\u30C7\u30FC\u30BF\uFF1A", _jsx("a", { href: "https://www.openstreetmap.org/", target: "_blank", rel: "noopener noreferrer", children: "OpenStreetMap" }), ' ', "\u00A9", ' ', _jsx("a", { href: "https://www.openstreetmap.org/copyright", target: "_blank", rel: "noopener noreferrer", children: "OpenStreetMap contributors" }), ' ', "\uFF08", _jsx("a", { href: "https://opendatacommons.org/licenses/odbl/", target: "_blank", rel: "noopener noreferrer", children: "ODbL" }), ' ', "\u30E9\u30A4\u30BB\u30F3\u30B9\uFF09"] }), _jsxs("p", { children: ["\u51FA\u5178\uFF1A", _jsx("a", { href: "https://ckan.pf-sapporo.jp/dataset/sapporo_bear_appearance", target: "_blank", rel: "noopener noreferrer", children: "\u672D\u5E4C\u5E02\u30AA\u30FC\u30D7\u30F3\u30C7\u30FC\u30BF\u300C\u672D\u5E4C\u5E02\u5185\u306E\u30D2\u30B0\u30DE\u51FA\u6CA1\u60C5\u5831\u300D" }), _jsx("br", {}), "\u3053\u306E\u30A2\u30D7\u30EA\u30B1\u30FC\u30B7\u30E7\u30F3\u3067\u306F\u3001\u5143\u30C7\u30FC\u30BF\uFF08CSV\u5F62\u5F0F\uFF09\u3092\u52A0\u5DE5\uFF08GeoJSON\u5F62\u5F0F\u3078\u5909\u63DB\uFF09\u3057\u3066\u5229\u7528\u3057\u3066\u3044\u307E\u3059\u3002", _jsx("br", {}), "\u5F53\u8A72\u30C7\u30FC\u30BF\u306F", ' ', _jsx("a", { href: "https://creativecommons.org/licenses/by/4.0/deed.ja", target: "_blank", rel: "noopener noreferrer", children: "\u30AF\u30EA\u30A8\u30A4\u30C6\u30A3\u30D6\u30FB\u30B3\u30E2\u30F3\u30BA \u8868\u793A 4.0 \u56FD\u969B\u30E9\u30A4\u30BB\u30F3\u30B9\uFF08CC BY 4.0\uFF09" }), ' ', "\u306E\u4E0B\u3067\u63D0\u4F9B\u3055\u308C\u3066\u3044\u307E\u3059\u3002", _jsx("br", {}), "\u00A9 \u672D\u5E4C\u5E02, CC BY 4.0"] })] })] }));
};
export default App;
