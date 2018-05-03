import IServer from "./IServer"

export default interface ICloudProvider {
    startNewWorker: (minCPU: number, minRam: number, name: string) => Promise<boolean>
    listWorkers: () => Promise<IServer[]>
    stopWorker: (serverIdentifier: any) => Promise<boolean>
}