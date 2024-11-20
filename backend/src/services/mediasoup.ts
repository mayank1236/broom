import * as mediasoup from 'mediasoup';
import { Router, Worker } from 'mediasoup/node/lib/types';
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
}

export { createWorker };