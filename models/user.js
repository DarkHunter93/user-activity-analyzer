'use strict';

let mongoose = require('mongoose'),
	bcrypt = require('bcrypt-nodejs');

let userSchema = mongoose.Schema({
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
	rights: {
    	basic: {
    		type: Boolean,
			required: true,
			default: true
		},
		admin: {
    		type: Boolean,
			required: true,
			default: false
		}
	},
	authToken: {
    	type: String,
		required: true
	}
});

// generating a hash
userSchema.methods.generateHash = (item) => {
    return bcrypt.hashSync(item, bcrypt.genSaltSync(8), null);
};

//TODO określić docelową kolekcję w modelu User
//TODO zapisywanie użytkowników z zaszyfrowanym hasłem
//TODO weryfikowanie hasła

module.exports = mongoose.model('User', userSchema);