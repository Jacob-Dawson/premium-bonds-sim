import { useSimulation } from "./hooks/useSimulation"
import type { SimulationConfig } from "./simulation/types"
import ConfigPanel from './components/ConfigPanel.tsx'

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

  return (
    <div className="min-h-screen bg-bg text-text">

      {/* Header */}
      <header className="border-b border-border px-8 py-6">
        <p className="font-mono text-xs text-muted uppercase tracking-widest mb-1">
          NS&I Monte Carlo
        </p>
        <h1 className="font-display text-gold text-3xl">
          Premium Bonds Simulator
        </h1>
      </header>

      {/* Header */}
      <main className="max-w-6xl mx-auto px-8 py-10 space-y-10">
        <ConfigPanel
          defaultConfig={DEFAULT_CONFIG}
          status={status}
          onRun={run}
          onCancel={cancel}
        />

        {/* Progress bar */}
        {status === 'running' && (
          <div className="space-y-2">
            <p className="font-mono text-xs text-muted">
              Running simulation... {progress}%
            </p>
            <div className="h-1 w-full bg-surface rounded-full overflow-hidden">
              <div
                className="h-full bg-gold transition-all duration-300"
                style={{width: `${progress}%`}}
              />
            </div>
          </div>
        )}

        {/* Results placeholder */}
        {status === 'complete' && results && (
          <p className="font-mono text-green text-sm">
            Simulation complete - results coming soon
          </p>
        )}

        {status === 'error' && (
          <p className="font-mono text-red text-sm">
            Something went wrong. Check the console.
          </p>
        )}
      </main>
    </div>
  )

}