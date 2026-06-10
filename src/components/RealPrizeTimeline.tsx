import { useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import type { AggregatedResults } from '../simulation/types'
import type { RealPrizeEvent } from '../App'
import { fmtGBP } from '../utils/format'
import { tierColor, getYearTicks, TOOLTIP_STYLE } from '../utils/chart'
import StatCard from './StatCard'

const PRIZE_AMOUNTS = [25, 50, 100, 500, 1000, 5000, 10000, 25000, 50000, 100000, 1000000]

interface Props {
    
    prizes: RealPrizeEvent[]
    onAdd: (month: number, amount: number) => void
    onRemove: (id: string) => void
    results: AggregatedResults | null

}

export default function RealPrizeTimeline({ prizes, onAdd, onRemove, results }: Props){

    const [month, setMonth]     = useState(1)
    const [amount, setAmount]   = useState(25)

    const durationMonths = results?.config.durationMonths ?? 60
    const maxMonth = Math.max(durationMonths, ...prizes.map(p => p.month), 1);

    const chartData = Array.from({ length: maxMonth }, (_,i) => {
        const monthPrizes   = prizes.filter(p => p.month === i + 1)
        const total         = monthPrizes.reduce((sum, p) => sum + p.amount, 0)
        const highestPrize  = monthPrizes.reduce((max, p) => Math.max(max, p.amount), 0)
        return { month: i, total, highestPrize, prizes: monthPrizes }
    })

    const totalWon  = prizes.reduce((sum, p) => sum + p.amount, 0)
    const biggestWin = prizes.reduce((max, p) => Math.max(max, p.amount), 0)

    const simMedianTotal = results
        ? [...results.totalPrizesWon].sort((a, b) => a - b)[
            Math.floor(results.totalPrizesWon.length / 2)
        ]
    : null

    const yearTicks = getYearTicks(chartData)

    return (
        <div className="bg-surface border border-border rounded-xl p-6 space-y-6">
            <div>
                <p className="font-mono text-xs text-muted uppercase tracking-widest mb-1">
                    Your Real Prize Timeline
                </p>
                <p className="font-mono text-xs text-muted">
                    Log your actual Premium Bonds wins to compare against the simulation.
                </p>
            </div>

            {/* Add prize form */}
            <div className="flex gap-3 flex-wrap items-end">
                <div className="space-y-1.5">
                    <label className="block font-mono text-xs text-muted uppercase tracking-wider">
                        Month
                    </label>
                    <div className="flex items-center bg-bg border border-border rounded-lg overflow-hidden focus-within:border-gold transition-colors">
                        <input
                            type="number"
                            min={1}
                            max={maxMonth}
                            value={month}
                            onChange={e => setMonth(parseInt(e.target.value) || 1)}
                            className="input w-24"
                        />
                    </div>
                </div>

                <div className="space-y-1.5">
                    <label className="block font-mono text-xs text-muted uppercase tracking-wider">
                        Prize Amount
                    </label>
                    <div className="flex items-center bg-bg border border-border rounded-lg overflow-hidden focus-within:border-gold transition-colors px-3">
                        <select
                            value={amount}
                            onChange={e => setAmount(Number(e.target.value))}
                            className="bg-transparent font-mono text-sm text-text py-2.5 focus:outline-none cursor-pointer"
                        >
                            {PRIZE_AMOUNTS.map(p => (
                                <option key={p} value={p} style={{ background: '#0D1117'}}>
                                    £{p.toLocaleString('en-GB')}
                                </option>
                            ))}    
                        </select>
                    </div> 
                </div>

                <button
                    onClick={() => onAdd(month, amount)}
                    className="bg-gold text-bg font-mono font-medium text-sm px-6 py-2.5 rounded-lg hover:brightness-110 transition-all cursor-pointer"
                >
                    Add Win →
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3">
                <StatCard label="Total Won"   value={prizes.length > 0 ? fmtGBP(totalWon)        : '—'} />
                <StatCard label="Prize Count" value={prizes.length > 0 ? String(prizes.length)   : '—'} />
                <StatCard label="Biggest Win" value={prizes.length > 0 ? fmtGBP(biggestWin)      : '—'} />
            </div>

            {/* Chart */}
            <ResponsiveContainer width="100%" height={220}>
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 0}}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1E2A3B" vertical={false}/>
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
                    <Tooltip content={<RealTooltip />} />
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

            {/* Prize Log */}
            {prizes.length > 0 && (
                <div className="space-y-2">
                    <p className="font-mono text-xs text-muted uppercase tracking-widest">Prize Log</p>
                    <div className="space-y-1 max-h-40 overflow-y-auto">
                        {[...prizes]
                            .sort((a, b) => a.month - b.month)
                            .map(p => (
                                <div key={p.id}
                                    className="flex items-center justify-between py-1.5 px-3 bg-bg border border-border rounded-lg">
                                    <span className="font-mono text-xs text-muted">Month {p.month}</span>
                                    <span className="font-mono text-xs text-gold">{fmtGBP(p.amount)}</span>
                                    <button
                                        onClick={() => onRemove(p.id)}
                                        className="font-mono text-xs text-muted hover:text-red transition-colors cursor-pointer ml-4"
                                    >
                                        remove
                                    </button>
                                </div>
                            ))}
                    </div>
                </div>
            )}

            {/* vs Simulation */}
            {simMedianTotal !== null && prizes.length > 0 && (
                <div className="border-t border-border pt-4 space-y-3">
                    <p className="font-mono text-xs text-muted uppercase tracking-widest">
                        vs Simulation
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                        <StatCard label="Your Total" value={fmtGBP(totalWon)} />
                        <StatCard
                            label="Simulation Median"
                            value={fmtGBP(simMedianTotal)}
                            color={totalWon >= simMedianTotal ? 'text-green' : 'text-red'}
                        />
                    </div>
                </div>
            )}
        </div>
    )

}

function RealTooltip({ active, payload, label }: {
    active?: boolean
    payload?: { payload: { total: number; prizes: RealPrizeEvent[]}}[]
    label?: number
}) {
    if(!active || !payload?.length || label == null) return null
    const { total, prizes } = payload[0].payload
    if(total === 0) return null

    return (
        <div style={TOOLTIP_STYLE}>
            <p style={{ color: '#94A3B8', marginBottom: 6 }}>Month {(label as number) + 1}</p>
            {prizes.map(p => (
                <p key={p.id} style={{ color: '#F5C518' }}>{fmtGBP(p.amount)}</p>
            ))}
            {prizes.length > 1 && (
                <p style={{ color: '#94A3B8', marginTop: 4, borderTop: '1px solid #1E2A3B', paddingTop: 4}}>
                    Total: {fmtGBP(total)}
                </p>
            )}
        </div>
    )
}