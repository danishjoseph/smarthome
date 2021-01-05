import readline from 'readline'
import * as file from './logic/file'
import { fulfillment as homegraph } from './routes/smarthome';
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

const switchJson = {
    "id": "",
    "type": "action.devices.types.SWITCH",
    "traits": [
        "action.devices.traits.OnOff"
    ],
    "name": {
        "name": "Living Room"
    },
    "roomHint": "",
    "willReportState": true,
    "deviceInfo": {
        "manufacturer": "smart-home-inc",
        "model": "hs1234",
        "hwVersion": "3.2",
        "swVersion": "11.4"
    }
}
const fanJson = {
    "id": "",
    "type": "action.devices.types.FAN",
    "traits": [
      "action.devices.traits.OnOff"
    ],
    "name": {
      "name": "Simple fan"
    },
    "roomHint": "living Room",
    "willReportState": true,
    "states": {
      "online": true,
      "on": false
    },
    "deviceInfo": {
      "hwVersion": "1.0.0",
      "swVersion": "2.0.0",
      "model": "L",
      "manufacturer": "L"
    }
  }
const lightJson = {
    "id": "",
    "type": "action.devices.types.LIGHT",
    "traits": [
        "action.devices.traits.OnOff"
    ],
    "name": {
        "name": "Simple light"
    },
    "roomHint": "living Room",
    "willReportState": true,
    "deviceInfo": {
        "manufacturer": "smart-home-inc",
        "model": "hs1234",
        "hwVersion": "3.2",
        "swVersion": "11.4"
    }
}

const question1 = ()  => {
    return new Promise<string>((resolve, reject)  => {
        rl.question('Which device you need to add ? ( Eg: switch, light, fan )\n', (answer) => {
            resolve(answer)
        })
    })
}

const question2 = ()  => {
    return new Promise<string>((resolve, reject)  => {
        rl.question('Enter a name for the device\n', (answer) => {
            resolve(answer)
        })
    })
}

const question3 = () => {
    return new Promise((resolve, reject) => {
        rl.question('Assign room for device (default: Living Room)\n', (answer) => {
            answer == "" ? resolve("Living Room") :  resolve(answer)
        })
    })
}

const main = async () => {
    let deviceData: any
    const deviceType = await question1()
    const deviceName = await question2()
    const roomHint = await question3()
    console.log('roomHint:', roomHint)
    if (deviceType.trim() == "switch")
        deviceData = switchJson
    else if (deviceType.trim() == "fan")
        deviceData = fanJson
    else
        deviceData = lightJson
    deviceData.id = Math.random().toString(36).substring(7);
    deviceData.name.name = deviceName
    deviceData.roomHint = roomHint
    console.log('roomHint:', roomHint)
    await file.addDevice(deviceData)
    await homegraph.requestSync("1234")
    rl.close()
}
main()