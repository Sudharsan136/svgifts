const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { protect } = require('../middleware/auth');
const { upload } = require('../config/cloudinary');

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
// @desc   Create new review
// @access Public
router.post('/:id/reviews', async (req, res) => {
  try {
    const { rating, comment, name } = req.body;
    const product = await Product.findById(req.params.id);

    if (product) {
      const review = {
        name,
        rating: Number(rating),
        comment,
      };

      product.reviews.push(review);
      product.numReviews = product.reviews.length;
      product.ratings =
        product.reviews.reduce((acc, item) => item.rating + acc, 0) /
        product.reviews.length;

      await product.save();
      res.status(201).json({ message: 'Review added' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @route  POST /api/products
// @desc   Create product (Admin only)
// @access Private
router.post('/', protect, upload.array('images', 5), async (req, res) => {
  try {
    const { name, description, price, discountPrice, category, stock, isFeatured, tags, imageUrls } = req.body;
    let images = req.files ? req.files.map((f) => `${req.protocol}://${req.get('host')}/uploads/${f.filename}`) : [];
    
    // Add any pasted URLs
    if (imageUrls) {
      const urls = Array.isArray(imageUrls) ? imageUrls : [imageUrls];
      images = [...images, ...urls];
    }

    const product = await Product.create({
      name,
      description,
      price: Number(price),
      discountPrice: discountPrice ? Number(discountPrice) : null,
      category,
      stock: Number(stock),
      isFeatured: isFeatured === 'true',
      tags: tags ? tags.split(',').map((t) => t.trim()) : [],
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
router.put('/:id', protect, upload.array('images', 5), async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const { name, description, price, discountPrice, category, stock, isFeatured, tags, imageUrls, existingImages } = req.body;
    
    // Compile retained images, new files, and new pasted URLs
    let compiledImages = existingImages ? (Array.isArray(existingImages) ? existingImages : [existingImages]) : [];
    if (req.files) compiledImages.push(...req.files.map((f) => `${req.protocol}://${req.get('host')}/uploads/${f.filename}`));
    if (imageUrls) {
      const urls = Array.isArray(imageUrls) ? imageUrls : [imageUrls];
      compiledImages.push(...urls);
    }

    product.name = name || product.name;
    product.description = description || product.description;
    product.price = price ? Number(price) : product.price;
    product.discountPrice = discountPrice ? Number(discountPrice) : product.discountPrice;
    product.category = category || product.category;
    product.stock = stock !== undefined ? Number(stock) : product.stock;
    product.isFeatured = isFeatured !== undefined ? isFeatured === 'true' : product.isFeatured;
    product.tags = tags ? tags.split(',').map((t) => t.trim()) : product.tags;
    
    if (compiledImages.length > 0) product.images = compiledImages;

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
