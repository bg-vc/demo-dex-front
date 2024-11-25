'use client'

import { TrendingUp, TrendingDown, Clock, DollarSign, BarChart2 } from 'lucide-react'
import { useTradingContext } from '@/contexts/TradingContext'

const MarketData = () => {
  const { selectedPair } = useTradingContext()

  if (!selectedPair) {
    return (
      <div className="bg-[#1A1B1E] rounded-lg border border-[#2B2F36] p-4 flex items-center justify-center text-gray-400">
        Select a trading pair to view market data
      </div>
    )
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000000) {
      return `$${(num / 1000000000).toFixed(1)}B`
    }
    if (num >= 1000000) {
      return `$${(num / 1000000).toFixed(1)}M`
    }
    return `$${num.toLocaleString()}`
  }

  return (
    <div className="bg-[#1A1B1E] rounded-lg border border-[#2B2F36]">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 p-4">
        {/* Price */}
        <div>
          <div className="text-sm text-gray-400 mb-1">Price</div>
          <div className="flex items-center">
            <span className="text-white font-medium">${selectedPair.lastPrice.toFixed(2)}</span>
            <span className={`ml-2 flex items-center text-sm ${selectedPair.priceChange24h >= 0 ? 'text-[#00C076]' : 'text-[#FF5B5B]'}`}>
              {selectedPair.priceChange24h >= 0 ? (
                <TrendingUp className="h-4 w-4 mr-1" />
              ) : (
                <TrendingDown className="h-4 w-4 mr-1" />
              )}
              {Math.abs(selectedPair.priceChange24h)}%
            </span>
          </div>
        </div>

        {/* 24h High */}
        <div>
          <div className="text-sm text-gray-400 mb-1">24h High</div>
          <div className="text-white font-medium">
            ${selectedPair.high24h.toFixed(2)}
          </div>
        </div>

        {/* 24h Low */}
        <div>
          <div className="text-sm text-gray-400 mb-1">24h Low</div>
          <div className="text-white font-medium">
            ${selectedPair.low24h.toFixed(2)}
          </div>
        </div>

        {/* 24h Volume */}
        <div>
          <div className="text-sm text-gray-400 mb-1">24h Volume</div>
          <div className="text-white font-medium">
            {formatNumber(selectedPair.volume24h)}
          </div>
        </div>

        {/* Market Cap */}
        <div>
          <div className="text-sm text-gray-400 mb-1">Market Cap</div>
          <div className="text-white font-medium">
            {formatNumber(selectedPair.marketCap)}
          </div>
        </div>

        {/* Price Change */}
        <div>
          <div className="text-sm text-gray-400 mb-1">24h Change</div>
          <div className={`font-medium ${selectedPair.priceChange24h >= 0 ? 'text-[#00C076]' : 'text-[#FF5B5B]'}`}>
            {selectedPair.priceChange24h >= 0 ? '+' : ''}{selectedPair.priceChange24h}%
          </div>
        </div>
      </div>
    </div>
  )
}

export default MarketData
