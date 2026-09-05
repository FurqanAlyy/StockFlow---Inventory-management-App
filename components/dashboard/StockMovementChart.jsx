'use client'

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from 'recharts'

export default function StockMovementChart({ data }) {
  return (
    <div className="h-80 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="#27272a"
          />

          <XAxis
            dataKey="date"
            tick={{ fill: '#71717a', fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />

          <YAxis
            tick={{ fill: '#71717a', fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />

          <Tooltip
            contentStyle={{
              backgroundColor: '#09090b',
              border: '1px solid #27272a',
              borderRadius: '8px',
              color: '#fff'
            }}
          />

          <Bar
            dataKey="stockIn"
            name="Stock In"
            fill="#10b981"
            radius={[4, 4, 0, 0]}
          />

          <Bar
            dataKey="stockOut"
            name="Stock Out"
            fill="#f97316"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}