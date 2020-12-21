import express, { Request, Response } from 'express'
import { Device, IDevice } from '../models/device'

const router = express.Router()

router.get('/get', async (req: Request, res: Response) => {
  const todo = await Device.find({})
  res.status(200).send(todo)
})

router.post('/add', async (req: Request, res: Response) => {
  const deviceData: IDevice = req.body;
  const createdDevice = new Device(deviceData);
  createdDevice.save()
  return res.status(201).send(createdDevice)
})

export { router as deviceRouter }