export const formatNumber = (num: number, options?: {
  minimumFractionDigits?: number
  maximumFractionDigits?: number
  notation?: 'standard' | 'compact'
}) => {
  if (typeof num !== 'number' || isNaN(num)) {
    return '0'
  }

  const {
    minimumFractionDigits = 2,
    maximumFractionDigits = 2,
    notation = 'standard'
  } = options || {}

  // Ensure fraction digits are within valid range (0-20)
  const safeMinFractionDigits = Math.max(0, Math.min(20, minimumFractionDigits))
  const safeMaxFractionDigits = Math.max(
    safeMinFractionDigits,
    Math.min(20, maximumFractionDigits)
  )

  try {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: safeMinFractionDigits,
      maximumFractionDigits: safeMaxFractionDigits,
      notation,
    }).format(num)
  } catch (error) {
    console.error('Error formatting number:', error)
    return num.toString()
  }
}

export const formatCurrency = (num: number, options?: {
  currency?: string
  minimumFractionDigits?: number
  maximumFractionDigits?: number
  notation?: 'standard' | 'compact'
}) => {
  if (typeof num !== 'number' || isNaN(num)) {
    return '$0'
  }

  const {
    currency = 'USD',
    minimumFractionDigits = 2,
    maximumFractionDigits = 2,
    notation = 'standard'
  } = options || {}

  // Ensure fraction digits are within valid range (0-20)
  const safeMinFractionDigits = Math.max(0, Math.min(20, minimumFractionDigits))
  const safeMaxFractionDigits = Math.max(
    safeMinFractionDigits,
    Math.min(20, maximumFractionDigits)
  )

  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: safeMinFractionDigits,
      maximumFractionDigits: safeMaxFractionDigits,
      notation,
    }).format(num)
  } catch (error) {
    console.error('Error formatting currency:', error)
    return `$${num}`
  }
}

export const formatCompactNumber = (num: number) => {
  if (typeof num !== 'number' || isNaN(num)) {
    return '0'
  }

  try {
    return new Intl.NumberFormat('en-US', {
      notation: 'compact',
      maximumFractionDigits: 1,
    }).format(num)
  } catch (error) {
    console.error('Error formatting compact number:', error)
    return num.toString()
  }
}

export const formatPercentage = (num: number, options?: {
  minimumFractionDigits?: number
  maximumFractionDigits?: number
  alwaysShowSign?: boolean
}) => {
  if (typeof num !== 'number' || isNaN(num)) {
    return '0%'
  }

  const {
    minimumFractionDigits = 2,
    maximumFractionDigits = 2,
    alwaysShowSign = false
  } = options || {}

  // Ensure fraction digits are within valid range (0-20)
  const safeMinFractionDigits = Math.max(0, Math.min(20, minimumFractionDigits))
  const safeMaxFractionDigits = Math.max(
    safeMinFractionDigits,
    Math.min(20, maximumFractionDigits)
  )

  try {
    const formatted = new Intl.NumberFormat('en-US', {
      style: 'percent',
      minimumFractionDigits: safeMinFractionDigits,
      maximumFractionDigits: safeMaxFractionDigits,
    }).format(num / 100)

    return alwaysShowSign && num > 0 ? `+${formatted}` : formatted
  } catch (error) {
    console.error('Error formatting percentage:', error)
    return `${num}%`
  }
}

export const formatPriceWithPrecision = (price: number, precision: number = 2) => {
  if (typeof price !== 'number' || isNaN(price)) {
    return '0'
  }

  const safePrecision = Math.max(0, Math.min(20, precision))
  
  try {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: safePrecision,
      maximumFractionDigits: safePrecision,
    }).format(price)
  } catch (error) {
    console.error('Error formatting price:', error)
    return price.toFixed(safePrecision)
  }
}

export const abbreviateAddress = (
  address: string,
  startLength: number = 6,
  endLength: number = 4
) => {
  if (!address) return ''
  if (address.length <= startLength + endLength) return address

  return `${address.slice(0, startLength)}...${address.slice(-endLength)}`
}
