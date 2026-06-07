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
    month: number;
    amount: number;
}

export interface MonthSnapshot{
    month: number;
    eligibleBonds: number;
    balace: number;
    cashPayout: number;
    prizes: PrizeEvent[];
}