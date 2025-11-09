export interface KnobSettings {
  gain: number;
  bass: number;
  mid: number;
  treb: number;
  vol: number;
}

export interface GeneratedTone {
  name: string;
  description: string;
}

// Fix: Add missing type definitions used in constants.ts
export type AmpType = 'Combo' | 'Head';
export type Power = '15W' | '30W' | '50W' | '100W';
export type SpeakerSize = '8"' | '10"' | '12"';
export type Style = 'Blues' | 'Rock' | 'Metal' | 'Jazz' | 'Country';
export type TolexColor = 'Black' | 'Cream' | 'Red' | 'Green' | 'Tweed';
export type GrillCloth = 'Black' | 'Salt & Pepper' | 'Oxblood' | 'Wheat';
export type Knobs = 'Chicken Head' | 'Skirted' | 'Bell';
export type SpecialFeature = 'Reverb' | 'Tremolo' | 'Boost' | 'FX Loop';
