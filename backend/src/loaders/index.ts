import expressLoader from './express';
import mongooseLoader from './mongoose';
import passportLoader from './passport';
import websocketLoader from './websocket';

export default async ({ expressApp, httpServer }: {expressApp: any, httpServer: any}) => {
  const mongoConnection = await mongooseLoader();

  await passportLoader();
  
  await expressLoader({ app: expressApp });

  await websocketLoader({ server: httpServer });
}