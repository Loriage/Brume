const express = require('express')
const router = express.Router()
const clc = require('cli-color')

router.get('/dropbox',
    passport.authenticate('dropbox-oauth2'));

router.get('/dropbox/callback',
    passport.authenticate('dropbox-oauth2', {
        failureRedirect: '/login'
    }),
    function (req, res) {
        // Successful authentication, redirect home.
        res.redirect('/');
    });

module.exports = router
