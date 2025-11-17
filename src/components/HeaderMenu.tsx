const MENU_ICON_URL = import.meta.env.VITE_ROOT_DIR + 'icon/menu.svg';

interface HeaderMenuProps {
  isOpen: boolean;
  onToggle: () => void;
}

/**
 * ヘッダ左上に表示する 3 点メニューを管理し、クリックでメニューリストを表示・非表示にする。
 *
 * @param {HeaderMenuProps} props メニュー開閉状態とトグル用コールバック
 * @returns {JSX.Element} メニューボタンと空のリストを含んだ JSX
 */
const HeaderMenu = ({ isOpen, onToggle }: HeaderMenuProps): JSX.Element => {
  return (
    <div className="header-menu">
      <button
        type="button"
        className="header-menu-button"
        aria-label="メニューを開く"
        aria-haspopup="true"
        aria-expanded={isOpen}
        onClick={onToggle}
      >
        <img src={MENU_ICON_URL} alt="メニュー" />
      </button>
      {/* メニューの開閉状態に応じてドロップダウンを描画する */}
      {isOpen && (
        <div className="header-menu-panel" role="menu">
          <ul className="header-menu-list" aria-label="メニュー一覧" />
        </div>
      )}
    </div>
  );
};

export default HeaderMenu;
