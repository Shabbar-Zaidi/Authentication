import passport from "passport";
import { Strategy as FacebookStrategy } from "passport-facebook";
import User from "../models/userModel.js";

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FB_APP_ID,
      clientSecret: process.env.FB_APP_SECRET,
      callbackURL: "http://localhost:8080/auth/facebook/callback",
      profileFields: ["id", "displayName", "emails", "photos"],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ facebookId: profile.id });

        if (!user) {
          user = await User.create({
            facebookId: profile.id,
            name: profile.displayName,
            email: profile.emails?.[0]?.value,
            photo: profile.photos?.[0]?.value,
          });
        }

        done(null, user);
      } catch (err) {
        done(err, null);
      }
    }
  )
);

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id).select("-password");
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});
