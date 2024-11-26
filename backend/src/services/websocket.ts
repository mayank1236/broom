import { WebSocket, WebSocketServer } from 'ws';
import {createConsumer, createWebRtcTransport, createWorker} from "@/services/mediasoup";
import {
    Consumer,
    DtlsParameters,
    MediaKind,
    Producer,
    Router, RtpCapabilities,
    RtpParameters,
    Transport
} from 'mediasoup/node/lib/types';


const WebsocketConnection = async (wss: WebSocketServer) => {
    let mediasoupRouter: Router;

    let producerTransport: Transport;
    let producer: Producer;

    let consumerTransport: Transport;
    let consumer: Consumer;

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
                case 'createProducerTransport':
                    onCreateProducerTransport(event, ws);
                    break;
                case 'connectProducerTransport':
                    onConnectProducerTransport(event, ws);
                    break;
                case 'produce':
                    onProduce(event, ws, wss);
                    break;
                case 'createConsumerTransport':
                    onCreateConsumerTransport(event, ws);
                    break;
                case 'connectConsumerTransport':
                    onConnectConsumerTransport(event, ws);
                    break;
                case 'resume':
                    onResume(ws);
                    break;
                case 'consume':
                    onConsume(event, ws);
                    break;
                default:
                    console.error('Unknown event type', event);
                    break;
            }
        });
    });

    const onRouterRtpCapabilities = (event: string, ws: WebSocket) => {
        send(ws, "routerCapabilities", mediasoupRouter.rtpCapabilities);
    }

    const onCreateProducerTransport = async (event: string, ws: WebSocket) => {
        try{
            const { transport, params } = await createWebRtcTransport(mediasoupRouter);
            producerTransport = transport;
            send(ws, "producerTransportCreated", params);
        } catch (e) {
            console.error(e);
            send(ws, "error", e);
        }
    }

    const onConnectProducerTransport = async (event: { type: string; dtlsParameters: DtlsParameters }, ws: WebSocket) => {
        await producerTransport.connect({dtlsParameters: event.dtlsParameters});
        send(ws, "producerConnected", 'producer connected');
    }

    const onProduce = async (
        event: { type: string; transportId: string; kind: MediaKind; rtpParameters: RtpParameters },
        ws: WebSocket,
        webSocket: WebSocketServer
    ) => {
        const { kind, rtpParameters } = event;
        producer = await producerTransport.produce({kind, rtpParameters});
        const resp = {
            id: producer.id
        };
        send(ws, "produced", resp);
        broadcast(webSocket, "newProducer", "new user");
    }

    const onCreateConsumerTransport = async (event: string, ws: WebSocket) => {
        try{
            const { transport, params } = await createWebRtcTransport(mediasoupRouter);
            consumerTransport = transport;
            send(ws, "subTransportCreated", params);
        } catch (e) {
            console.error(e);
            send(ws, "error", e);
        }
    }

    const onConnectConsumerTransport = async (event: { type: string; dtlsParameters: DtlsParameters }, ws: WebSocket) => {
        await consumerTransport.connect({dtlsParameters: event.dtlsParameters});
        send(ws, "subConnected", 'Consumer Transport Connected!');
    }

    const onResume = async (ws: WebSocket) => {
        await consumer.resume();
        send(ws, "resumed", "Resumed");
    }

    const onConsume = async (
        event: { type: string; rtpCapabilities: RtpCapabilities },
        ws: WebSocket
    ) => {
        const res = await createConsumer(producer, mediasoupRouter, event.rtpCapabilities, consumerTransport);
        if(res) {
            let {consumer: consumerCopy, ...rest} = res;

            consumer = consumerCopy;

            send(ws, "subscribed", rest);
        }
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

    const broadcast = (ws: WebSocketServer, type: string, msg: any) => {
        const message = {
            type,
            data: msg
        }
        const resp = JSON.stringify(message);

        ws.clients.forEach(client => {
            client.send(resp);
        });
    }
}

export default WebsocketConnection;