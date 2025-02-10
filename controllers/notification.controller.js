import Notification from "../models/notification.model.js";
import { SUCCESS, ERROR } from "../config/statusText.js";
import { asyncHandler } from "../middlewares/error.middleware.js";

export const getNotifications = asyncHandler(async (req, res) => {
  try {
    const userId = req.user?.id;

    const notifications = await Notification.find({ user: userId }).sort({ createdAt: -1 });
    res.status(200).json({ status: SUCCESS,message: "Notifications fetched successfully", data:notifications });
  } catch (error) {
    res.status(500).json({ status: ERROR, message: "Error fetching notifications", error });
  }
});

export const markAsRead = asyncHandler(async (req, res) => {
  try {
    const { notificationId } = req.body;

    const notification = await Notification.findById(notificationId);
    if (!notification) {
      return res.status(404).json({ status: ERROR, message: "Notification not found" });
    }

    notification.isRead = true;
    await notification.save();

    res.status(200).json({ status: SUCCESS, message: "Notification marked as read", data: notification.isRead });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ status: ERROR, message: "Error marking notification as read", error });
  }
});
