import { WebSocketServer } from "ws";
import {Server} from 'http';
import WebsocketConnection from "@/services/websocket";


export default async ({ server }: {server: Server}) => { 
    const wss = new WebSocketServer({ server,  path: '/ws'});

    await WebsocketConnection(wss);
    
}
