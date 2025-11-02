import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react';
import { ACCEPTABLE_STATUSES } from '../lib/geojson';
import type { BearFilter } from '../types/bears';

const years = Array.from({ length: 2025 - 2017 + 1 }, (_, index) => 2017 + index);
const months = Array.from({ length: 12 }, (_, index) => index + 1);

/**
 * 年・月・状況による絞り込み条件を入力するモーダルを表示する。
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
  const [year, setYear] = useState<number | ''>(defaultFilter.year ?? '');
  const [month, setMonth] = useState<number | ''>(defaultFilter.month ?? '');
  const [status, setStatus] = useState<BearFilter['status'] | ''>(defaultFilter.status ?? '');
  const containerRef = useRef<HTMLDivElement | null>(null);
  const firstFieldRef = useRef<HTMLSelectElement | null>(null);

  useEffect(() => {
    // モーダルが開いたタイミングでフォーム値を最新フィルタへ合わせる
    if (isOpen) {
      setYear(defaultFilter.year ?? '');
      setMonth(defaultFilter.month ?? '');
      setStatus(defaultFilter.status ?? '');
    }
  }, [defaultFilter, isOpen]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    // 最初の入力欄にフォーカスを移動して操作しやすくする
    firstFieldRef.current?.focus();

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

  const filterPayload = useMemo<BearFilter>(
    () => ({
      year: typeof year === 'number' ? year : undefined,
      month: typeof month === 'number' ? month : undefined,
      status: status ? (status as BearFilter['status']) : undefined,
    }),
    [month, status, year],
  );

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    // フォームのデフォルト送信を抑止し、親へ条件を通知する
    event.preventDefault();
    onApply(filterPayload);
    onClose();
  };

  const handleReset = () => {
    // 全項目をリセットしてワイルドカード状態に戻す
    setYear('');
    setMonth('');
    setStatus('');
    onReset();
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
          <label>
            年
            <select
              ref={firstFieldRef}
              value={year}
              onChange={(event) => setYear(event.target.value ? Number(event.target.value) : '')}
            >
              <option value="">すべて</option>
              {years.map((value) => (
                <option key={`year-${value}`} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </label>
          <label>
            月
            <select
              value={month}
              onChange={(event) => setMonth(event.target.value ? Number(event.target.value) : '')}
            >
              <option value="">すべて</option>
              {months.map((value) => (
                <option key={`month-${value}`} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </label>
          <label>
            状況
            <select
              value={status}
              onChange={(event) => setStatus((event.target.value as BearFilter['status']) || '')}
            >
              <option value="">すべて</option>
              {ACCEPTABLE_STATUSES.map((value) => (
                <option key={`status-${value}`} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </label>
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
