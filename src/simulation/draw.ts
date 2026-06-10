import type { MonthSnapshot, PrizeEvent } from "./types";
import { samplePrizeTier } from "./prizeTiers";

export const MAX_BALANCE = 50_000;

function samplePoisson(lambda: number): number{
    if(lambda === 0) return 0;
    const L = Math.exp(-lambda);
    let k = 0;
    let p = 1;
    do {
        k++;
        p *= Math.random();
    } while (p > L);
    return k - 1
}

export function runMonthlyDraw(
    month: number,
    eligibleBonds: number,
    balanceBeforeDraw: number,
    oddsPerBond: number
): MonthSnapshot {
    // guard: no bonds in draw or invalid odds - return snapshot with no prizes
    if(eligibleBonds <= 0 || oddsPerBond <= 0){

        return {
            month,
            eligibleBonds,
            balance: balanceBeforeDraw,
            cashPayout: 0,
            prizes: []
        }

    }

    const expectedWins = eligibleBonds / oddsPerBond;
    const numberOfWins = samplePoisson(expectedWins)

    const prizes: PrizeEvent[] = []
    let totalPrizeValue = 0;

    for(let i=0; i < numberOfWins; i++){

        const amount = samplePrizeTier(Math.random())
        prizes.push({month, amount})
        totalPrizeValue += amount

    }

    const availableCapacity = Math.max(0, MAX_BALANCE - balanceBeforeDraw)
    const reinvested = Math.min(totalPrizeValue, availableCapacity)
    const cashPayout = totalPrizeValue - reinvested

    return {
        month,
        eligibleBonds,
        balance: balanceBeforeDraw + reinvested,
        cashPayout,
        prizes
    }

}