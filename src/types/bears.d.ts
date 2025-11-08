export interface BearProps {
  year: number;
  month: number;
  id?: string;
  icon?: BearIconName;
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
  icon?: BearIconName;
}

export type BearIconName =
  | 'bear.svg'
  | 'like-bear.svg'
  | 'excrement.svg'
  | 'footprint.svg'
  | 'camera.svg'
  | 'voice.svg'
  | 'other.svg';
