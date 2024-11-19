// import { Container } from 'typedi';
import mongoose from 'mongoose';
import { IUser } from '@/interfaces/IUser';
import User from '@/models/user';
import { Logger } from 'winston';
import { NextFunction, RequestHandler } from 'express';

/**
 * Attach user to req.currentUser
 * @param {*} req Express req Object
 * @param {*} res  Express res Object
 * @param {*} next  Express next Function
 */
const attachCurrentUser: RequestHandler = async (req, res, next) => {
  // const Logger : Logger = Container.get('logger');
  // try {
  //   // const UserModel = Container.get('userModel') as mongoose.Model<IUser & mongoose.Document>;
  //   const UserModel = User as mongoose.Model<IUser & mongoose.Document>;
  //   const userRecord = await UserModel.findById(req.token._id);
  //   if (!userRecord) {
  //     res.sendStatus(401);
  //     return;
  //   }
  //   const currentUser = userRecord.toObject();
  //   Reflect.deleteProperty(currentUser, 'password');
  //   Reflect.deleteProperty(currentUser, 'salt');
  //   req.currentUser = currentUser;
  //   next();
  // } catch (e) {
  //   // Logger.error('🔥 Error attaching user to req: %o', e);
  //   next(e);
  // }
};

export default attachCurrentUser;