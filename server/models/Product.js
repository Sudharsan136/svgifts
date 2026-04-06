const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    discountPrice: { type: Number, default: null },
    category: {
      type: String,
      required: true,
    },
    images: [{ type: String }],         // Cloudinary URLs
    stock: { type: Number, default: 0 },
    isFeatured: { type: Boolean, default: false },
    tags: [{ type: String }],
    ratings: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
    reviews: [
      {
        name: { type: String, required: true },
        rating: { type: Number, required: true },
        comment: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);
