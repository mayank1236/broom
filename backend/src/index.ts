import express from "express";
import loaders from "./loaders";
import config from "./config";

async function startServer() {

  const app = express();

  await loaders({ expressApp: app });

  app.listen(config.port, () => {
    console.log(`Your server is ready on ${config.port} !`);
  });
}

startServer();