const jwt = require('jsonwebtoken')
const User = require('../db/models/User')
var passport = require('passport');
var DropboxStrategy = require('passport-dropbox-auth').Strategy;
require("dotenv").config({
    path: '../'
});

passport.use(new DropboxStrategy({
    apiVersion: '2',
    clientID: `${process.env.DROPBOX_CLIENT_ID}`,
    clientSecret: `${process.env.DROPBOX_CLIENT_SECRET}`,
    callbackURL: "https://brume-tool.herokuapp.com/oauth/dropbox/callback"
    },
    async (accessToken, refreshToken, profile, done) => {
        const email = profile.emails[0].value;

        const currentUser = await User.findOne({ email: email });
            if (currentUser) {
                return done(null, currentUser);
            } else {
                const newUser = await new User({ email: email, dropboxId: profile.account_id, username: profile.name.display_name}).save();
                return done(null, newUser);
            }
        }));

module.exports = passport
