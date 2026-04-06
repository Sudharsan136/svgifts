require('dotenv').config();
const mongoose = require('mongoose');
const Admin = require('./models/Admin');
const connectDB = require('./config/db');

async function test() {
  await connectDB();
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  const admin = await Admin.findOne({ email });
  if (!admin) {
    console.log('Admin not found in DB');
    process.exit(1);
  }
  
  console.log('Stored Hashed Password:', admin.password);
  
  const isMatch = await admin.matchPassword(password);
  console.log('Password match:', isMatch);
  process.exit(0);
}
test();
