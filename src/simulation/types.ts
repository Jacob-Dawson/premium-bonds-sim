export interface SimulationConfig {
    initialDeposit: number;
    monthlyContribution: number;
    durationMonths: number;
    numberOfRuns: number;
    oddsPerBond: number;
    annualPrizeRate: number;
    comparisonInterestRate: number;
}

export interface PrizeTier {
    value: number;
    weight: number;
}

export interface PrizeEvent{
    month: number;  // which month it occured (0-indexed)
    amount: number; // prize value in £
}

export interface MonthSnapshot{
    month: number;
    eligibleBonds: number;  // bonds entered in this month's draw
    balance: number;         // total bond value at the end of the month, after reinvestments
    cashPayout: number;     // prize money that couldn't be reinvested (£50k cap)
    prizes: PrizeEvent[];   // all prizes won this month
}

export interface SimulationRun {
    finalBalance: number;       // bond value at end of simulation
    totalPrizesWon: number;     // total prize money won across all months
    totalCashPayout: number;    // portion paid out in cash (cap was hit)
    balanceByMonth: number[];   // balance at end of each month, length = durationMonths
}

export interface DetailedSimulationRun extends SimulationRun{
    months: MonthSnapshot[];    // full snapshot per month, including prize events
}

export interface PercentileSnapshot {
    month: number;
    p10: number;
    p25: number;
    p50: number; // median
    p75: number;
    p90: number;
}

export interface AggregatedResults{
    config: SimulationConfig;
    balancePercentiles: PercentileSnapshot[];   // one per month - drives the balance chart
    finalBalances: number[];                    // all 1000 final balances - drives the histogram
    totalPrizesWon: number[];                   // all 1000 total prize values - also for histogram
    featuredRuns: DetailedSimulationRun[];      // 10 full runs - drives the prize timeline
    comparisonBalanceByMonth: number[];         // savings account equivalent - drives comparison chart
    medianEquivalentRate: number;               // "you effectively earned X% annually" stat
}