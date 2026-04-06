require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("Connected to MongoDB.");
    const products = await Product.find({});
    let count = 0;
    for (const p of products) {
      let updated = false;
      const newImages = p.images.map(img => {
        if (img.startsWith('http://localhost:5000')) {
          updated = true;
          return img.replace('http://localhost:5000', 'https://svgifts.onrender.com');
        }
        return img;
      });
      if (updated) {
        p.images = newImages;
        await p.save();
        count++;
      }
    }
    console.log(`Updated ${count} products.`);
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
