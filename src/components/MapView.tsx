import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Map as MapLibreMap, NavigationControl } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import BearMarker from './BearMarker';
import FilterButton from './FilterButton';
import FilterModal from './FilterModal';
import DetailsModal from './DetailsModal';
import { useBearData } from '../hooks/useBearData';
import type { BearFeature, BearFilter } from '../types/bears';

const SAPPORO_COORDINATES: [number, number] = [141.3545, 43.0621];

/**
 * MapLibre のマップを表示し、熊出没データをマーカーとして描画する。
 *
 * @returns {JSX.Element} マップと関連 UI を含む JSX
 */
const MapView = (): JSX.Element => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);
  const [selectedFeature, setSelectedFeature] = useState<BearFeature | null>(null);

  const { filteredFeatures, filter, setFilter, resetFilter, isLoading, error } = useBearData();

  useEffect(() => {
    if (mapRef.current || !mapContainerRef.current) {
      return;
    }

    // MapLibre のマップインスタンスを生成する
    const map = new MapLibreMap({
      container: mapContainerRef.current,
      style: {
        version: 8,
        sources: {
          osm: {
            type: 'raster',
            tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
            tileSize: 256,
            attribution: '© <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
          },
        },
        layers: [
          {
            id: 'osm',
            type: 'raster',
            source: 'osm',
          },
        ],
      },
      center: SAPPORO_COORDINATES,
      zoom: 11,
    });

    map.addControl(new NavigationControl(), 'top-right');

    mapRef.current = map;

    // クリーンアップ時にマップを破棄する
    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    // マーカーの表示後にマップサイズを補正し、レスポンシブレイアウトで崩れないようにする
    mapRef.current?.resize();
  }, [filteredFeatures.length]);

  /**
   * フィルタモーダルを開く。
   */
  const openFilter = useCallback(() => {
    setIsFilterOpen(true);
  }, []);

  /**
   * フィルタモーダルを閉じる。
   */
  const closeFilter = useCallback(() => {
    setIsFilterOpen(false);
  }, []);

  /**
   * マーカーがクリックされたときに詳細モーダルを開く。
   *
   * @param {BearFeature} feature クリックされた Feature
   */
  const handleMarkerSelect = useCallback((feature: BearFeature) => {
    setSelectedFeature(feature);
  }, []);

  /**
   * 詳細モーダルを閉じる。
   */
  const handleCloseDetails = useCallback(() => {
    setSelectedFeature(null);
  }, []);

  /**
   * フィルタ条件の適用とステート更新を行う。
   *
   * @param {BearFilter} partial 更新するフィルタ条件
   */
  const handleApplyFilter = useCallback(
    (partial: BearFilter) => {
      setFilter(partial);
    },
    [setFilter],
  );

  /**
   * 全件表示に戻したい場合のハンドラ。
   */
  const handleResetFilter = useCallback(() => {
    resetFilter();
  }, [resetFilter]);

  const map = mapRef.current;

  const markers = useMemo(
    () =>
      map
        ? filteredFeatures.map((feature) => (
            <BearMarker key={`${feature.geometry.coordinates.join(',')}-${feature.properties.year}-${feature.properties.month}`} map={map} feature={feature} onSelect={handleMarkerSelect} />
          ))
        : null,
    [filteredFeatures, handleMarkerSelect, map],
  );

  return (
    <div className="map-container">
      <div className="map-header">
        <h1>熊出没マップ 北海道札幌市 2017年～2024年</h1>
        <button type="button" className="secondary-button" onClick={handleResetFilter}>
          フィルタ解除
        </button>
      </div>
      <div className="map-wrapper" ref={mapContainerRef} aria-label="熊の出没マップ" />
      <FilterButton onClick={openFilter} />
      {isLoading && <div className="status-badge">読み込み中...</div>}
      {error && <div className="status-badge error">データ取得に失敗しました: {error}</div>}
      {markers}
      <FilterModal
        isOpen={isFilterOpen}
        defaultFilter={filter}
        onApply={handleApplyFilter}
        onClose={closeFilter}
        onReset={handleResetFilter}
      />
      <DetailsModal feature={selectedFeature} onClose={handleCloseDetails} />
    </div>
  );
};

export default MapView;
