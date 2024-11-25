'use client'

import { useState } from 'react'
import { useTradingContext } from '@/contexts/TradingContext'
import { formatNumber, formatPriceWithPrecision } from '@/utils/formatters'
import { OrderBookEntry } from '@/types/trading'

const OrderBook = () => {
  const { selectedPair, orderBook } = useTradingContext()
  const [inverted, setInverted] = useState<boolean>(false)

  // Calculate max total for both asks and bids
  const maxTotal = Math.max(
    Math.max(...(orderBook?.asks?.map(entry => entry.total) || [0])),
    Math.max(...(orderBook?.bids?.map(entry => entry.total) || [0]))
  )

  const renderOrderBookEntry = (entry: OrderBookEntry, isAsk: boolean) => {
    const percentageTotal = (entry.total / maxTotal) * 100

    return (
      <div key={entry.price} className="grid grid-cols-3 py-1 text-sm relative">
        <div
          className={`absolute top-0 bottom-0 ${isAsk ? 'bg-[#FF5B5B]' : 'bg-[#00C076]'} opacity-10`}
          style={{
            width: `${percentageTotal}%`,
            right: isAsk ? 0 : 'auto',
            left: isAsk ? 'auto' : 0,
          }}
        />
        <div className={`text-left relative z-10 ${isAsk ? 'text-[#FF5B5B]' : 'text-[#00C076]'}`}>
          {formatPriceWithPrecision(entry.price)}
        </div>
        <div className="text-center relative z-10">{formatNumber(entry.size)}</div>
        <div className="text-right relative z-10">{formatNumber(entry.total)}</div>
      </div>
    )
  }

  if (!selectedPair || !orderBook) {
    return (
      <div className="bg-[#1A1B1E] rounded-lg border border-[#2B2F36] p-4 flex items-center justify-center text-gray-400">
        Select a trading pair to view order book
      </div>
    )
  }

  return (
    <div className="bg-[#1A1B1E] rounded-lg border border-[#2B2F36]">
      {/* Header */}
      <div className="p-4 border-b border-[#2B2F36]">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold">Order Book</h2>
          <button
            onClick={() => setInverted(!inverted)}
            className="text-xs text-gray-400 hover:text-white"
          >
            {inverted ? 'Normal' : 'Inverted'}
          </button>
        </div>
      </div>

      {/* Column Headers */}
      <div className="grid grid-cols-3 px-4 py-2 text-xs text-gray-400">
        <div className="text-left">Price ({selectedPair.quote})</div>
        <div className="text-center">Size ({selectedPair.base})</div>
        <div className="text-right">Total ({selectedPair.base})</div>
      </div>

      {/* Order Book Content */}
      <div className="min-h-0">
        {/* Sells */}
        <div className="px-4 py-1">
          {inverted 
            ? orderBook.bids.slice(0, 10).map(entry => renderOrderBookEntry(entry, false))
            : orderBook.asks.slice(0, 10).map(entry => renderOrderBookEntry(entry, true))
          }
        </div>

        {/* Spread */}
        {orderBook.asks[0] && orderBook.bids[0] && (
          <div className="px-4 py-1 text-xs text-gray-400 border-y border-[#2B2F36]">
            <div className="text-center">
              Spread: {formatNumber(orderBook.asks[0].price - orderBook.bids[0].price)} (
              {formatNumber(
                ((orderBook.asks[0].price - orderBook.bids[0].price) /
                  orderBook.bids[0].price) *
                  100,
                { minimumFractionDigits: 2, maximumFractionDigits: 2 }
              )}
              %)
            </div>
          </div>
        )}

        {/* Buys */}
        <div className="px-4 py-1">
          {inverted
            ? orderBook.asks.slice(0, 10).map(entry => renderOrderBookEntry(entry, true))
            : orderBook.bids.slice(0, 10).map(entry => renderOrderBookEntry(entry, false))
          }
        </div>
      </div>
    </div>
  )
}

export default OrderBook
