import * as express from 'express';
import * as bodyParser from 'body-parser';
import cors from 'cors';
import passport from 'passport';
import session from 'express-session';
import routes from '@/api';
import config from '@/config';

export default async ({ app }: { app: express.Application }) => {
  
  app.enable('trust proxy');

  app.use(cors());
  app.use(express.json());
  
  app.use(bodyParser.urlencoded({ extended: false }));

  console.log('Setup express and passport session properly in loaders/express');
  app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
  }));

  app.use(passport.initialize());
  app.use(passport.session());
  
  app.use(config.api.prefix, routes());

  // ...More middlewares

  // Return the express app
  return app;
}