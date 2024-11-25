'use client'

import { useState, useEffect } from 'react'
import { ArrowUpRight, ArrowDownRight } from 'lucide-react'
import { formatNumber, formatPriceWithPrecision } from '@/utils/formatters'
import { useTradingContext } from '@/contexts/TradingContext'
import { format } from 'date-fns'

const RecentTrades = () => {
  const { recentTrades, selectedPair } = useTradingContext()

  if (!selectedPair || !recentTrades) {
    return (
      <div className="bg-[#1A1B1E] rounded-lg border border-[#2B2F36] p-4 flex items-center justify-center text-gray-400">
        Select a trading pair to view recent trades
      </div>
    )
  }

  return (
    <div className="bg-[#1A1B1E] rounded-lg border border-[#2B2F36] h-full flex flex-col">
      <div className="p-4 border-b border-[#2B2F36]">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold">Recent Trades</h2>
          <span className="text-xs text-gray-400">Last 10 trades</span>
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-hidden">
        <div className="px-4 py-2 grid grid-cols-4 text-xs text-gray-400 sticky top-0 bg-[#1A1B1E]">
          <span>Price ({selectedPair.quote})</span>
          <span className="text-right">Amount ({selectedPair.base})</span>
          <span className="text-right">Time</span>
          <span className="text-right">Type</span>
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto px-4 space-y-1">
          {recentTrades.slice(0, 10).map((trade) => (
            <div
              key={trade.id}
              className="grid grid-cols-4 py-1 text-sm border-t border-[#2B2F36] hover:bg-[#2B2F36] transition-colors"
            >
              <div className="flex items-center space-x-1">
                <span className={trade.type === 'buy' ? 'text-[#00C076]' : 'text-[#FF5B5B]'}>
                  {formatPriceWithPrecision(trade.price, 2)}
                </span>
              </div>
              <span className="text-right">
                {formatNumber(trade.amount, { minimumFractionDigits: 4 })}
              </span>
              <span className="text-right text-gray-400">
                {format(new Date(trade.timestamp), 'HH:mm:ss')}
              </span>
              <div className="flex justify-end">
                {trade.type === 'buy' ? (
                  <div className="flex items-center space-x-1 text-[#00C076]">
                    <span>Buy</span>
                    <ArrowUpRight className="h-4 w-4" />
                  </div>
                ) : (
                  <div className="flex items-center space-x-1 text-[#FF5B5B]">
                    <span>Sell</span>
                    <ArrowDownRight className="h-4 w-4" />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default RecentTrades
