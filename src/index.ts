import express from 'express';
import https from 'https';
import fs from 'fs'
import cors from 'cors'
import mongoose from 'mongoose'
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

  
  mongoose.connect('mongodb://localhost:27017/test-todo', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true
})


mqtt.connect()
lgtv.connect()

// use your own domain certificates
let certificates = {
  key: fs.readFileSync("src/config/privkey.pem"),
  cert: fs.readFileSync("src/config/cert.pem"),
  ca: fs.readFileSync("src/config/chain.pem")
}

app.listen(3001,() => {
  console.info('server is listening on port [http] 3001')
})

https.createServer(certificates, app).listen(3000, () => {
    console.info('server is listening on port [https] 3000')
  })