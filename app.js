require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
const session = require("express-session");
const flash = require("connect-flash");
const GoogleStrategy = require("passport-google-oauth20");
const MongoStore = require("connect-mongo")
const User = require("./models/user.js");

const authRoutes = require("./routes/auth");
const noteRoutes = require("./routes/notes.js");
const app = express();
const port = 4000;

mongoose
  .connect("mongodb://localhost:27017/noteApp")
  .then(() => console.log("DB connected"))
  .catch((err) => console.log(`Error: ${err}`));

  app.use(express.urlencoded({extended: true}))
app.use(express.json());
app.use(express.static("public"));
app.set("view engine", "ejs");

app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: "mongodb://localhost:27017/noteApp" }), 
    cookie: {
      maxAge: 24 * 60 * 60 * 1000, 
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", 
      sameSite: "lax",
    },
  })
);
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: process.env.NODE_ENV === "production"
      ? "https://note-app-aesj.onrender.com/auth/google"
      : "http://localhost:4000/auth/google/note-app",
      scope: ["profile", "email"],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value || `${profile.id}@google.noemail`;
        const username = profile.displayName?.replace(/\s+/g, "_") || email.split("@")[0] || `user_${profile.id.slice(0, 6)}`;
        const user = await User.findOrCreate(
          { googleId: profile.id },
          { username, email: email.toLowerCase(), googleId: profile.id },
          { upsert: true, new: true}
        );

        return done(null, user.doc);
      } catch (err) {
        return done(err);
      }
    }
  )
);

app.use("/", authRoutes);
app.use("/notes", noteRoutes);

app.get("/", (req, res) => {
  const date = new Date();
  res.render("index.ejs", { date: date.getFullYear() });
});

app.listen(port, (err) => {
  if (err) throw err;
  console.log(`Server active on http://localhost:${port}`);
});
