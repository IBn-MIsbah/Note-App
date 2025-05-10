const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/user");

module.exports = function (passport) {
  passport.use(
    new LocalStrategy(
      { usernameField: "email" },
      async (email, password, done) => {
        try {
          const user = await User.findOne({ email });
          if (!user) return done(null, false, { message: "Incorrect email" });
          user.authenticate(password, (err, isValid) => {
            if (err) return done(err);
            if (!isValid)
              return done(null, false, { message: "Incorrect password" });
            return done(null, user);
          });
        } catch (err) {
          return done(err);
        }
      }
    )
  );

  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        callbackURL:
          process.env.NODE_ENV === "production"
            ? "https://note-app-aesj.onrender.com/auth/google/note-app"
            : "http://localhost:4000/auth/google/note-app",
        scope: ["profile", "email"],
        userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo",
        accessType: "offline",
        prompt: "consent",
        state: true,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const email =
            profile.emails?.[0]?.value || `${profile.id}@no-email.com`;
          const username =
            profile.displayName?.replace(/\s+/g, "_") ||
            email.split("@")[0] ||
            `user_${profile.id.slice(0, 6)}`;
          const user = await User.findOrCreate(
            { googleId: profile.id },
            {
              googleId: profile.id,
              email: email.toLowerCase(),
              username: username,
            }
          );
          done(null, user);
        } catch (err) {
          done(err);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    console.log("serialized user", user);
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (err) {
      done(err);
    }
  });
};
