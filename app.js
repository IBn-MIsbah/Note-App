require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
const session = require("express-session");
const flash = require("connect-flash");
const MongoStore = require("connect-mongo");
const User = require("./models/user.js");

const authRoutes = require("./routes/auth");
const noteRoutes = require("./routes/notes.js");
const app = express();
const port = 4000;

const getMongoURI = () => {
  if (process.env.NODE_ENV === "production") {
    return `mongodb+srv://${process.env.DB_USER}:${encodeURIComponent(
      process.env.DB_PASSWORD
    )}@${process.env.DB_HOST}/${
      process.env.DB_NAME
    }?retryWrites=true&w=majority`;
  }
  {
    return "mongodb://localhost:27017/noteApp";
  }
};
mongoose
  .connect(getMongoURI(), {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    ssl: true, 
    tlsAllowInvalidCertificates: false, 
    tlsInsecure: false,
  })
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.log("MongoDB connection error:", err));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));
app.set("view engine", "ejs");

const sessionStore = MongoStore.create({
  mongoUrl: getMongoURI(),
  collectionName: "sessions",
  ttl: 24 * 60 * 60,
});

app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    },
  })
);
app.use(flash());
require("./config/passport")(passport);
app.use(passport.initialize());
app.use(passport.session());

app.use("/", authRoutes);
app.use("/notes", noteRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  req.flash("error", "Something went wrong!");
  res.redirect("/");
});

app.get("/", (req, res) => {
  const date = new Date();
  res.render("index.ejs", { date: date.getFullYear() });
});

app.listen(port, (err) => {
  if (err) throw err;
  console.log(`Server active on http://localhost:${port}`);
});
