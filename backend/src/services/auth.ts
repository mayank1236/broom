import passport from "passport";
import {Strategy as GoogleStrategy} from "passport-google-oauth20";
import config from "../config";
import { IUserInputDTO } from "@/interfaces/IUser";

export default class AuthService {

  constructor(
    private userModel: Models.UserModel,
  ) {
  }

  public async Signin(userInputDTO: IUserInputDTO) {
    passport.use(new GoogleStrategy({
        clientID: config.google.clientId,
        clientSecret: config.google.clientSecret,
        callbackURL: config.google.callback
      },
      function(accessToken, refreshToken, profile, cb) {
        // User.findOrCreate({ googleId: profile.id }, function (err, user) {
        //     return cb(err, user);
        // });
      }
    ));
  }
  
}
