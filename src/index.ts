import express from 'express';
import https from 'https';
import fs from 'fs'
import cors from 'cors'
import ip from 'ip'
import { json, urlencoded } from 'body-parser';
import { deviceRouter } from './routes/device'
import { authRouter } from './routes/auth'
import { smartHomeRoute } from './routes/smarthome'
import * as mqtt from './routes/mqtt'
import * as lgtv from './routes/lgtv'   // comment if not using lgtv


const app = express()
const c = cors()
app.use(json(), urlencoded({ extended: true }))
app.set('trust proxy', 1)
app.use(c)
app.use(deviceRouter)
app.use(authRouter)
app.use(smartHomeRoute)


mqtt.connect()
lgtv.connect()

// use your own domain certificates
let certificates = {
  key: fs.readFileSync("src/userfiles/privkey.pem"),
  cert: fs.readFileSync("src/userfiles/cert.pem"),
  ca: fs.readFileSync("src/userfiles/chain.pem")
}

app.listen(3001,() => {
  console.info(`server is listening on ${ip.address()} port 3001 [http] `)
})

https.createServer(certificates, app).listen(3000, () => {
    console.info(`server is listening on ${ip.address()} port 3000 [https]`)
  })