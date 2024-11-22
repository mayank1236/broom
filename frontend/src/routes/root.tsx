import { Link, Outlet, useLoaderData } from "react-router-dom";
// import WebSocket from "ws";

export default function Root() {

  const connect = () => {
    const socket = new WebSocket('ws://localhost:5001/ws');

    socket.onopen = () => {
      // start our socket request
      const msg = {
        type: "getRouterRtpCapabilities"
      };

      const resp = JSON.stringify(msg);
      socket.send(resp)

    }

    socket.onmessage = (event) => {
      const msg = event.data;

      const jsonValidation = IsJsonString(msg);
      if (!jsonValidation) {
          console.error("json error");
          return
      }

      let resp = JSON.parse(msg);

      switch (resp.type) {
        case "routerCapabilities":
          console.log(resp)
          break;
      
        default:
          break;
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
  }

  connect();

  return (
    <>

      <div id="detail">
        <Outlet />
      </div>
    </>
  );
  }
  