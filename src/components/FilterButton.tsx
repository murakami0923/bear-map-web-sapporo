import type { MouseEventHandler } from 'react';

const FILTER_ICON_URL = import.meta.env.VITE_ROOT_DIR + 'icon/filter.svg';

/**
 * 検索条件モーダルを開くためのフィルタボタンを表示する。
 *
 * @param {{ onClick: MouseEventHandler<HTMLButtonElement> }} props ボタン押下時に呼び出すコールバック
 * @returns {JSX.Element} フィルタボタンの JSX
 */
const FilterButton = ({ onClick }: { onClick: MouseEventHandler<HTMLButtonElement> }): JSX.Element => {
  return (
    <button type="button" className="filter-button" onClick={onClick} aria-label="検索条件を開く">
      <img src={FILTER_ICON_URL} alt="フィルタ" />
    </button>
  );
};

export default FilterButton;
