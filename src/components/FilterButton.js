import { jsx as _jsx } from "react/jsx-runtime";
const FILTER_ICON_URL = import.meta.env.VITE_ROOT_DIR + 'icon/filter.svg';
/**
 * 検索条件モーダルを開くためのフィルタボタンを表示する。
 *
 * @param {{ onClick: MouseEventHandler<HTMLButtonElement> }} props ボタン押下時に呼び出すコールバック
 * @returns {JSX.Element} フィルタボタンの JSX
 */
const FilterButton = ({ onClick }) => {
    return (_jsx("button", { type: "button", className: "filter-button", onClick: onClick, "aria-label": "\u691C\u7D22\u6761\u4EF6\u3092\u958B\u304F", children: _jsx("img", { src: FILTER_ICON_URL, alt: "\u30D5\u30A3\u30EB\u30BF" }) }));
};
export default FilterButton;
