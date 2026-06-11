# Premium Bonds Simulator

A Monte Carlo simulation tool for NS&I Premium Bonds, built as a portfolio project. Run thousands of simulated prize draws to understand the realistic range of outcomes from your investment — and compare against an equivalent savings account.

**[Live demo → (coming soon)]()**

**[Github Link](https://github.com/Jacob-Dawson/premium-bonds-sim.git)**

---

## Overview

Premium Bonds don't pay interest. Instead, every £1 bond is entered into a monthly prize draw with prizes ranging from £25 to £1,000,000. The headline prize rate (currently 3.80%) tells you the expected return across all bondholders, but individual outcomes vary enormously due to the lottery nature of the draw.

This simulator runs up to 10,000 independent simulations of your exact investment scenario and shows you the full distribution of outcomes — not just the expected value.

---

## Features

- **Monte Carlo engine** — runs N simulations in a Web Worker to keep the UI responsive
- **Realistic prize modelling** — weighted sampling from NS&I's July 2026 prize distribution across all 11 tiers
- **Regular contributions** — monthly top-ups with NS&I's £50,000 cap enforced
- **Prize reinvestment** — prizes are reinvested into bonds until the cap is hit, then tracked as cash payouts
- **Savings account comparison** — overlay a fixed-rate savings account on the same timeline
- **Equivalent rate calculator** — back-calculates what fixed interest rate would have matched your median outcome
- **Prize timeline** — explore individual simulated runs month by month, coloured by prize band
- **Real prize log** — record your actual NS&I wins and compare against the simulation distribution
- **July 2026 prize table** — official NS&I draw data available inline

---

## How it works

### Draw simulation

Rather than looping through every eligible bond individually (up to 50,000 iterations per month), the simulator uses a **Poisson approximation**:

`wins ~ Poisson(λ)   where λ = eligibleBonds / oddsPerBond`

For large `n` and small `p`, `Binomial(n, p) ≈ Poisson(λ = n × p)`. At maximum holding (£50,000), `λ ≈ 2.27` — meaning we typically sample 0–4 wins per month rather than running 50,000 Bernoulli trials. This makes 1,000 runs across 60 months fast enough to run in the browser.

### Prize tier sampling

Each win is assigned a prize tier via **weighted random sampling** against NS&I's published prize counts. The weights are taken directly from the July 2026 estimated draw:

| Band | Prizes | Share |
|---|---|---|
| Higher (£5,000–£1,000,000) | 3,121 | 10% of fund |
| Medium (£500–£1,000) | 70,620 | 10% of fund |
| Lower (£25–£100) | 6,261,037 | 80% of fund |

### Aggregation

After all runs complete, per-month percentiles (p10, p25, p50, p75, p90) are computed across the full run set. These drive the confidence band on the balance chart. The median equivalent annual rate is found via binary search over the standard future value formula.

---

## Tech stack

| Layer | Technology |
|---|---|
| Framework | React 18 + TypeScript |
| Build | Vite |
| Styling | Tailwind CSS v4 |
| Charts | Recharts |
| Computation | Web Workers API |
| Fonts | DM Serif Display · IBM Plex Mono · DM Sans |
| Deployment | Netlify |

---

## Getting started

```bash
git clone https://github.com/Jacob-Dawson/premium-bonds-sim.git
cd premium-bonds-sim
npm install
npm run dev
```

---

## Project structure

```
src/
├── simulation/         # Pure TypeScript — no React dependencies
│   ├── types.ts        # All shared interfaces
│   ├── prizeTiers.ts   # NS&I prize distribution + weighted sampler
│   ├── draw.ts         # Single month draw (Poisson approximation)
│   ├── run.ts          # Single simulation run
│   └── monteCarlo.ts   # N-run aggregation + percentile computation
├── worker/
│   └── simulation.worker.ts   # Web Worker wrapper
├── hooks/
│   └── useSimulation.ts       # Worker lifecycle management
├── components/                # React UI components
│   ├── BalanceChart.tsx        # Balance Chart
│   ├── ComparisonChart.tsx     # Comparison Chart
│   ├── ConfigPanel.tsx         # Configuration Panel
│   ├── OutcomeHistogram.tsx    # Histogram of outcomes
│   ├── PrizeDrawTable.tsx      # Prize Draw Table
│   ├── PrizeTimeline.tsx       # Prize Timeline
│   ├── RealPrizeTimeline.tsx   # Your Prizes Timeline
│   ├── ResultsDashboard.tsx    # Results Dashboard
│   ├── StatCard.tsx            # Stats Card
│   └── StatsSummary.tsx        # Summary of Stats
├── utils/
│   ├── chart.ts    # Shared chart utilities
│   └── format.ts   # Number formatting helpers
├── App.tsx   
└── main.tsx       
```

The `simulation/` directory has no React imports and can be tested independently of the UI.

---

## Data sources

Prize distribution and odds sourced from NS&I's official monthly prize allocation page:

> **nsandi.com/get-to-know-us/monthly-prize-allocation**

Figures used are the **estimated July 2026 draw** (odds: 1 in 22,000, prize rate: 3.80%). NS&I updates these monthly — the Market Parameters panel allows manual adjustment.

---

## Limitations & assumptions

- **Eligibility lag** — bonds bought in month M are modelled as eligible from month M+1. NS&I's actual rule is M+2 (bonds must be held for a full calendar month before the following draw). The difference is small but slightly favours the simulated investor.
- **Prize distribution** — tier weights are fixed at July 2026 figures. NS&I adjusts the distribution each month based on total eligible bonds.
- **Comparison rate** — the savings account comparison assumes a fixed AER with monthly compounding and no deposit cap. Real savings accounts have FSCS protection up to £85,000 and variable rates.
- **Tax** — Premium Bonds prizes are tax-free. The equivalent rate shown does not account for income tax on savings interest, which may be payable depending on your Personal Savings Allowance.

---

## Licence

MIT