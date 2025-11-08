import { jsx as _jsx } from "react/jsx-runtime";
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
/**
 * React アプリケーションをルート要素へマウントする。
 */
const bootstrap = () => {
    // ルート要素を取得し、React 18 の createRoot で描画する
    const rootElement = document.getElementById('root');
    if (!rootElement) {
        throw new Error('root 要素が見つかりません。');
    }
    const root = ReactDOM.createRoot(rootElement);
    root.render(_jsx(React.StrictMode, { children: _jsx(App, {}) }));
};
bootstrap();
