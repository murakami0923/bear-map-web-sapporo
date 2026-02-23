import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useRef, useState } from 'react';
const years = Array.from({ length: 2025 - 2017 + 1 }, (_, index) => 2017 + index);
const months = Array.from({ length: 12 }, (_, index) => index + 1);
const iconFilterOptions = [
    { label: 'ヒグマ', filename: 'bear.svg' },
    { label: 'ヒグマらしき動物', filename: 'like-bear.svg' },
    { label: 'フン', filename: 'excrement.svg' },
    { label: '足跡', filename: 'footprint.svg' },
    { label: 'カメラ', filename: 'camera.svg' },
    { label: '声', filename: 'voice.svg' },
    { label: 'その他', filename: 'other.svg' },
];
/**
 * 年・月・アイコンによる絞り込み条件（複数選択）を入力するモーダルを表示する。
 *
 * @param {{ isOpen: boolean; defaultFilter: BearFilter; onApply: (filter: BearFilter) => void; onClose: () => void; onReset: () => void }} props モーダルの開閉状態とイベントハンドラ群
 * @returns {JSX.Element | null} モーダルの JSX。非表示の場合は null
 */
const FilterModal = ({ isOpen, defaultFilter, onApply, onClose, onReset, }) => {
    const [selectedYears, setSelectedYears] = useState(defaultFilter.years ?? []);
    const [selectedMonths, setSelectedMonths] = useState(defaultFilter.months ?? []);
    const [selectedIcons, setSelectedIcons] = useState(defaultFilter.icons ?? []);
    const containerRef = useRef(null);
    const firstCheckboxRef = useRef(null);
    useEffect(() => {
        // モーダルが開いたタイミングでフォーム値を最新フィルタへ合わせる
        if (isOpen) {
            setSelectedYears(defaultFilter.years ?? []);
            setSelectedMonths(defaultFilter.months ?? []);
            setSelectedIcons(defaultFilter.icons ?? []);
        }
    }, [defaultFilter, isOpen]);
    useEffect(() => {
        if (!isOpen) {
            return;
        }
        // 最初の入力欄（チェックボックス）にフォーカスを移動して操作しやすくする
        firstCheckboxRef.current?.focus();
        const handleKeyDown = (event) => {
            // ESC キーでモーダルを閉じる
            if (event.key === 'Escape') {
                event.preventDefault();
                onClose();
                return;
            }
            // Tab キーによるフォーカストラップを実現する
            if (event.key === 'Tab' && containerRef.current) {
                const focusableElements = containerRef.current.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
                if (focusableElements.length === 0) {
                    return;
                }
                const firstElement = focusableElements[0];
                const lastElement = focusableElements[focusableElements.length - 1];
                if (!event.shiftKey && document.activeElement === lastElement) {
                    event.preventDefault();
                    firstElement.focus();
                }
                else if (event.shiftKey && document.activeElement === firstElement) {
                    event.preventDefault();
                    lastElement.focus();
                }
            }
        };
        // キーダウンイベントを捕捉する
        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen, onClose]);
    const handleSubmit = (event) => {
        // フォームのデフォルト送信を抑止し、親へ条件を通知する
        event.preventDefault();
        const payload = {
            years: selectedYears.length > 0 ? selectedYears : undefined,
            months: selectedMonths.length > 0 ? selectedMonths : undefined,
            icons: selectedIcons.length > 0 ? selectedIcons : undefined,
        };
        onApply(payload);
        onClose();
    };
    const handleReset = () => {
        // 全選択を解除してワイルドカード状態に戻す
        setSelectedYears([]);
        setSelectedMonths([]);
        setSelectedIcons([]);
        onReset();
    };
    /**
     * 配列内の値をトグル（追加または削除）する。
     *
     * @param {T[]} current 現在の配列
     * @param {T} value 対象の値
     * @returns {T[]} 更新後の配列
     */
    const toggleValue = (current, value) => {
        return current.includes(value) ? current.filter((v) => v !== value) : [...current, value];
    };
    if (!isOpen) {
        return null;
    }
    return (_jsx("div", { className: "modal-backdrop", role: "dialog", "aria-modal": "true", children: _jsxs("div", { className: "modal-content", ref: containerRef, children: [_jsxs("header", { className: "modal-header", children: [_jsx("h2", { children: "\u691C\u7D22\u6761\u4EF6" }), _jsx("button", { type: "button", className: "modal-close", onClick: onClose, "aria-label": "\u9589\u3058\u308B", children: "\u00D7" })] }), _jsxs("form", { className: "modal-form", onSubmit: handleSubmit, children: [_jsxs("fieldset", { className: "filter-fieldset", children: [_jsx("legend", { children: "\u5E74" }), _jsx("div", { className: "checkbox-group", children: years.map((value, idx) => (_jsxs("label", { className: "checkbox-label", children: [_jsx("input", { type: "checkbox", ref: idx === 0 ? firstCheckboxRef : undefined, checked: selectedYears.includes(value), onChange: () => setSelectedYears((prev) => toggleValue(prev, value)) }), value] }, `year-${value}`))) })] }), _jsxs("fieldset", { className: "filter-fieldset", children: [_jsx("legend", { children: "\u6708" }), _jsx("div", { className: "checkbox-group", children: months.map((value) => (_jsxs("label", { className: "checkbox-label", children: [_jsx("input", { type: "checkbox", checked: selectedMonths.includes(value), onChange: () => setSelectedMonths((prev) => toggleValue(prev, value)) }), value] }, `month-${value}`))) })] }), _jsxs("fieldset", { className: "filter-fieldset", children: [_jsx("legend", { children: "\u30A2\u30A4\u30B3\u30F3" }), _jsx("div", { className: "checkbox-group icons", children: iconFilterOptions.map(({ label, filename }) => (_jsxs("label", { className: "checkbox-label", children: [_jsx("input", { type: "checkbox", checked: selectedIcons.includes(filename), onChange: () => setSelectedIcons((prev) => toggleValue(prev, filename)) }), label] }, `icon-${filename}`))) })] }), _jsxs("div", { className: "modal-actions", children: [_jsx("button", { type: "button", onClick: handleReset, className: "secondary-button", children: "\u30AF\u30EA\u30A2" }), _jsx("button", { type: "submit", className: "primary-button", children: "\u7D5E\u308A\u8FBC\u3080" })] })] })] }) }));
};
export default FilterModal;
