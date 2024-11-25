# BG-DEX 项目创建指南

## 1. 创建项目
```bash
# 1.1 创建项目目录
mkdir -p /Users/vincecfl/Documents/BuildWithAI/bg-dex-front
cd /Users/vincecfl/Documents/BuildWithAI/bg-dex-front

# 1.2 使用 create-next-app 创建项目
npx create-next-app@latest . --typescript --tailwind --eslint
# 在交互提示中选择：
# ✔ Would you like to use App Router? Yes
# ✔ Would you like to customize the default import alias (@/*)? Yes
```

## 2. 安装依赖
```bash
# 2.1 安装核心依赖
npm install next@14 react react-dom

# 2.2 安装开发依赖
npm install -D typescript @types/react @types/node @types/react-dom

# 2.3 安装样式相关依赖
npm install -D tailwindcss postcss autoprefixer

# 2.4 安装图表相关依赖
npm install lightweight-charts

# 2.5 安装图标库
npm install lucide-react
```

## 3. 配置文件设置

### 3.1 next.config.js
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
}

module.exports = nextConfig
```

### 3.2 tailwind.config.js
```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#00C076',
        secondary: '#FF5B5B',
        background: '#141518',
        surface: '#1A1B1E',
        border: '#2B2F36',
      },
    },
  },
  plugins: [],
}
```

### 3.3 tsconfig.json
```json
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

## 4. 项目结构
```
src/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
│   ├── layout/
│   │   ├── Header.tsx
│   │   └── TradingView.tsx
│   └── features/
│       └── Trading/
│           ├── KLineChart.tsx
│           ├── MarketData.tsx
│           ├── OrderBook.tsx
│           ├── PairSelector.tsx
│           ├── Positions.tsx
│           ├── RecentTrades.tsx
│           ├── TimeframeSelector.tsx
│           └── TradingControls.tsx
├── contexts/
│   └── TradingContext.tsx
└── utils/
    └── formatters.ts
```

## 5. 运行项目
```bash
# 5.1 进入项目目录
cd /Users/vincecfl/Documents/BuildWithAI/bg-dex-front

# 5.2 安装依赖（如果是新克隆的项目）
npm install

# 5.3 启动开发服务器
npm run dev
```

## 6. 访问项目
- 开发环境：`http://localhost:3000`
- 主要功能：
  - K线图表显示
  - 交易对选择
  - 订单簿显示
  - 最近成交
  - 限价/市价下单
  - 持仓信息

## 7. 构建生产版本
```bash
# 7.1 构建项目
npm run build

# 7.2 运行生产版本
npm run start
```

## 8. 其他命令
```bash
# 代码检查
npm run lint

# 类型检查
npx tsc --noEmit
```

## 技术栈
- Next.js 14（React 框架）
- TypeScript（类型安全）
- Tailwind CSS（样式）
- Lightweight Charts（图表库）
- Lucide React（图标）

## 主题颜色
- 主色：绿色 (#00C076)
- 警告色：红色 (#FF5B5B)
- 背景色：深色 (#141518)
- 表面色：稍浅 (#1A1B1E)
- 边框色：灰色 (#2B2F36)

## 创作者
- BG-VC (Creator & Lead Developer)
- Cascade AI (AI Pair Programming Assistant)
