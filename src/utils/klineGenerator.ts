import { Kline, TimeFrame } from '@/types/kline';
import { TradingPair } from '@/types/trading';

// 时间框架对应的毫秒数
const timeFrameMs: { [key in TimeFrame]: number } = {
  '1m': 60 * 1000,
  '5m': 5 * 60 * 1000,
  '15m': 15 * 60 * 1000,
  '1h': 60 * 60 * 1000,
  '4h': 4 * 60 * 60 * 1000,
  '1d': 24 * 60 * 60 * 1000,
  '1w': 7 * 24 * 60 * 60 * 1000,
};

// 根据交易对获取合适的价格波动范围
const getPriceVolatility = (pair: TradingPair): { basePrice: number; volatility: number } => {
  const basePrice = pair.lastPrice;
  let volatility = 0;

  switch (pair.base) {
    case 'BTC':
      volatility = 0.002; // 0.2% 基础波动
      break;
    case 'ETH':
      volatility = 0.003; // 0.3% 基础波动
      break;
    default:
      volatility = 0.005; // 0.5% 基础波动
  }

  return { basePrice, volatility };
};

// 生成真实的交易量
const generateVolume = (pair: TradingPair, timeframe: TimeFrame): number => {
  const baseVolume = pair.base === 'BTC' ? 2 : pair.base === 'ETH' ? 15 : 1000;
  const timeframeMultiplier = timeFrameMs[timeframe] / timeFrameMs['1m'];
  
  // 添加随机性，但保持在合理范围内
  const randomFactor = 0.5 + Math.random();
  return baseVolume * Math.sqrt(timeframeMultiplier) * randomFactor;
};

// 生成单个K线数据
const generateSingleKline = (
  timestamp: number,
  prevClose: number,
  volatility: number,
  volume: number
): Kline => {
  // 基于前一个收盘价生成开盘价，添加小幅随机波动
  const open = prevClose * (1 + (Math.random() - 0.5) * volatility * 0.5);
  
  // 生成高低点，确保合理的范围
  const maxMove = volatility;
  const highMove = Math.random() * maxMove;
  const lowMove = -Math.random() * maxMove;
  
  const high = open * (1 + Math.max(highMove, lowMove));
  const low = open * (1 + Math.min(highMove, lowMove));
  
  // 生成收盘价，在高低点之间
  const closeRange = Math.random();
  const close = low + (high - low) * closeRange;

  return {
    timestamp,
    open: Number(open.toFixed(2)),
    high: Number(high.toFixed(2)),
    low: Number(low.toFixed(2)),
    close: Number(close.toFixed(2)),
    volume: Number(volume.toFixed(2)),
  };
};

// 生成指定时间范围的K线数据
export const generateKlines = (
  pair: TradingPair,
  timeframe: TimeFrame,
  count: number = 200
): Kline[] => {
  const { basePrice, volatility } = getPriceVolatility(pair);
  const klines: Kline[] = [];
  const interval = timeFrameMs[timeframe];
  
  // 从当前时间开始，往前生成K线
  const now = Date.now();
  const currentTime = Math.floor(now / interval) * interval;
  let prevClose = basePrice;

  // 生成历史数据
  for (let i = 0; i < count; i++) {
    const timestamp = currentTime - (count - 1 - i) * interval;
    const volume = generateVolume(pair, timeframe);
    
    const kline = generateSingleKline(timestamp, prevClose, volatility, volume);
    klines.push(kline);
    prevClose = kline.close;
  }

  // 验证时间戳
  const firstTime = new Date(klines[0].timestamp);
  const lastTime = new Date(klines[klines.length - 1].timestamp);

  console.log('Generated klines:', {
    pair: pair.symbol,
    timeframe,
    count: klines.length,
    interval: interval / 1000, // 转换为秒
    firstTime: firstTime.toISOString(),
    lastTime: lastTime.toISOString(),
    timeDiff: (lastTime.getTime() - firstTime.getTime()) / 1000, // 转换为秒
    expectedDiff: (count - 1) * (interval / 1000), // 转换为秒
    sampleKline: klines[klines.length - 1]
  });

  return klines;
};

// 生成所有时间维度的K线数据
export const generateAllTimeframeKlines = (pair: TradingPair) => {
  const timeframes: TimeFrame[] = ['1m', '5m', '15m', '1h', '4h', '1d', '1w'];
  const result: { [key in TimeFrame]?: Kline[] } = {};

  timeframes.forEach(timeframe => {
    result[timeframe] = generateKlines(pair, timeframe);
  });

  return result;
};
