
import { Outlet } from "react-router-dom";
import * as mediasoup from 'mediasoup-client';
import {useEffect, useRef} from "react";
import {AppData, Producer, RtpCapabilities, Transport, TransportOptions} from "mediasoup-client/lib/types";
// import WebSocket from "ws";

export default function Root() {
    let isWebcam: boolean;
    let textPublish: HTMLParagraphElement | null;
    let device: mediasoup.types.Device;
    let producer: Producer | undefined;
    let stream:  MediaStream | undefined;
    let transport: Transport | undefined;

    const textWebcam = useRef<HTMLParagraphElement | null>(null);;
    const textScreen = useRef<HTMLParagraphElement | null>(null);
    const btnWebcam = useRef<HTMLButtonElement | null>(null);
    const btnScreen = useRef<HTMLButtonElement | null>(null);
    const localVideo = useRef<HTMLVideoElement | null >(null);
    const remoteVideo = useRef<HTMLVideoElement | null>(null);

    const connect = () => {

        const socket = new WebSocket('ws://localhost:5001/ws');

        btnScreen.current?.addEventListener('click', (e) => publish(e, socket));
        btnWebcam.current?.addEventListener('click', (e) => publish(e, socket));

        socket.onopen = () => {
            // start our socket request
            const msg = {
                type: "getRouterRtpCapabilities"
            };

            const resp = JSON.stringify(msg);
            socket.send(resp)

        }

        socket.onmessage = async (event) => {
            const msg = event.data;

            const jsonValidation = IsJsonString(msg);
            if (!jsonValidation) {
                console.error("json error");
                return
            }

            const resp: {type: string, data: never} = JSON.parse(msg);

            switch (resp.type) {
                case "routerCapabilities":
                    await onRouterCapabilities(resp.data);
                    break;
                case "producerTransportCreated":
                    await onProducerTransportCreated(resp.data, socket);
                    break;
                case "error":
                    //Maybe change to a handle error method
                    console.error(resp.data);
                    break;
                default:
                    break;
            }
        }

        // socket.onclose = () => {
        //     console.error('websocket closed');
        //     transport?.close();
        // }

    }

    useEffect(() => {
        connect();
    }, []);

    const onRouterCapabilities = async (resp: RtpCapabilities) => {
        await loadDevice(resp);
        if(btnWebcam.current && btnScreen.current) {
            btnWebcam.current.disabled = false;
            btnScreen.current.disabled = false;
        }
    }

    const onProducerTransportCreated = async (resp: TransportOptions<AppData>, socket: WebSocket) => {
        transport = device.createSendTransport(resp);

        transport.on('connect', async ({dtlsParameters}, callback) => {
            const message = {
                type: 'connectProducerTransport',
                dtlsParameters
            };
            const resp = JSON.stringify(message);
            socket.send(resp);

            socket.addEventListener('message', (event) => {
                const msg = event.data;

                const jsonValidation = IsJsonString(msg);
                if (!jsonValidation) {
                    console.error("json error");
                    return
                }

                const resp: {type: string, data: string} = JSON.parse(msg);
                if(resp.type === "producerConnected") {
                    console.log(resp.data);
                    callback();
                }
            });
        });
        // Begin Transport Producer
        transport.on('produce', async ({kind, rtpParameters}, callback) => {
            const message = {
                type: 'produce',
                transportId: transport?.id,
                kind,
                rtpParameters
            };

            const resp = JSON.stringify(message);
            socket.send(resp);

            socket.addEventListener('message', (event) => {
            // socket.addEventListener('published', (event) => {
                const msg: string = event.data;

                const jsonValidation = IsJsonString(msg);
                if (!jsonValidation) {
                    console.error("json error");
                    return
                }

                const resp: {type: string, data: { id: string }} = JSON.parse(msg);
                console.log('published', resp);
                callback({id: resp.data.id});
            })
        });
        // End Transport Producer
        // Connection state change begin
        transport.on('connectionstatechange', (state) => {
            switch (state) {
                case 'connecting':
                    if(textPublish) {
                        textPublish.innerHTML = 'publishing....'
                    }
                    break;
                case 'connected':
                    if(localVideo.current) {
                        localVideo.current.srcObject = stream ?? null;
                    }
                    if(textPublish) {
                        textPublish.innerHTML = 'published';
                    }
                    break;
                case 'failed':
                    transport?.close();
                    if(textPublish) {
                        textPublish.innerHTML = 'failed';
                    }
                    break;
                default:
                    break;
            }
        });
        // Connection state change end

        try {
            stream = await getUserMedia(transport, isWebcam);
            const track = stream?.getVideoTracks()[0];
            const params = { track};

            producer = await transport.produce(params);
            console.log(producer);
        } catch (e) {
            console.error(e);
            if (textPublish) {
                textPublish.innerHTML = 'failed!';
            } else {
                console.error("textPublish is null");
            }
        }
    }

    const publish = (e: MouseEvent, socket: WebSocket) => {
        const target = e.target as HTMLElement;
        isWebcam = (target.id == "btn_webcam");
        textPublish = isWebcam ? textWebcam.current : textScreen.current;
        if(btnWebcam.current && btnScreen.current) {
            btnWebcam.current.disabled = true;
            btnScreen.current.disabled = true;
        }

        const message = {
            type: 'createProducerTransport',
            forceTcp: false,
            rtpCapabilities: device?.rtpCapabilities,
        };

        const resp = JSON.stringify(message);
        socket.send(resp);
    }

    const IsJsonString = (str: string) => {
        try {
            JSON.parse(str);
        } catch (error) {
            console.error(error);
            return false;
        }
        return true;
    }

    const loadDevice = async (routerRtpCapabilities: RtpCapabilities) => {
        try {
            device = new mediasoup.Device();
        } catch (error) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            if(error.name === 'UnsupportedError') {
                console.log("browser not supported")
            }
        }
        await device.load({routerRtpCapabilities})
    }

    const getUserMedia = async (transport: Transport, isWebcam: boolean) => {
        console.log(transport);
        if(!device.canProduce('video')) {
            console.error('cannot produce a video');
            return;
        }
        let stream;
        try{
            stream = isWebcam ?
                await navigator.mediaDevices.getUserMedia({video: true, audio: true}):
                await navigator.mediaDevices.getDisplayMedia({video: true});
        } catch (e) {
            console.error(e);
        }
        return stream;
    }

    return (
        <>
            <main className="main">
                <div className="flex justify-around p-10 gap-x-4 ">
                    <video className="w-full" ref={localVideo} autoPlay controls></video>
                    <video className="w-full" ref={remoteVideo} autoPlay controls></video>
                </div>
                <button
                  disabled
                  className="btn_webcam p-3 bg-black text-white border border-black hover:text-black hover:bg-white disabled:bg-gray-400 disabled:border-gray-400 disabled:text-white"
                  id="btn_webcam"
                  ref={btnWebcam}
                >Webcam</button>
                <button
                  disabled
                  className="btn_screen p-3 bg-black text-white border border-black hover:text-black hover:bg-white disabled:bg-gray-400 disabled:border-gray-400 disabled:text-white"
                  id="btn_screen"
                  ref={btnScreen}
                >Screen</button>
                <p ref={textScreen}></p>
                <p ref={textWebcam}></p>
            </main>
            <div id="detail">
                <Outlet />
            </div>
        </>
    );
  }
  