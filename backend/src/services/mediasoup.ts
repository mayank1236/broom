import * as mediasoup from 'mediasoup';
import {Producer, Router, RtpCapabilities, Transport, Worker} from 'mediasoup/node/lib/types';
import { msConfig } from '@/config/mediasoup';

const workers: Array<{
    worker: Worker
    router: Router
}> = [];

let nextMediasoupWorkerIdx = 0;

const createWorker = async () => {
    const worker = await mediasoup.createWorker({
        logLevel: msConfig.mediasoup.worker.logLevel,
        logTags: msConfig.mediasoup.worker.logTags,
        rtcMinPort: msConfig.mediasoup.worker.rtcMinPort,
        rtcMaxPort: msConfig.mediasoup.worker.rtcMaxPort
    });

    worker.on('died', () => {
        console.error('media worker died, exiting in 2 seconds ... [pid:&d]', worker.pid);
        setTimeout(() => {
            process.exit(1);
        }, 2000);
    });

    const mediaCodecs = msConfig.mediasoup.router.mediaCodes;
    const mediasoupRouter = await worker.createRouter({mediaCodecs});
    return mediasoupRouter;
}

const createWebRtcTransport = async (mediasoupRouter: Router) => {
    const {
        maxIncomeBitrate,
        initialAvailableOutgoingBitrate,
        listenIps
    } = msConfig.mediasoup.webRtcTransport;

    const transport = await mediasoupRouter.createWebRtcTransport({
        listenIps,
        enableUdp: true,
        enableTcp: true,
        preferUdp: true,
        initialAvailableOutgoingBitrate,
    });

    if(maxIncomeBitrate) {
        try{
            await transport.setMaxIncomingBitrate(maxIncomeBitrate);
        } catch(e) {
            console.error(e);
        }
    }

    return {
        transport,
        params: {
            id: transport.id,
            iceParameters: transport.iceParameters,
            iceCandidates: transport.iceCandidates,
            dtlsParameters: transport.dtlsParameters,
        }
    }
};

const createConsumer = async(producer: Producer, mediasoupRouter: Router, rtpCapabilities: RtpCapabilities, consumerTransport: Transport) => {
    if(!mediasoupRouter.canConsume({
        producerId: producer.id,
        rtpCapabilities
    })) {
        console.error('Can not consume');
        return;
    }

    let consumer;

    try{
        consumer = await consumerTransport.consume({
            producerId: producer.id,
            rtpCapabilities,
            paused: producer.kind === "video"
        });
    } catch (e) {
        console.error('consume failed ', e);
        return;
    }

    return {
        consumer,
        producerId: producer.id,
        id: consumer.id,
        kind: consumer.kind,
        rtpParameters: consumer.rtpParameters,
        type: consumer.type,
        producerPaused: consumer.producerPaused
    };
}


export { createWorker, createWebRtcTransport, createConsumer };