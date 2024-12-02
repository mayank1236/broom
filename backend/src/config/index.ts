import dotenv from "dotenv";


const envFound = dotenv.config();

if(envFound.error) {
  throw new Error("⚠️  Couldn't find .env file  ⚠️");
}

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

export default {
  port: process.env.PORT || "5001",
  databaseURL: process.env.DATABASE_URI || "",
  pgURI: process.env.POSTGRE_URI || "",
  googleAuth: {
    clientId: process.env.GOOGLE_CLIENT_ID || "",
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
  },
  api: {
    prefix: '/api/v1'
  }
}