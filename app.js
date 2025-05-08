import 'dotenv/config'
import express from 'express'
import ejs from 'ejs'
import passport from 'passport';
import bodyParser from 'body-parser';
import session from 'express-session';
import mongoose from 'mongoose';
import passportLocalMongoose from 'passport-local-mongoose';

import noteRoutes from './routes/notes.js';
import registerRoute from './routes/auth.js';

import User from './models/user.js'

const app = express();
const port = process.env.PORT || 4000;

app.use(express.static('public'))
app.use(bodyParser.urlencoded({extended: true}))
app.set('view engine', 'ejs')

app.use(session({
  secret: process.env.SECRET || '1234567890poiuytrewq',
  resave: false,
  saveUninitialized: false,

}))

app.use(passport.initialize());
app.use(passport.session())

mongoose.connect("mongodb://localhost:27017/userDB");

passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use('/', registerRoute) 


app.listen(port, (err) => {
  if(err) throw err
  console.log(`✅ Server running at http://localhost:${port}`);
});