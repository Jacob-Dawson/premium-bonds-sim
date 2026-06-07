import { useRef, useState, useCallback, useEffect } from 'react'
import type { SimulationConfig, AggregatedResults } from '../simulation/types'
import type { WorkerOutMessage } from '../worker/simulation.worker'

// types

export type SimulationStatus = 'idle' | 'running' | 'complete' | 'error'

interface SimulationState {
    status: SimulationStatus
    progress: number
    results: AggregatedResults | null
    error: string | null
}

const INITIAL_STATE: SimulationState = {
    status: 'idle',
    progress: 0,
    results: null,
    error: null
}

// hook

export function useSimulation(){
    const [state, setState] = useState<SimulationState>(INITIAL_STATE)
    const workerRef = useRef<Worker | null>(null)

    useEffect(() => {
        return () => { workerRef.current?.terminate() }
    }, [])

    const run = useCallback((config: SimulationConfig) => {
        workerRef.current?.terminate()
        setState({ status: 'running', progress: 0, results: null, error: null})

        const worker = new Worker(
            new URL('../worker/simulation.worker.ts', import.meta.url),
            { type: 'module' }
        )
        workerRef.current = worker

        worker.onmessage = (event: MessageEvent<WorkerOutMessage>) => {
            const { data } = event
            switch (data.type) {
                case 'PROGRESS':
                    setState(prev => ({ ...prev, progress: data.percent}))
                    break;
                case 'RESULT':
                    setState({ status: 'complete', progress: 100, results: data.results, error: null})
                    break;
                case 'ERROR':
                    setState({ status: 'error', progress: 0, results: null, error: data.message})
                    break;
            }
        }

        worker.onerror = (event) => {
            setState({
                status: 'error',
                progress: 0,
                results: null,
                error: event.message ?? 'Worker encountered an unexpected error'
            })
        }

        worker.postMessage({ type: 'START', config })

    }, [])

    const cancel = useCallback(() => {
        workerRef.current?.terminate()
        workerRef.current = null
        setState(INITIAL_STATE)
    }, [])

    return {
        status: state.status,
        progress: state.progress,
        results: state.results,
        error: state.error,
        run,
        cancel
    }
}