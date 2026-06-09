import type { PrizeTier } from "./types";

const PRIZE_TIERS: PrizeTier[] = [
    { value: 1_000_000, weight: 2 },
    { value: 100_000,   weight: 84 },
    { value: 50_000,    weight: 169 },
    { value: 25_000,    weight: 337 },
    { value: 10_000,    weight: 844 },
    { value: 5_000,     weight: 1_685 },
    { value: 1_000,     weight: 17_655 },
    { value: 500,       weight: 52_965 },
    { value: 100,       weight: 1_965_639 },
    { value: 50,        weight: 1_695_639 },
    { value: 25,        weight: 2_330_759 }
];

const TOTAL_WEIGHT = PRIZE_TIERS.reduce((sum, tier) => sum + tier.weight, 0)

export function samplePrizeTier(random: number): number{
    let remaining = random * TOTAL_WEIGHT;
    for(const tier of PRIZE_TIERS){
        remaining -= tier.weight;
        if(remaining < 0) return tier.value
    }
    return 25; // fallback - should never be reached
}