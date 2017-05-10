var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = mongoose.model('History', new Schema({
  owner: {
    type: String,
    required: true
  },
	url: {
    type: String,
    required: true
  },
	parentUrl: {
    type: String,
    required: true
  },
	time: {
    type: String,
    default: Date.now,
    required: true
  }
}));
