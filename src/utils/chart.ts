import type { CSSProperties } from "react";

/** Maps a prize amount to its NS&I band colour **/
export function tierColor(amount: number): string {
    if(amount >= 5_000) return '#FFFFFF' // higher band
    if(amount >= 500)   return '#F5C518' // medium band
    return '#A38A0A'
}

/** Returns month indices to use as yearly x-axis ticks **/
export function getYearTicks(data: { month: number }[]): number[] {

    return data
        .filter(d => d.month % 12 === 11)
        .map(d => d.month)

}

/** Shared inline style for all Recharts tooltips **/
export const TOOLTIP_STYLE: CSSProperties = {
    background:     '#161D2B',
    border:         '#1px solid #1E2A3B',
    borderRadius:   8,
    padding:        '10px 14px',
    fontFamily:     'IBM Plex Mono',
    fontSize:       11
}