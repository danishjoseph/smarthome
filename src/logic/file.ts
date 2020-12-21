
import fs from 'fs'

export async function getAllDevices() {
    try {
        const devicesJson: string = fs.readFileSync("src/config/db.json", 'utf-8')
        const devices: [any] = JSON.parse(devicesJson)
        if (!devices.length) {
            throw new Error(`User has not added any devices`)
        }
        const devicesWithStatesRemoved = JSON.parse(JSON.stringify(devices))
        devicesWithStatesRemoved.forEach((element: any) => {
            delete element.states
        });
        return devicesWithStatesRemoved
    } catch (error) {
        console.log('error:', error)
    }


}

export async function getDeviceState(id: string) {
    try {
        const devicesJson: string = fs.readFileSync("src/config/db.json", 'utf-8')
        const devices: [any] = JSON.parse(devicesJson)
        const device = devices.reduce((a, e) => {
            if (e.id == id) {
                a = e
                return a
            }
            return null
        }, {})
        if (!device)
            throw new Error(`device id doesn't exist`)
        return device.states
    } catch (error) {
        console.log('error:', error.message)
    }

}

export async function updateDeviceState(id: string, state: boolean) {
    let index: number = 0
    const devicesJson: string = fs.readFileSync("src/config/db.json", 'utf-8')
    const devices: [any] = JSON.parse(devicesJson)
    const device = devices.reduce((a, e, i) => {
        if (e.id == id) {
            a = e
            index = i
            return a
        }
        return null
    }, {})
    if (!device || device.states.on == state)
        return false
    devices[index].states.on = state
    console.log('jsonString:', devices[index].states.on, state, index)
    const jsonString = JSON.stringify(devices, null, 2)
    fs.writeFileSync('src/config/db.json', jsonString)
    return true
}

