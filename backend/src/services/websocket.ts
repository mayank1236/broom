import { WebSocketServer } from 'ws';
import { createWorker } from "@/services/mediasoup";

const WebsocketConnection = async (wss: WebSocketServer) => {
    try {
        let mediasoupRouter = await createWorker();
    } catch (error) {
        throw error;
    }
    
    wss.on('connection', function connection(ws) {
        ws.on('error', console.error);
    
        ws.on('message', function message(data: any) {
            const message = JSON.parse(data);
            console.log(message)
        });
    
        ws.send('something');
    });
}

export default WebsocketConnection;