import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  Cell, LabelList, ResponsiveContainer,
} from 'recharts'

interface StatusBarChartProps {
  data: { name: string; value: number; fill: string }[]
}

// Custom label above bar
const CustomLabel = ({ x = 0, y = 0, width = 0, value = 0 }) => (
  <text
    x={x + width / 2}
    y={y - 6}
    textAnchor="middle"
    fontSize={12}
    fontWeight={600}
    className="fill-slate-600 dark:fill-slate-300"
  >
    {value.toLocaleString('en-IN')}
  </text>
)

export default function StatusBarChart({ data }: StatusBarChartProps) {
  return (
    <ResponsiveContainer width="100%" height={170}>
      <BarChart data={data} margin={{ top: 22, right: 4, left: -28, bottom: 0 }} barCategoryGap="30%">
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" className="dark:stroke-slate-700" />
        <XAxis
          dataKey="name"
          tick={{ fontSize: 11, fill: '#94a3b8' }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 10, fill: '#94a3b8' }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: 'var(--tt-bg, #ffffff)',
            border: '1px solid #e2e8f0',
            borderRadius: '10px',
            fontSize: 13,
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
          }}
          cursor={{ fill: 'rgba(148,163,184,0.08)' }}
          formatter={(v: number) => [v.toLocaleString('en-IN'), 'Complaints']}
        />
        <Bar dataKey="value" radius={[6, 6, 0, 0]} maxBarSize={60}>
          <LabelList dataKey="value" content={<CustomLabel />} />
          {data.map((entry, i) => (
            <Cell key={i} fill={entry.fill} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
