import serverless from 'serverless-http';
import express from 'express';
import allRouters from './src/routes';
import 'dotenv/config.js';
import cors from 'cors';
import session from 'express-session';
import passport from 'passport';
import { getConfig } from './src/utils/config';

const { JWT_SECRET_KEY } = getConfig();
const app = express();

const corsOptions = {
  origin: function (origin, callback) {
    callback(null, true);
  },
};

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

app.use(cors(corsOptions));

//session
app.use(
  session({
    secret: JWT_SECRET_KEY,
    resave: false,
    saveUninitialized: false,
  }),
);

// Initialize Passport and restore authentication state, if any, from the session.
app.use(passport.initialize());
app.use(passport.session());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/v1/team', allRouters);

export const handler = serverless(app);
