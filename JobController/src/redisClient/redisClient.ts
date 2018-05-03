import * as redis from "redis"
import * as bluebird from "bluebird"

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

interface containerJob {
    metadata: object
    container: string
    inject: object
    capture: string[]
    maxSize: number
    resultsURL: string
  }

export default class redisClient {
    private connected;
    private redisClient;
    //TODO config map
    private QUEUE_NAME = "JOB_QUEUE";

    constructor(options){
        this.connected = false;
        this._setupRedis(options)
    }

    public async addJob(job: JSON): Promise<boolean>{
        if(!this._validJob(job)) return false;
        
        try {
            await this.redisClient.rpushAsync(this.QUEUE_NAME, JSON.stringify(job))
        } catch (e){
            return false;
        }

        return true;
    }

    private _validJob(job: JSON){
        return true;
    }

    private _setupRedis(options){
        this.redisClient = redis.createClient({host: options.host});

        this.redisClient.on("error", err => {
            console.log("Redis Error: " + err);
        })

        this.redisClient.on("ready", ()=> {
            this.connected = true;
            console.log("Redis Ready");
        })

    }
}