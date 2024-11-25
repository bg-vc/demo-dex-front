'use client'

import { useTradingContext } from '@/contexts/TradingContext'
import { TimeFrame } from '@/types/kline'

const timeframeButtons: { label: string; value: TimeFrame }[] = [
  { label: '1m', value: '1m' },
  { label: '5m', value: '5m' },
  { label: '15m', value: '15m' },
  { label: '1h', value: '1h' },
  { label: '4h', value: '4h' },
  { label: '1d', value: '1d' },
  { label: '1w', value: '1w' },
]

export default function TimeframeSelector() {
  const { selectedTimeframe, setSelectedTimeframe } = useTradingContext()

  return (
    <div className="flex items-center space-x-1">
      {timeframeButtons.map(({ label, value }) => (
        <button
          key={value}
          onClick={() => setSelectedTimeframe(value)}
          className={`px-3 py-1 text-xs rounded ${
            selectedTimeframe === value
              ? 'bg-[#00C076] text-white'
              : 'text-gray-400 hover:bg-[#2B2F36]'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  )
}
