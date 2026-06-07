import type { PrizeTier } from "./types";

const PRIZE_TIERS: PrizeTier[] = [
    { value: 1_000_000, weight: 2 },
    { value: 100_000,   weight: 78 },
    { value: 50_000,    weight: 156 },
    { value: 25_000,    weight: 313 },
    { value: 10_000,    weight: 782 },
    { value: 5_000,     weight: 1_563 },
    { value: 1_000,     weight: 16_424 },
    { value: 500,       weight: 49_272 },
    { value: 100,       weight: 1_746_689 },
    { value: 50,        weight: 1_746_689 },
    { value: 25,        weight: 2_659_353 }
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