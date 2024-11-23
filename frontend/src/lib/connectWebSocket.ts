// import {RtpCapabilities} from "mediasoup-client/lib/types";
// import mediasoup from "mediasoup-client";
//
// const connectWebSocket = () => {
//     let device: mediasoup.types.Device;
//
//     const socket = new WebSocket('ws://localhost:5001/ws');
//
//     socket.onopen = () => {
//         // start our socket request
//         const msg = {
//             type: "getRouterRtpCapabilities"
//         };
//
//         const resp = JSON.stringify(msg);
//         socket.send(resp)
//
//     }
//
//     socket.onmessage = (event) => {
//         const msg = event.data;
//
//         const jsonValidation = IsJsonString(msg);
//         if (!jsonValidation) {
//             console.error("json error");
//             return
//         }
//
//         let resp: {type: string, data: RtpCapabilities} = JSON.parse(msg);
//
//         switch (resp.type) {
//             case "routerCapabilities":
//                 onRouterCapabilities(resp.data);
//                 break;
//
//             default:
//                 break;
//         }
//     }
//
//     const onRouterCapabilities = (resp: RtpCapabilities) => {
//         loadDevice(resp);
//         // bntCam.disabled = false;
//         // bntScreen.disabled = false;
//     }
//
//     const IsJsonString = (str: string) => {
//         try {
//             JSON.parse(str);
//         } catch (error) {
//             return false;
//         }
//         return true;
//     }
//
//     const loadDevice = async (routerRtpCapabilities: RtpCapabilities) => {
//         try {
//             device = new mediasoup.Device();
//         } catch (error: any) {
//             if(error.name === 'UnsupportedError') {
//                 console.log("browser not supported")
//             }
//         }
//         await device.load({routerRtpCapabilities})
//     }
// }
//
// export default connectWebSocket;