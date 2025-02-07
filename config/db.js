import mongoose from "mongoose";

export default function connectionDB() {
  try {
    mongoose.connect(process.env.DATABASE);
    console.log("connect with database");
  } catch (error) {
    console.log("failed connected with database");
  }
}
