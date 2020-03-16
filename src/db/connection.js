const mongoose = require('mongoose')
require("dotenv").config();

// Create the connection
mongoose.connect(`${process.env.MONGODB_URL}`, {
	useNewUrlParser: true,
    useUnifiedTopology: true
})
.catch((err) => {
	console.log(err)
})

// Store the connection
const db = mongoose.connection

module.exports = db
