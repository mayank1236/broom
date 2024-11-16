import * as express from 'express';
import WebSocket from "ws";

export default async ({ server }: {server: any}) => { 
    const wss = new WebSocket.Server({ server })
    
    wss.on('connection', function connection(ws) {
        ws.on('error', console.error);
    
        ws.on('message', function message(data: any) {
            const message = JSON.parse(data);
            console.log(message)
        });
    
        ws.send('something');
    });
}
