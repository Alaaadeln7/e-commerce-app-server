import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
  admins: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }]
});

const Admin = mongoose.model("Admin", adminSchema);
export default Admin;