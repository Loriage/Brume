const jwt = require('jsonwebtoken')
const User = require('../db/models/User')
var passport = require('passport');
var DropboxStrategy = require('passport-dropbox-auth').Strategy;
require("dotenv").config({
    path: '../'
});

passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (obj, done) {
    done(null, obj);
});

passport.use(new DropboxStrategy({
    apiVersion: '2',
    clientID: `${process.env.DROPBOX_CLIENT_ID}`,
    clientSecret: `${process.env.DROPBOX_CLIENT_SECRET}`,
    callbackURL: "http://localhost:8000/oauth/dropbox/callback"
    },
    async (accessToken, refreshToken, profile, done) => {
        const email = profile.email;

        const currentUser = await User.findOne({ email: email });
            if (currentUser) {
                return done(null, currentUser);
            } else {
                const newUser = await new User({ email: email, dropboxId: profile.account_id, username: profile.name.given_name}).save();
                return done(null, newUser);
            }
        }));

module.exports = passport
