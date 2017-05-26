var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = mongoose.model('History', new Schema({
  ownerId: {
    type: String,
    required: true
  },
  url: {
    domain: {
      type: String,
      required: true
    },
    full: {
      type: String,
      required: true
    },
    path: {
      type: String,
      required: false
    },
    query: {
      type: Schema.Types.Mixed,
      required: false
    },
    protocol: {
      type: String,
      required: false
    },
    port: {
      type: Number,
      required: false
    }
  },
  parentUrl: {
    domain: {
      type: String,
      required: false
    },
    full: {
      type: String,
      required: false
    },
    path: {
      type: String,
      required: false
    },
    query: {
      type: Schema.Types.Mixed,
      required: false
    },
    protocol: {
      type: String,
      required: false
    },
    port: {
      type: Number,
      required: false
    }
  },
  connection: {
    url: {
      type: String,
      required: false
    },
    title: {
      type: String,
      required: false
    }
  },
	date: {
    type: Date,
    default: new Date
  }
}));
