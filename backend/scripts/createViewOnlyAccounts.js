// backend/scripts/createViewOnlyAccounts.js
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import User from '../models/User.js';

// Load environment variables
dotenv.config();

const MONGO_URI = process.env.MONGO_URI;
const SALT_ROUNDS = Number(process.env.SALT_ROUNDS) || 10;

async function createViewOnlyAccounts() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Create view-only admin account
    const viewAdminPassword = await bcrypt.hash('viewadmin123', SALT_ROUNDS);
    
    const existingViewAdmin = await User.findOne({ email: 'viewadmin@dealmate.com' });
    if (!existingViewAdmin) {
      const viewAdmin = new User({
        name: 'View Admin Demo',
        email: 'viewadmin@dealmate.com',
        password: viewAdminPassword,
        role: 'admin',
        isVerified: true
      });
      await viewAdmin.save();
      console.log('✅ Created view-only admin account: viewadmin@dealmate.com / viewadmin123');
    } else {
      console.log('ℹ️ View admin account already exists');
    }

    // Create view-only seller account
    const viewSellerPassword = await bcrypt.hash('viewseller123', SALT_ROUNDS);
    
    const existingViewSeller = await User.findOne({ email: 'viewseller@dealmate.com' });
    if (!existingViewSeller) {
      const viewSeller = new User({
        name: 'View Seller Demo',
        email: 'viewseller@dealmate.com',
        password: viewSellerPassword,
        role: 'seller',
        isVerified: true
      });
      await viewSeller.save();
      console.log('✅ Created view-only seller account: viewseller@dealmate.com / viewseller123');
    } else {
      console.log('ℹ️ View seller account already exists');
    }

    console.log('🎉 View-only accounts setup completed!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating view-only accounts:', error);
    process.exit(1);
  }
}

createViewOnlyAccounts();
