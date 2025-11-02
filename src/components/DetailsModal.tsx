import { useEffect, useRef } from 'react';
import type { BearFeature } from '../types/bears';

/**
 * 選択した熊出没情報の詳細をモーダルで表示する。
 *
 * @param {{ feature: BearFeature | null; onClose: () => void }} props 表示対象の Feature と閉じる処理
 * @returns {JSX.Element | null} 詳細モーダルの JSX。対象がない場合は null
 */
const DetailsModal = ({ feature, onClose }: { feature: BearFeature | null; onClose: () => void }): JSX.Element | null => {
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!feature) {
      return;
    }
    // モーダルが開いたら閉じるボタンにフォーカスを移動する
    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
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

  const entries = Object.entries(feature.properties);

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <div className="modal-content details-modal">
        <header className="modal-header">
          <h2>出没詳細</h2>
          <button
            type="button"
            className="modal-close"
            onClick={onClose}
            aria-label="閉じる"
            ref={closeButtonRef}
          >
            ×
          </button>
        </header>
        <div className="modal-body">
          <table>
            <tbody>
              {entries.map(([key, value]) => (
                <tr key={`detail-${key}`}>
                  <th>{key}</th>
                  <td>{String(value)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DetailsModal;
