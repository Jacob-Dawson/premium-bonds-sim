import type {
    SimulationConfig,
    SimulationRun,
    DetailedSimulationRun,
    AggregatedResults,
    PercentileSnapshot
} from './types'
import { runSimulation } from './run'

const DETAILED_RUN_COUNT = 10

// helpers

function pickPercentile(sorted: number[], p: number): number {
    const index = p * (sorted.length - 1)
    const lower = Math.floor(index)
    const upper = Math.ceil(index)
    if(lower === upper) return sorted[lower]
    return sorted[lower] + (sorted[upper] - sorted[lower]) * (index - lower)
}

function computePercentiles(values: number[]): Omit<PercentileSnapshot, 'month'>{
    const sorted = [...values].sort((a, b) => a - b)
    return {
        p10: pickPercentile(sorted, 0.10),
        p25: pickPercentile(sorted, 0.25),
        p50: pickPercentile(sorted, 0.50),
        p75: pickPercentile(sorted, 0.75),
        p90: pickPercentile(sorted, 0.90)
    }
}

function computeComparisonBalance(config: SimulationConfig): number[]{
    const monthlyRate = Math.pow(1 + config.comparisonInterestRate, 1/12) - 1
    let balance = config.initialDeposit
    const result: number[] = []

    for(let month = 0; month < config.durationMonths; month++){

        balance = balance * (1 + monthlyRate) + config.monthlyContribution
        result.push(balance)

    }

    return result
}

function computeEquivalentAnnualRate(
    initialDeposit: number,
    monthlyContribution: number,
    durationMonths: number,
    targetBalance: number
): number {
    // Guard: no real return above contribution alone
    if(durationMonths <= 0) return 0

    const baseBalance = initialDeposit + monthlyContribution * durationMonths
    if(targetBalance <= baseBalance) return 0

    // Binary search for the monthly rate that produces targetBalance
    let low = 0
    let high = 1

    for(let i = 0; i < 100; i++){

        const mid = (low + high) / 2
        let balance = initialDeposit
        for(let m = 0; m < durationMonths; m++){

            balance = balance * (1 + mid) + monthlyContribution

        }

        if(balance < targetBalance) low = mid
        else high = mid

    }

    const monthlyRate = (low + high) / 2
    return Math.pow(1 + monthlyRate, 12) - 1

}

// main export

export function runMonteCarlo(
    config: SimulationConfig,
    onProgress?: (percent: number) => void // add this
): AggregatedResults {

    if(config.durationMonths <= 0 || config.numberOfRuns <= 0){

        throw new Error('Invalid config: durationMonths and numberOfRuns must be positive')

    }

    const allRuns: SimulationRun[] = [];
    const featuredRuns: DetailedSimulationRun[] = []

    for(let i = 0; i < config.numberOfRuns; i++){

        const detailed = i < DETAILED_RUN_COUNT
        const run = runSimulation(config, detailed)
        if(detailed) featuredRuns.push(run as DetailedSimulationRun)
            allRuns.push(run)

        if(onProgress && i % 50 === 0){

            onProgress(Math.round((i / config.numberOfRuns) * 100))

        }

    }

    // Per-month percentiles across all runs
    const balancePercentiles: PercentileSnapshot[] = Array.from(
        {length: config.durationMonths},
        (_, month) => ({
            month,
            ...computePercentiles(allRuns.map(run => run.balanceByMonth[month]))
        })
    )

    const medianFinalBalance = balancePercentiles[config.durationMonths - 1].p50

    return {
        config,
        balancePercentiles,
        finalBalances: allRuns.map(run => run.finalBalance),
        totalPrizesWon: allRuns.map(run => run.totalPrizesWon),
        featuredRuns,
        comparisonBalanceByMonth: computeComparisonBalance(config),
        medianEquivalentRate: computeEquivalentAnnualRate(
            config.initialDeposit,
            config.monthlyContribution,
            config.durationMonths,
            medianFinalBalance
        )
    }
}