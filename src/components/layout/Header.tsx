'use client'

import { useState } from 'react'
import { Menu, X, ChevronDown, BarChart2, PieChart, ArrowRightLeft, Blocks } from 'lucide-react'
import { Orbitron } from 'next/font/google'
import Image from 'next/image'

const orbitron = Orbitron({ subsets: ['latin'], weight: ['700'] })

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const navigation = [
    { name: 'Trading', icon: BarChart2 },
    { name: 'Market', icon: PieChart },
    { name: 'Transfer', icon: ArrowRightLeft },
  ]

  return (
    <header className="bg-[#1A1B1E] border-b border-[#2B2F36]">
      <div className="container mx-auto px-4">
        <div className="flex h-14 items-center justify-between">
          {/* Left section */}
          <div className="flex items-center">
            <div className="lg:hidden mr-4">
              <button
                type="button"
                className="text-gray-400 hover:text-white"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                <span className="sr-only">Open menu</span>
                {isMenuOpen ? (
                  <X className="h-6 w-6" aria-hidden="true" />
                ) : (
                  <Menu className="h-6 w-6" aria-hidden="true" />
                )}
              </button>
            </div>
            
            <div className="flex items-center">
              <Blocks className="h-8 w-8 text-[#00C076] mr-2" />
              <span className={`${orbitron.className} text-[#00C076] font-bold text-2xl tracking-wider`}>
                BG-DEX
              </span>
            </div>

            <div className="hidden lg:flex lg:ml-8">
              {navigation.map((item) => (
                <a
                  key={item.name}
                  href="#"
                  className="flex items-center text-sm font-medium text-gray-300 hover:text-white mr-8"
                >
                  <item.icon className="h-5 w-5 mr-2" />
                  {item.name}
                </a>
              ))}
            </div>
          </div>

          {/* Right section */}
          <div className="flex items-center -mr-4">
            <button className="flex items-center h-14 px-4 text-sm font-medium text-gray-300 hover:text-white">
              <span>Mainnet</span>
              <ChevronDown className="ml-2 h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <div className={`lg:hidden ${isMenuOpen ? 'block' : 'hidden'}`}>
          <div className="space-y-1 pb-3 pt-2">
            {navigation.map((item) => (
              <a
                key={item.name}
                href="#"
                className="flex items-center text-sm font-medium text-gray-300 hover:text-white py-2"
              >
                <item.icon className="h-5 w-5 mr-2" />
                {item.name}
              </a>
            ))}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
