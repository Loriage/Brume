const jwt = require('jsonwebtoken')
const User = require('../db/models/User')
var passport = require('passport');
var DropboxStrategy = require('passport-dropbox-auth').Strategy;
require("dotenv").config();

passport.use(new DropboxStrategy({
        apiVersion: '2',
        clientID: `${process.env.DROPBOX_CLIENT_ID}`,
        clientSecret: `${process.env.DROPBOX_CLIENT_SECRET}`,
        callbackURL: "https://brume-tool/oauth/dropbox/callback"
    },
    function (accessToken, refreshToken, profile, done) {
        User.findOrCreate({
            providerId: profile.id
        }, function (err, user) {
            return done(err, user);
        });
    }
));

module.exports = passport