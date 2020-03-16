const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const clc = require('cli-color')

const User = require('../db/models/User')

/**
 * /login/
 * POST
 * body : { username, email, password }
 * username OR email required
*/
router.post('/', (req, res, next) => {
	// Get the username, email and password from req.body
	const { username, password } = req.body

	if ((username == undefined || username == '') && (password == undefined || password == '')) {
        console.log(clc.red('Authentication failed'))
		res.status(401).json({
			'msg': 'Authentication failed'
		}).end()
	} else {
		User.findOne({ username: username })
		.exec()
		.then(data => {
			if ( data === null ) {
                console.log(clc.red('Authentication failed'))
				res.status(401).json({
					'msg': 'Authentication failed'
				}).end()
			}

			// Compare the password
			bcrypt.compare(password, data.password, (err, result) => {
				console.log(clc.blue(result))
				if (result) {
					// Data to be provided with token
					const payLoad = {
						'email': data.email,
						'username': data.username
					}

					// Options for the token
					const jwtOptions = {
						expiresIn: '1h'
					}

					// Generate the token
					const token = jwt.sign(payLoad, 'YOUR_JWT_KEY', jwtOptions)

                    // Send the token
                    console.log(clc.green('Authentication successful'))
					res.status(200).json({
						'msg': 'Authentication successful',
						'auth_token': token
					})
				} else {
                    console.log(clc.red('Authentication failed'))
					res.status(401).json({
						'msg': 'Authentication failed'
					}).end()
				}
			})
		})
		.catch(e => {
			console.log(e)
		})
	}
})

module.exports = router
