export type TimeFrame = '1m' | '5m' | '15m' | '1h' | '4h' | '1d' | '1w';

export interface Kline {
  timestamp: number;  // Unix timestamp in milliseconds
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface KlineData {
  [key: string]: { // trading pair symbol as key
    [key in TimeFrame]?: Kline[];
  };
}
