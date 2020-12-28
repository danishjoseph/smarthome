import Lgtv from 'lgtv2'
import * as wol from 'wol'
import { mqttClient } from './mqtt'
import { config } from '../config'
let lgtv:any

export const connect = () => {
    let tvConnected:boolean
    let volume:number
    let lastError:any
    mqttClient.subscribe('device/lgtv/#');

    lgtv = new Lgtv({
        url: 'ws://' + config.tv + ':3000'
    });
    lgtv.on('prompt', () => {
        console.info('authorization required');
    });

    lgtv.on('connecting', (host:any) => {
        console.debug('tv trying to connect', host);
    });

    lgtv.on('connect', () => {
        lastError = null;
        tvConnected = true;
        mqttClient.publish('device/lgtv/state', tvConnected ? '1' : '0');
        console.log('tv connected');
        lgtv.subscribe('ssap://audio/getVolume', (err:any, res:any) => {
            if (res.changed.indexOf('volume') !== -1) {
                volume = res.volume
            }
        });
    
    });
    
    lgtv.on('close', () => {
        tvConnected = false;
        mqttClient.publish('device/lgtv/state', tvConnected ? '1' : '0');
        console.info('tv disconnected');
    });
    
    lgtv.on('error', (err:any) => {
        const str = String(err);
        if (str !== lastError) {
            mqttClient.publish('device/lgtv/state', tvConnected ? '1' : '0');
            console.error('tv', str);
        }
        lastError = str;
    });
    
    
     // When a message arrives, process the message
    mqttClient.on('message', function (topic: String, payload: any) {
        payload = String(payload)
        try {
            payload = JSON.parse(payload);
        } catch (err) {

        }
        const parts = topic.split('/');
        switch (parts[2]) {
            case 'OnOff':
                if(payload == 1){
                    wol.wake('30:a9:de:7d:72:4c', () => {
                        mqttClient.publish('device/lgtv/state','true')
                    })
                    break;
                }
                else {
                    lgtv.request('ssap://system/turnOff', { message: "false" });
                    mqttClient.publish('device/lgtv/state', '0');
                    break;
                }
            case 'currentstate':
                mqttClient.publish('device/lgtv/state', tvConnected ? '1' : '0');
                break;
            case 'toast':
                lgtv.request('ssap://system.notifications/createToast', { message: String(payload) });
                break;
            case 'volume':
                lgtv.request('ssap://audio/setVolume', { volume: parseInt(payload) || 15 } );
                break;
            case 'mute':
                if (payload === 'true') {
                    payload = true;
                }
                if (payload === 'false') {
                    payload = false;
                }
                lgtv.request('ssap://audio/setMute', { mute: Boolean(payload) });
                break;
            case 'launch':
                lgtv.request('ssap://system.launcher/launch', { id: String(payload) });
                break;
            case 'youtube':
                lgtv.request('ssap://system.launcher/launch', { id: 'youtube.leanback.v4', contentId: String(payload) });
                break;
            case 'button':
                /*
                 * Buttons that are known to work:
                 *    MUTE, RED, GREEN, YELLOW, BLUE, HOME, MENU, VOLUMEUP, VOLUMEDOWN,
                 *    CC, BACK, UP, DOWN, LEFT, ENTER, DASH, 0-9, EXIT
                 *
                 * Probably also (but I don't have the facility to test them):
                 *    CHANNELUP, CHANNELDOWN
                 */
                sendPointerEvent('button', { name: (String(payload)).toUpperCase() });
                break;

            default:
                break;
        }
    })

}

function sendPointerEvent(type:any, payload:any) {
    lgtv.getSocket(
        'ssap://com.webos.service.networkinput/getPointerInputSocket',
        (err:any, sock:any) => {
            if (!err) {
                sock.send(type, payload);
            }
        }
    );
}
