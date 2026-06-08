// £x,xxx
export const fmtGBP = (n: number): string =>
    '£' + Math.round(n).toLocaleString('en-GB')

// £x.xk - for chart axes
export const fmtGBPk = (n: number): string => {
    if(n >= 1000) return `£${(n / 1000).toFixed(0)}k`
    return `£${Math.round(n)}`
}

// +£x,xxx or -£x,xxx
export const fmtDiff = (n: number): string => {
    const abs = fmtGBPk(Math.abs(n))
    return n >= 0 ? `+${abs}` : `-${abs}`
}

// x.xx%
export const fmtPct = (n: number, dp = 2): string =>
    (n * 100).toFixed(dp) + '%'