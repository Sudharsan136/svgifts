require('dotenv').config();
const mongoose = require('mongoose');
const Admin = require('./models/Admin');
const connectDB = require('./config/db');

async function seedAdmin() {
  try {
    await connectDB();
    const email = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_PASSWORD;

    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      console.log('Admin already exists. Updating password just in case...');
      existingAdmin.password = password;
      await existingAdmin.save();
      console.log('Admin password re-synced.');
    } else {
      await Admin.create({
        name: 'SV Gifts Admin',
        email,
        password
      });
      console.log('Admin account created successfully.');
    }
  } catch (error) {
    console.error('Seeding error:', error);
  } finally {
    process.exit();
  }
}

seedAdmin();
