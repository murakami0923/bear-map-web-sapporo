import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useRef } from 'react';
/**
 * 選択した熊出没情報の詳細をモーダルで表示する。
 *
 * @param {{ feature: BearFeature | null; onClose: () => void }} props 表示対象の Feature と閉じる処理
 * @returns {JSX.Element | null} 詳細モーダルの JSX。対象がない場合は null
 */
const DetailsModal = ({ feature, onClose }) => {
    const closeButtonRef = useRef(null);
    useEffect(() => {
        if (!feature) {
            return;
        }
        // モーダルが開いたら閉じるボタンにフォーカスを移動する
        closeButtonRef.current?.focus();
        const handleKeyDown = (event) => {
            // ESC キーでモーダルを閉じる
            if (event.key === 'Escape') {
                event.preventDefault();
                onClose();
            }
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [feature, onClose]);
    if (!feature) {
        return null;
    }
    const iconUrl = import.meta.env.VITE_ROOT_DIR + 'icon/' + String(feature.properties.icon);
    return (_jsx("div", { className: "modal-backdrop", role: "dialog", "aria-modal": "true", children: _jsxs("div", { className: "modal-content details-modal", children: [_jsxs("header", { className: "modal-header", children: [_jsx("h2", { children: "\u51FA\u6CA1\u60C5\u5831" }), _jsx("button", { type: "button", className: "modal-close", onClick: onClose, "aria-label": "\u9589\u3058\u308B", ref: closeButtonRef, children: "\u00D7" })] }), _jsx("img", { src: iconUrl, width: '64px', height: '64px' }), _jsx("div", { className: "modal-body", children: _jsx("table", { children: _jsxs("tbody", { children: [_jsxs("tr", { children: [_jsx("th", { children: "\u65E5\u4ED8" }), _jsx("td", { children: String(feature.properties.datetime) })] }), _jsxs("tr", { children: [_jsx("th", { children: "\u5834\u6240" }), _jsx("td", { children: String(feature.properties.location) })] }), _jsxs("tr", { children: [_jsx("th", { children: "\u72B6\u6CC1" }), _jsx("td", { children: String(feature.properties.status) })] })] }) }) })] }) }));
};
export default DetailsModal;
