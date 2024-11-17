import expressLoader from './express';
import mongooseLoader from './mongoose';
import websocketLoader from './websocket';

export default async ({ expressApp, httpServer }: {expressApp: any, httpServer: any}) => {
  const mongoConnection = await mongooseLoader();
  
  await expressLoader({ app: expressApp });

  await websocketLoader({ server: httpServer });
}