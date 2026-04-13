const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { protect } = require('../middleware/auth');

// @route  GET /api/products
// @desc   Get all products (with optional filters)
// @access Public
router.get('/', async (req, res) => {
  try {
    const { category, search, featured, sort } = req.query;
    const query = {};

    if (category) query.category = category;
    if (featured === 'true') query.isFeatured = true;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } }
      ];
    }

    let sortOption = { createdAt: -1 };
    if (sort === 'price_asc') sortOption = { price: 1 };
    if (sort === 'price_desc') sortOption = { price: -1 };
    if (sort === 'name') sortOption = { name: 1 };

    const products = await Product.find(query).sort(sortOption);
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route  GET /api/products/:id
// @desc   Get single product
// @access Public
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route  POST /api/products/:id/reviews
// @desc   Create or update review
// @access Public
router.post('/:id/reviews', async (req, res) => {
  try {
    const { rating, comment, name, email } = req.body;
    const product = await Product.findById(req.params.id);

    if (product) {
      const existingReviewIndex = product.reviews.findIndex(
        (r) => r.userEmail && r.userEmail === email
      );

      if (existingReviewIndex !== -1 && email) {
        // Update existing review
        product.reviews[existingReviewIndex].rating = Number(rating);
        product.reviews[existingReviewIndex].comment = comment;
        product.reviews[existingReviewIndex].name = name;
        product.reviews[existingReviewIndex].createdAt = Date.now();
      } else {
        // Create new review
        const review = {
          name,
          userEmail: email,
          rating: Number(rating),
          comment,
        };
        product.reviews.push(review);
      }

      product.numReviews = product.reviews.length;
      product.ratings =
        product.reviews.reduce((acc, item) => item.rating + acc, 0) /
        product.reviews.length;

      await product.save();
      res.status(201).json({ message: 'Review successfully updated' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @route  DELETE /api/products/:id/reviews/:reviewId
// @desc   Delete a review
// @access Public (with email check)
router.delete('/:id/reviews/:reviewId', async (req, res) => {
  try {
    const { email } = req.query;
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const reviewIndex = product.reviews.findIndex(r => r._id.toString() === req.params.reviewId);
    if (reviewIndex === -1) return res.status(404).json({ message: 'Review not found' });

    if (product.reviews[reviewIndex].userEmail !== email) {
      return res.status(403).json({ message: 'Unauthorized to delete this review' });
    }

    product.reviews.splice(reviewIndex, 1);
    
    product.numReviews = product.reviews.length;
    product.ratings = product.reviews.length > 0 
      ? product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length 
      : 0;

    await product.save();
    res.json({ message: 'Review deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route  POST /api/products
// @desc   Create product (Admin only)
// @access Private
router.post('/', protect, async (req, res) => {
  try {
    const { name, description, price, discountPrice, category, subCategory, stock, isFeatured, tags, imageUrls } = req.body;
    let images = [];
    if (imageUrls) {
      const urls = Array.isArray(imageUrls) ? imageUrls : [imageUrls];
      images = [...urls];
    }

    const product = await Product.create({
      name,
      description,
      price: Number(price),
      discountPrice: discountPrice ? Number(discountPrice) : null,
      category,
      subCategory: subCategory || '',
      stock: Number(stock),
      isFeatured: isFeatured === true || isFeatured === 'true',
      tags: tags ? (Array.isArray(tags) ? tags : tags.split(',').map((t) => t.trim())) : [],
      images,
    });

    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @route  PUT /api/products/:id
// @desc   Update product (Admin only)
// @access Private
router.put('/:id', protect, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const { name, description, price, discountPrice, category, subCategory, stock, isFeatured, tags, imageUrls, existingImages } = req.body;
    
    // Keep existing images + add new compiled URLs
    let compiledImages = existingImages ? (Array.isArray(existingImages) ? existingImages : [existingImages]) : [];
    if (imageUrls) {
      const urls = Array.isArray(imageUrls) ? imageUrls : [imageUrls];
      compiledImages.push(...urls);
    }

    product.name = name || product.name;
    product.description = description || product.description;
    product.price = price ? Number(price) : product.price;
    product.discountPrice = discountPrice !== undefined ? (discountPrice ? Number(discountPrice) : null) : product.discountPrice;
    product.category = category || product.category;
    product.subCategory = subCategory !== undefined ? subCategory : product.subCategory;
    product.stock = stock !== undefined ? Number(stock) : product.stock;
    product.isFeatured = isFeatured !== undefined ? (isFeatured === true || isFeatured === 'true') : product.isFeatured;
    
    if (tags !== undefined) {
      product.tags = Array.isArray(tags) ? tags : tags.split(',').map((t) => t.trim());
    }
    
    product.images = compiledImages;

    const updated = await product.save();
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @route  DELETE /api/products/:id
// @desc   Delete product (Admin only)
// @access Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
