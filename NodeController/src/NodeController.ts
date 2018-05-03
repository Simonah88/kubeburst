import * as redis from "redis"
import * as k8s from "@kubernetes/client-node"
import * as bluebird from "bluebird"
import DODriver from "./DODriver/DODriver"
import ICloudProvider from "./Interfaces/ICloudProvider"
import * as uuid from "node-uuid"
const fs = require("fs")

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

//TODO move to configmap along with redis queue name
const maxWorkers = 3;
const watchInterval = 10000;

const redisClient: any = redis.createClient({host: "redis-master"});
const cloudProvider: ICloudProvider = new DODriver(process.env.DO_API_KEY)

redisClient.on("error", err => {
    console.log("Redis Error: " + err);
})
redisClient.on("ready", ()=> {
    setInterval(watchLoop, watchInterval);
})

async function watchLoop(){
    console.log("NodeController::watchLoop Running");
    try{
        const outstandingJobs = await redisClient.llenAsync("JOB_QUEUE");
        console.log("NodeController::wachLoop outstanding jobs: " + outstandingJobs);
        const workers = await cloudProvider.listWorkers();
        console.log("NodeController::watchLoop workers: " + JSON.stringify(workers))
        const numWorkers = workers.length;

        if(outstandingJobs > workers && numWorkers < maxWorkers){
            console.log("NodeController::watchLoop Creating Worker");
            await cloudProvider.startNewWorker(1, 1, "kubeburst-worker-" + uuid.v1())
            console.log("NodeController::watchLoop Worker Created");
        }

    } catch(e){
        console.log("Error: " + e);
    }
}
