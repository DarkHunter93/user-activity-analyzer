var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = mongoose.model('Website', new Schema({
  id: {
    type: String,
    required: true
  },
  websiteContent: {
    text: {
      type: String,
      required: true
    },
    urls: {
      type: Array,
      required: false
    }
  }
}));
