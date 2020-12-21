import mongoose from 'mongoose'

interface IDevice extends mongoose.Document {
  id:  string,
  type: string,
  traits: [string],
  name: { name :string, defaultNames: [string], swVersion: string, nicknames: [string] },
  willReportState: boolean,
  roomHint : string ,
  states: { online : boolean, on : boolean}, 
  attributes:  undefined, 
  otherDeviceIds: undefined, 
  customData: undefined,
}

const Name = new mongoose.Schema({
  defaultNames: { type: [String] ,default: undefined },
  name: { type: String, required: true },
  nicknames: { type: [String], default: undefined  },
}, {_id : false})

const DeviceInfo = new mongoose.Schema({
  hwVersion: { type: String, default: '1.0.0' },
  swVersion: { type: String, default: '1.0.0' },
  model: { type: String, default: '111' },
  manufacturer: { type: String, required: true },
}, {_id : false})

const deviceSchema = new mongoose.Schema({
  id: { type: String, required: true, unique : true},
  type: { type: String, required: true },
  traits: { type: [String], required: true },
  name: { type: Name, required: true },
  willReportState: { type: Boolean, required: true },
  states: { type: { online : Boolean, on : Boolean}, required: true },
  attributes: mongoose.Schema.Types.Mixed,
  roomHint : { type : String },
  deviceInfo:{ type: DeviceInfo, required: true },
  otherDeviceIds:{ type: String, default: undefined },
  customData: {  type: String, default: undefined },
},{ versionKey: false })


const Device = mongoose.model<IDevice>('Device', deviceSchema);


export { Device, IDevice }




