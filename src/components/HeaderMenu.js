import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const MENU_ICON_URL = import.meta.env.VITE_ROOT_DIR + 'icon/menu.svg';
/**
 * ヘッダ左上に表示する 3 点メニューを管理し、クリックでメニューリストを表示・非表示にする。
 *
 * @param {HeaderMenuProps} props メニュー開閉状態とトグル用コールバック
 * @returns {JSX.Element} メニューボタンと空のリストを含んだ JSX
 */
const HeaderMenu = ({ isOpen, onToggle }) => {
    return (_jsxs("div", { className: "header-menu", children: [_jsx("button", { type: "button", className: "header-menu-button", "aria-label": "\u30E1\u30CB\u30E5\u30FC\u3092\u958B\u304F", "aria-haspopup": "true", "aria-expanded": isOpen, onClick: onToggle, children: _jsx("img", { src: MENU_ICON_URL, alt: "\u30E1\u30CB\u30E5\u30FC" }) }), isOpen && (_jsx("div", { className: "header-menu-panel", role: "menu", children: _jsx("ul", { className: "header-menu-list", "aria-label": "\u30E1\u30CB\u30E5\u30FC\u4E00\u89A7" }) }))] }));
};
export default HeaderMenu;
