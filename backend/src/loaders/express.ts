import * as express from 'express';
import * as bodyParser from 'body-parser';
import cors from 'cors';
import routes from '@/api';
import config from '@/config';

export default async ({ app }: { app: express.Application }) => {

  app.get('/status', (req, res) => { res.status(200).end(); });
  app.head('/status', (req, res) => { res.status(200).end(); });
  
  app.enable('trust proxy');

  app.use(cors());
  app.use(express.json());
  
  app.use(config.api.prefix, routes());
  
  app.use(bodyParser.urlencoded({ extended: false }));

  // ...More middlewares

  // Return the express app
  return app;
}