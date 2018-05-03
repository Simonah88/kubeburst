import * as express from "express"
import * as bodyParser from "body-parser"
import redisClient from "./redisClient/redisClient"

let app = express();
app.use(bodyParser.json());
let client = new redisClient({host: "redis-master"})

client.addJob(JSON.parse('{"test":"dsad"}'))

app.get('/healthcheck', (req, res)=>{ res.send("Alive") })

app.post('/job', async (req, res) => {
   let success = await client.addJob(req.body);
   res.statusCode = success ? 201 : 400;
   res.send();
})

app.listen(4000, function(){
  console.log("JobController is Listening on port 4000")
})