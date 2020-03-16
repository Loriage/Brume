const mongoose = require('mongoose')

// Consts
const Schema = mongoose.Schema

const UserSchema = new Schema({
	username: { type: String },
	email: { type: String },
	password: { type: String },
})


// Export model
module.exports = mongoose.model('users', UserSchema)