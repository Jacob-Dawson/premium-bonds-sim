import { useSimulation } from "./hooks/useSimulation"
import type { SimulationConfig } from "./simulation/types"
import ConfigPanel from './components/ConfigPanel.tsx'
import ResultsDashboard from "./components/ResultsDashboard.tsx"
import { useState } from "react"
import RealPrizeTimeline from './components/RealPrizeTimeline.tsx'
import PrizeDrawTable from "./components/PrizeDrawTable.tsx"

export interface RealPrizeEvent {
  id: string
  month: number
  amount: number
}

const DEFAULT_CONFIG: SimulationConfig = {
  initialDeposit: 1000,
  monthlyContribution: 100,
  durationMonths: 60,
  numberOfRuns: 1000,
  oddsPerBond: 22000,
  annualPrizeRate: 0.038,
  comparisonInterestRate: 0.045
}

export default function App(){

  const { status, progress, results, run, cancel} = useSimulation()
  const [realPrizes, setRealPrizes] = useState<RealPrizeEvent[]>([])

  const addRealPrize = (month: number, amount: number) => {
    setRealPrizes(prev => [...prev, { id: crypto.randomUUID(), month, amount}])
  }

  const removeRealPrize = (id: string) => {
    setRealPrizes(prev => prev.filter(p => p.id !== id))
  }

  return (
    <div className="min-h-screen bg-bg text-text">

      {/* Header */}
      <header className="border-b border-border px-8 py-8">
        <div className="max-w-6xl mx-auto flex items-end justify-between gap-6 flex-wrap">
          <div>
            <p className="font-mono text-xs text-muted uppercase tracking-widest mb-2">
              NS&I Monte Carlo Simulator
            </p>
            <h1 className="font-display text-4xl text-gold leading-tight">
              Premium Bonds
            </h1>
            <p className="font-mono text-xs text-muted mt-2 max-w-sm">
              Run thousands of simulations to understand the realistic range of outcomes from your Premium Bonds investment.
            </p>
          </div>
          <div className="text-right hidden md:block">
            <p className="font-mono text-xs text-muted uppercase tracking-widest mb-1">
              Current odds
            </p>
            <p className="font-mono text-2xl text-text">
              1 in 22,000
            </p>
            <p className="font-mono text-xs text-muted mt-1">
              Prize rate 3.80% · Updated July 2026
            </p>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-6xl mx-auto px-8 py-10 space-y-8">
        <ConfigPanel
          defaultConfig={DEFAULT_CONFIG}
          status={status}
          onRun={run}
          onCancel={cancel}
        />
        <PrizeDrawTable />

        {/* Progress bar */}
        {status === 'running' && (
          <div className="bg-surface border border-border rounded-xl px-6 py-5 space-y-3">
            <div className="flex items-center justify-between">
              <p className="font-mono text-xs text-muted uppercase tracking-widest">
                Running simulation
              </p>
              <p className="font-mono text-xs text-gold">{progress}%</p>
            </div>
            <div className="h-px w-full bg-border rounded-full overflow-hidden">
              <div
                className="h-full bg-gold transition-all duration-300 rounded-full"
                style={{width: `${progress}%`}}
              />
            </div>
            <p className="font-mono text-xs text-muted">
              Calculating {results?.config.numberOfRuns.toLocaleString() ?? '1,000'} Monte Carlo paths across {results?.config.durationMonths ?? 60} months...
            </p>
          </div>
        )}

        {/* Results */}
        {status === 'complete' && results && (
          <ResultsDashboard results={results} />
        )}

        {status === 'error' && (
          <p className="font-mono text-red text-sm">
            Something went wrong. Check the console.
          </p>
        )}

        <RealPrizeTimeline
          prizes={realPrizes}
          onAdd={addRealPrize}
          onRemove={removeRealPrize}
          results={results}
        />
      </main>
    </div>
  )

}