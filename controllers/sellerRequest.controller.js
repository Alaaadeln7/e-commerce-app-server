import { ERROR, SUCCESS } from "../config/statusText.js";
import User from "../models/user.model.js";

export const reviewSellerRequest = async (req, res) => {
  try {
    const { userId, status } = req.body;
    const statuses = ['approved', 'rejected'];
    if (!statuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (user.sellerRequestStatus !== 'pending') {
      return res.status(400).json({ message: 'No request is being reviewed for this user' });
    }

    user.sellerRequestStatus = status;
    if (status === 'approved') user.role = 'seller';

    await user.save();
    res.status(200).json({ message: `Request ${status === 'approved' ? 'approved' : 'rejected'}` });
  } catch (error) {
    res.status(500).json({ message: 'An error occurred', error: error.message });
  }
};
export const getAllSellerRequests = async (req, res) => {
  try {
    const users = await User.find({ sellerRequestStatus: 'pending' });
    res.status(200).json({ status: SUCCESS, data: users });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ status: ERROR, message: 'An error occurred', error: error.message });
  }
};

export const requestSellerRole = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (user.role === 'seller') return res.status(400).json({ message: 'You are already a seller' });

    if (user.sellerRequestStatus === 'pending') {
      return res.status(400).json({ sellerRequestStatus: user.sellerRequestStatus,message: 'You already have a pending request' });
    }

    user.sellerRequestStatus = 'pending';
    await user.save();

    res.status(200).json({ sellerRequestStatus: user.sellerRequestStatus,message: 'Your request has been sent to the administration' });
  } catch (error) {
    res.status(500).json({ message: 'An error occurred', error: error.message });
  }
};

export const checkRequestSellerStatus = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    res.status(200).json({ sellerRequestStatus: user.sellerRequestStatus });
  } catch (error) {
    res.status(500).json({ message: 'An error occurred', error: error.message });
  }
};