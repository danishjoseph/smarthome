
import { Device, IDevice } from '../models/device'
import { SmartHomeV1SyncDevices } from 'actions-on-google'


export async function getAllDevices() : Promise<SmartHomeV1SyncDevices[]>{
    const devices : IDevice[] = await Device.find({},{ '_id': 0})
    if (!devices) {
      throw new Error(`User has not added any devices`)
    }
    const devicesWithStatesRemoved =  JSON.parse(JSON.stringify(devices))
    devicesWithStatesRemoved.forEach((element:any) => {
      delete element.states
    });
    return devicesWithStatesRemoved
  }

export async function getDeviceState(id:string) {
    const device: IDevice | null = await Device.findOne({id: id})
    if (!device) {
      throw new Error(`device id doesn't exist`)
    }
    return device.states
  }

export async function updateDeviceState(id:string,state:boolean)   {
    const device = await Device.updateOne({id: id}, {$set : { "states.on" : state }})
    if (!device.nModified)
      return false
    return true
  }