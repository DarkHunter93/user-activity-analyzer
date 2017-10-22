let mongoose = require('mongoose'),
	Schema = mongoose.Schema;

//TODO szyfrowanie

module.exports = mongoose.model('User', new Schema({
	id: {
		type: String,
		required: true
    },
	login: {
		type: String,
		required: true
    },
	password: {
		type: String,
		required: true
    },
	email: {
		type: String,
		required: true
    },
	birthdate: {
		type: Date,
		required: false
    },
	gender: {
		type: String,
		required: false
    },
	province: {
		type: String,
		required: false
    },
	admin: {
		type: Boolean,
		default: false
	}
}));
