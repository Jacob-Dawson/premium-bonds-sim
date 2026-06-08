import type { AggregatedResults } from "../simulation/types";
import StatsSummary from "./StatsSummary";
import BalanceChart from "./BalanceChart";
import OutcomeHistogram from "./OutcomeHistogram";
import ComparisonChart from "./ComparisonChart";
import PrizeTimeline from "./PrizeTimeline";

interface Props {
    results: AggregatedResults
}

export default function ResultsDashboard({ results }: Props) {

    const { numberOfRuns, durationMonths } = results.config;

    return (
        <div className="space-y-6">
            <p className="font-mono text-xs text-muted uppercase tracking-widest">
                Results - {numberOfRuns.toLocaleString()} simulations over {durationMonths / 12} years
            </p>

            {/* Headline stats */}
            <StatsSummary results={results} />

            {/* Main balance chart - full width */}
            <BalanceChart results={results} />

            {/* Two-column row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <OutcomeHistogram results={results} />
                <ComparisonChart results={results} />
            </div>

            {/* Prize timeline - full width */}
            <PrizeTimeline results={results} />
        </div>
    )

}