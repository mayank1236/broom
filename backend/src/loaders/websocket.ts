import { Server, WebSocketServer } from "ws";

export default async ({ server }: {server: Server}) => { 
    const wss = new WebSocketServer({ noServer: true });

    server.on('upgrade', (request, socket, head) => {
        socket.on('error', console.error);
        socket.removeListener('error', console.error);

        wss.handleUpgrade(request, socket, head, function (ws) {
            wss.emit('connection', ws, request);
        });
    });
    
    wss.on('connection', function connection(ws) {
        ws.on('error', console.error);
    
        ws.on('message', function message(data: any) {
            const message = JSON.parse(data);
            console.log(message)
        });
    
        ws.send('something');
    });
}
