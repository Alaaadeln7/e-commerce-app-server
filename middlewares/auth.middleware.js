import jwt from 'jsonwebtoken';
import { AppError } from './error.middleware.js';
import { asyncHandler } from './error.middleware.js';
import User from '../models/user.model.js';
import { ROLES } from '../config/constants.js';

const verifyToken = (token, secret) => {
  try {
    const decoded = jwt.verify(token, secret);
    const currentTimestamp = Math.floor(Date.now() / 1000);
    
    if (decoded.exp && decoded.exp < currentTimestamp) {
      throw new AppError('Token has expired', 401);
    }
    
    return decoded;
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError('Invalid token or token expired', 401);
  }
};

const getTokenFromRequest = (req) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader?.startsWith('Bearer ')) {
    throw new AppError('No token provided', 401);
  }

  return authHeader.split(' ')[1];
};

export const protectRoute = asyncHandler(async (req, res, next) => {
  const token = getTokenFromRequest(req);
  
  const decoded = verifyToken(token, process.env.JWT_SECRET);
  
  const user = await User.findById(decoded.userId).select('-password');
  if (!user) {
    throw new AppError('User belonging to this token no longer exists', 401);
  }
  
  req.user = user;
  next();
});

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new AppError(
        'You do not have permission to perform this action',
        403
      );
    }
    next();
  };
};

export const isAdmin = asyncHandler(async (req, res, next) => {
  if (req.user.role !== ROLES.ADMIN) {
    throw new AppError('Admin access required', 403);
  }
  next();
});

export const isSeller = asyncHandler(async (req, res, next) => {
  if (req.user.role !== ROLES.SELLER) {
    throw new AppError('Seller access required', 403);
  }
  next();
});

export const isResourceOwner = (model) => asyncHandler(async (req, res, next) => {
  const resource = await model.findById(req.params.id);
  
  if (!resource) {
    throw new AppError('Resource not found', 404);
  }
  
  if (resource.userId.toString() !== req.user._id.toString() && req.user.role !== ROLES.ADMIN) {
    throw new AppError('You do not have permission to perform this action', 403);
  }
  
  req.resource = resource;
  next();
});