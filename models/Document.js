var mongoose = require('mongoose');

var DocumentSchema = new mongoose.Schema({
  subject_document: String,
  subject_classification: String,
  physical_location: String,
  document_number: Number,
  description: String,
  author: String,
  scanned: String,
  updated_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Document', DocumentSchema);
