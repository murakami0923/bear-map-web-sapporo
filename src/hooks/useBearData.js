import { useCallback, useEffect, useMemo, useState } from 'react';
import { filterFeatures, parseFeatureCollection } from '../lib/geojson';
const DATA_URL = import.meta.env.VITE_ROOT_DIR + 'data/bears.geojson';
/**
 * 熊の出没データを取得し、フィルタ条件に基づいて抽出結果を返す。
 *
 * @returns {{ features: BearFeature[]; filteredFeatures: BearFeature[]; filter: BearFilter; setFilter: (partial: BearFilter) => void; resetFilter: () => void; isLoading: boolean; error: string | null }} フィルタ結果や状態管理 API をまとめたオブジェクト
 */
export const useBearData = () => {
    // 取得済みの全 Feature を保持する
    const [features, setFeatures] = useState([]);
    // 現在のフィルタ条件を保持する
    const [filter, setFilterState] = useState({});
    // 読み込み状態とエラー文言を保持する
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        let isCancelled = false;
        // fetch 実行直前にフラグを初期化する
        setIsLoading(true);
        setError(null);
        fetch(DATA_URL)
            .then(async (response) => {
            // ステータスコードの検証
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }
            // JSON をパースして内部形式へ変換
            const json = await response.json();
            const collection = parseFeatureCollection(json);
            if (!isCancelled) {
                setFeatures(collection.features);
            }
        })
            .catch((fetchError) => {
            // エラー発生時はメッセージを保存し、UI 側に通知する
            if (!isCancelled) {
                setError(fetchError instanceof Error ? fetchError.message : 'データ取得で不明なエラーが発生しました。');
                setFeatures([]);
            }
        })
            .finally(() => {
            // クリーンアップ済みでなければローディングを解除
            if (!isCancelled) {
                setIsLoading(false);
            }
        });
        // アンマウント時にキャンセルフラグを立て、ステート更新を抑止する
        return () => {
            isCancelled = true;
        };
    }, []);
    /**
     * フィルタ条件を部分的に更新する。
     *
     * @param {BearFilter} partial 設定したい部分的なフィルタ
     */
    const updateFilter = useCallback((partial) => {
        // undefined が指定された項目は削除し、条件を上書きする
        setFilterState((prev) => {
            const next = { ...prev, ...partial };
            Object.entries(next).forEach(([key, value]) => {
                if (value === undefined || value === null || value === '') {
                    delete next[key];
                }
            });
            return next;
        });
    }, []);
    /**
     * 全てのフィルタ条件を解除する。
     */
    const resetFilter = useCallback(() => {
        // 空オブジェクトに戻すことで全件表示に切り替える
        setFilterState({});
    }, []);
    // フィルタ条件が変わったときだけ再計算する
    const filteredFeatures = useMemo(() => filterFeatures(features, filter), [features, filter]);
    return {
        features,
        filteredFeatures,
        filter,
        setFilter: updateFilter,
        resetFilter,
        isLoading,
        error,
    };
};
