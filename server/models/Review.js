const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  imageUrl: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Review', reviewSchema);
