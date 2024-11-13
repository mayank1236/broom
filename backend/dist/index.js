"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
const wss = new ws_1.WebSocketServer({ port: 8080 });
// let senderSocket: null | WebSocket = null;
// let receiverSocket: null | WebSocket = null;
wss.on('connection', function connection(ws) {
    // ws.on('error', console.error);
    ws.on('message', function message(data) {
        const message = JSON.parse(data);
        console.log(message);
    });
    // ws.send('something');
});
