import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const JWT_SECRET = process.env.JWT_SECRET;

export const protect = async (req, res, next) => {
  try {
    const header = req.headers.authorization || req.headers.Authorization;
    if (!header || !header.startsWith('Bearer ')) return res.status(401).json({ message: 'Unauthorized' });

    const token = header.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Handle guest users (not stored in database)
    if (decoded.isGuest) {
      req.user = {
        _id: decoded.id,
        name: 'Guest User',
        email: decoded.email,
        role: 'guest',
        isGuest: true,
        isVerified: true
      };
      return next();
    }
    
    const user = await User.findById(decoded.id).select('-password');
    if (!user) return res.status(401).json({ message: 'Unauthorized' });

    req.user = user;

    // Update lastActive timestamp (fire and forget for performance)
    User.findByIdAndUpdate(user._id, { lastActive: Date.now() }).catch(console.error);

    next();
  } catch (err) {
    console.error('auth middleware error', err);
    return res.status(401).json({ message: 'Unauthorized' });
  }
};

export const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Admin access required' });
  }
};

export const sellerOnly = (req, res, next) => {
  if (req.user && (req.user.role === 'seller' || req.user.role === 'admin')) {
    next();
  } else {
    res.status(403).json({ message: 'Seller access required' });
  }
};

// Optional authentication - populates req.user if token exists, but doesn't fail if no token
export const optionalAuth = async (req, res, next) => {
  try {
    const header = req.headers.authorization || req.headers.Authorization;
    if (!header || !header.startsWith('Bearer ')) {
      // No token present, continue without req.user
      return next();
    }

    const token = header.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');

    if (user) {
      req.user = user;
    }
    next();
  } catch (err) {
    // Invalid token, but continue anyway (optional auth)
    next();
  }
};

// View-only admin middleware (allows viewing but not modifying)
export const viewOnlyAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin' && req.user.email === 'viewadmin@dealmate.com') {
    req.user.isViewOnly = true;
    next();
  } else if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Admin access required' });
  }
};

// View-only seller middleware (allows viewing but not modifying)
export const viewOnlySeller = (req, res, next) => {
  if (req.user && req.user.role === 'seller' && req.user.email === 'viewseller@dealmate.com') {
    req.user.isViewOnly = true;
    next();
  } else if (req.user && (req.user.role === 'seller' || req.user.role === 'admin')) {
    // kgusa121@gmail.com and other real sellers get full access
    next();
  } else {
    res.status(403).json({ message: 'Seller access required' });
  }
};

// Block view-only users from write operations
export const blockViewOnly = (req, res, next) => {
  if (req.user && req.user.isViewOnly) {
    return res.status(403).json({ 
      message: 'View-only access - you cannot modify data. This is a demo account.' 
    });
  }
  next();
};

// Allow kgusa121@gmail.com to add products but block delete/update
export const allowAddOnly = (req, res, next) => {
  if (req.user && req.user.email === 'kgusa121@gmail.com') {
    // Check if this is a POST (create) operation
    if (req.method === 'POST') {
      return next(); // Allow creation
    }
    // Block PUT (update) and DELETE operations
    if (req.method === 'PUT' || req.method === 'DELETE' || req.method === 'PATCH') {
      return res.status(403).json({ 
        message: 'Demo account - you can only add products, not update or delete.' 
      });
    }
  }
  next();
};

export default protect;
