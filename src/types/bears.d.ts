export type BearStatus =
  | 'クマを目撃'
  | 'ヒグマらしき動物を目撃'
  | 'フンを確認'
  | '足跡を確認'
  | 'その他'
  | 'ヒグマを目撃';

export interface BearProps {
  year: number;
  month: number;
  status: BearStatus;
  title?: string;
  note?: string;
  [key: string]: unknown;
}

export interface BearFeature {
  type: 'Feature';
  geometry: {
    type: 'Point';
    coordinates: [number, number];
  };
  properties: BearProps;
}

export interface BearFeatureCollection {
  type: 'FeatureCollection';
  features: BearFeature[];
}

export interface BearFilter {
  year?: number;
  month?: number;
  status?: BearStatus;
}
