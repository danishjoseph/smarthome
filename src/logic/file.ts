
import fs from 'fs'


export async function addDevice(device:any) {
    try {
        const devicesJson: string = fs.readFileSync("src/db.json", 'utf-8')
        const devices: [any] = JSON.parse(devicesJson)
        devices.push(device)
        const jsonString = JSON.stringify(devices, null, 2)
        fs.writeFileSync('src/db.json', jsonString)
        return true
    } catch (error) {
        console.error('error:', error.message)
    }


}

export async function getAllDevices() {
    try {
        const devicesJson: string = fs.readFileSync("src/db.json", 'utf-8')
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
        console.error('error: getAllDevices() ', error.message)
    }


}

export async function getDeviceState(id: string) {
    try {
        const devicesJson: string = fs.readFileSync("src/db.json", 'utf-8')
        const devices: [any] = JSON.parse(devicesJson)
        const device = devices.find(e => e.id == id )
        if (!device)
            throw new Error(`device id doesn't exist`)
        return device.states
    } catch (error) {
        console.error('error:', error.message)
    }

}

export async function updateDeviceState(id: string, state: boolean) {
    const devicesJson: string = fs.readFileSync("src/db.json", 'utf-8')
    const devices: [any] = JSON.parse(devicesJson)
    const index = devices.findIndex((e) =>  e.id == id)
    if (index == -1 || devices[index].states.on == state)
        return false
    devices[index].states.on = state
    const jsonString = JSON.stringify(devices, null, 2)
    fs.writeFileSync('src/db.json', jsonString)
    return true
}

