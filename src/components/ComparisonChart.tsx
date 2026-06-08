import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine} from 'recharts'
import type { AggregatedResults } from '../simulation/types'
import { fmtDiff, fmtGBPk } from '../utils/format'

interface Props {
    results: AggregatedResults
}

export default function ComparisonChart({ results }: Props) {

    const chartData = results.balancePercentiles.map((snap, i) => ({
        month:      snap.month,
        difference: snap.p50 - results.comparisonBalanceByMonth[i]  
    }))

    const values    = chartData.map(d => d.difference)
    const maxVal    = Math.max(...values)
    const minVal    = Math.min(...values)
    const range     = maxVal - minVal || 1
    const zeroFrac  = maxVal / range
    const zeroPct   = `${Math.min(100, Math.max(0, zeroFrac * 100)).toFixed(1)}%`

    const yearTicks = chartData
        .filter(d => d.month % 12 === 11)
        .map(d => d.month)

    return (
        <div className="bg-surface border border-border rounded-xl p-6 space-y-4 h-full">
            <div>
                <p className="font-mono text-xs text-muted uppercase tracking0-widest mb-1">
                    Premium Bonds vs Savings Account
                </p>
                <p className="font-mono text-xs text-muted">
                    Median Premium Bonds balance minus equivalent savings account. Above zero = Premium Bonds ahead.
                </p>
            </div>

            <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 0}}>
                    <defs>
                        <linearGradient id="diffGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#F5C518" stopOpacity={0.25} />
                            <stop offset={zeroPct} stopColor="#F5C518" stopOpacity={0.05} />
                            <stop offset={zeroPct} stopColor="#EF4444" stopOpacity={0.05} />
                            <stop offset="100%" stopColor="#EF4444" stopOpacity={0.25} />
                        </linearGradient>
                    </defs>

                    <CartesianGrid strokeDasharray="3 3" stroke="#1E2A3B" />
                    <XAxis
                        dataKey="month"
                        ticks={yearTicks}
                        tickFormatter={m => `Y${Math.round((m + 1) / 12)}`}
                        tick={{ fill: '#94A3B8', fontFamily: 'IBM Plex Mono', fontSize: 11}}
                        axisLine={{ stroke: '#1E2A3B'}}
                        tickLine={false}
                    />
                    <YAxis
                        tickFormatter={fmtDiff}
                        tick={{ fill: '#94A3B8', fontFamily: 'IBM Plex Mono', fontSize: 11}}
                        axisLine={false}
                        tickLine={false}
                        width={60}
                    />
                    <Tooltip content={<CompTooltip comparisonRate={results.config.comparisonInterestRate} />} />
                    <ReferenceLine y={0} stroke="#22C55E" strokeDasharray="4 3" label={{ value: `savings (${(results.config.comparisonInterestRate * 100).toFixed(1)}%)`, fill: '#22C55E', fontFamily: 'IBM Plex Mono', fontSize: 10, position: 'insideTopRight' }} />
                    <Area
                        type="monotone"
                        dataKey="difference"
                        stroke="#F5C518"
                        strokeWidth={2}
                        fill="url(#diffGradient)"
                        dot={false}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    )

}

function CompTooltip({ active, payload, label, comparisonRate}: {
    active?: boolean
    payload?: { value: number }[]
    label?: number
    comparisonRate: number
}) {

    if(!active || !payload?.length || label == null) return null
    const diff = payload[0].value
    const year = ((label + 1) / 12).toFixed(1)
    const ahead = diff >= 0

    return (
        <div style={{
            background: '#161D2B', border: '1px solid #1E2A3B', borderRadius: 8, padding: '10px 14px', fontFamily: 'IBM Plex Mono', fontSize: 11
        }}>
            <p style={{ color: '#94A3B8', marginBottom: 4}}>Year {year}</p>
            <p style={{ color: ahead ? '#F5C518' : '#EF4444'}}>
                {ahead ? 'PB ahead by' : 'Savings ahead by'} {fmtGBPk(Math.abs(diff))}
            </p>
            <p style={{ color: '#94A3B8', marginTop: 4}}>
                vs {(comparisonRate * 100).toFixed(1)}% savings rate
            </p>
        </div>
    )

}