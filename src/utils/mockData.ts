import { TradingPair, OrderBookEntry, Trade, Position, TimeFrame, CandlestickData } from '@/types/trading'

// 基础价格配置
const basePrices = {
  'BTC-USD': 43250.25,
  'ETH-USD': 2285.75,
  'SOL-USD': 98.45,
  'AVAX-USD': 35.80,
  'ARB-USD': 1.85,
  'OP-USD': 3.25,
}

// 获取真实的价格波动
const getPriceDeviation = (base: string): number => {
  switch (base) {
    case 'BTC':
      return 0.0002 // 0.02% 基础波动
    case 'ETH':
      return 0.0003 // 0.03% 基础波动
    case 'SOL':
      return 0.0005 // 0.05% 基础波动
    default:
      return 0.001 // 0.1% 基础波动
  }
}

// 生成模拟交易对
export const generateMockTradingPairs = (): TradingPair[] => {
  return [
    {
      symbol: 'BTC-USD',
      base: 'BTC',
      quote: 'USD',
      lastPrice: basePrices['BTC-USD'],
      priceChange24h: -1.2,
      volume24h: 12580.45,
      high24h: basePrices['BTC-USD'] * 1.015,
      low24h: basePrices['BTC-USD'] * 0.985,
      marketCap: 843.5e9,
    },
    {
      symbol: 'ETH-USD',
      base: 'ETH',
      quote: 'USD',
      lastPrice: basePrices['ETH-USD'],
      priceChange24h: 2.5,
      volume24h: 85420.78,
      high24h: basePrices['ETH-USD'] * 1.02,
      low24h: basePrices['ETH-USD'] * 0.98,
      marketCap: 274.8e9,
    },
    {
      symbol: 'SOL-USD',
      base: 'SOL',
      quote: 'USD',
      lastPrice: basePrices['SOL-USD'],
      priceChange24h: 5.8,
      volume24h: 458750.25,
      high24h: basePrices['SOL-USD'] * 1.025,
      low24h: basePrices['SOL-USD'] * 0.975,
      marketCap: 42.5e9,
    },
    {
      symbol: 'AVAX-USD',
      base: 'AVAX',
      quote: 'USD',
      lastPrice: basePrices['AVAX-USD'],
      priceChange24h: -0.8,
      volume24h: 325480.15,
      high24h: basePrices['AVAX-USD'] * 1.018,
      low24h: basePrices['AVAX-USD'] * 0.982,
      marketCap: 12.8e9,
    },
    {
      symbol: 'ARB-USD',
      base: 'ARB',
      quote: 'USD',
      lastPrice: basePrices['ARB-USD'],
      priceChange24h: 3.2,
      volume24h: 854620.35,
      high24h: basePrices['ARB-USD'] * 1.022,
      low24h: basePrices['ARB-USD'] * 0.978,
      marketCap: 2.4e9,
    },
    {
      symbol: 'OP-USD',
      base: 'OP',
      quote: 'USD',
      lastPrice: basePrices['OP-USD'],
      priceChange24h: -2.1,
      volume24h: 654280.90,
      high24h: basePrices['OP-USD'] * 1.02,
      low24h: basePrices['OP-USD'] * 0.98,
      marketCap: 2.8e9,
    },
  ]
}

// 生成真实的订单量
const getRealisticSize = (base: string): number => {
  const randomFactor = 0.5 + Math.random()
  switch (base) {
    case 'BTC':
      return 0.05 * randomFactor // 0.025 - 0.05 BTC
    case 'ETH':
      return 0.8 * randomFactor // 0.4 - 0.8 ETH
    case 'SOL':
      return 15 * randomFactor // 7.5 - 15 SOL
    case 'AVAX':
      return 20 * randomFactor // 10 - 20 AVAX
    case 'ARB':
      return 500 * randomFactor // 250 - 500 ARB
    case 'OP':
      return 300 * randomFactor // 150 - 300 OP
    default:
      return 1 * randomFactor
  }
}

// 生成订单簿数据
export const generateOrderBook = (pair: TradingPair): { asks: OrderBookEntry[]; bids: OrderBookEntry[] } => {
  const basePrice = pair.lastPrice
  const deviation = getPriceDeviation(pair.base)
  const asks: OrderBookEntry[] = []
  const bids: OrderBookEntry[] = []
  let askTotal = 0
  let bidTotal = 0

  // Generate 10 asks (sell orders)
  for (let i = 0; i < 10; i++) {
    const price = basePrice * (1 + deviation * (i + 1) * (0.8 + Math.random() * 0.4))
    const size = getRealisticSize(pair.base)
    askTotal += size
    asks.push({
      price,
      size,
      total: askTotal,
    })
  }

  // Generate 10 bids (buy orders)
  for (let i = 0; i < 10; i++) {
    const price = basePrice * (1 - deviation * (i + 1) * (0.8 + Math.random() * 0.4))
    const size = getRealisticSize(pair.base)
    bidTotal += size
    bids.push({
      price,
      size,
      total: bidTotal,
    })
  }

  // Sort asks ascending and bids descending
  asks.sort((a, b) => a.price - b.price)
  bids.sort((a, b) => b.price - a.price)

  return { asks, bids }
}

// Recent Trades
export const generateTrades = (pair: TradingPair): Trade[] => {
  const trades: Trade[] = []
  const baseTime = Date.now()
  
  // Trading patterns
  const patterns = [
    { size: 0.1, probability: 0.4 },    // Small trades
    { size: 0.5, probability: 0.3 },    // Medium trades
    { size: 2.0, probability: 0.2 },    // Large trades
    { size: 5.0, probability: 0.1 },    // Whale trades
  ]

  // Generate trades
  for (let i = 0; i < 3; i++) {
    // Determine trade size based on patterns
    const rand = Math.random()
    let cumulativeProbability = 0
    let baseSize = patterns[0].size

    for (const pattern of patterns) {
      cumulativeProbability += pattern.probability
      if (rand <= cumulativeProbability) {
        baseSize = pattern.size
        break
      }
    }

    // Add some randomness to the size
    const sizeVariation = 0.2 // 20% variation
    const finalSize = baseSize * (1 + (Math.random() - 0.5) * sizeVariation)

    // Price with small random deviation
    const priceChange = (Math.random() - 0.5) * 0.001 // 0.1% max change
    const price = pair.lastPrice * (1 + priceChange)

    // Determine trade type (buy/sell) with slight bias based on price movement
    const buyProbability = 0.5 + priceChange * 100 // Bias towards buys when price is dropping
    const type = Math.random() < buyProbability ? 'buy' : 'sell'

    trades.push({
      id: `trade-${baseTime}-${i}`,
      price,
      amount: finalSize,
      timestamp: new Date(baseTime - i * 1000).toISOString(), // One trade per second
      type,
    })
  }

  return trades.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
}

// 生成最近交易数据
export const generateRecentTrades = (pair: TradingPair): Trade[] => {
  const trades: Trade[] = []
  const now = Date.now()

  for (let i = 0; i < 10; i++) {
    const basePrice = pair.lastPrice
    const deviation = getPriceDeviation(pair.base)
    const priceChange = (Math.random() - 0.5) * 2 * deviation
    const price = basePrice * (1 + priceChange)
    const amount = getRealisticSize(pair.base)
    const type = Math.random() > 0.5 ? 'buy' : 'sell'

    trades.push({
      id: `trade-${now}-${i}`,
      price,
      amount,
      type,
      timestamp: now - i * 1000 * 60, // 每分钟一笔交易
    })
  }

  return trades.sort((a, b) => b.timestamp - a.timestamp)
}

// Positions
export const generatePositions = (pair: TradingPair): Position[] => {
  const positions: Position[] = []
  const baseTime = Date.now()

  // Generate fixed positions for each trading pair
  const positionsData = [
    {
      pair: 'BTC/USD',
      side: 'long',
      size: 1.5,
      leverage: 10,
    },
    {
      pair: 'ETH/USD',
      side: 'short',
      size: 15.0,
      leverage: 5,
    },
    {
      pair: 'SOL/USD',
      side: 'long',
      size: 100,
      leverage: 3,
    }
  ]

  positionsData.forEach((data, index) => {
    const entryPrice = getPriceDeviation(pair.base) * pair.lastPrice
    const currentPrice = getPriceDeviation(pair.base) * pair.lastPrice
    const pnl = data.side === 'long' 
      ? (currentPrice - entryPrice) * data.size 
      : (entryPrice - currentPrice) * data.size
    const pnlPercentage = data.side === 'long'
      ? ((currentPrice - entryPrice) / entryPrice) * 100
      : ((entryPrice - currentPrice) / currentPrice) * 100

    positions.push({
      id: `position-${baseTime}-${index}`,
      pair: data.pair,
      side: data.side,
      size: data.size,
      entryPrice,
      markPrice: currentPrice,
      pnl,
      pnlPercentage,
      leverage: data.leverage,
    })
  })

  return positions
}

// Candlestick Data with more realistic price movements
export const generateCandlestickData = (
  pair: TradingPair,
  timeframe: TimeFrame
): CandlestickData[] => {
  const candlesticks: CandlestickData[] = []
  const now = Math.floor(Date.now() / 1000)
  const timeframeInSeconds = {
    '1m': 60,
    '5m': 300,
    '15m': 900,
    '1h': 3600,
    '4h': 14400,
    '1d': 86400,
    '1w': 604800,
  }[timeframe]

  // Market characteristics
  const baseVolatility = {
    'btc-usd': 0.0008, // Reduced base volatility
    'eth-usd': 0.001,
    'sol-usd': 0.0015,
    'bnb-usd': 0.0012,
  }[pair.id] || 0.001

  // Time-based volatility adjustment
  const timeframeVolatilityMultiplier = {
    '1m': 0.6,  // Reduced multiplier for shorter timeframes
    '5m': 0.8,
    '15m': 1.0,
    '1h': 1.3,
    '4h': 1.6,
    '1d': 2.0,
    '1w': 2.5,
  }[timeframe]

  const volatility = baseVolatility * timeframeVolatilityMultiplier
  
  // Generate longer-term trend
  const trendPeriods = 4
  const trendsData = []
  for (let i = 0; i < trendPeriods; i++) {
    const trendLength = Math.floor(200 / trendPeriods)
    const trendDirection = Math.random() > 0.5 ? 1 : -1
    const trendStrength = Math.random() * 0.0004 + 0.0001 // Subtle trend
    trendsData.push({
      direction: trendDirection,
      strength: trendStrength,
      length: trendLength
    })
  }

  const numCandles = 200
  const startTime = now - numCandles * timeframeInSeconds
  const alignedStartTime = Math.floor(startTime / timeframeInSeconds) * timeframeInSeconds

  let basePrice = pair.lastPrice
  let prevClose = basePrice
  let volumeBase = pair.volume24h / (86400 / timeframeInSeconds)
  let momentum = 0
  const momentumDecay = 0.95
  const momentumMax = 0.002

  // Market session volatility (simulating active trading hours)
  const getSessionVolatility = (timestamp: number) => {
    const hour = new Date(timestamp * 1000).getUTCHours()
    // More volatile during US and Asian market hours
    if ((hour >= 13 && hour <= 21) || (hour >= 0 && hour <= 8)) {
      return 1.2
    }
    return 0.8
  }

  for (let i = 0; i < numCandles; i++) {
    const timestamp = alignedStartTime + i * timeframeInSeconds
    
    // Get current trend
    const trendIndex = Math.floor(i / (numCandles / trendPeriods))
    const currentTrend = trendsData[trendIndex]

    // Calculate price movement with multiple factors
    const trendEffect = currentTrend.direction * currentTrend.strength
    const randomWalk = (Math.random() - 0.5) * volatility
    const meanReversion = (basePrice - prevClose) * 0.1
    const sessionEffect = getSessionVolatility(timestamp)

    // Update momentum
    momentum = momentum * momentumDecay + randomWalk
    momentum = Math.max(Math.min(momentum, momentumMax), -momentumMax)

    // Combine all factors for final price change
    const priceChange = basePrice * (
      trendEffect +
      randomWalk * sessionEffect +
      meanReversion +
      momentum
    )

    // Generate OHLC with price clustering
    const open = prevClose
    const close = open + priceChange
    const highLowRange = Math.abs(priceChange) * (1 + Math.random() * 0.5)
    const high = Math.max(open, close) + (highLowRange * Math.random() * 0.5)
    const low = Math.min(open, close) - (highLowRange * Math.random() * 0.5)

    // Volume with price-volume relationship
    const priceVolatility = Math.abs(priceChange / basePrice)
    const volumeMultiplier = 1 + priceVolatility * 8 * sessionEffect
    const volume = volumeBase * (0.7 + Math.random() * 0.6) * volumeMultiplier

    candlesticks.push({
      time: timestamp,
      open: Number(open.toFixed(2)),
      high: Number(high.toFixed(2)),
      low: Number(low.toFixed(2)),
      close: Number(close.toFixed(2)),
      volume: Math.round(volume),
    })

    prevClose = close
    basePrice = close
  }

  return candlesticks
}
