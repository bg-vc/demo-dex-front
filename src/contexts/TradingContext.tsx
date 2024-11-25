'use client'

import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { TradingPair, OrderBookEntry, Trade } from '@/types/trading'
import { Kline, TimeFrame, KlineData } from '@/types/kline'
import { generateMockTradingPairs, generateOrderBook, generateRecentTrades } from '@/utils/mockData'
import { generateAllTimeframeKlines } from '@/utils/klineGenerator'

interface TradingContextType {
  tradingPairs: TradingPair[]
  selectedPair: TradingPair | null
  selectedTimeframe: TimeFrame
  orderBook: {
    asks: OrderBookEntry[]
    bids: OrderBookEntry[]
  } | null
  klineData: KlineData
  recentTrades: Trade[]
  setSelectedPair: (pair: TradingPair) => void
  setSelectedTimeframe: (timeframe: TimeFrame) => void
}

const TradingContext = createContext<TradingContextType | undefined>(undefined)

export function TradingProvider({ children }: { children: React.ReactNode }) {
  const [tradingPairs, setTradingPairs] = useState<TradingPair[]>([])
  const [selectedPair, setSelectedPair] = useState<TradingPair | null>(null)
  const [selectedTimeframe, setSelectedTimeframe] = useState<TimeFrame>('15m')
  const [orderBook, setOrderBook] = useState<{ asks: OrderBookEntry[]; bids: OrderBookEntry[] } | null>(null)
  const [klineData, setKlineData] = useState<KlineData>({})
  const [recentTrades, setRecentTrades] = useState<Trade[]>([])

  // 初始化交易对数据
  useEffect(() => {
    const pairs = generateMockTradingPairs()
    setTradingPairs(pairs)
    // 默认选择 BTC-USD
    const btcPair = pairs.find(p => p.symbol === 'BTC-USD')
    if (btcPair) {
      setSelectedPair(btcPair)
    }
  }, [])

  // 生成新的 K 线数据
  const generateNewKlineData = useCallback((pair: TradingPair) => {
    console.log('Generating new K-line data for:', pair.symbol)
    const newKlineData = generateAllTimeframeKlines(pair)
    console.log('Generated K-line data:', {
      pair: pair.symbol,
      timeframes: Object.keys(newKlineData),
      sampleCounts: Object.entries(newKlineData).map(([tf, data]) => ({
        timeframe: tf,
        count: data.length
      }))
    })
    return newKlineData
  }, [])

  // 当选择的交易对改变时，更新所有数据
  useEffect(() => {
    if (!selectedPair) return

    console.log('Selected pair changed:', selectedPair.symbol)

    // 更新订单簿
    const newOrderBook = generateOrderBook(selectedPair)
    setOrderBook(newOrderBook)

    // 生成并更新K线数据
    const newKlineData = generateNewKlineData(selectedPair)
    setKlineData(prev => ({
      ...prev,
      [selectedPair.symbol]: newKlineData
    }))

    // 更新最近交易
    const newTrades = generateRecentTrades(selectedPair)
    setRecentTrades(newTrades)

  }, [selectedPair, generateNewKlineData])

  // 定期更新数据
  useEffect(() => {
    if (!selectedPair) return

    console.log('Starting data update interval for:', selectedPair.symbol)

    const interval = setInterval(() => {
      // 更新订单簿
      setOrderBook(generateOrderBook(selectedPair))

      // 更新最近交易
      setRecentTrades(generateRecentTrades(selectedPair))

      // 更新K线数据
      const newKlineData = generateNewKlineData(selectedPair)
      setKlineData(prev => ({
        ...prev,
        [selectedPair.symbol]: newKlineData
      }))
    }, 3000) // 每3秒更新一次

    return () => {
      console.log('Cleaning up data update interval for:', selectedPair.symbol)
      clearInterval(interval)
    }
  }, [selectedPair, generateNewKlineData])

  const value = {
    tradingPairs,
    selectedPair,
    selectedTimeframe,
    orderBook,
    klineData,
    recentTrades,
    setSelectedPair,
    setSelectedTimeframe,
  }

  return (
    <TradingContext.Provider value={value}>
      {children}
    </TradingContext.Provider>
  )
}

export function useTradingContext() {
  const context = useContext(TradingContext)
  if (context === undefined) {
    throw new Error('useTradingContext must be used within a TradingProvider')
  }
  return context
}
