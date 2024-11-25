'use client'

import { TradingProvider } from '@/contexts/TradingContext'
import PairSelector from '@/components/features/Trading/PairSelector'
import KLineChart from '@/components/features/Trading/KLineChart'
import OrderBook from '@/components/features/Trading/OrderBook'
import RecentTrades from '@/components/features/Trading/RecentTrades'
import TimeframeSelector from '@/components/features/Trading/TimeframeSelector'

export default function TradingPage() {
  return (
    <TradingProvider>
      <div className="flex flex-col h-screen bg-[#141518] text-white">
        <main className="flex-1 p-4 min-h-0">
          <div className="grid grid-cols-12 gap-4 h-full">
            {/* 左侧 - 交易对选择器和K线图 */}
            <div className="col-span-9 flex flex-col space-y-4">
              <div className="h-16 flex justify-between items-center">
                <PairSelector />
                <TimeframeSelector />
              </div>
              <div className="flex-1 min-h-0 h-[calc(100vh-12rem)]">
                <KLineChart />
              </div>
            </div>

            {/* 右侧 - 订单簿和最近成交 */}
            <div className="col-span-3 flex flex-col space-y-4">
              <div className="flex-1 min-h-0">
                <OrderBook />
              </div>
              <div className="flex-1 min-h-0">
                <RecentTrades />
              </div>
            </div>
          </div>
        </main>
      </div>
    </TradingProvider>
  )
}
