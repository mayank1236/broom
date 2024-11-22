import { WebSocket, WebSocketServer } from 'ws';
import { createWorker } from "@/services/mediasoup";
import { Router } from 'mediasoup/node/lib/types';

let mediasoupRouter: Router;

const WebsocketConnection = async (wss: WebSocketServer) => {
    try {
        mediasoupRouter = await createWorker();
    } catch (error) {
        throw error;
    }
    
    wss.on('connection', function connection(ws) {
        ws.on('error', console.error);
    
        ws.on('message', function message(data: any) {
            const jsonValidation = IsJsonString(data);
            if (!jsonValidation) {
                console.error("json error");
                return
            }

            const event = JSON.parse(data);

            switch(event.type) {
                case 'getRouterRtpCapabilities':
                    onRouterRtpCapabilities(event, ws);
                    break;
                default:
                    break;
            }
        });
    });

    const onRouterRtpCapabilities = (event: string, ws: WebSocket) => {
        send(ws, "routerCapabilities", mediasoupRouter.rtpCapabilities)
    }

    const IsJsonString = (str: string) => {
        try {
            JSON.parse(str);
        } catch (error) {
            return false;
        }
        return true;
    }

    const send = (ws: WebSocket, type: string, msg: any) => {
        const message = {
            type,
            data: msg
        }

        const resp = JSON.stringify(message);
        ws.send(resp);
    }
}

export default WebsocketConnection;