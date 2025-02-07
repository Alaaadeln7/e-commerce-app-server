import express from "express";
import { config } from "dotenv";
import cors from "cors";
import connectionDB from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";
import cookieParser from "cookie-parser";
const app = express();
config();
const port = process.env.PORT || 8080;
const frontend = "http://localhost:5173";
app.use(
  cors({
    origin: frontend,
    credentials: true,
  })
);


app.use(
  express.json({
    limit: "10mb",
  })
);
app.use(cookieParser());
connectionDB();

app.use("/api/auth", authRoutes);








app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
