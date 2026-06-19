import {
  AreaChart, Area, Tooltip, ResponsiveContainer,
} from 'recharts'
import type { ResolutionTrend } from '@shared/types/complaints'

interface ResolutionSparklineProps {
  data: ResolutionTrend[]
}

export default function ResolutionSparkline({ data }: ResolutionSparklineProps) {
  return (
    <ResponsiveContainer width="100%" height={48}>
      <AreaChart data={data} margin={{ top: 2, right: 0, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="sparkGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%"  stopColor="#0e9f6e" stopOpacity={0.25} />
            <stop offset="95%" stopColor="#0e9f6e" stopOpacity={0} />
          </linearGradient>
        </defs>
        <Tooltip
          contentStyle={{
            backgroundColor: '#fff',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            fontSize: 12,
          }}
          formatter={(v: number) => [`${v}h`, 'Avg Resolution']}
          labelFormatter={() => ''}
        />
        <Area
          type="monotone"
          dataKey="hours"
          stroke="#0e9f6e"
          strokeWidth={2}
          fill="url(#sparkGrad)"
          dot={false}
          activeDot={{ r: 3, fill: '#0e9f6e' }}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
