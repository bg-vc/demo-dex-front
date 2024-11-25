'use client'

import { useState, useRef, useEffect } from 'react'
import { Search, Star, ChevronDown } from 'lucide-react'
import { useTradingContext } from '@/contexts/TradingContext'
import { formatPriceWithPrecision } from '@/utils/formatters'

const PairSelector = () => {
  const { tradingPairs, selectedPair, setSelectedPair } = useTradingContext()
  const [searchQuery, setSearchQuery] = useState('')
  const [favorites, setFavorites] = useState<Set<string>>(new Set())
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const filteredPairs = tradingPairs.filter(pair => 
    pair.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
    pair.base.toLowerCase().includes(searchQuery.toLowerCase()) ||
    pair.quote.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const toggleFavorite = (symbol: string, event: React.MouseEvent) => {
    event.stopPropagation()
    setFavorites(prev => {
      const newFavorites = new Set(prev)
      if (newFavorites.has(symbol)) {
        newFavorites.delete(symbol)
      } else {
        newFavorites.add(symbol)
      }
      return newFavorites
    })
  }

  // 处理点击外部关闭
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div ref={containerRef} className="relative">
      {/* 选择器按钮 */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-4 py-2 bg-[#2B2F36] rounded hover:bg-[#3B3F46] transition-colors w-[400px]"
      >
        <div className="flex-1 flex items-center space-x-2">
          <span className="font-medium">{selectedPair?.symbol || 'Select Market'}</span>
          {selectedPair && (
            <span className={`text-sm ${
              selectedPair.priceChange24h >= 0 ? 'text-[#00C076]' : 'text-[#FF5B5B]'
            }`}>
              {selectedPair.priceChange24h >= 0 ? '+' : ''}{selectedPair.priceChange24h.toFixed(2)}%
            </span>
          )}
        </div>
        <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${isOpen ? 'transform rotate-180' : ''}`} />
      </button>

      {/* 下拉面板 */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-[480px] bg-[#1A1B1E] border border-[#2B2F36] rounded-lg shadow-lg z-50">
          <div className="p-4 border-b border-[#2B2F36]">
            <div className="relative">
              <input
                type="text"
                placeholder="Search markets"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#2B2F36] rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#4A4F58]"
              />
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            </div>
          </div>
          
          <div className="max-h-[400px] overflow-y-auto">
            <div className="grid grid-cols-5 px-4 py-2 text-xs text-gray-400 sticky top-0 bg-[#1A1B1E]">
              <span className="col-span-2">Market</span>
              <span className="text-right">Price</span>
              <span className="text-right">24h Change</span>
              <span className="text-right">24h Volume</span>
            </div>

            <div className="px-4 pb-4">
              {filteredPairs.map((pair) => (
                <div
                  key={pair.symbol}
                  className={`grid grid-cols-5 py-2 text-sm border-t border-[#2B2F36] hover:bg-[#2B2F36] transition-colors cursor-pointer ${
                    selectedPair?.symbol === pair.symbol ? 'bg-[#2B2F36]' : ''
                  }`}
                  onClick={() => {
                    setSelectedPair(pair)
                    setIsOpen(false)
                  }}
                >
                  <div className="col-span-2 flex items-center space-x-2">
                    <button
                      onClick={(e) => toggleFavorite(pair.symbol, e)}
                      className="p-1 hover:bg-[#3B3F46] rounded"
                    >
                      <Star
                        className={`h-4 w-4 ${
                          favorites.has(pair.symbol) ? 'text-yellow-400 fill-current' : 'text-gray-400'
                        }`}
                      />
                    </button>
                    <span>{pair.symbol}</span>
                  </div>
                  <span className="text-right">
                    {formatPriceWithPrecision(pair.lastPrice)}
                  </span>
                  <span className={`text-right ${
                    pair.priceChange24h >= 0 ? 'text-[#00C076]' : 'text-[#FF5B5B]'
                  }`}>
                    {pair.priceChange24h >= 0 ? '+' : ''}{pair.priceChange24h.toFixed(2)}%
                  </span>
                  <span className="text-right">
                    {pair.volume24h.toLocaleString(undefined, {
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0,
                    })}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default PairSelector
