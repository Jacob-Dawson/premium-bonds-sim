import { runMonteCarlo } from "../simulation/monteCarlo";
import type { SimulationConfig, AggregatedResults } from "../simulation/types";

// message types

export type WorkerInMessage = {
    type: 'START'
    config: SimulationConfig
}

export type WorkerOutMessage = 
    | { type: 'PROGRESS'; percent: number }
    | { type: 'RESULT'; results: AggregatedResults }
    | { type: 'ERROR'; message: string }

// handler

self.onmessage = (event: MessageEvent<WorkerInMessage>) => {
    
    if(event.data.type !== 'START') return

    try{
        const results = runMonteCarlo(event.data.config, (percent) => {

            const msg: WorkerOutMessage = { type: 'PROGRESS', percent }
            self.postMessage(msg)

        })

        const msg: WorkerOutMessage = { type: 'RESULT', results }
        self.postMessage(msg)

    } catch (error){
        const msg: WorkerOutMessage = {
            type: 'ERROR',
            message: error instanceof Error ? error.message : 'Unknown error'
        }
        self.postMessage(msg)
    }
}