import { Router, Request, Response, NextFunction } from 'express';
import AuthService from '@/services/auth';
import { IUserInputDTO } from '@/interfaces/IUser';
import middlewares from '../middlewares';
import { Logger } from 'winston';
import passport from 'passport';

const route = Router();

export default (app: Router) => {
  app.use('/auth', route);

  // const logger:Logger = Container.get('logger');
  // logger.debug('Calling Sign-In endpoint with body: %o', req.body);
  // logger.error('🔥 error: %o',  e );

  route.get('/google', passport.authenticate('google', { 
    session: false, 
    scope: ['email', 'profile'],
  }));

  route.get('/google/callback', passport.authenticate('google', {
    successRedirect: '/',
    failureRedirect: '/login'
  }));

  route.post('/logout', middlewares.isAuth, (req: Request, res: Response, next: NextFunction) => {
    
    try {
      //@TODO AuthService.Logout(req.user) do some clever stuff
      res.status(200).end();
    } catch (e) {
      return next(e);
    }
  });
};