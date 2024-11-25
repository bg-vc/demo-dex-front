'use client'

import { useEffect, useRef, useState } from 'react'
import { createChart, ColorType, CrosshairMode, IChartApi, ISeriesApi } from 'lightweight-charts'
import { useTradingContext } from '@/contexts/TradingContext'

const KLineChart = () => {
  const chartContainerRef = useRef<HTMLDivElement>(null)
  const chartRef = useRef<IChartApi | null>(null)
  const candlestickSeriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null)
  const volumeSeriesRef = useRef<ISeriesApi<'Histogram'> | null>(null)
  const { selectedPair, selectedTimeframe, klineData } = useTradingContext()
  const [isChartReady, setIsChartReady] = useState(false)

  // 创建图表
  useEffect(() => {
    if (!chartContainerRef.current || chartRef.current) return

    console.log('Creating chart...')
    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: '#1A1B1E' },
        textColor: '#d1d4dc',
        fontSize: 12,
        fontFamily: 'Inter, sans-serif',
      },
      watermark: {
        visible: false,
        color: 'transparent',
      },
      grid: {
        vertLines: { color: '#2B2F36' },
        horzLines: { color: '#2B2F36' },
      },
      overlayPriceScales: {
        borderVisible: false,
      },
      leftPriceScale: {
        visible: false,
        borderVisible: false,
      },
      rightPriceScale: {
        borderColor: '#2B2F36',
        borderVisible: true,
        autoScale: true,
        scaleMargins: {
          top: 0.1,  // 主图顶部边距
          bottom: 0.3,  // 主图底部边距，为成交量预留空间
        },
      },
      timeScale: {
        borderColor: '#2B2F36',
        timeVisible: true,
        secondsVisible: false,
        borderVisible: true,
        fixLeftEdge: true,
        fixRightEdge: true,
        barSpacing: 12,
        minBarSpacing: 8,
        rightOffset: 8,
        tickMarkFormatter: (time) => {
          const date = new Date(time * 1000)
          const hours = date.getHours().toString().padStart(2, '0')
          const minutes = date.getMinutes().toString().padStart(2, '0')
          return `${hours}:${minutes}`
        },
      },
      handleScale: {
        mouseWheel: true,
        pinch: true,
        axisPressedMouseMove: {
          time: true,
          price: true,
        },
      },
      handleScroll: {
        mouseWheel: true,
        pressedMouseMove: true,
        horzTouchDrag: true,
        vertTouchDrag: true,
      },
      crosshair: {
        mode: CrosshairMode.Normal,
        vertLine: {
          color: '#4A4F58',
          width: 1,
          style: 3,
          labelBackgroundColor: '#2B2F36',
        },
        horzLine: {
          color: '#4A4F58',
          width: 1,
          style: 3,
          labelBackgroundColor: '#2B2F36',
        },
      },
    })

    // 设置图表大小
    const handleResize = () => {
      if (chartRef.current && chartContainerRef.current) {
        const { width, height } = chartContainerRef.current.getBoundingClientRect()
        chartRef.current.applyOptions({
          width,
          height: Math.min(height, 550),  // 增加最大高度限制
        })
        chartRef.current.timeScale().fitContent()
      }
    }

    // 初始设置大小
    handleResize()

    // 创建主图蜡烛图
    const candlestickSeries = chart.addCandlestickSeries({
      upColor: '#00C076',
      downColor: '#FF5B5B',
      borderVisible: false,
      wickUpColor: '#00C076',
      wickDownColor: '#FF5B5B',
      priceFormat: {
        type: 'price',
        precision: 2,
        minMove: 0.01,
      },
    })

    // 创建成交量图
    const volumeSeries = chart.addHistogramSeries({
      color: '#26a69a',
      priceFormat: {
        type: 'volume',
      },
      priceScaleId: 'volume',
      scaleMargins: {
        top: 0.7,  // 成交量图顶部边距，与主图分开
        bottom: 0,  // 成交量图底部边距
      },
    })

    // 设置成交量的价格轴
    chart.priceScale('volume').applyOptions({
      scaleMargins: {
        top: 0.7,  // 与上面保持一致
        bottom: 0,
      },
      visible: false,  // 隐藏成交量的价格轴
    })

    chartRef.current = chart
    candlestickSeriesRef.current = candlestickSeries
    volumeSeriesRef.current = volumeSeries
    setIsChartReady(true)

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      if (chartRef.current) {
        chartRef.current.remove()
        chartRef.current = null
        candlestickSeriesRef.current = null
        volumeSeriesRef.current = null
        setIsChartReady(false)
      }
    }
  }, [])

  // 更新数据
  useEffect(() => {
    if (!isChartReady || !selectedPair || !candlestickSeriesRef.current || !volumeSeriesRef.current) {
      return
    }

    const currentKlines = klineData[selectedPair.symbol]?.[selectedTimeframe]
    if (!currentKlines || currentKlines.length === 0) {
      console.log('No kline data available')
      return
    }

    console.log('Setting chart data:', {
      pair: selectedPair.symbol,
      timeframe: selectedTimeframe,
      klines: currentKlines.length
    })

    const candleData = currentKlines.map(kline => ({
      time: Math.floor(kline.timestamp / 1000),
      open: parseFloat(kline.open),
      high: parseFloat(kline.high),
      low: parseFloat(kline.low),
      close: parseFloat(kline.close),
    }))

    const volumeData = currentKlines.map(kline => ({
      time: Math.floor(kline.timestamp / 1000),
      value: parseFloat(kline.volume),
      color: parseFloat(kline.close) >= parseFloat(kline.open) ? '#00C076' : '#FF5B5B',
    }))

    try {
      candlestickSeriesRef.current.setData(candleData)
      volumeSeriesRef.current.setData(volumeData)
      
      // 自适应显示范围
      chartRef.current?.timeScale().fitContent()
      
      // 设置合适的价格范围
      const prices = candleData.map(candle => [candle.high, candle.low]).flat()
      const minPrice = Math.min(...prices)
      const maxPrice = Math.max(...prices)
      const padding = (maxPrice - minPrice) * 0.1

      candlestickSeriesRef.current.applyOptions({
        autoscaleInfoProvider: () => ({
          priceRange: {
            minValue: minPrice - padding,
            maxValue: maxPrice + padding,
          },
        }),
      })
    } catch (error) {
      console.error('Error updating chart:', error)
    }
  }, [isChartReady, selectedPair, selectedTimeframe, klineData])

  return (
    <div 
      ref={chartContainerRef} 
      className="w-full h-full tv-lightweight-charts"
      style={{ position: 'relative' }}
    />
  )
}

export default KLineChart
