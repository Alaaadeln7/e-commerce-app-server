import { FAILED, SUCCESS,ERROR } from "../config/statusText.js";
import { asyncHandler } from "../middlewares/error.middleware.js";
import Admin from "../models/admin.model.js";
import User from "../models/user.model.js";
export const makeAdmin = asyncHandler(async (req, res) => {
  const { userId } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ status: FAILED, message: "User not found" });

    const adminData = await Admin.findOne();
    if (!adminData.admins.includes(userId)) {
      adminData.admins.push(userId);
      await adminData.save();
      user.role = "admin";
      await user.save();
    }
    res.status(200).json({ status: SUCCESS, message: "User added as admin" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ status: ERROR, message: "Failed to add admin", error: error.message });
  }
});

export const removeAdmin = asyncHandler(async (req, res) => {
  const { userId } = req.body;
  try {
    const adminData = await Admin.findOne();
    adminData.admins = adminData.admins.filter((id) => id.toString() !== userId);
    await adminData.save();

    res.status(200).json({ message: "Admin removed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to remove admin", error: error.message });
  }
});
