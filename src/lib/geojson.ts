import type {
  BearFilter,
  BearFeature,
  BearFeatureCollection,
  BearProps,
  BearIconName,
} from '../types/bears';

export const ACCEPTABLE_ICON_FILENAMES: BearIconName[] = [
  'bear.svg',
  'like-bear.svg',
  'excrement.svg',
  'footprint.svg',
  'camera.svg',
  'voice.svg',
  'other.svg',
];

/**
 * 指定されたアイコンファイル名が許容リストに含まれるか確認する。
 *
 * @param {unknown} iconName チェック対象の値
 * @returns {BearIconName | undefined} 許容リスト内ならファイル名、そうでなければ undefined
 */
export const normalizeIconName = (iconName: unknown): BearIconName | undefined => {
  if (!iconName || typeof iconName !== 'string') {
    return undefined;
  }
  return ACCEPTABLE_ICON_FILENAMES.includes(iconName as BearIconName) ? (iconName as BearIconName) : undefined;
};

/**
 * 指定された年が許容範囲内かを検証する。
 *
 * @param {unknown} year チェック対象の値
 * @returns {year is number} 2017〜2025 の範囲内なら true
 */
export const isValidYear = (year: unknown): year is number => {
  // 数値かつ整数で 2017〜2025 の範囲を満たすかどうか
  return typeof year === 'number' && Number.isInteger(year) && year >= 2017 && year <= 2025;
};

/**
 * 指定された月が許容範囲内かを検証する。
 *
 * @param {unknown} month チェック対象の値
 * @returns {month is number} 1〜12 の範囲内なら true
 */
export const isValidMonth = (month: unknown): month is number => {
  // 数値かつ整数で 1〜12 の範囲を満たすかどうか
  return typeof month === 'number' && Number.isInteger(month) && month >= 1 && month <= 12;
};

/**
 * GeoJSON Feature の properties を BearProps 型へマッピングする。
 *
 * @param {Record<string, unknown>} rawProperties GeoJSON の生のプロパティ
 * @returns {BearProps | undefined} 正常化された BearProps。必須項目不足なら undefined
 */
export const mapProperties = (
  rawProperties: Record<string, unknown> | undefined,
): BearProps | undefined => {
  // プロパティが存在しない場合は undefined を返却する
  if (!rawProperties) {
    return undefined;
  }

  // データ源によって年/月/状況のキーが異なるため、候補を順番にチェックする
  const dateString = rawProperties['date'];
  const iconRaw = rawProperties['icon'];

  // 日付文字列から年と月を抽出する
  const yearCandidates = [rawProperties['year']].filter((value) => typeof value === 'number' || value instanceof Number) as number[];

  const year = yearCandidates.find((candidate) => isValidYear(Number(candidate)));
  const monthCandidates = [rawProperties['month']].filter((value) => typeof value === 'number' || value instanceof Number) as number[];

  const month = monthCandidates.find((candidate) => isValidMonth(Number(candidate)));
  
  // 年と月のいずれかが取れない場合はフィルタ対象から除外する
  if (!year || !month) {
    return undefined;
  }

  return {
    ...rawProperties,
    year,
    month,
    icon: normalizeIconName(iconRaw),
  };
};

/**
 * GeoJSON FeatureCollection をアプリ内で扱える形式に変換する。
 *
 * @param {unknown} json GeoJSON のパース結果
 * @returns {BearFeatureCollection} BearFeatureCollection 型のデータ
 * @throws {Error} 必須フィールドが不足している場合にスロー
 */
export const parseFeatureCollection = (json: unknown): BearFeatureCollection => {
  // GeoJSON の基本的な構造を確認する
  if (!json || typeof json !== 'object' || (json as { type?: string }).type !== 'FeatureCollection') {
    throw new Error('FeatureCollection 形式の GeoJSON ではありません。');
  }

  const features = Array.isArray((json as { features?: unknown }).features)
    ? ((json as { features: unknown[] }).features as Record<string, unknown>[])
    : [];

  const mappedFeatures: BearFeature[] = [];

  // 各 Feature を検証・変換する
  for (const feature of features) {
    if (!feature || typeof feature !== 'object') {
      continue;
    }

    const geometry = (feature as { geometry?: Record<string, unknown> }).geometry;
    const properties = (feature as { properties?: Record<string, unknown> }).properties;

    // Point 以外は対象外とする
    if (!geometry || geometry.type !== 'Point' || !Array.isArray(geometry.coordinates)) {
      continue;
    }

    const props = mapProperties(properties);
    if (!props) {
      continue;
    }

    const [lng, lat] = geometry.coordinates as [number, number];
    if (typeof lat !== 'number' || typeof lng !== 'number') {
      continue;
    }

    mappedFeatures.push({
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [lng, lat],
      },
      properties: props,
    });
  }

  return {
    type: 'FeatureCollection',
    features: mappedFeatures,
  };
};

/**
 * フィルタ条件に一致する Feature のみを抽出する。
 *
 * @param {BearFeature[]} features 抽出前の Feature 配列
 * @param {BearFilter} filter 現在のフィルタ条件
 * @returns {BearFeature[]} フィルタリング後の Feature 配列
 */
export const filterFeatures = (features: BearFeature[], filter: BearFilter): BearFeature[] => {
  // 条件の AND 結合で絞り込み、未指定項目はワイルドカード扱いとする
  return features.filter((feature) => {
    const { year, month, icon } = feature.properties;
    if (filter.year && year !== filter.year) {
      return false;
    }
    if (filter.month && month !== filter.month) {
      return false;
    }
    if (filter.icon && icon !== filter.icon) {
      return false;
    }
    return true;
  });
};
