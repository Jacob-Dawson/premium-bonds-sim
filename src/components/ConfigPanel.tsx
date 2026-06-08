import { useState } from 'react'
import type { SimulationConfig } from '../simulation/types'
import type { SimulationStatus } from '../hooks/useSimulation'

interface Props {
    defaultConfig: SimulationConfig
    status: SimulationStatus
    onRun: (config: SimulationConfig) => void
    onCancel: () => void
}

interface FormState {
    initialDeposit: string
    monthlyContribution: string
    durationYears: string
    comparisonInterestRate: string
    annualPrizeRate: string
    oddsPerBond: string
    numberOfRuns: string
}

export default function ConfigPanel({ defaultConfig, status, onRun, onCancel}: Props){

    const [form, setForm] = useState<FormState>({
        initialDeposit: String(defaultConfig.initialDeposit),
        monthlyContribution: String(defaultConfig.monthlyContribution),
        durationYears: String(defaultConfig.durationMonths / 12),
        comparisonInterestRate: String((defaultConfig.comparisonInterestRate * 100).toFixed(1)),
        annualPrizeRate: String((defaultConfig.annualPrizeRate * 100).toFixed(2)),
        oddsPerBond: String(defaultConfig.oddsPerBond),
        numberOfRuns: String(defaultConfig.numberOfRuns)
    })

    const isRunning = status === 'running'

    const handleChange = (field: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
        setForm(prev => ({ ...prev, [field]: e.target.value}))

    const handleRun = () => {
        onRun({
            initialDeposit: parseFloat(form.initialDeposit) || 0,
            monthlyContribution: parseFloat(form.monthlyContribution) || 0,
            durationMonths: Math.round((parseFloat(form.durationYears) || 1) * 12),
            comparisonInterestRate: (parseFloat(form.comparisonInterestRate) || 0) / 100,
            annualPrizeRate: (parseFloat(form.annualPrizeRate) || 0) / 100,
            oddsPerBond: parseInt(form.oddsPerBond) || 22000,
            numberOfRuns: parseInt(form.numberOfRuns) || 1000
        })
    }

    return (
        <div className="bg-surface border border-border rounded-xl p-6 space-y-5">

            {/* Your Investment */}
            <section className="space-y-4">
                <p className="font-mono text-xs text-muted uppercase tracking-widest">
                    Your Investment
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Field label="Initial Deposit" prefix="£">
                        <input type="number"    className="input" min={25} max={50000} value={form.initialDeposit} onChange={handleChange('initialDeposit')} disabled={isRunning} />
                    </Field>
                    <Field label="Monthly Contribution" prefix="£">
                        <input type="number" className="input" min={0} max={50000}
                        value={form.monthlyContribution} onChange={handleChange('monthlyContribution')}
                        disabled={isRunning} />
                    </Field>
                    <Field label="Duration" suffix="years">
                        <input type="number" className="input" min={1} max={40}
                        value={form.durationYears} onChange={handleChange('durationYears')}
                        disabled={isRunning}/>
                    </Field>
                </div>
            </section>

            {/* Market Parameters */}
            <section className="space-y-4">
                <p className="font-mono text-xs text-muted uppercase tracking-widest">
                    Market Parameters
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Field label="Prize Rate" suffix="%">
                        <input type="number" className="input" step={0.1}
                        value={form.annualPrizeRate} onChange={handleChange('annualPrizeRate')} disabled={isRunning} />
                    </Field>
                    <Field label="Savings Rate" suffix="%">
                        <input type="number" className="input" step={0.1}
                        value={form.comparisonInterestRate} onChange={handleChange('comparisonInterestRate')} disabled={isRunning} />
                    </Field>
                    <Field label="Bond Odds" prefix="1 in">
                        <input type="number" className="input"
                        value={form.oddsPerBond} onChange={handleChange('oddsPerBond')}
                        disabled={isRunning} />
                    </Field>
                    <Field label="Simulations">
                        <input type="number" className="input" min={100} max={10000} step={100}
                        value={form.numberOfRuns} onChange={handleChange('numberOfRuns')}
                        disabled={isRunning} />
                    </Field>
                </div>
            </section>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
                {isRunning ? (
                    <button onClick={onCancel}
                        className="border border-border text-muted font-mono text-sm px-6 py-3 rounded-lg hover:border-red hover:text-red transition-colors cursor-pointer">
                        Cancel
                    </button>
                ) : (
                    <button onClick={handleRun}
                        className="bg-gold text-bg font-mono font-medium text-sm px-8 py-3 rounded-lg hover:brightness-110 transition-all cursor-pointer">
                        Run Simulation →
                    </button>
                )}
            </div>
        </div>
    )
}

function Field({label, prefix, suffix, children}: {
    label: string
    prefix?: string
    suffix?: string
    children: React.ReactNode
}) {
    return (
        <div className="space-y-1.5">
            <label className="block font-mono text-xs text-muted uppercase tracking-wider">
                {label}
            </label>
            <div className="flex items-center bg-bg border border-border rounded-lg overflow-hidden focus-within:border-gold transition-colors">
                {prefix && (
                    <span className="font-mono text-xs text-muted pl-3 pr-1 select-none">{prefix}</span>
                )}
                {children}
                {suffix && (
                    <span className="font-mono text-xs text-muted pr-3 pl-1 select-none">{suffix}</span>
                )}
            </div>
        </div>
    )
}