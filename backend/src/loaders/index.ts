import expressLoader from './express';
// import mongooseLoader from './mongoose';
import passportLoader from './passport';
import websocketLoader from './websocket';
import pgLoader from './postgres';

export default async ({ expressApp, httpServer }: {expressApp: any, httpServer: any}) => {
  // const mongoConnection = await mongooseLoader();
  const postgresConnection = await pgLoader();

  await passportLoader();
  
  await expressLoader({ app: expressApp });

  await websocketLoader({ server: httpServer });
}