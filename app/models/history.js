var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = mongoose.model('History', new Schema({
  ownerId: String,
  url: {
    domain: String,
    full: String,
    path: String,
    query: Schema.Types.Mixed,
    protocol: String,
    port: String
  },
  parentUrl: {
    domain: String,
    full: String,
    path: String,
    query: Schema.Types.Mixed,
    protocol: String,
    port: String
  },
	time: {
    type: String,
    default: Date.now
  }
}));
