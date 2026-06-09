import { useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell} from 'recharts'
import type { AggregatedResults } from '../simulation/types'
import { fmtGBP } from '../utils/format'

interface Props {
    results: AggregatedResults
}

function tierColor(total: number): string {

    if(total >= 5_000) return '#FFFFFF'  // higher band
    if(total >= 500) return '#F5C518'   // medium band
    return '#A38A0A'                    // lower band

}

export default function PrizeTimeline({ results }: Props){

    const [runIndex, setRunIndex] = useState(0)
    const run = results.featuredRuns[runIndex]

    const chartData = run.months.map(snap => ({
        month:          snap.month,
        total:          snap.prizes.reduce((sum, p) => sum + p.amount, 0),
        highestPrize:   snap.prizes.reduce((max, p) => Math.max(max, p.amount), 0), 
        prizes:         snap.prizes
    }))

    const totalWon  = chartData.reduce((sum, d) => sum + d.total, 0)
    const winCount  = chartData.filter(d => d.total > 0).length
    const biggestWin = Math.max(...chartData.map(d => d.total), 0)
    const totalDeposited = run.finalBalance - run.totalPrizesWon + run.totalCashPayout
    const totalValue = run.finalBalance + run.totalCashPayout

    const yearTicks = chartData
        .filter(d => d.month % 12 === 11)
        .map(d => d.month)

    return (
        <div className="bg-surface border border-border rounded-xl p-6 space-y-4">

            {/* Header + run selector */}
            <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                    <p className="font-mono text-xs text-muted uppercase tracking-widest mb-1">
                        Prize Timeline - Single Run
                    </p>
                    <p className="font-mono text-xs text-muted">
                        Each bar is a prize win. Most months will have none.
                    </p>
                </div>
                <div className="flex gap-1 flex-wrap">
                    {results.featuredRuns.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setRunIndex(i)}
                            className={`font-mono text-xs px-2.5 py-1 rounded border transition-colors cursor-pointer ${
                                i === runIndex
                                    ? 'bg-gold text-bg border-gold'
                                    : 'border-border text-muted hover:border-gold hover:text-gold'
                            }`}
                        >
                            {i + 1}
                        </button>
                    ))}
                </div>
            </div>

            {/* Summary stats for this run */}
            <div className="grid grid-cols-3 gap-3">
                {[
                    { label: 'Total Won',   value: fmtGBP(totalWon)},
                    { label: 'Prize Count', value: String(winCount)},
                    { label: 'Biggest Win', value: biggestWin > 0 ? fmtGBP(biggestWin) : '-'}
                ].map(({ label, value }) => (
                    <div key={label} className="bg-bg border  border-border rounded-lg px-4 py-3">
                        <p className="font-mono text-xs text-muted mb-1">{label}</p>
                        <p className="font-mono text-sm text-gold">{value}</p>
                    </div>
                ))}
            </div>

            {/* Chart */}
            <ResponsiveContainer width="100%" height={220}>
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 0}}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1E2A3B" vertical={false} />
                    <XAxis
                        dataKey="month"
                        ticks={yearTicks}
                        tickFormatter={m => `Y${Math.round((m + 1) / 12)}`}
                        tick={{ fill: '#94A3B8', fontFamily: 'IBM Plex Mono', fontSize: 11}}
                        axisLine={{ stroke: '#1E2A3B'}}
                        tickLine={false}
                    />
                    <YAxis
                        tickFormatter={v => v === 0 ? '' : `£${v}`}
                        tick={{ fill: '#94A3B8', fontFamily: 'IBM Plex Mono', fontSize: 11}}
                        axisLine={false}
                        tickLine={false}
                        width={52}
                    />
                    <Tooltip content={<TimelineTooltip />} />
                    <Bar dataKey="total" radius={[2, 2, 0, 0]} minPointSize={2}>
                        {chartData.map((d, i) => (
                            <Cell
                                key={i}
                                fill={d.total > 0 ? tierColor(d.highestPrize) : 'transparent'}
                                fillOpacity={d.total > 0 ? 0.85 : 0}
                            />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
            {/* Legend */}
            <div className="flex gap-6 pt-1">
                {[
                    { color: '#FFFFFF', label: 'Higher band (£5,000+)' },
                    { color: '#F5C518', label: 'Medium band (£500-£1,000)' },
                    { color: '#A38A0A', label: 'Lower band (£25-£100)' }
                ].map(({ color, label }) => (
                    <div key={label} className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: color }} />
                        <span className="font-mono text-xs text-muted">{label}</span>
                    </div>
                ))}
            </div>

            {/* Total section */}
            <div className="border-t border-border pt-4 space-y-3">
                <p className="font-mono text-xs text-muted uppercase tracking-widest">
                    Total
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                        {
                            label: 'Total Deposited',
                            value: fmtGBP(totalDeposited),
                            color: 'text-text'
                        },
                        {
                            label: 'Total Prizes Won',
                            value: fmtGBP(run.totalPrizesWon),
                            color: 'text-gold'
                        },
                        {
                            label: 'Cash Payouts',
                            value: run.totalCashPayout > 0 ? fmtGBP(run.totalCashPayout) : '-',
                            color: 'text-green'
                        },
                        {
                            label: 'Total Value',
                            value: fmtGBP(totalValue),
                            color: 'text-gold'
                        }
                    ].map(({ label, value, color}) => (
                        <div key={label} className="bg-bg border border-border rounded-lg px-4 py-3">
                            <p className="font-mono text-xs text-muted mb-1">{label}</p>
                            <p className={`font-mono text-sm font-medium ${color}`}>{value}</p>
                        </div>              
                    ))}
                </div>
            </div>
        </div>
    )

}

function TimelineTooltip({ active, payload, label }: {
    active?: boolean
    payload?: { payload: { month: number; total: number; prizes: {amount: number}[]}}[]
    label?: number
}) {
    
    if(!active || !payload?.length || label == null) return null
    const { total, prizes } = payload[0].payload
    if(total === 0) return null

    const year = Math.floor(label / 12) + 1
    const month = (label % 12) + 1

    // Group prizes by amount
    const groups = prizes.reduce<Record<number, number>>((acc, p) => {
        acc[p.amount] = (acc[p.amount] ?? 0) + 1
        return acc
    }, {})

    return (
        <div style={{
            background: '#161D2B', border: '1px solid #1E2A3B', borderRadius: 8, padding: '10px 14px', fontFamily: 'IBM Plex Mono', fontSize: 11
        }}>
            <p style={{ color: '#94A3B8', marginBottom: 6}}>
                Year {year}, Month {month}
            </p>
            {Object.entries(groups)
                .sort(([a], [b]) => Number(b) - Number(a))
                .map(([amount, count]) =>
                    <p key={amount} style={{color: '#F5C518'}}>
                        {fmtGBP(Number(amount))}
                        {count > 1 ? ` x ${count}` : ''}
                    </p>
            )}
            <p style={{ color: '#94A3B8', marginTop: 4, borderTop: '1px solid #1E2A3B', paddingTop: 4}}>
                Total: {fmtGBP(total)}
            </p>
        </div>
    )
}