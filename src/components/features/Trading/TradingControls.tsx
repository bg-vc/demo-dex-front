'use client'

import { useState, useEffect } from 'react'
import { useTradingContext } from '@/contexts/TradingContext'
import { formatNumber, formatPriceWithPrecision } from '@/utils/formatters'

const LEVERAGE_OPTIONS = [1, 2, 3, 5, 10, 25, 50, 100]

const TradingControls = () => {
  const { selectedPair } = useTradingContext()
  const [orderType, setOrderType] = useState('market')
  const [amount, setAmount] = useState('')
  const [price, setPrice] = useState('')
  const [leverage, setLeverage] = useState(1)
  const [total, setTotal] = useState('')
  const [isBuySelected, setIsBuySelected] = useState(true)

  useEffect(() => {
    if (selectedPair?.lastPrice && amount) {
      const calculatedTotal = parseFloat(amount) * selectedPair.lastPrice
      setTotal(calculatedTotal.toFixed(2))
    }
  }, [amount, selectedPair?.lastPrice])

  useEffect(() => {
    if (selectedPair?.lastPrice) {
      setPrice(selectedPair.lastPrice.toFixed(2))
    }
  }, [selectedPair?.lastPrice])

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setAmount(value)
    if (selectedPair?.lastPrice && value) {
      const calculatedTotal = parseFloat(value) * selectedPair.lastPrice
      setTotal(calculatedTotal.toFixed(2))
    } else {
      setTotal('')
    }
  }

  const handleTotalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setTotal(value)
    if (selectedPair?.lastPrice && value) {
      const calculatedAmount = parseFloat(value) / selectedPair.lastPrice
      setAmount(calculatedAmount.toFixed(8))
    } else {
      setAmount('')
    }
  }

  const handlePercentageClick = (percentage: number) => {
    // TODO: Calculate based on available balance
    const maxAmount = 1.0 // This should be replaced with actual available balance
    const newAmount = (maxAmount * percentage).toFixed(8)
    setAmount(newAmount)
    if (selectedPair?.lastPrice) {
      const calculatedTotal = parseFloat(newAmount) * selectedPair.lastPrice
      setTotal(calculatedTotal.toFixed(2))
    }
  }

  const handleOrder = (type: 'buy' | 'sell') => {
    if (!selectedPair || !amount || (orderType === 'limit' && !price)) {
      return
    }

    console.log({
      type,
      orderType,
      amount,
      price: orderType === 'market' ? selectedPair.lastPrice : parseFloat(price),
      leverage,
      pair: selectedPair.id,
      total: parseFloat(total)
    })
  }

  if (!selectedPair) {
    return (
      <div className="bg-[#1A1B1E] rounded-lg border border-[#2B2F36] p-4 flex items-center justify-center text-gray-400">
        Select a trading pair to place orders
      </div>
    )
  }

  const inputClasses = "w-full bg-[#2B2F36] rounded px-3 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#00C076] transition-colors"

  return (
    <div className="bg-[#1A1B1E] rounded-lg border border-[#2B2F36]">
      <div className="p-4 border-b border-[#2B2F36]">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold">Place Order</h2>
          <div className="flex space-x-2">
            <button
              onClick={() => setOrderType('limit')}
              className={`px-3 py-1 text-xs rounded transition-colors ${
                orderType === 'limit'
                  ? isBuySelected ? 'bg-[#00C076] text-white' : 'bg-[#FF5B5B] text-white'
                  : 'text-gray-400 hover:text-white hover:bg-[#2B2F36]'
              }`}
            >
              Limit
            </button>
            <button
              onClick={() => setOrderType('market')}
              className={`px-3 py-1 text-xs rounded transition-colors ${
                orderType === 'market'
                  ? isBuySelected ? 'bg-[#00C076] text-white' : 'bg-[#FF5B5B] text-white'
                  : 'text-gray-400 hover:text-white hover:bg-[#2B2F36]'
              }`}
            >
              Market
            </button>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Price Input */}
        {orderType === 'limit' && (
          <div className="space-y-2">
            <label className="block text-xs text-gray-400">
              Price ({selectedPair.quote})
            </label>
            <div className="relative">
              <input
                type="number"
                className={inputClasses}
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="0.00"
                min="0"
                step="0.01"
              />
            </div>
          </div>
        )}

        {/* Amount Input */}
        <div className="space-y-2">
          <label className="block text-xs text-gray-400">
            Amount ({selectedPair.base})
          </label>
          <div className="relative">
            <input
              type="number"
              className={inputClasses}
              value={amount}
              onChange={handleAmountChange}
              placeholder="0.00"
              min="0"
              step="0.00000001"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex space-x-1">
              <button
                className="text-xs text-gray-400 hover:text-white transition-colors"
                onClick={() => handlePercentageClick(0.25)}
              >
                25%
              </button>
              <button
                className="text-xs text-gray-400 hover:text-white transition-colors"
                onClick={() => handlePercentageClick(0.5)}
              >
                50%
              </button>
              <button
                className="text-xs text-gray-400 hover:text-white transition-colors"
                onClick={() => handlePercentageClick(0.75)}
              >
                75%
              </button>
              <button
                className="text-xs text-gray-400 hover:text-white transition-colors"
                onClick={() => handlePercentageClick(1)}
              >
                100%
              </button>
            </div>
          </div>
        </div>

        {/* Total */}
        <div className="space-y-2">
          <label className="block text-xs text-gray-400">
            Total ({selectedPair.quote})
          </label>
          <div className="relative">
            <input
              type="number"
              className={inputClasses}
              value={total}
              onChange={handleTotalChange}
              placeholder="0.00"
              min="0"
              step="0.01"
            />
          </div>
        </div>

        {/* Leverage Selector */}
        <div className="space-y-2">
          <label className="block text-xs text-gray-400">Leverage</label>
          <div className="flex flex-wrap gap-2">
            {LEVERAGE_OPTIONS.map((option) => (
              <button
                key={option}
                onClick={() => setLeverage(option)}
                className={`px-3 py-1 text-xs rounded transition-colors ${
                  leverage === option
                    ? isBuySelected ? 'bg-[#00C076] text-white' : 'bg-[#FF5B5B] text-white'
                    : 'bg-[#2B2F36] text-gray-400 hover:text-white'
                }`}
              >
                {option}x
              </button>
            ))}
          </div>
        </div>

        {/* Buy/Sell Buttons */}
        <div className="grid grid-cols-2 gap-2">
          <button
            className="w-full bg-[#132E1E] hover:bg-[#00C076] text-[#00C076] hover:text-white py-3 rounded text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => {
              setIsBuySelected(true)
              handleOrder('buy')
            }}
            disabled={!amount || (orderType === 'limit' && !price)}
          >
            Buy {selectedPair.base}
          </button>
          <button
            className="w-full bg-[#3D1E28] hover:bg-[#FF5B5B] text-[#FF5B5B] hover:text-white py-3 rounded text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => {
              setIsBuySelected(false)
              handleOrder('sell')
            }}
            disabled={!amount || (orderType === 'limit' && !price)}
          >
            Sell {selectedPair.base}
          </button>
        </div>
      </div>
    </div>
  )
}

export default TradingControls
