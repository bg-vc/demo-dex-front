'use client'

import { useEffect, useState } from 'react'
import { useTradingContext } from '@/contexts/TradingContext'
import { formatNumber, formatPriceWithPrecision } from '@/utils/formatters'
import { ArrowUpRight, ArrowDownRight, X } from 'lucide-react'
import { Position } from '@/types/trading'

const Positions = () => {
  const { selectedPair } = useTradingContext()
  const [positions, setPositions] = useState<Position[]>([])

  useEffect(() => {
    const updatePositions = () => {
      if (!selectedPair) return

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

      const updatedPositions = positionsData.map((data, index) => {
        const entryPrice = selectedPair.lastPrice * (1 + (Math.random() - 0.5) * 0.01)
        const currentPrice = selectedPair.lastPrice * (1 + (Math.random() - 0.5) * 0.005)
        const pnl = data.side === 'long'
          ? (currentPrice - entryPrice) * data.size
          : (entryPrice - currentPrice) * data.size
        const pnlPercentage = data.side === 'long'
          ? ((currentPrice - entryPrice) / entryPrice) * 100
          : ((entryPrice - currentPrice) / currentPrice) * 100

        return {
          id: `position-${index}`,
          pair: data.pair,
          side: data.side,
          size: data.size,
          entryPrice,
          markPrice: currentPrice,
          pnl,
          pnlPercentage,
          leverage: data.leverage,
        }
      })

      setPositions(updatedPositions)
    }

    // Initial update
    updatePositions()

    // Update every 2 seconds
    const interval = setInterval(updatePositions, 2000)

    return () => clearInterval(interval)
  }, [selectedPair])

  return (
    <div className="bg-[#1A1B1E] rounded-lg border border-[#2B2F36]">
      <div className="p-4 border-b border-[#2B2F36]">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold">Positions</h2>
          <div className="flex items-center space-x-4">
            <span className="text-xs text-gray-400">
              Total PnL: {formatNumber(positions.reduce((acc, pos) => acc + pos.pnl, 0), { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD
            </span>
          </div>
        </div>
      </div>

      {positions.length === 0 ? (
        <div className="flex items-center justify-center h-[200px] text-gray-400">
          No open positions
        </div>
      ) : (
        <div className="min-h-0">
          {/* Headers */}
          <div className="grid grid-cols-7 px-4 py-2 text-xs text-gray-400 sticky top-0 bg-[#1A1B1E]">
            <span>Pair</span>
            <span className="text-right">Size</span>
            <span className="text-right">Entry Price</span>
            <span className="text-right">Mark Price</span>
            <span className="text-right">Liq. Price</span>
            <span className="text-right">PnL</span>
            <span className="text-right">Close</span>
          </div>

          {/* Position List */}
          <div className="px-4 pb-4">
            {positions.map((position) => (
              <div
                key={position.id}
                className="grid grid-cols-7 py-3 text-sm border-t border-[#2B2F36] hover:bg-[#2B2F36] transition-colors"
              >
                {/* Pair */}
                <div className="flex items-center space-x-2">
                  <span className={position.side === 'long' ? 'text-[#00C076]' : 'text-[#FF5B5B]'}>
                    {position.side === 'long' ? (
                      <ArrowUpRight className="h-4 w-4 inline" />
                    ) : (
                      <ArrowDownRight className="h-4 w-4 inline" />
                    )}
                  </span>
                  <span>{position.pair}</span>
                </div>

                {/* Size */}
                <span className="text-right">
                  {formatNumber(position.size, { minimumFractionDigits: 4 })}×{position.leverage}
                </span>

                {/* Entry Price */}
                <span className="text-right">
                  {formatPriceWithPrecision(position.entryPrice, 2)}
                </span>

                {/* Mark Price */}
                <span className="text-right">
                  {formatPriceWithPrecision(position.markPrice, 2)}
                </span>

                {/* Liquidation Price */}
                <span className="text-right text-gray-400">
                  {formatPriceWithPrecision(position.entryPrice * (1 + (position.side === 'long' ? -1 : 1) / position.leverage), 2)}
                </span>

                {/* PnL */}
                <div className="text-right">
                  <div className={position.pnl >= 0 ? 'text-[#00C076]' : 'text-[#FF5B5B]'}>
                    {formatNumber(position.pnl, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    <span className="text-xs ml-1">({formatNumber(position.pnlPercentage, { minimumFractionDigits: 2 })}%)</span>
                  </div>
                </div>

                {/* Close Button */}
                <div className="flex justify-end">
                  <button
                    className="p-1 hover:bg-[#2B2F36] rounded transition-colors"
                    onClick={() => {}}
                  >
                    <X className="h-4 w-4 text-gray-400 hover:text-white" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default Positions
