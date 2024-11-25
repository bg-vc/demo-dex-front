'use client'

import { useState, useEffect, useMemo } from 'react'
import { useTradingContext } from '@/contexts/TradingContext'
import { formatNumber, formatPriceWithPrecision } from '@/utils/formatters'
import { OrderBookEntry } from '@/types/trading'

const OrderBook = () => {
  const { selectedPair, orderBook } = useTradingContext()
  const [displayType, setDisplayType] = useState<'both' | 'buys' | 'sells'>('both')

  // Process order book data
  const { processedAsks, processedBids, maxTotal } = useMemo(() => {
    if (!orderBook?.asks || !orderBook?.bids) {
      return { processedAsks: [], processedBids: [], maxTotal: 0 }
    }

    const maxTotal = Math.max(
      ...orderBook.asks.map((order) => order.total),
      ...orderBook.bids.map((order) => order.total)
    )

    return {
      processedAsks: orderBook.asks.slice(0, 6),
      processedBids: orderBook.bids.slice(0, 6),
      maxTotal,
    }
  }, [orderBook])

  const renderOrderRow = (order: OrderBookEntry, maxTotal: number, type: 'ask' | 'bid') => (
    <div
      key={order.price}
      className="grid grid-cols-3 py-1 text-sm relative"
    >
      <div
        className="absolute inset-0 opacity-10"
        style={{
          background: type === 'ask' ? '#FF5B5B' : '#00C076',
          width: `${(order.total / maxTotal) * 100}%`,
          right: type === 'ask' ? 0 : 'auto',
          left: type === 'ask' ? 'auto' : 0,
        }}
      />
      <span className={`relative z-10 ${type === 'ask' ? 'text-[#FF5B5B]' : 'text-[#00C076]'}`}>
        {formatPriceWithPrecision(order.price, 2)}
      </span>
      <span className="text-right relative z-10">{formatNumber(order.size, { minimumFractionDigits: 4 })}</span>
      <span className="text-right text-gray-400 relative z-10">{formatNumber(order.total, { minimumFractionDigits: 4 })}</span>
    </div>
  )

  if (!selectedPair) {
    return (
      <div className="bg-[#1A1B1E] rounded-lg border border-[#2B2F36] p-4 flex items-center justify-center text-gray-400 h-full">
        Select a trading pair to view order book
      </div>
    )
  }

  return (
    <div className="bg-[#1A1B1E] rounded-lg border border-[#2B2F36] h-full flex flex-col">
      <div className="p-4 border-b border-[#2B2F36] shrink-0">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold">Order Book</h2>
          <div className="flex space-x-2">
            <button
              className={`px-3 py-1 text-xs rounded ${
                displayType === 'both'
                  ? 'bg-[#2B2F36] text-white'
                  : 'text-gray-400 hover:text-white hover:bg-[#2B2F36]'
              }`}
              onClick={() => setDisplayType('both')}
            >
              Both
            </button>
            <button
              className={`px-3 py-1 text-xs rounded ${
                displayType === 'sells'
                  ? 'bg-[#2B2F36] text-white'
                  : 'text-gray-400 hover:text-white hover:bg-[#2B2F36]'
              }`}
              onClick={() => setDisplayType('sells')}
            >
              Sells
            </button>
            <button
              className={`px-3 py-1 text-xs rounded ${
                displayType === 'buys'
                  ? 'bg-[#2B2F36] text-white'
                  : 'text-gray-400 hover:text-white hover:bg-[#2B2F36]'
              }`}
              onClick={() => setDisplayType('buys')}
            >
              Buys
            </button>
          </div>
        </div>
        <div className="grid grid-cols-3 text-xs text-gray-400">
          <div>Price ({selectedPair?.quote})</div>
          <div className="text-right">Amount ({selectedPair?.base})</div>
          <div className="text-right">Total ({selectedPair?.base})</div>
        </div>
      </div>

      <div className="flex-1 min-h-0 flex flex-col">
        {/* 卖单区域 */}
        <div className={`${displayType === 'buys' ? 'hidden' : 'flex-1'} min-h-0 overflow-y-auto p-4 space-y-1`}>
          {processedAsks.map((ask) => renderOrderRow(ask, maxTotal, 'ask'))}
        </div>

        {/* 当前价格区域 */}
        {displayType === 'both' && (
          <div className="px-4 py-2 border-y border-[#2B2F36] bg-[#1D1F23] text-center text-sm shrink-0">
            <span className="text-white font-medium">${formatPriceWithPrecision(selectedPair.lastPrice, 2)}</span>
            <span className={`ml-2 ${
              selectedPair.priceChange24h >= 0 ? 'text-[#00C076]' : 'text-[#FF5B5B]'
            }`}>
              {selectedPair.priceChange24h >= 0 ? '+' : ''}{selectedPair.priceChange24h.toFixed(2)}%
            </span>
          </div>
        )}

        {/* 买单区域 */}
        <div className={`${displayType === 'sells' ? 'hidden' : 'flex-1'} min-h-0 overflow-y-auto p-4 space-y-1`}>
          {processedBids.map((bid) => renderOrderRow(bid, maxTotal, 'bid'))}
        </div>
      </div>
    </div>
  )
}

export default OrderBook
