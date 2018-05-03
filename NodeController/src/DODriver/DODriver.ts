import ICloudProvider from "../Interfaces/ICloudProvider";
import IServer from "../Interfaces/IServer"
import DigitalOcean from 'dots-wrapper';


export default class DODriver implements ICloudProvider {
    docloud: DigitalOcean

    constructor(apiToken: string) {
        this.docloud = new DigitalOcean(apiToken)
    }

    public startNewWorker(minCPU: number, minRam: number, name: string): Promise<boolean> {
        return new Promise((resolve, reject) => {
            this.docloud.Droplet.create({
                name: name,
                region: "tor1",
                image: 33973811,
                size: "s-1vcpu-1gb",
                ssh_keys: ["20394369"],
                tags: ["kubeburst-worker"]
            }).subscribe(() => { resolve(true), reject(false) })

        })
    }

    public listWorkers(): Promise<IServer[]> {
        return new Promise((resolve, reject) => {
            this.docloud.Droplet.list("kubeburst-worker", 0, 999).subscribe(
                droplets => {
                    let iservers = droplets.items.map((droplet => { 
                        return {k8sName: droplet.name, deleteIdentifier: droplet.id} 
                    }))

                    resolve(iservers)
                },
                err => { reject(err) }
            )
        })
    }

    public stopWorker(serverIdentifier: any): Promise<boolean> {
        return new Promise((resolve, reject) => {

        })
    }
}