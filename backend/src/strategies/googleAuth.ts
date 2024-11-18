import passport from "passport";
import {Strategy as GoogleStrategy} from "passport-google-oauth20";
import config from "@/config";
import User from "@/models/user";

const {clientId, clientSecret} = config.googleAuth;
    
export default () => passport.use(new GoogleStrategy({
        clientID: clientId,
        clientSecret: clientSecret,
        callbackURL: 'http://localhost:5001/api/v1/auth/google/callback'
    },
    async (accessToken, refreshToken, profile, cb) => {
        try {
            console.log('profile', profile); 
            let existingUser = await User.findOne({ 'google.id': profile.id });
            // if user exists return the user 
            if (existingUser) {
                console.log('Found existing user...');
                return cb(null, existingUser);
            }

            // if user does not exist create a new user 
            const newUser = new User({
                method: 'google',
                googleId: profile.id,
                profileImage: profile.photos && profile.photos[0].value,
                firstName: profile.name?.givenName,
                lastName: profile.name?.familyName,
                shortName: profile.displayName,  
            });
            await newUser.save();
            return cb(null, newUser);
        } catch (error) {
            return cb(error, false)
        }
    }
));