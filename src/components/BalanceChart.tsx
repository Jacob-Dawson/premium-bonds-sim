import {
    ComposedChart, 
    Area, 
    Line, 
    XAxis, 
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts'
import type { AggregatedResults } from '../simulation/types'
import { fmtGBPk, fmtGBP } from '../utils/format'

interface Props {
    results: AggregatedResults
}

export default function BalanceChart({ results }: Props){
    
    const chartData = results.balancePercentiles.map((snap, i) => ({
        month:      snap.month,
        bandBottom: snap.p10,
        bandHeight: snap.p90 - snap.p10,
        p50:        snap.p50,
        comparison: results.comparisonBalanceByMonth[i]
    }))

    const yearTicks = chartData
        .filter(d => d.month % 12 === 11)
        .map(d => d.month)

    return (
        <div className="bg-surface border border-border rounded-xl p-6 space-y-4">
            <div>
                <p className="font-mono text-xs text-muted uppercase tracking-widest mb-1">
                    Balance Over Time
                </p>
                <p className="font-mono text-xs text-muted">
                    Shaded band shows p10-p90 range. Dashed line is the savings account comparison.
                </p>
            </div>

            <ResponsiveContainer width="100%" height={320}>
                <ComposedChart data={chartData} margin={{top: 10, right: 10, left: 10, bottom: 0}}>
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
                        tickFormatter={fmtGBPk}
                        tick={{ fill: '#94A3B8', fontFamily: 'IBM Plex Mono', fontSize: 11}}
                        axisLine={false}
                        tickLine={false}
                        width={52}
                    />
                    <Tooltip content={<ChartTooltip comparisonRate={results.config.comparisonInterestRate} />} />

                    {/* Confidence band - stacked so bandHeight sits on top of bandBottom */}
                    <Area type="monotone" dataKey="bandBottom" stackId="band" fill="transparent" stroke="none" legendType="none" />
                    <Area type="monotone" dataKey="bandHeight" stackId="band" fill="#F5C518" fillOpacity={0.08} stroke="none" name="p10-p90 range" />

                    {/* Median */}
                    <Line type="monotone" dataKey="p50" stroke="#F5C518" strokeWidth={2} dot={false} name="Median (p50)" />

                    {/* Savings comparison */}
                    <Line type="monotone" dataKey="comparison" stroke="#22C55E" strokeWidth={1.5} strokeDasharray="5 4" dot={false} name="Savings account" />
                </ComposedChart>
            </ResponsiveContainer>
        </div>
    )
}

function ChartTooltip({ active, payload, label, comparisonRate}: {
    active?: boolean
    payload?: {dataKey: string; value: number}[]
    label?: number
    comparisonRate: number
}) {

    if(!active || !payload?.length || label == null) return null

    const get = (key: string) => payload.find(p => p.dataKey === key)?.value ?? 0
    const fmt = (n: number) => fmtGBP(n)

    const p10 = get('bandBottom')
    const p90 = p10 + get('bandHeight')
    const p50 = get('p50')
    const comp = get('comparison')
    const year = ((label + 1 ) / 12).toFixed(1)

    return (
        <div style={{
            background: '#161D2B',
            border: '1px solid #1E2A3B',
            borderRadius: 8,
            padding: '10px 14px',
            fontFamily: 'IBM Plex Mono',
            fontSize: 11
        }}>
            <p style={{ color: '#94A3B8', marginBottom: 6}}>Year {year}</p>
            <p style={{ color: '#F5C518' }}>Median: {fmt(p50)}</p>
            <p style={{ color: '#94A3B8' }}>Range: {fmt(p10)} - {fmt(p90)}</p>
            <p style={{ color: '#22C55E' }}>
                Savings ({(comparisonRate * 100).toFixed(1)}%): {fmt(comp)}
            </p>
        </div>
    )

}