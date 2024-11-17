import * as mongoose from 'mongoose'
import config from '../config';

export default async (): Promise<any> => {
  const mongoUrl = "mongodb://broom_mongo:27017/myDatabase";

  const connection = await mongoose.connect(config.databaseURL || mongoUrl);
  return connection.connection.db;
}