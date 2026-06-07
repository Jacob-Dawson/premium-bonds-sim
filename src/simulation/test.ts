console.log('script started')

import { runMonteCarlo } from "./monteCarlo";

console.log('imports resolved')

const results = runMonteCarlo({
    initialDeposit: 1000,
    monthlyContribution: 100,
    durationMonths: 12,
    numberOfRuns: 10,
    oddsPerBond: 22000,
    annualPrizeRate: 0.038,
    comparisonInterestRate: 0.045
})

console.log('Median final balance:', results.balancePercentiles[11].p50);
console.log('Median prizes won:', results.totalPrizesWon.sort((a, b) => a - b)[5]);
console.log('Equivalent annual rate:', (results.medianEquivalentRate * 100).toFixed(2) + '%');
