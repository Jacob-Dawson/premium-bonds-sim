import type { AggregatedResults } from "../simulation/types";
import { fmtGBP, fmtPct } from "../utils/format";

interface Props {
    results: AggregatedResults
}

export default function StatsSummary({results}: Props) {
    const lastMonth = results.config.durationMonths - 1
    const p50 = results.balancePercentiles[lastMonth].p50
    const p10 = results.balancePercentiles[lastMonth].p10
    const p90 = results.balancePercentiles[lastMonth].p90

    const medianPrizes = [...results.totalPrizesWon].sort((a, b) => a - b)[Math.floor(results.totalPrizesWon.length / 2)]

    const comparisonFinal = results.comparisonBalanceByMonth[results.config.durationMonths - 1]

    const beatSavings = results.finalBalances.filter(b => b > comparisonFinal).length / results.finalBalances.length

    const stats = [
        {
            label: 'Median Final Balance',
            value: fmtGBP(p50),
            sub: `p10 ${fmtGBP(p10)} - p90 ${fmtGBP(p90)}`,
            accent: 'text-gold'
        },
        {
            label: 'Median Prizes Won',
            value: fmtGBP(medianPrizes),
            sub: `over ${results.config.durationMonths / 12} years`,
            accent: 'text-green'
        },
        {
            label: 'Equivalent Annual Rate',
            value: fmtPct(results.medianEquivalentRate),
            sub: `vs ${fmtPct(results.config.comparisonInterestRate)} savings rate`,
            accent: results.medianEquivalentRate >= results.config.comparisonInterestRate
                ? 'text-green'
                : 'text-red'
        },
        {
            label: 'Beat Savings Account',
            value: fmtPct(beatSavings),
            sub: 'of simulated runs',
            accent: beatSavings >= 0.5 ? 'text-green' : 'text-red'
        }
    ]

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map(({ label, value, sub, accent}) => (
                <div key={label} className="bg-surface border border-border rounded-xl p-5 space-y-2">
                    <p className="font-mono text-xs text-muted uppercase tracking-wider">
                        {label}
                    </p>
                    <p className={`font-mono text-2xl font-medium ${accent}`}>
                        {value}
                    </p>
                    <p className="font-mono text-xs text-muted">
                        {sub}
                    </p>
                </div>
            ))}
        </div>
    )
}