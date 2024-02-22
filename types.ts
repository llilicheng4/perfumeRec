
export interface Perfume {
  name: string;
  brand: string;
  image: string;
  description: string;
  reviews?: string[];
  pros?: string[];
  cons?: string[];
  summary?: string;
  _additional: AdditionalType;
}


export interface NearTextType {
  concepts: [string] | [];
  certainty?: number;
  moveAwayFrom?: object;
}

export interface AdditionalType {
  generate: GenerateType
}

export interface GenerateType {
  error?: string;
  singleResult: string;
}