import { Link, Outlet, useLoaderData } from "react-router-dom";
import {
  RecoilRoot,
  atom,
  selector,
  useRecoilState,
  useRecoilValue,
} from 'recoil';

import WebSocket from "ws";

export default function Root() {
    const socket = new WebSocket('wss://localhost:5176/ws');

    // Set up event listeners for incoming messages
    socket.onmessage = (event) => {
      console.log(`Received message from server: ${event.data}`);
      // Process the message and update the UI if needed
    };

    // Set up event listeners for disconnections
    socket.onclose = () => {
      console.log('Disconnected from server');
    };

    // Set up event listeners for errors
    socket.onerror = (error) => {
      console.error(`Error occurred: ${error}`);
    };

    return (
      <RecoilRoot>
        
        <div id="detail">
          <Outlet />
        </div>
      </RecoilRoot>
    );
  }
  