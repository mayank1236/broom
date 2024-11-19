import 'module-alias/register';
import express from "express";
import { createServer } from "http";

import loaders from "./loaders";
import config from "./config";

async function startServer() {
  const app = express();
  const server = createServer(app);

  await loaders({ expressApp: app, httpServer: server });

  server.listen(config.port, () => {
    console.log(`Your server is ready on ${config.port} !`);
  });
}

startServer();