var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = mongoose.model('User', new Schema({
	id: String,
	login: String,
	password: String,
	email: String,
	birthdate: Date,
	gender: String,
	province: String,
	admin: {
		type: Boolean,
		default: false
	}
}));
