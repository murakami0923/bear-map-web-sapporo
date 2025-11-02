import { useEffect, useRef } from 'react';
import type { Map as MapLibreMap, Marker } from 'maplibre-gl';
import { Marker as MapLibreMarker } from 'maplibre-gl';
import type { BearFeature } from '../types/bears';

const BEAR_ICON_URL = '/icon/bear.svg';

/**
 * MapLibre のマップ上に熊アイコンのマーカーを描画する。
 *
 * @param {{ map: MapLibreMap | null; feature: BearFeature; onSelect: (feature: BearFeature) => void }} props マップインスタンスと対象 Feature、選択時のコールバック
 * @returns {null} 画面には直接要素を描画せず、副作用のみ行うため null
 */
const BearMarker = ({
  map,
  feature,
  onSelect,
}: {
  map: MapLibreMap | null;
  feature: BearFeature;
  onSelect: (feature: BearFeature) => void;
}) => {
  const markerRef = useRef<Marker | null>(null);

  useEffect(() => {
    // マップがまだ初期化されていない場合は何もせず抜ける
    if (!map) {
      return;
    }

    // 既存のマーカーがあれば一旦破棄する
    if (markerRef.current) {
      markerRef.current.remove();
      markerRef.current = null;
    }

    // 画像要素を生成し、MapLibre のマーカーへ割り当てる
    const img = document.createElement('img');
    img.src = BEAR_ICON_URL;
    img.alt = '熊の出没地点';
    img.style.width = '32px';
    img.style.height = '32px';
    img.style.cursor = 'pointer';

    // クリックで詳細表示のコールバックを呼び出す
    const handleClick = () => onSelect(feature);
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        onSelect(feature);
      }
    };

    img.addEventListener('click', handleClick);
    img.addEventListener('keydown', handleKeyDown);
    img.tabIndex = 0;
    img.setAttribute('role', 'button');
    img.setAttribute('aria-label', '熊の出没詳細を表示');

    // MapLibre のマーカーオブジェクトを生成する
    const marker = new MapLibreMarker({ element: img }).setLngLat(feature.geometry.coordinates).addTo(map);
    markerRef.current = marker;

    // クリーンアップ時にはマーカーを削除し、イベントリスナーも外す
    return () => {
      img.removeEventListener('click', handleClick);
      img.removeEventListener('keydown', handleKeyDown);
      marker.remove();
    };
  }, [feature, map, onSelect]);

  return null;
};

export default BearMarker;
