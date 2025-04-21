import express from "express";
import { config } from "dotenv";
config();
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import mongoSanitize from "express-mongo-sanitize";
import cookieParser from "cookie-parser";
import swaggerUi from "swagger-ui-express";
import connectionDB from "./config/db.js";
import { errorHandler } from "./middlewares/error.middleware.js";
import { CORS_OPTIONS, RATE_LIMIT_OPTIONS } from "./config/constants.js";
import swaggerSpec from "./docs/swaggerDocs.js";
import morgan from "morgan";
import authRoutes from "./routes/auth.routes.js";
import productRoutes from "./routes/product.routes.js";
import sellerRoutes from "./routes/seller.routes.js";
import cartRoutes from "./routes/cart.routes.js";
import orderRoutes from "./routes/order.routes.js";
import discountRoutes from "./routes/discount.routes.js";
import paymentRoutes from "./routes/payment.routes.js";
import shippingRoutes from "./routes/shipping.routes.js";
import reviewRoutes from "./routes/review.routes.js";
import adminRoutes from "./routes/admin.routes.js";

const app = express();
const port = process.env.PORT || 8080;

app.use(helmet());
app.use(cors(CORS_OPTIONS));
app.use(rateLimit(RATE_LIMIT_OPTIONS));
app.use(mongoSanitize());
app.use(morgan("dev"));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());

connectionDB();

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const API_PREFIX = "/api";
app.use(`${API_PREFIX}/auth`, authRoutes);
app.use(`${API_PREFIX}/products`, productRoutes);
app.use(`${API_PREFIX}/sellers`, sellerRoutes);
app.use(`${API_PREFIX}/cart`, cartRoutes);
app.use(`${API_PREFIX}/orders`, orderRoutes);
app.use(`${API_PREFIX}/discounts`, discountRoutes);
app.use(`${API_PREFIX}/payments`, paymentRoutes);
app.use(`${API_PREFIX}/shipping`, shippingRoutes);
app.use(`${API_PREFIX}/reviews`, reviewRoutes);
app.use(`${API_PREFIX}/admins`, adminRoutes);

app.use(errorHandler);

app.use((req, res) => {
  res.status(404).json({
    status: "error",
    message: "Route not found",
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  console.log(
    `API Documentation available at http://localhost:${port}/api-docs`
  );
});
