import express from 'express';
import expressLoader from './express';
import mongooseLoader from './mongoose';
import websocketLoader from './websocket';
import { createServer } from "http"

export default async ({ expressApp, httpExpressServer }: any) => {
  const mongoConnection = await mongooseLoader();
  
  await expressLoader({ app: expressApp });

  const server = createServer(expressApp);

  await websocketLoader({ server });
}