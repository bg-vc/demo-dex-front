'use client'

import { Clock, BarChart, ChevronDown, Maximize2 } from 'lucide-react'
import PairSelector from '@/components/features/Trading/PairSelector'
import KLineChart from '@/components/features/Trading/KLineChart'
import { useTradingContext } from '@/contexts/TradingContext'
import TimeframeSelector from '@/components/features/Trading/TimeframeSelector'

const TradingView = () => {
  const { selectedPair } = useTradingContext()

  if (!selectedPair) {
    return (
      <div className="bg-[#1A1B1E] rounded-lg border border-[#2B2F36] h-full flex items-center justify-center">
        <div className="text-gray-500">
          <BarChart className="h-16 w-16 mx-auto mb-4" />
          <p>Select a trading pair to view chart</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-[#1A1B1E] rounded-lg border border-[#2B2F36] h-full flex flex-col">
      {/* 头部控制栏 */}
      <div className="p-4 border-b border-[#2B2F36] flex items-center justify-between shrink-0">
        <div className="flex items-center space-x-4">
          <PairSelector />
          <div className="text-sm">
            <span className="text-white">${selectedPair.lastPrice.toFixed(2)}</span>
            <span className={`ml-2 ${
              selectedPair.priceChange24h >= 0 ? 'text-[#00C076]' : 'text-[#FF5B5B]'
            }`}>
              {selectedPair.priceChange24h >= 0 ? '+' : ''}
              {selectedPair.priceChange24h.toFixed(2)}%
            </span>
          </div>
          <TimeframeSelector />
        </div>
        <div className="flex items-center space-x-2">
          <button className="p-2 hover:bg-[#2B2F36] rounded">
            <Clock className="w-4 h-4 text-gray-400" />
          </button>
          <button className="p-2 hover:bg-[#2B2F36] rounded">
            <BarChart className="w-4 h-4 text-gray-400" />
          </button>
          <button className="p-2 hover:bg-[#2B2F36] rounded">
            <Maximize2 className="w-4 h-4 text-gray-400" />
          </button>
        </div>
      </div>

      {/* 图表区域 */}
      <div className="flex-1 min-h-0 relative">
        <KLineChart />
      </div>
    </div>
  )
}

export default TradingView
