import type {
    SimulationConfig,
    SimulationRun,
    DetailedSimulationRun,
    MonthSnapshot
} from './types'
import { runMonthlyDraw, MAX_BALANCE } from './draw'

export function runSimulation(
    config: SimulationConfig,
    detailed: boolean
): SimulationRun | DetailedSimulationRun {
    let currentBalance = config.initialDeposit
    let eligibleBonds = config.initialDeposit

    const balanceByMonth: number[] = []
    const months: MonthSnapshot[] = []
    let totalPrizesWon = 0
    let totalCashPayout = 0

    for(let month = 0; month < config.durationMonths; month++){

        // 1. Run the draw with this month's eligible bonds
        const snapshot = runMonthlyDraw(
            month,
            eligibleBonds,
            currentBalance,
            config.oddsPerBond
        )

        // 2. Accumulate prizer totals
        const monthPrizesTotal = snapshot.prizes.reduce((sum, p) => sum + p.amount, 0)
        totalPrizesWon += monthPrizesTotal
        totalCashPayout += snapshot.cashPayout

        // 3. Add monthly contribution after the draw
        const spaceAvailable = Math.max(0, MAX_BALANCE - snapshot.balance)
        const contribution = Math.min(config.monthlyContribution, spaceAvailable)
        currentBalance = snapshot.balance + contribution

        // 4. 1-month lag: everything in currentBalance is eligible next month
        eligibleBonds = currentBalance

        balanceByMonth.push(currentBalance)
        if(detailed) months.push(snapshot)

    }

    const base: SimulationRun = {
        finalBalance: currentBalance,
        totalPrizesWon,
        totalCashPayout,
        balanceByMonth
    }

    return detailed ? { ...base, months}: base
}