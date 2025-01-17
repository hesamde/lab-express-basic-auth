const session = require('express-session');
const MongoStore = require('connect-mongo');
// since we are going to USE this middleware in the app.js,
// let's export it and have it receive a parameter
const mongoose = require('mongoose');

module.exports = app => {
  // <== app is just a placeholder here
  // but will become a real "app" in the app.js
  // when this file gets imported/required there

  // required for the app when deployed to Heroku (in production)
    app.set('trust proxy', 1);

  // use session
    app.use(
        session({
        secret: 'Super safe secret', // used for generating the id of our session
        resave: true,
        saveUninitialized: true,
        store: MongoStore.create({
            mongoUrl:  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/lab-express-basic-auth",
            // ttl: 10*60,
            // autoRemove: 'interval',
            // autoRemoveInterval: 10
        }), // define a sessions collection in MongoDB
        cookie: {
            // sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            // secure: process.env.NODE_ENV === 'production',
            httpOnly: true,
            maxAge: 600000 // 60 * 1000 ms === 1 min
        },

        })
    );
    };