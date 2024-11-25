// Trading Pair
export interface TradingPair {
  symbol: string
  base: string
  quote: string
  lastPrice: number
  priceChange24h: number
  volume24h: number
  high24h: number
  low24h: number
  marketCap: number
}

// Order Book Entry
export interface OrderBookEntry {
  price: number
  size: number
  total: number
}

// Trade
export interface Trade {
  id: string
  price: number
  amount: number
  type: 'buy' | 'sell'
  timestamp: number
}

// Position
export interface Position {
  id: string
  pair: string
  side: 'long' | 'short'
  size: number
  entryPrice: number
  markPrice: number
  pnl: number
  pnlPercentage: number
  leverage: number
}

// Candlestick Data
export interface CandlestickData {
  time: number
  open: number
  high: number
  low: number
  close: number
  volume: number
}

// Time Frame
export type TimeFrame = '1m' | '5m' | '15m' | '1h' | '4h' | '1d' | '1w'

// Chart Types
export type ChartType = 'candles' | 'line'

// Technical Indicator
export interface TechnicalIndicator {
  id: string
  name: string
  type: string
  parameters: Record<string, any>
  color: string
  visible: boolean
}

// Drawing Tool
export interface DrawingTool {
  id: string
  type: string
  points: { x: number; y: number }[]
  color: string
  visible: boolean
}

// Chart Layout
export interface ChartLayout {
  type: ChartType
  interval: TimeFrame
  indicators: TechnicalIndicator[]
  drawings: DrawingTool[]
  showVolume: boolean
  showGrid: boolean
  showLegend: boolean
  theme: 'dark' | 'light'
}

// Market Summary
export interface MarketSummary {
  pair: string
  lastPrice: number
  priceChange24h: number
  volume24h: number
  high24h: number
  low24h: number
  marketCap: number
  totalSupply: number
  circulatingSupply: number
}

// Order Types
export type OrderType = 'market' | 'limit' | 'stop' | 'stopLimit'

// Order Side
export type OrderSide = 'buy' | 'sell'

// Order Status
export type OrderStatus = 'open' | 'filled' | 'canceled' | 'rejected'

// Order
export interface Order {
  id: string
  pair: string
  type: OrderType
  side: OrderSide
  status: OrderStatus
  price: number
  size: number
  filled: number
  remaining: number
  leverage: number
  margin: number
  createdAt: string
  updatedAt: string
}
