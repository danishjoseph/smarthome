import express, { Request, Response } from 'express'
import * as fileData from '../logic/file'

const router = express.Router()

router.get('/get', async (req: Request, res: Response) => {
  const devices = await fileData.getAllDevices()
  res.status(200).send(devices)
})

router.post('/add', async (req: Request, res: Response) => {
  const deviceData = req.body;
  const addDevice = await fileData.addDevice(deviceData)
  if(!addDevice)
    return res.status(500).send("Error in adding device data")
  return res.status(201).send("device creation successfull")
})

export { router as deviceRouter }