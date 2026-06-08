import { BarChart, Bar, XAxis, CartesianGrid, Tooltip, ResponsiveContainer, YAxis, ReferenceLine } from "recharts";
import type { AggregatedResults } from "../simulation/types";

interface Props {
    results: AggregatedResults
}

function buildBuckets(values: number[], bucketCount = 40){

    const min = Math.min(...values)
    const max = Math.max(...values)
    const step = (max - min) / bucketCount

    const buckets = Array.from({ length: bucketCount }, (_, i) => ({
        from:   min + i * step,
        to:     min + (i + 1) * step,
        count:  0
    }))

    for (const v of values){
        const i = Math.min(Math.floor((v - min) / step), bucketCount - 1)
        buckets[i].count++
    }

    return buckets.map(b => ({
        label: '£' + Math.round(b.from / 1000) + 'k',
        midpoint: (b.from + b.to) / 2,
        count: b.count
    }))

}

export default function OutcomeHistogram({ results }: Props) {

    const buckets = buildBuckets(results.finalBalances)
    const lastMonth = results.config.durationMonths - 1
    const p50 = results.balancePercentiles[lastMonth].p50
    const comparisonFinal = results.comparisonBalanceByMonth[lastMonth]

    return (
        <div className="bg-surface border border-border rounded-xl p-6 space-y-4 h-full">
            <div>
                <p className="font-mono text-xs text-muted uppercase tracking-widest mb-1">
                    Distribution of Final Balance
                </p>
                <p className="font-mono text-xs text-muted">
                    Each bar is a bucket of outcomes across all simulations.
                </p>
            </div>

            <ResponsiveContainer width="100%" height={280}>
                <BarChart data={buckets} margin={{ top: 10, right: 10, left: 10, bottom: 0}}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1E2A3B" vertical={false} />
                    <XAxis
                        dataKey="label"
                        interval="preserveStartEnd"
                        tick={{ fill: '#94A3B8', fontFamily: 'IBM Plex Mono', fontSize: 11}}
                        axisLine={{ stroke: '#1E2A3B' }}
                        tickLine={false}
                    />
                    <YAxis
                        tick={{ fill: '#94A3B8', fontFamily: 'IBM Plex Mono', fontSize: 11}}
                        axisLine={false}
                        tickLine={false}
                        width={40}
                    />
                    <Tooltip content={<HistTooltip total={results.finalBalances.length} />} />
                    <Bar dataKey="count" fill="#F5C518" fillOpacity={0.7} radius={[2, 2, 0, 0]} />
                    <ReferenceLine
                        x={buckets.reduce((best, b) =>
                        Math.abs(b.midpoint - p50) < Math.abs(best.midpoint - p50) ? b : best).label}
                        stroke='#F5C518'
                        strokeDasharray="4 3"
                        label={{ value: 'median', fill: '#F5C518', fontFamily: 'IBM Plex Mono', fontSize: 10}}
                    />
                    <ReferenceLine
                        x={buckets.reduce((best, b) =>
                        Math.abs(b.midpoint - comparisonFinal) < Math.abs(best.midpoint - comparisonFinal) ? b : best).label}
                        stroke='#22C55E'
                        strokeDasharray="4 3"
                        label={{ value: 'savings', fill: '#22C55E', fontFamily: 'IBM Plex Mono', fontSize: 10}}
                    />
                </BarChart>
            </ResponsiveContainer>
        </div>
    )

}

function HistTooltip({ active, payload, total }: {
    active?: boolean
    payload?: {payload: {label: string; count: number}}[]
    total: number
}){

    if(!active || !payload?.length) return null
    const {label, count} = payload[0].payload
    const pct = ((count / total) * 100).toFixed(1)

    return (
        <div style={{
            background: '#161D2B', border: '1px solid #1E2A3B',
            borderRadius: 8, padding: '10px 14px',
            fontFamily: 'IBM Plex Mono', fontSize: 11
        }}>
            <p style={{ color: '#94A3B8', marginBottom: 4 }}>{label}</p>
            <p style={{ color: '#F5C518' }}>{count} runs ({pct}%)</p>
        </div>
    )

}