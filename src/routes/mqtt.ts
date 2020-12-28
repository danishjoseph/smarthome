import mqtt from 'mqtt'
import { config } from '../config'
import * as deviceLogic from '../logic/file'
import * as smartHome from '../routes/smarthome'


export let mqttClient:any

export function connect(){

    // Connect mqtt with credentials (in case of needed, otherwise we can omit 2nd param)
    mqttClient = mqtt.connect(`mqtt://${config.mqtt_host}`);
    console.log('mqttClient: mha', mqttClient.options.clientId)
    // Connection callback
    mqttClient.on('connect', () => {
       console.info(`mqtt client connected`);
    });

    // mqtt subscriptions
    mqttClient.subscribe("device/+/state");

    mqttClient.on('message', async (topic: String, payload: any) => {
        let splitTopic = topic.split('/')
        switch (splitTopic[2]) {
            case "state":
                const updateMessage = String(payload) ==  "1" ? true : false
                const stateUpdate = await deviceLogic.updateDeviceState(splitTopic[1],updateMessage)
                if(!stateUpdate)
                    break;
                smartHome.reportState(config.userId,splitTopic[1],{ online : true, on : updateMessage})
                break;
            
        
            default:
                break;
        }
       
    })

    mqttClient.on('close', () => {
      console.error(`mqtt client disconnected`);
    });
  }


  // Sends a mqtt message to topic: mytopic
  export async function sendMessage(topic:String,message:String) {
    await mqttClient.publish(topic, message);
    return true
  }