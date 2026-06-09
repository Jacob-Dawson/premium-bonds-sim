import { useState } from 'react'

const DRAW_DATA = {
    month: 'July 2026',
    odds: 22_000,
    totalPrizes: 6_335_778,
    bands: [
        {
            name: 'Higher value',
            share: '10% of prize fund',
            color: 'text-white',
            tiers: [
                { value: 1_000_000, count: 2 },
                { value: 100_000,   count: 84 },
                { value: 50_000,    count: 169 },
                { value: 25_000,    count: 337 },
                { value: 10_000,    count: 844 },
                { value: 5_000,     count: 1_685 }
            ]
        },
        {
            name: 'Medium value',
            share: '10% of prize fund',
            color: 'text-gold',
            tiers: [
                { value: 1_000, count: 17_655 },
                { value: 500,   count: 52_965 }
            ]
        },
        {
            name: 'Lower value',
            share: '80% of prize fund',
            color: 'text-[#A38A0A]',
            tiers: [
                { value: 100,   count: 1_965_639 },
                { value: 50,    count: 1_965_639 },
                { value: 25,    count: 2_330_759 }
            ]
        }
    ]
}

export default function PrizeDrawTable(){

    const [open, setOpen] = useState(false)

    return (
        <div className="bg-surface border border-border rounded-xl overflow-hidden">

            {/* Toggle Header */}
            <button
                onClick={() => setOpen(o => !o)}
                className="w-full flex items-center justify between px-6 py-4 cursor-pointer hover:bg-border transition-colors">
                <div className="flex items-center gap-4">
                    <p className="font-mono text-xs text-muted uppercase tracking-widest">
                        Prize Draw Distribution
                    </p>
                    <p className="font-mono text-xs text-gold">
                        {DRAW_DATA.month}
                    </p>
                    <p className="font-mono text-xs text-gold">
                        Odds: 1 in {DRAW_DATA.odds.toLocaleString('en-GB')}
                        · Total prizes: {DRAW_DATA.totalPrizes.toLocaleString('en-GB')}
                    </p>
                </div>
                <span className="font-mono text-xs text-muted">
                    { open ? ' ▲ hide' : ' ▼ show'}
                </span>
            </button>

            {/* Table */}
            {open && (
                <div className="px-6 pb-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {DRAW_DATA.bands.map(band => (
                            <div key={band.name} className="space-y-3">

                                {/* Band header */}
                                <div className="border-b border-border pb-2">
                                    <p className={`font-mono text-xs font-medium uppercase tracking-wider ${band.color}`}>
                                        {band.name}
                                    </p>
                                    <p className="font-mono text-xs text-muted mt-0.5">
                                        {band.share}
                                    </p>
                                </div>

                                {/* Tiers */}
                                <div className="space-y-1.5">
                                    {band.tiers.map(tier => (
                                        <div key={tier.value} className="flex justify-between items-baseline">
                                            <span className={`font-mono text-sm ${band.color}`}>
                                                £{tier.value.toLocaleString('en-GB')}
                                            </span>
                                            <span className="font-mono text-xs text-muted">
                                                ×{tier.count.toLocaleString('en-GB')}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    <p className="font-mono text-xs text-muted border-t border-border pt-4">
                        Source: NS&I · nsandi.com/get-to-know-us/monthly-prize-allocation · Estimated figures, subject to change.
                    </p>
                </div>

            )}
        </div>
    )

}