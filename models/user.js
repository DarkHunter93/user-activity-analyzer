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
    settings: {
        blackList: {
            type: Array,
            required: false
        }
    },
    firm: {
        type: String,
        required: false
    },
	rights: {
    	basic: {
    		type: Boolean,
			required: true,
			default: true
		},
        extended: {
            type: Boolean,
            required: true,
            default: false
        },
		admin: {
    		type: Boolean,
			required: true,
			default: false
		}
	}
});

//TODO dodawanie elementów do tablicy blackList
//TODO sprawdzić, czy dodawanie property firm działa
//TODO stronicowanie

// generating a hash
userSchema.methods.generateHash = (item) => {
    return bcrypt.hashSync(item, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = (password, hashPassword) => {
    return bcrypt.compareSync(password, hashPassword);
};

module.exports = mongoose.model('User', userSchema, 'users');