// Smart home imports
import { smarthome, SmartHomeV1ExecuteResponseCommands, Headers } from 'actions-on-google'
import express from 'express'
import * as devicedb from '../logic/file'
import { sendMessage, mqttClient } from './mqtt'
import {config} from '../config'

const router = express.Router()

const userId = config.userId
let jwt
try {
    jwt = require("../userfiles/smart-home-key.json")
} catch (e) {
    console.warn('Service account key is not found')
    console.warn('Report state and Request sync will be unavailable')
}

const app = smarthome({
    jwt,
    debug: true,
})
// Array could be of any type
// tslint:disable-next-line
async function asyncForEach(array: any[], callback: Function) {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array)
    }
}


export async function reportState(agentUserId: string, deviceId: string, states: any) {
    console.log(`Reporting state payload for ${deviceId}`, states)
    // Report state back to Homegraph
    // Do state name replacement for ColorSetting trait
    // See https://developers.google.com/assistant/smarthome/traits/colorsetting#device-states
    if (states.color && typeof states.color.spectrumRgb === 'number') {
        states.color.spectrumRGB = states.color.spectrumRgb
        delete states.color.spectrumRgb
    }

    return await app.reportState({
        agentUserId,
        requestId: Math.random().toString(),
        payload: {
            devices: {
                states: {
                    [deviceId]: states,
                },
            },
        },
    })
}

app.onSync(async (body, headers) => {
    const devices = await devicedb.getAllDevices()
    return {
        requestId: body.requestId,
        payload: {
            agentUserId: userId,
            devices: devices,
        },
    }
})

interface DeviceStatesMap {
    // tslint:disable-next-line
    [key: string]: any
}

app.onQuery(async (body, headers) => {
    const deviceStates: DeviceStatesMap = {}
    const { devices } = body.inputs[0].payload
    await asyncForEach(devices, async (device: { id: string }) => {
        try {
            const states = await devicedb.getDeviceState(device.id)
            deviceStates[device.id] = {
                ...states,
                status: 'SUCCESS',
            }
        } catch (e) {
            console.error(e)
            deviceStates[device.id] = {
                status: 'ERROR',
                errorCode: 'deviceOffline',
            }
        }
    })

    return {
        requestId: body.requestId,
        payload: {
            devices: deviceStates,
        },
    }
})

app.onExecute(async (body, headers) => {
    const commands: SmartHomeV1ExecuteResponseCommands[] = []
    const successCommand: SmartHomeV1ExecuteResponseCommands = {
        ids: [],
        status: 'SUCCESS',
        states: {},
    }
    const { devices, execution } = body.inputs[0].payload.commands[0]
    await asyncForEach(devices, async (device: { id: string }) => {
        try {
            let states: any
            switch (execution[0].command) {
                case "action.devices.commands.OnOff":
                    const message = execution[0].params.on == true ? "1" : "0"
                    await sendMessage(`device/${device.id}/OnOff`, message);  //change topic to OnOff
                    break;
                case "action.devices.commands.appSelect":
                    await sendMessage("device/lgtv/launch", String(execution[0].params.newApplication));
                    break;
                case "action.devices.commands.mute":
                    await sendMessage("device/lgtv/mute", String(execution[0].params.mute));
                    break;
                case "action.devices.commands.setVolume":
                    await sendMessage("device/lgtv/volume", String(execution[0].params.volumeLevel));
                    break;
                default:
                    break;
            }
            const boolValue = execution[0].params.on
            states = { on: boolValue, online: true }
            successCommand.ids.push(device.id)
            successCommand.states = states
        } catch (e) {
            console.error(e)
            if (e.message === 'pinNeeded') {
                commands.push({
                    ids: [device.id],
                    status: 'ERROR',
                    errorCode: 'challengeNeeded',
                    challengeNeeded: {
                        type: 'pinNeeded',
                    },
                })
                return
            } else if (e.message === 'challengeFailedPinNeeded') {
                commands.push({
                    ids: [device.id],
                    status: 'ERROR',
                    errorCode: 'challengeNeeded',
                    challengeNeeded: {
                        type: 'challengeFailedPinNeeded',
                    },
                })
                return
            } else if (e.message === 'ackNeeded') {
                commands.push({
                    ids: [device.id],
                    status: 'ERROR',
                    errorCode: 'challengeNeeded',
                    challengeNeeded: {
                        type: 'ackNeeded',
                    },
                })
                return
            } else if (e.message === 'PENDING') {
                commands.push({
                    ids: [device.id],
                    status: 'PENDING',
                })
                return
            }
            commands.push({
                ids: [device.id],
                status: 'ERROR',
                errorCode: e.message,
            })
        }
    })

    if (successCommand.ids.length) {
        commands.push(successCommand)
    }

    return {
        requestId: body.requestId,
        payload: {
            commands,
        },
    }
})

app.onDisconnect(async (body, headers) => {
    return
})

router.post('/smarthome', app)

export { router as smartHomeRoute }