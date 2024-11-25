'use client'

import { TradingProvider } from '@/contexts/TradingContext'
import Header from '@/components/layout/Header'
import TradingView from '@/components/layout/TradingView'
import OrderBook from '@/components/features/Trading/OrderBook'
import RecentTrades from '@/components/features/Trading/RecentTrades'
import MarketData from '@/components/features/Trading/MarketData'
import TradingControls from '@/components/features/Trading/TradingControls'

export default function Home() {
  return (
    <TradingProvider>
      <div className="flex flex-col h-screen bg-[#141518] text-white">
        {/* 顶部导航栏 */}
        <Header />

        <main className="flex-1 min-h-0">
          <div className="container mx-auto px-4 py-4 h-full">
            {/* 市场数据概览 */}
            <div className="mb-4">
              <MarketData />
            </div>

            <div className="grid grid-cols-12 gap-4 h-full">
              {/* 左侧 - 交易区域 */}
              <div className="col-span-9 flex flex-col gap-4">
                {/* K线图 */}
                <div className="h-[600px]">
                  <TradingView />
                </div>

                {/* 最近成交 */}
                <div>
                  <RecentTrades />
                </div>
              </div>

              {/* 右侧 - 交易控制和订单信息 */}
              <div className="col-span-3 flex flex-col gap-4">
                {/* 交易控制 */}
                <div>
                  <TradingControls />
                </div>

                {/* 订单簿 */}
                <div>
                  <OrderBook />
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </TradingProvider>
  )
}
