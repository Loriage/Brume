const express = require('express')
const bcrypt = require('bcrypt')
const clc = require('cli-color')

const router = express.Router()

const User = require('../db/models/User')


/**
 * /register/
 * POST
 * body : { email, password, username }
*/
router.post('/', (req, res, next) => {
	// Get values
	const { email, username, password } = req.body

	// REGEX for E-mail validation
	const reg = /^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$/

	if ( email === '' || email == null || !reg.test(email) ) {
        console.log(clc.red('Email error.'))
		res.status(422).json({
			'error': 'emailError'
		}).end()
	} else if ( password == null || password.length < 6 ) {
        console.log(clc.red('Password error.'))
		res.status(422).json({
			'error': 'passwordError'
		}).end()
	} else if ( username == null || username === '' ) {
        console.log(clc.red('Username error.'))
		res.status(422).json({
			'error': 'usernameError'
		}).end()
	} else {
		User.findOne( { $or: [{ email: email }, { username: username }] })
		.exec()
		.then(data => {
			if (data) {
                console.log(clc.red('Username or email exists.'))
				res.status(422).json({
					'error': 'usernameOrEmailExistsError'
				}).end()
			} else {
				// If username or email is not used
				bcrypt.hash(password, 10, (err, password) => {
					if ( err ) {
                        console.log(clc.red('Error while encrypting data. Please try again later.'))
						res.status(500).json({
							'msg': 'Error while encrypting data. Please try again later.'
						})
					} else {
						const user = new User({ email, username, password })
						user.save()
						.then(() => {
                            console.log(clc.blue(username) + clc.green(' successfuly registered'))
							res.status(200).json({
								'msg': 'Data entered successfuly.'
							}).end()
						})
						.catch(() => {
                            console.log(clc.red('Error while saving data to database. Please try again later.'))
							res.status(500).json({
								'msg': 'Error while saving data to database. Please try again later.'
							}).end()
						})
					}
				})
			}
		})
		.catch(e => {
			console.log(e)
		})
	}


})

/**
 * /register/username
 * POST
 * body : { username }
*/
router.post('/username', (req, res, next) => {
	const { username } = req.body
	User.findOne({ username: username }, (err, data) => {
		if (err) {
            console.log(clc.red('Server error occured. Please try again later...'))
			res.status(500).json({
				'msg': 'Server error occured. Please try again later...'
			}).end()
		} else {
			if (data) {
                console.log(clc.red('User with the username exists.'))
				res.status(200).json({
					'msg': 'User with the username exists.',
					'exists': true
				}).end()
			} else {
                console.log(clc.red('User with the username does not exist.'))
				res.status(404).json({
					'msg': 'User with the username does not exist.',
					'exists': false
				}).end()
			}
		}
	})
})

/**
 * /register/email
 * POST
 * body : { email }
*/
router.post('/email', (req, res, next) => {
	const { email } = req.body
	User.findOne({ email: email }, (err, data) => {
		if (err) {
            console.log(clc.red('Server error occured. Please try again later...'))
			res.status(500).json({
				'msg': 'Server error occured. Please try again later...'
			}).end()
		} else {
			if (data) {
                console.log(clc.red('User with the email exists.'))
				res.status(200).json({
					'msg': 'User with the email exists.',
					'exists': true
				}).end()
			} else {
                console.log(clc.red('User with the email does not exist.'))
				res.status(404).json({
					'msg': 'User with the email does not exist.',
					'exists': false
				}).end()
			}
		}
	})
})

module.exports = router
