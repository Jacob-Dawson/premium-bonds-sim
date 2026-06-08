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

    return (
        <div className="space-y-6">
            <p className="font-mono text-xs text-muted uppercase tracking-widest">
                Results - {results.config.numberOfRuns.toLocaleString()} simulations over {results.config.durationMonths / 12} years
            </p>
            <StatsSummary results={results} />
            {/* Charts go here */}
            <BalanceChart results={results} />
            <OutcomeHistogram results={results} />
            <ComparisonChart results={results} />
            <PrizeTimeline results={results} />
        </div>
    )

}