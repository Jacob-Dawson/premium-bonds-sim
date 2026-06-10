interface Props {
    label: string
    value: string
    color?: string
}

export default function StatCard({ label, value, color = 'text-gold' }: Props){

    return (
        <div className="bg-bg border border-border rounded-lg px-4 py-3">
            <p className="font-mono text-xs text-muted mb-1">{label}</p>
            <p className={`font-mono text-sm font-medium ${color}`}>{value}</p>
        </div>
    )

}