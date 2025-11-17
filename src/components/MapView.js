import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Fragment, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Map as MapLibreMap, NavigationControl } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import BearMarker from './BearMarker';
import FilterButton from './FilterButton';
import FilterModal from './FilterModal';
import DetailsModal from './DetailsModal';
import HeaderMenu from './HeaderMenu';
import { useBearData } from '../hooks/useBearData';
const SAPPORO_COORDINATES = [141.3545, 43.0621];
/**
 * MapLibre のマップを表示し、熊出没データをマーカーとして描画する。
 *
 * @returns {JSX.Element} マップと関連 UI を含む JSX
 */
const MapView = () => {
    const mapContainerRef = useRef(null);
    const mapRef = useRef(null);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [selectedFeature, setSelectedFeature] = useState(null);
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
    const handleMarkerSelect = useCallback((feature) => {
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
    const handleApplyFilter = useCallback((partial) => {
        setFilter(partial);
    }, [setFilter]);
    /**
     * 全件表示に戻したい場合のハンドラ。
     */
    const handleResetFilter = useCallback(() => {
        resetFilter();
    }, [resetFilter]);
    /**
     * ヘッダの 3 点メニューを開閉する。
     */
    const handleToggleMenu = useCallback(() => {
        setIsMenuOpen((prev) => !prev);
    }, []);
    const map = mapRef.current;
    const markerLayerKey = useMemo(() => {
        return JSON.stringify({
            year: filter.year ?? 'all',
            month: filter.month ?? 'all',
            icon: filter.icon ?? 'all',
        });
    }, [filter]);
    const markers = useMemo(() => {
        if (!map) {
            return null;
        }
        return (_jsx(Fragment, { children: filteredFeatures.map((feature) => (_jsx(BearMarker, { map: map, feature: feature, onSelect: handleMarkerSelect }, feature.properties.id ?? `${feature.geometry.coordinates.join(',')}-${feature.properties.year}-${feature.properties.month}`))) }, markerLayerKey));
    }, [filteredFeatures, handleMarkerSelect, map, markerLayerKey]);
    return (_jsxs("div", { className: "map-container", children: [_jsxs("div", { className: "map-header", children: [_jsxs("div", { className: "map-header-left", children: [_jsx(HeaderMenu, { isOpen: isMenuOpen, onToggle: handleToggleMenu }), _jsx("h1", { children: "\u718A\u51FA\u6CA1\u30DE\u30C3\u30D7 \u5317\u6D77\u9053\u672D\u5E4C\u5E02 2017\u5E74\uFF5E2025\u5E74" })] }), _jsx("button", { type: "button", className: "secondary-button", onClick: handleResetFilter, children: "\u30D5\u30A3\u30EB\u30BF\u89E3\u9664" })] }), _jsx("div", { className: "map-wrapper", ref: mapContainerRef, "aria-label": "\u718A\u306E\u51FA\u6CA1\u30DE\u30C3\u30D7" }), _jsx(FilterButton, { onClick: openFilter }), isLoading && _jsx("div", { className: "status-badge", children: "\u8AAD\u307F\u8FBC\u307F\u4E2D..." }), error && _jsxs("div", { className: "status-badge error", children: ["\u30C7\u30FC\u30BF\u53D6\u5F97\u306B\u5931\u6557\u3057\u307E\u3057\u305F: ", error] }), markers, _jsx(FilterModal, { isOpen: isFilterOpen, defaultFilter: filter, onApply: handleApplyFilter, onClose: closeFilter, onReset: handleResetFilter }), _jsx(DetailsModal, { feature: selectedFeature, onClose: handleCloseDetails })] }));
};
export default MapView;
