import { useEffect, useRef, useState, type FormEvent } from 'react';
import type { BearFilter, BearIconName } from '../types/bears';

const years = Array.from({ length: 2025 - 2017 + 1 }, (_, index) => 2017 + index);
const months = Array.from({ length: 12 }, (_, index) => index + 1);
const iconFilterOptions: { label: string; filename: BearIconName }[] = [
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
const FilterModal = ({
  isOpen,
  defaultFilter,
  onApply,
  onClose,
  onReset,
}: {
  isOpen: boolean;
  defaultFilter: BearFilter;
  onApply: (filter: BearFilter) => void;
  onClose: () => void;
  onReset: () => void;
}): JSX.Element | null => {
  const [selectedYears, setSelectedYears] = useState<number[]>(defaultFilter.years ?? []);
  const [selectedMonths, setSelectedMonths] = useState<number[]>(defaultFilter.months ?? []);
  const [selectedIcons, setSelectedIcons] = useState<BearIconName[]>(defaultFilter.icons ?? []);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const firstCheckboxRef = useRef<HTMLInputElement | null>(null);

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

    const handleKeyDown = (event: KeyboardEvent) => {
      // ESC キーでモーダルを閉じる
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
        return;
      }

      // Tab キーによるフォーカストラップを実現する
      if (event.key === 'Tab' && containerRef.current) {
        const focusableElements = containerRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        );
        if (focusableElements.length === 0) {
          return;
        }
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (!event.shiftKey && document.activeElement === lastElement) {
          event.preventDefault();
          firstElement.focus();
        } else if (event.shiftKey && document.activeElement === firstElement) {
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

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    // フォームのデフォルト送信を抑止し、親へ条件を通知する
    event.preventDefault();
    const payload: BearFilter = {
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
  const toggleValue = <T,>(current: T[], value: T): T[] => {
    return current.includes(value) ? current.filter((v) => v !== value) : [...current, value];
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <div className="modal-content" ref={containerRef}>
        <header className="modal-header">
          <h2>検索条件</h2>
          <button type="button" className="modal-close" onClick={onClose} aria-label="閉じる">
            ×
          </button>
        </header>
        <form className="modal-form" onSubmit={handleSubmit}>
          <fieldset className="filter-fieldset">
            <legend>年</legend>
            <div className="checkbox-group years">
              {years.map((value, idx) => (
                <label key={`year-${value}`} className="checkbox-label">
                  <input
                    type="checkbox"
                    ref={idx === 0 ? firstCheckboxRef : undefined}
                    checked={selectedYears.includes(value)}
                    onChange={() => setSelectedYears((prev) => toggleValue(prev, value))}
                  />
                  {value}年
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset className="filter-fieldset">
            <legend>月</legend>
            <div className="checkbox-group">
              {months.map((value) => (
                <label key={`month-${value}`} className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={selectedMonths.includes(value)}
                    onChange={() => setSelectedMonths((prev) => toggleValue(prev, value))}
                  />
                  {value}月
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset className="filter-fieldset">
            <legend>アイコン</legend>
            <div className="checkbox-group icons">
              {iconFilterOptions.map(({ label, filename }) => (
                <label key={`icon-${filename}`} className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={selectedIcons.includes(filename)}
                    onChange={() => setSelectedIcons((prev) => toggleValue(prev, filename))}
                  />
                  {label}
                </label>
              ))}
            </div>
          </fieldset>

          <div className="modal-actions">
            <button type="button" onClick={handleReset} className="secondary-button">
              クリア
            </button>
            <button type="submit" className="primary-button">
              絞り込む
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FilterModal;
