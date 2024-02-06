
export interface Perfume {
  name: string;
  brand: string;
  image: string;
  description: string;
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
  error: string;
  singleResult: string;
}